# Debloating and performance audit

Scope: the portfolio application, build scripts, public assets, and GitHub workflows. Baseline is the working tree at the start of this audit, including the earlier browser-only Echo Mountain update. Local reference projects under `docs/`, private evidence, résumé source documents, and unrelated user edits were preserved.

## Measured build results

Bytes, measured with the same Node `gzipSync` settings before and after. Totals include all emitted chunks; they are not timings or a claim of faster measured internet loading.

| Output | Before raw | After raw | Before gzip | After gzip | Gzip saved |
|---|---:|---:|---:|---:|---:|
| All JavaScript chunks | 388,898 | 297,498 | 123,059 | 91,699 | 31,360 (25.5%) |
| CSS | 22,548 | 22,407 | 5,090 | 5,055 | 35 (0.7%) |

Public visual assets: 2,729,322 → 2,093,307 bytes, removing 636,015 bytes from every deployment. These savings are deployment storage, not initial-page transfer: the deleted images were already unreferenced. Initial JS is now the main chunk; the 915-byte case-detail chunk is fetched on first expansion. A browser request assertion confirmed it is absent from the initial load. This is a small split; the JSON content remains in the main bundle intentionally to preserve cards and deep links.

The total JS gzip reduction is approximately 31.4 kB (25.5%). Removing library code drives this change, not syntax shortening. The existing Vite production build performs tree-shaking and minification. No broad `sideEffects: false` override was added, which could strip required CSS or initialization.

## Deleted assets and code

- `public/visuals/alpfa.svg` — 1,746 bytes; no current application/content reference.
- `public/visuals/echo-mountain-gameplay.png` — 279,487 bytes; no current application/content reference.
- `public/visuals/rps-round.png` — 31,447 bytes; no current application/content reference.
- `public/visuals/echo-mountain-expert.png` — 321,560 bytes; no current application/content reference.
- `public/visuals/tempo.svg` — 1,775 bytes; no current application/content reference.
- `public/.gitkeep` — unnecessary placeholder in a populated directory.
- `scripts/build.mjs` — obsolete HTML generator, unreferenced by npm/workflows and incompatible with the current React build.
- `scripts/serve.mjs` — unreferenced legacy server; `npm run preview` is the supported built-site preview.
- `.project-card__body` CSS, unused reveal wrapper CSS, spring/variant constants, Motion wrappers and imports.
- Duplicate `.nav` and `.nav-link` rule blocks consolidated without changing declarations.

## Dependency and runtime changes

- Removed `motion` and `@radix-ui/react-navigation-menu`; uninstall removed seven installed packages including their no-longer-required transitive dependencies. Both libraries were referenced before this change; they were replaced intentionally, not misreported as unused.
- Static navigation now uses semantic `nav`, `ul`, `li`, and ordinary links. Cards appear immediately instead of animating into view. Modal focus management and accordion keyboard behavior remain with Radix.
- Added build-only `knip`, `size-limit`, and `@size-limit/file`. Maintenance tooling increases the lockfile/development install; it is not shipped in the website bundle. `npm prune` completed and the lockfile is synchronized.
- Moved immutable project sorting outside the React render path. Replaced filter-and-slice with `findLast` for the active navigation item.
- Extracted reusable media/link helpers and deferred case detail rendering using `React.lazy` and `Suspense`.
- Existing scroll/resize/hash/click listeners and animation-frame cleanup were retained. No speculative `useMemo`/`useCallback` wrappers were added to cheap operations.

## Analysis and continuous maintenance

- Initial Knip found the two legacy scripts. Initial depcheck found no unused dependencies. Final Knip passes with no blanket source ignores. `jq` is explicitly exempted from npm binary discovery because it is a documented system prerequisite for maintenance tests.
- Final depcheck passes with `--ignores=@size-limit/file`: that plugin is loaded by Size Limit, so depcheck reports a false positive without the documented exception. Knip recognizes it normally.
- All CSS class names were checked against current component source, including conditional and state classes; only confirmed dead selectors were deleted. This is not proof that every conceivable CSS declaration is redundant or used.
- `npm run assets:check` fails on unreferenced public files, excluding explicit host-consumed files. It checks literal references in source/content; future computed asset paths require extending the checker deliberately. Existing content checks still verify missing paths, captions, alt text and unsafe public files.
- `debloat-check.yml` runs Knip, asset checking, build and Size Limit on pushes/PRs. Gzip budgets: 100 kB for all JS chunks, 6 kB for CSS. PRs build the actual base SHA in an isolated directory and report aggregate gzip deltas in the job summary. It uses the Size Limit CLI directly, without a third-party commenting action or write token. Node per-file gzip totals and Size Limit's combined-file compression can differ slightly.
- `codeql.yml` scans JavaScript/TypeScript on PRs, main pushes and weekly, using GitHub's `security-and-quality` suite and a pinned official action. It covers source, scripts, tests and Vite configuration. CodeQL finds supported security/quality patterns; it does not replace Knip or prove the absence of unreachable code.
- Existing Dependabot updates cover the new packages and action pins. Workflow code and YAML parsing were checked locally; hosted CodeQL and PR-base builds have not run yet. If GitHub default CodeQL setup is already enabled, switch it to advanced setup before enabling this workflow. Configure required checks in branch rules if enforcement before merge is desired.

## Repository maintenance script

`scripts/github-maintenance.sh` requires authenticated GitHub CLI, jq and GNU date. Default mode is read-only audit. `--branch`, `--pr`, `--release`, `--tag`, and `--cache` select a single operation; it remains a preview until `--apply` is added. No remote maintenance command was executed during this task.

```sh
scripts/github-maintenance.sh --repo dlg309/Diego-Guevara-Portfolio
scripts/github-maintenance.sh --repo dlg309/Diego-Guevara-Portfolio --branch old-merged-feature
# After reviewing the preview, repeat with --apply to execute.
```

Branches must be older than 90 days (configurable), merged into the default branch, unprotected, and have no open PR. The default branch is always refused and the SHA is rechecked before deletion. There is no atomic compare-and-delete GitHub API here; do not run concurrently with active branch work. PRs must be stale and labeled `cleanup-approved`; they are closed rather than deleted. Releases/tags and cache IDs require explicit selection because age/download count cannot prove an artifact is unused. Release deletion removes its binaries but retains the git tag; tag deletion refuses a tag attached to a release. No cleanup cron was installed.

## Validation

- Content checks, unused-asset check, Knip, Size Limit, production build, npm audit (zero known vulnerabilities), and `git diff --check` passed.
- Seven Node tests passed, including four mocked GitHub maintenance safeguards; no network deletion in tests. The four maintenance tests explicitly skip if jq is absent. They were run here using a temporary jq executable; Ubuntu Actions runners include jq.
- Chromium and Firefox at 360, 390, 768, 1024 and 1440 pixels: no horizontal overflow, broken rendered images, application errors, or axe WCAG violations. Case links, repeated hashes, direct deep links, modal keyboard trapping/Escape/focus restoration, résumé and email paths passed.
- Verified that case-detail JavaScript loads only when expanded.
- No real-user timing claim, Safari test, manual screen-reader certification, remote CodeQL result or deployed Pages update is implied. Vite still emits the pre-existing non-blocking Radix `use client` bundling warnings.

References: [Knip configuration](https://knip.dev/overview/configuration), [Size Limit](https://github.com/ai/size-limit), [GitHub CodeQL configuration](https://docs.github.com/en/code-security/reference/code-scanning/workflow-configuration-options).
