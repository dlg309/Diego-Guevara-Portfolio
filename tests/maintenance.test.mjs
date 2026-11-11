import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, writeFileSync, readFileSync, rmSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';

const hasJq = spawnSync('jq', ['--version']).status === 0;
const maintenanceTest = (name, fn) => test(name, { skip: !hasJq && 'Install jq to test GitHub maintenance safeguards' }, fn);

function invoke(args) {
  const dir = mkdtempSync(join(tmpdir(), 'portfolio-maintenance-'));
  const log = join(dir, 'commands');
  writeFileSync(join(dir, 'gh'), `#!/usr/bin/env bash
printf '%s\\n' "$*" >> "$CALL_LOG"
case "$*" in
  'api repos/test/repo --jq .default_branch') echo main ;;
  *'/branches/'*) echo '{"protected":false,"commit":{"sha":"abc"}}' ;;
  *'/commits/'*) echo '2020-01-01T00:00:00Z' ;;
  *'/compare/'*) echo '{"ahead_by":1}' ;;
  *'/pulls/'*) echo '{"state":"open","updated_at":"2020-01-01T00:00:00Z","labels":[]}' ;;
  *'/releases?'*) echo '[]' ;;
esac
`, { mode: 0o755 });
  try {
    const result = spawnSync('bash', ['scripts/github-maintenance.sh', '--repo', 'test/repo', ...args], {
      encoding: 'utf8', env: { ...process.env, PATH: `${dir}:${process.env.PATH}`, CALL_LOG: log },
    });
    return { ...result, calls: existsSync(log) ? readFileSync(log, 'utf8') : '' };
  } finally { rmSync(dir, { recursive: true, force: true }); }
}
maintenanceTest('release deletion is preview-only by default', () => {
  const result = invoke(['--release', 'v1.0']);
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /PREVIEW/);
  assert.doesNotMatch(result.calls, /release delete/);
});
maintenanceTest('explicit apply deletes only the selected release, keeping its tag', () => {
  const result = invoke(['--release', 'v1.0', '--apply']);
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.calls, /release delete v1.0 --repo test\/repo --yes/);
  assert.doesNotMatch(result.calls, /cleanup-tag|refs\/tags/);
});
maintenanceTest('default and unmerged branches cannot be deleted even with apply', () => {
  for (const branch of ['main', 'feature']) {
    const result = invoke(['--branch', branch, '--apply']);
    assert.notEqual(result.status, 0);
    assert.doesNotMatch(result.calls, /DELETE/);
  }
});
maintenanceTest('unapproved stale PR is not closed', () => {
  const result = invoke(['--pr', '12', '--apply']);
  assert.notEqual(result.status, 0);
  assert.doesNotMatch(result.calls, /pr close/);
});
