import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';

const html = readFileSync('index.html', 'utf8');
const pageUrl = 'https://dlg309.github.io/Diego-Guevara-Portfolio/';

function metaContent(attribute, name) {
  const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = html.match(new RegExp(`<meta\\s+${attribute}="${escapedName}"\\s+content="([^"]*)"\\s*\\/?>`));
  return match?.[1];
}

test('homepage metadata uses the verified Pages URL and existing preview assets', () => {
  assert.match(html, /<title>Diego Guevara \| Portfolio<\/title>/);
  assert.match(html, /<link rel="canonical" href="https:\/\/dlg309\.github\.io\/Diego-Guevara-Portfolio\/"\s*\/>/);
  assert.ok(metaContent('property', 'og:title'));
  assert.ok(metaContent('property', 'og:description'));
  assert.equal(metaContent('property', 'og:url'), pageUrl);
  assert.equal(metaContent('name', 'twitter:card'), 'summary_large_image');
  assert.ok(metaContent('name', 'twitter:title'));
  assert.ok(metaContent('name', 'twitter:description'));
  assert.equal(metaContent('name', 'twitter:image'), metaContent('property', 'og:image'));
  assert.ok(metaContent('name', 'twitter:image:alt')?.trim());
  assert.equal(metaContent('property', 'og:image:alt')?.trim().length > 0, true);
  assert.equal(metaContent('property', 'og:image'), `${pageUrl}visuals/echo-browser-downhill.png`);
  assert.equal(metaContent('property', 'og:image:type'), 'image/png');
  assert.equal(metaContent('property', 'og:image:width'), '1440');
  assert.equal(metaContent('property', 'og:image:height'), '1000');
  assert.ok(existsSync('public/visuals/echo-browser-downhill.png'));
  assert.match(html, /<link rel="icon" type="image\/svg\+xml" href="\.\/visuals\/favicon\.svg"\s*\/>/);
  assert.ok(existsSync('public/visuals/favicon.svg'));
});