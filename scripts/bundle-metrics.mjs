import { readdirSync, readFileSync, appendFileSync, existsSync } from 'node:fs';
import { gzipSync } from 'node:zlib';
const files = readdirSync('dist/assets').filter(name => /\.(js|css)$/.test(name));
const metrics = files.map(name => {
  const bytes = readFileSync(`dist/assets/${name}`);
  return { name, bytes: bytes.length, gzip: gzipSync(bytes).length };
});
console.log(JSON.stringify(metrics, null, 2));
if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY,
  '\n### Bundle sizes (bytes)\n\n| File | Raw | Gzip |\n|---|---:|---:|\n' +
  metrics.map(file => `| ${file.name} | ${file.bytes} | ${file.gzip} |`).join('\n') + '\n');

if (existsSync('.baseline/dist/assets')) {
  const baseline = readdirSync('.baseline/dist/assets').filter(name => /\.(js|css)$/.test(name));
  const before = baseline.reduce((sum, name) => sum + gzipSync(readFileSync(`.baseline/dist/assets/${name}`)).length, 0);
  const after = metrics.reduce((sum, file) => sum + file.gzip, 0);
  const result = `PR base → current total JS + CSS gzip: ${before} → ${after} bytes (${after - before >= 0 ? '+' : ''}${after - before} bytes).`;
  console.log(result);
  if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, `\n${result}\n`);
}
