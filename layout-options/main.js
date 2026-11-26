import site from '../src/content/site.json';
import projects from '../src/content/projects.json';
import '../src/style.css';
import './style.css';

const ordered = site.projectOrder
  .map(id => projects.find(project => project.id === id))
  .filter(Boolean);

function element(tag, className, value) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (value) node.textContent = value;
  return node;
}
function link(label, url) {
  const anchor = element('a', '', label);
  anchor.href = url;
  if (/^https?:/.test(url)) anchor.rel = 'noopener noreferrer';
  return anchor;
}
document.querySelector('#profile-title').textContent = site.name;
document.querySelector('#profile-intro').textContent = site.intro + ' ' + site.professionalFocus;
const profileLinks = document.querySelector('#profile-links');
[
  ['Résumé draft (PDF)', '../' + site.resume.replace('./assets/', '')],
  ['GitHub profile', site.github],
  ['LinkedIn profile', site.linkedin],
].forEach(([label, url]) => profileLinks.append(link(label, url)));

const container = document.querySelector('#projects');
ordered.forEach(project => {
  const card = element('article', 'project');
  const label = element('p', 'project-label', project.kind + ' · ' + project.status);
  const heading = element('h3', '', project.title);
  const summary = element('p', 'summary', project.summary);
  const contribution = element('p', 'contribution');
  contribution.append(element('strong', '', 'My contribution: '), document.createTextNode(project.cardContribution));
  const actions = element('div', 'project-links');
  actions.append(link('Case study', '../case-studies/#' + encodeURIComponent(project.id)));
  project.links?.filter(item => /github\.com/.test(item.url)).slice(0, 1).forEach(item => {
    actions.append(link(item.label, item.url));
  });
  if (project.demoUrl) actions.append(link('Live project', project.demoUrl));
  card.append(label, heading, summary, contribution, actions);
  container.append(card);
});

const buttons = {cards: document.querySelector('#cards'), index: document.querySelector('#index')};
const descriptions = {
  cards: 'Cards put a short contribution beside each project.',
  index: 'The index uses compact rows for a quick scan of all projects.',
};
function setView(view) {
  if (!(view in buttons)) view = 'cards';
  container.className = 'projects ' + view;
  Object.entries(buttons).forEach(([name, button]) => button.setAttribute('aria-pressed', String(name === view)));
  document.querySelector('#layout-description').textContent = descriptions[view];
  const url = new URL(location.href);
  url.searchParams.set('view', view);
  history.replaceState(null, '', url);
}
Object.entries(buttons).forEach(([view, button]) => button.addEventListener('click', () => setView(view)));
setView(new URLSearchParams(location.search).get('view'));
