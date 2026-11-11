#!/usr/bin/env bash
# Requires authenticated gh and jq. Dry-run unless --apply is supplied.
set -euo pipefail
repo=''
apply=false
action=audit
value=''
days=90
usage() {
  cat <<'HELP'
Usage: scripts/github-maintenance.sh --repo OWNER/REPO [--days 90]
       [--branch NAME | --pr NUMBER | --release TAG | --tag TAG | --cache ID] [--apply]
Default: audit only. Each deletion/closure needs an explicit target and --apply.
Branches must be stale, unprotected, merged into the default branch, and have no open PR.
PRs must be stale, open and labeled cleanup-approved. They are closed, never deleted.
Releases/tags cannot be inferred unused: select only after checking downstream consumers.
HELP
}
while (($#)); do
  case "$1" in
    --repo) repo="${2:?Missing repository}"; shift 2 ;;
    --days) days="${2:?Missing age}"; shift 2 ;;
    --branch|--pr|--release|--tag|--cache)
      [[ "$action" == audit ]] || { echo 'Select one target per invocation.' >&2; exit 2; }
      action="${1#--}"; value="${2:?Missing target}"; shift 2 ;;
    --apply) apply=true; shift ;;
    --help|-h) usage; exit 0 ;;
    *) usage >&2; exit 2 ;;
  esac
done
[[ "$repo" =~ ^[a-zA-Z0-9_.-]+/[a-zA-Z0-9_.-]+$ && "$days" =~ ^[1-9][0-9]*$ ]] || { usage >&2; exit 2; }
if [[ "$action" != audit && "$value" == -* ]]; then
  echo 'Targets must be names or IDs, not command options.' >&2
  exit 2
fi
for tool in gh jq; do
  command -v "$tool" >/dev/null || { echo "Install required tool: $tool" >&2; exit 1; }
done
cutoff=$(date -u -d "$days days ago" +%Y-%m-%dT%H:%M:%SZ)
encode() { jq -rn --arg value "$1" '$value|@uri'; }
run() {
  printf '%s ' "$($apply && echo APPLY || echo PREVIEW)"
  printf '%q ' "$@"; printf '\n'
  if $apply; then "$@"; fi
}
default=$(gh api "repos/$repo" --jq .default_branch)
case "$action" in
  audit)
    echo "Default branch: $default; stale threshold: $cutoff"
    echo 'Branches (age and merge eligibility checked when selecting a target):'
    gh api --paginate "repos/$repo/branches?per_page=100" --jq '.[] | {name,protected}'
    echo 'Stale open PRs (not automatically closed):'
    gh api --paginate "repos/$repo/pulls?state=open&per_page=100" | jq --arg cutoff "$cutoff" '.[] | select(.updated_at < $cutoff) | {number,title,updated_at,labels:[.labels[].name]}'
    echo 'Releases and binaries (age does not establish that they are unused):'
    gh api --paginate "repos/$repo/releases?per_page=100" --jq '.[] | {tag_name,published_at,assets:[.assets[]|{name,size,download_count}]}'
    echo 'Tags:'
    gh api --paginate "repos/$repo/tags?per_page=100" --jq '.[].name'
    echo 'Caches:'
    gh api --paginate "repos/$repo/actions/caches?per_page=100" --jq '.actions_caches[] | {id,key,ref,last_accessed_at,size_in_bytes}'
    ;;
  branch)
    [[ "$value" != "$default" ]] || { echo 'Default branch protected.' >&2; exit 1; }
    encoded=$(encode "$value")
    branch=$(gh api "repos/$repo/branches/$encoded")
    [[ $(jq -r .protected <<<"$branch") == false ]] || { echo 'Protected branch refused.' >&2; exit 1; }
    sha=$(jq -r .commit.sha <<<"$branch")
    date=$(gh api "repos/$repo/commits/$sha" --jq .commit.committer.date)
    [[ "$date" < "$cutoff" ]] || { echo 'Branch is not stale.' >&2; exit 1; }
    comparison=$(gh api "repos/$repo/compare/$(encode "$default")...$sha")
    [[ $(jq -r .ahead_by <<<"$comparison") == 0 ]] || { echo 'Unmerged branch refused.' >&2; exit 1; }
    open=$(gh api --paginate "repos/$repo/pulls?state=open&per_page=100" | jq -s --arg branch "$value" '[.[][] | select(.head.ref == $branch)] | length')
    [[ "$open" == 0 ]] || { echo 'Branch has an open PR.' >&2; exit 1; }
    current=$(gh api "repos/$repo/branches/$encoded" --jq .commit.sha)
    [[ "$sha" == "$current" ]] || { echo 'Branch changed; rerun the audit.' >&2; exit 1; }
    run gh api --method DELETE "repos/$repo/git/refs/heads/$encoded"
    ;;
  pr)
    [[ "$value" =~ ^[0-9]+$ ]] || exit 2
    pr=$(gh api "repos/$repo/pulls/$value")
    jq -e --arg cutoff "$cutoff" '.state == "open" and .updated_at < $cutoff and any(.labels[]; .name == "cleanup-approved")' <<<"$pr" >/dev/null
    run gh pr close "$value" --repo "$repo"
    ;;
  release)
    # Deletes the selected release and its binaries; keeps its git tag.
    run gh release delete "$value" --repo "$repo" --yes
    ;;
  tag)
    # Refuse deleting a tag still attached to a release; preserve published releases.
    releases=$(gh api --paginate "repos/$repo/releases?per_page=100")
    jq -se --arg tag "$value" 'all(.[][]; .tag_name != $tag)' <<<"$releases" >/dev/null
    run gh api --method DELETE "repos/$repo/git/refs/tags/$(encode "$value")"
    ;;
  cache)
    [[ "$value" =~ ^[0-9]+$ ]] || exit 2
    run gh cache delete "$value" --repo "$repo"
    ;;
esac
