import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

test('static host configurations carry matching security headers', () => {
  const fileLines = readFileSync('public/_headers', 'utf8').split('\n');
  assert.equal(fileLines[0].trim(), '/*');
  const lines = fileLines.slice(1).filter((line) => line.trim());
  const staticHeaders = new Map(lines.map((line) => {
    const separator = line.indexOf(':');
    return [line.slice(0, separator).trim().toLowerCase(), line.slice(separator + 1).trim()];
  }));
  const vercel = JSON.parse(readFileSync('vercel.json', 'utf8'));
  assert.equal(vercel.headers[0].source, '/(.*)');
  const vercelHeaders = new Map(vercel.headers[0].headers.map(({ key, value }) => [key.toLowerCase(), value]));
  for (const name of ['content-security-policy', 'x-frame-options', 'x-content-type-options', 'referrer-policy', 'permissions-policy']) {
    assert.ok(staticHeaders.has(name), `${name} missing from static host configuration`);
    assert.equal(vercelHeaders.get(name), staticHeaders.get(name), `${name} differs between host configurations`);
  }
  assert.match(staticHeaders.get('content-security-policy'), /frame-ancestors 'none'/);
  for (const directive of [
    "default-src 'self'",
    "script-src 'self'",
    "style-src 'self'",
    "img-src 'self' data:",
    "font-src 'self'",
    "connect-src 'self'",
    "object-src 'none'",
  ]) {
    assert.ok(staticHeaders.get('content-security-policy').includes(directive), `${directive} missing from CSP`);
  }
  assert.equal(staticHeaders.get('x-frame-options'), 'DENY');
});
