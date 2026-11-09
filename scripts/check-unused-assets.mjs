import { readdir, readFile } from 'node:fs/promises';
import { join, relative } from 'node:path';

async function files(dir) {
  return (await Promise.all((await readdir(dir, { withFileTypes: true })).map(entry => {
    const path = join(dir, entry.name);
    return entry.isDirectory() ? files(path) : [path];
  }))).flat();
}
// Content JSON paths use ./assets/ for compatibility; App maps them to public/.
const sources = await files('src');
const content = (await Promise.all([...sources, 'index.html'].map(path => readFile(path, 'utf8')))).join('\n');
// Host-consumed files are intentionally not linked by the application.
const hostFiles = new Set(['_headers', 'robots.txt', 'sitemap.xml', '.nojekyll', 'CNAME']);
const unused = (await files('public')).filter(path => {
  const asset = relative('public', path).replaceAll('\\', '/');
  return !hostFiles.has(asset) && !content.includes(asset);
});
if (unused.length) {
  console.error('Unreferenced public assets (verify before removal):\n' + unused.join('\n'));
  process.exitCode = 1;
} else console.log('All public assets are referenced or host-consumed.');
