import { readFileSync, lstatSync, readdirSync } from 'node:fs';
import { resolve, relative, isAbsolute, sep } from 'node:path';

const readJson = (file) => JSON.parse(readFileSync(file, 'utf8'));
const site = readJson('src/content/site.json');
const projects = readJson('src/content/projects.json');
const publicRoot = resolve('public');
const failures = [];

function check(condition, description) {
  if (!condition) failures.push(description);
}

function checkExternalUrl(value, description) {
  try {
    const url = new URL(value);
    check(url.protocol === 'https:' && !url.username && !url.password, `${description} must be an HTTPS URL without credentials`);
  } catch {
    failures.push(`${description} must be a valid HTTPS URL`);
  }
}

function checkAsset(value, description) {
  if (typeof value !== 'string' || !value.startsWith('./assets/')) {
    failures.push(`${description} must start with ./assets/`);
    return;
  }
  const path = resolve(publicRoot, value.slice('./assets/'.length));
  const relativePath = relative(publicRoot, path);
  if (!relativePath || relativePath === '..' || relativePath.startsWith(`..${sep}`) || isAbsolute(relativePath)) {
    failures.push(`${description} must stay within public/`);
    return;
  }
  try {
    check(lstatSync(path).isFile(), `${description} must be a regular file in public/`);
  } catch {
    failures.push(`${description} does not exist in public/`);
  }
}

function checkImage(image, description) {
  checkAsset(image.src, `${description} image`);
  check(typeof image.alt === 'string' && image.alt.trim().length > 0, `${description} needs descriptive alt text`);
  check(typeof image.caption === 'string' && image.caption.trim().length > 0, `${description} needs a caption`);
}

for (const key of ['github', 'portfolioRepo', 'linkedin']) checkExternalUrl(site[key], `site.${key}`);
check(typeof site.email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(site.email), 'site.email must be a valid email address');
checkAsset(site.resume, 'site.resume');
check(Array.isArray(projects) && projects.length > 0, 'projects must be a nonempty array');
const ids = new Set();
for (const project of projects) {
  const name = project.title || 'Untitled project';
  check(typeof project.id === 'string' && /^[a-z0-9-]+$/.test(project.id), `${name} needs a URL-safe ID`);
  check(!ids.has(project.id), `${name} has a duplicate project ID`);
  ids.add(project.id);
  if (project.image) checkImage(project.image, name);
  for (const image of project.gallery || []) checkImage(image, `${name} gallery`);
  for (const link of [...(project.links || []), ...(project.sections || []).flatMap((section) => section.links || [])]) {
    checkExternalUrl(link.url, `${name} link`);
  }
}

// Public files are copied to the deployed site. Catch common accidental secrets
// and symlinks before publishing without inspecting or printing file contents.
function checkPublicDirectory(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const path = resolve(directory, entry.name);
    const label = relative(publicRoot, path);
    if (entry.isSymbolicLink()) failures.push(`public/${label} must not be a symbolic link`);
    else if (entry.isDirectory()) {
      if (entry.name === '.git' || entry.name === 'private') failures.push(`public/${label} must not be published`);
      else checkPublicDirectory(path);
    } else if (/^\.env(?:\.|$)/i.test(entry.name) || /\.(?:pem|key|p12|pfx|map)$/i.test(entry.name)) {
      failures.push(`public/${label} must not be published`);
    }
  }
}
checkPublicDirectory(publicRoot);

if (failures.length) {
  console.error(failures.map((failure) => `- ${failure}`).join('\n'));
  process.exitCode = 1;
} else {
  console.log(`Content and public assets checked: ${projects.length} projects.`);
}
