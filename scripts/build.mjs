import { readFile, mkdir, rm, copyFile, writeFile, cp } from 'node:fs/promises';

const site = JSON.parse(await readFile('src/content/site.json', 'utf8'));
const projects = JSON.parse(await readFile('src/content/projects.json', 'utf8'));
const alternative = process.argv.includes('--alternative');
const out = alternative ? '.preview' : 'dist';
const esc = (s = '') => String(s).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#39;');
const arrow = '<span aria-hidden="true">↗</span>';
const link = (label, url, cls = 'text-link') => url ? `<a class="${cls}" href="${esc(url)}">${esc(label)} ${arrow}</a>` : '';
const imageTag = image => `<img src="${esc(image.src)}" alt="${esc(image.alt)}" loading="lazy" decoding="async">`;
const imageCaption = (image, project) => `${esc(image.caption || '')}${image.fullSize ? ` <a href="${esc(image.src)}">${esc(image.linkLabel || `View full-size screenshot of ${project.title}`)}</a>` : ''}`;
const visual = (p, className) => {
  if (!p.image?.src) return '';
  if (p.gallery?.length && className === 'card-visual') {
    return `<figure class="card-visual app-preview"><div class="app-preview-images">${imageTag(p.image)}${imageTag(p.gallery[0])}</div><figcaption>${esc(p.galleryPreviewCaption || `Screenshots of ${p.title}.`)}</figcaption></figure>`;
  }
  if (p.gallery?.length && className === 'case-visual') {
    const item = image => `<figure>${imageTag(image)}<figcaption>${imageCaption(image,p)}</figcaption></figure>`;
    return `<div class="case-visual app-gallery"><div class="app-gallery-grid">${item(p.image)}${item(p.gallery[0])}</div>${p.gallery.length > 1 ? `<details class="more-screens"><summary><span class="closed-label">View ${p.gallery.length - 1} more app screenshots</span><span class="open-label">Hide additional app screenshots</span></summary><div class="app-gallery-grid">${p.gallery.slice(1).map(item).join('')}</div></details>` : ''}</div>`;
  }
  return `<figure class="${className}">${imageTag(p.image)}<figcaption>${imageCaption(p.image,p)}</figcaption></figure>`;
};
const projectCards = projects.map(p => `<article class="project-card">
  <div class="card-meta"><span>${esc(p.number)} <span aria-hidden="true">/</span> ${esc(p.kind)}</span><span class="status">${esc(p.status)}</span></div>
  ${visual(p, 'card-visual')}
  <div class="card-body"><h3>${esc(p.title)}</h3><p class="card-summary">${esc(p.summary)}</p><p class="card-contribution"><strong>My contribution:</strong> ${esc(p.cardContribution || p.overview)}</p></div>
  <div class="card-footer"><div class="tags" aria-label="Technologies and topics">${p.tags.map(t => `<span>${esc(t)}</span>`).join('')}</div><a class="card-link" href="#${esc(p.id)}">Read case study <span class="sr-only">for ${esc(p.title)}</span><span aria-hidden="true">↗</span></a></div>
</article>`).join('');
const cases = projects.map(p => {
  const sectionUrls = new Set(p.sections.flatMap(section => (section.links || []).map(item => item.url)));
  const remainingLinks = p.links.filter(item => !sectionUrls.has(item.url));
  return `<article class="case" id="${esc(p.id)}"><div class="case-intro"><p class="eyebrow">CASE ${esc(p.number)} <span aria-hidden="true">/</span> ${esc(p.kind)}</p><h3>${esc(p.title)}</h3><p class="case-status">${esc(p.status)}</p><p>${esc(p.overview)}</p><a class="back-link" href="#work">← Back to selected work</a></div><div class="case-content">${visual(p, 'case-visual')}<div class="case-grid">${p.sections.map(section => `<div><h4>${esc(section.title)}</h4><p>${esc(section.text)}</p>${(section.links || []).map(item => link(item.label,item.url,'text-link evidence-link')).join('')}</div>`).join('')}</div>${remainingLinks.length ? `<div class="case-links">${remainingLinks.map(item => link(item.label,item.url)).join('')}</div>` : ''}</div></article>`;
}).join('');
const experience = site.experience.length ? `<div class="experience"><div><p class="eyebrow">EXPERIENCE</p><h3>Work that shapes how I think.</h3></div><div class="experience-list">${site.experience.map(e => `<article><div class="experience-title"><h4>${esc(e.title)}</h4>${e.dates ? `<span>${esc(e.dates)}</span>` : ''}</div><p class="experience-meta">${esc(e.organization)}</p><p>${esc(e.summary)}</p></article>`).join('')}</div></div>` : '';
const contact = [link('GitHub',site.github),link('LinkedIn',site.linkedin),link('View résumé',site.resume)].join('');
const email = site.email ? `<a class="email-link" href="mailto:${esc(site.email)}">${esc(site.email)} ${arrow}</a>` : '';
const resumeAction = site.resume ? `<a class="button button-light" href="${esc(site.resume)}">View résumé ${arrow}</a>` : '';
const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="description" content="Diego Guevara is an NJIT Business and Information Systems student interested in useful software and better workflows."><title>Diego Guevara | Business, technology & useful work</title><link rel="stylesheet" href="./style.css"></head>
<body class="${alternative ? 'alternative' : ''}"><a class="skip" href="#main">Skip to content</a>
<header class="site-header"><div class="wrap header-inner"><a class="brand" href="#top"><span class="brand-mark" aria-hidden="true">DG<span>.</span></span><span>${esc(site.name)}<small>PORTFOLIO</small></span></a><nav aria-label="Main navigation"><a href="#work">Work</a><a href="#about">About</a><a href="#case-studies">Project notes</a><a class="nav-contact" href="#contact">Let’s connect <span aria-hidden="true">↗</span></a></nav></div></header>
<main id="main"><section class="hero wrap" id="top"><div class="hero-copy"><p class="eyebrow"><span class="dot"></span> HI, I’M ${esc(site.name)} <span class="eyebrow-divider" aria-hidden="true">/</span> ${esc(site.eyebrow)}</p><h1>${esc(site.headline)}<br><em>${esc(site.headlineEmphasis)}</em></h1><p class="hero-intro">${esc(site.intro)}</p><p class="hero-availability">${esc(site.availability)}</p><div class="hero-actions"><a class="button button-dark" href="#work">Explore my work <span aria-hidden="true">↓</span></a>${resumeAction}</div></div><aside class="hero-aside" aria-label="Current areas of interest"><p class="micro-label">CURRENTLY EXPLORING</p><h2>Where my interests meet.</h2><ul class="focus-list">${site.interests.slice(0, 2).map((interest, i) => `<li><span aria-hidden="true">0${i + 1}</span>${esc(interest)}</li>`).join('')}</ul><a href="#about">More about me <span aria-hidden="true">↗</span></a></aside><div class="hero-foot"><span><span class="dot"></span> BUSINESS + INFORMATION SYSTEMS</span><span>SCROLL TO EXPLORE <span aria-hidden="true">↓</span></span></div></section>
<section class="work section" id="work"><div class="wrap"><div class="section-heading"><div><p class="eyebrow"><span class="section-number">01 /</span> SELECTED WORK</p><h2>Ideas meet <em>action.</em></h2></div><p>A selection of projects across software, data, and operations—with a closer look at my role in each.</p></div><div class="project-list">${projectCards}</div><div class="section-end"><span>THE WORK, IN CONTEXT</span><a href="#case-studies">Explore the project notes <span aria-hidden="true">↓</span></a></div></div></section>
<section class="about section" id="about"><div class="wrap"><div class="about-grid"><div><p class="eyebrow"><span class="section-number">02 /</span> ABOUT ME</p><h2>Business thinking.<br><em>Builder’s curiosity.</em></h2></div><div class="about-copy"><p class="lead">${esc(site.about)}</p><p>${esc(site.availability)}</p><div class="interest-heading">WHAT I’M EXPLORING <span aria-hidden="true">↘</span></div><ul class="interest-list">${site.interests.map((x,i) => `<li><span>0${i+1}</span>${esc(x)}</li>`).join('')}</ul></div></div>${experience}</div></section>
<section class="approach section" id="approach"><div class="wrap"><div class="section-heading"><div><p class="eyebrow"><span class="section-number">03 /</span> MY APPROACH</p><h2>Thoughtful work,<br><em>down to the details.</em></h2></div><p>I’m developing a practice grounded in asking questions, making things, and checking what actually works.</p></div><div class="principles"><div><span>01</span><h3>Start with people</h3><p>Understand the need and the context before deciding what to build.</p></div><div><span>02</span><h3>Make it tangible</h3><p>Turn an idea into something specific enough to try, discuss, and improve.</p></div><div><span>03</span><h3>Check the work</h3><p>Use evidence, testing, and honest limitations to guide the next iteration.</p></div></div><div class="skills"><p class="eyebrow">TOOLS & INTERESTS</p><div>${site.skills.map(s => `<p><strong>${esc(s.label)}</strong> ${esc(s.text)}</p>`).join('')}</div></div></div></section>
<section class="case-section section" id="case-studies"><div class="wrap"><div class="section-heading"><div><p class="eyebrow"><span class="section-number">04 /</span> PROJECT NOTES</p><h2>A closer <em>look.</em></h2></div><p>More about the problems, contributions, decisions, and checks behind the work.</p></div>${cases}<aside class="group-note" aria-label="Course group project status"><p><strong>Course group project · Pending.</strong> The required group customer project and my specific contribution are still being confirmed. I’ll add the project, team context, and evidence here when they’re ready.</p></aside></div></section>
<section class="contact section" id="contact"><div class="wrap contact-grid"><div><p class="eyebrow"><span class="section-number">05 /</span> LET’S CONNECT</p><h2>Good work starts<br>with a <em>conversation.</em></h2></div><div class="contact-copy"><p>I’m interested in opportunities to learn, collaborate, and help solve practical problems. You can explore my work on GitHub.</p>${email}<div class="contact-links">${contact}</div></div></div></section></main><footer><div class="wrap footer-inner"><span>© Diego Guevara</span><span>Built with curiosity & care.</span>${link('Portfolio source',site.portfolioRepo)}</div></footer></body></html>`;
await rm(out, { recursive: true, force: true });
await mkdir(out, { recursive: true });
await writeFile(`${out}/index.html`, html);
await copyFile('src/style.css', `${out}/style.css`);
// Copy only deliberately public assets; private notes and docs are never copied.
await cp('public', `${out}/assets`, { recursive: true });
console.log(`Built ${out}/index.html${alternative ? ' (alternative presentation)' : ''}`);
