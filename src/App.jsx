import { useEffect } from 'react';
import * as Accordion from '@radix-ui/react-accordion';
import { motion, useReducedMotion } from 'motion/react';
import site from './content/site.json';
import projects from './content/projects.json';

// Keep the editable content paths compatible with Vite and subdirectory hosting.
const assetHref = (href = '') => href.startsWith('./assets/') ? `./${href.slice('./assets/'.length)}` : href;

function Arrow({ down = false }) {
  return <span aria-hidden="true" className="arrow">{down ? '↓' : '↗'}</span>;
}

function TextLink({ href, children, className = 'text-link' }) {
  if (!href) return null;
  return <a className={className} href={assetHref(href)}>{children}<Arrow /></a>;
}

function ProjectImage({ image, eager = false, className = '' }) {
  return <img className={className} src={assetHref(image.src)} alt={image.alt} width={image.width} height={image.height} loading={eager ? 'eager' : 'lazy'} fetchPriority={eager ? 'high' : 'auto'} decoding="async" />;
}

function ImageFigure({ image, className = '' }) {
  return (
    <figure className={`image-figure ${className}`}>
      <ProjectImage image={image} />
      <figcaption>{image.caption}{image.fullSize && <> <a href={assetHref(image.src)}>{image.linkLabel || <>Open full image<span className="sr-only">: {image.alt}</span></>}</a></>}</figcaption>
    </figure>
  );
}

function ProjectMedia({ project, detail = false, eager = false }) {
  const { image, gallery = [] } = project;
  if (!image) return null;
  if (!detail && project.cardMediaNote) {
    return <div className="project-media-note"><span className="eyebrow">{project.mediaLabel || 'PROJECT IN PROGRESS'}</span><p>{project.cardMediaNote}</p><span>Earlier-version screenshots in the case study <span aria-hidden="true">↓</span></span></div>;
  }
  if (!detail) {
    const phones = project.galleryLayout === 'phone';
    return (
      <figure className={`project-media ${phones ? 'project-media--phones' : ''}`}>
        <div className={`media-viewport ${project.previewFit === 'top' ? 'media-viewport--top' : ''}`}>
          {phones ? <div className="phone-pair">{[image, gallery[0]].filter(Boolean).map((item, index) => <ProjectImage key={item.src} image={item} eager={eager && index === 0} />)}</div> : <ProjectImage image={image} eager={eager} />}
        </div>
        <figcaption>{project.cardCaption || image.caption}</figcaption>
      </figure>
    );
  }
  const phones = project.galleryLayout === 'phone';
  const leading = phones ? [image, gallery[0]].filter(Boolean) : [image];
  const additional = phones ? gallery.slice(1) : gallery;
  return (
    <div className="case-media">
      <div className={phones ? 'phone-gallery' : 'screenshot-gallery'}>{leading.map(item => <ImageFigure key={item.src} image={item} />)}</div>
      {additional.length > 0 && <details className="more-screens"><summary>More screenshots<span className="sr-only"> for {project.title}</span><span aria-hidden="true">＋</span></summary><div className={phones ? 'phone-gallery' : 'screenshot-gallery'}>{additional.map(item => <ImageFigure key={item.src} image={item} />)}</div></details>}
    </div>
  );
}

function ProjectCard({ project, eager = false }) {
  const sourceLink = project.links?.[0];
  return (
    <article className="project-card" aria-labelledby={`card-${project.id}`}>
      <div className="project-card__intro">
        <div className="project-meta"><span>{project.number} / {project.kind}</span><span className="status">{project.status}</span></div>
        <h3 id={`card-${project.id}`}>{project.title}</h3>
        <p>{project.summary}</p>
        <dl className="project-proof"><div><dt>Role</dt><dd>{project.role}</dd></div><div><dt>Scope / timeline</dt><dd>{project.scope}</dd></div><div><dt>Verified contribution</dt><dd>{project.verifiedContribution}</dd></div></dl>
      </div>
      <ProjectMedia project={project} eager={eager} />
      <div className="project-card__footer">
        <div className="project-actions"><a className="text-link" href={`#${project.id}`}>Read case study<span className="sr-only"> for {project.title}</span><Arrow /></a>{sourceLink && <TextLink href={sourceLink.url}>{sourceLink.label}</TextLink>}</div>
        <ul className="tags" aria-label={`Technologies and topics for ${project.title}`}>{project.tags.map(tag => <li key={tag}>{tag}</li>)}</ul>
      </div>
    </article>
  );
}

function CaseStudy({ project }) {
  const sectionUrls = new Set(project.sections.flatMap(section => (section.links || []).map(link => link.url)));
  const remainingLinks = (project.links || []).filter(link => !sectionUrls.has(link.url));
  return (
    <Accordion.Item asChild className="case-study" value={project.id}>
      <article id={project.id}>
        <Accordion.Header className="case-heading">
          <Accordion.Trigger className="case-trigger">
            <span className="case-number" aria-hidden="true">{project.number}</span>
            <span className="case-summary-title"><span className="case-kind">{project.kind}</span><span className="case-title">{project.title}</span></span>
            <span className="status">{project.status}</span>
            <span className="case-toggle" aria-hidden="true" />
          </Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content className="case-panel">
          <div className="case-body">
        <div className="case-intro"><h3>{project.title}</h3><p>{project.overview}</p></div>
        <div className="case-content">
          <ProjectMedia project={project} detail />
          <div className="case-sections">{project.sections.map(section => <section key={section.title}><h4>{section.title}</h4><p>{section.text}</p>{section.links?.map(link => <TextLink key={link.url} href={link.url}>{link.label}</TextLink>)}</section>)}</div>
        </div>
        {remainingLinks.length > 0 && <div className="case-links">{remainingLinks.map(link => <TextLink key={link.url} href={link.url}>{link.label}</TextLink>)}</div>}
        <a className="back-link" href="#work">↑ Back to selected work</a>
          </div>
        </Accordion.Content>
      </article>
    </Accordion.Item>
  );
}

function SectionHeading({ number, label, title, description, id }) {
  return <div className="section-heading"><div><p className="eyebrow">{number && `${number} / `}{label}</p><h2 id={id}>{title}</h2></div>{description && <p>{description}</p>}</div>;
}

const springTransition = { type: 'spring', stiffness: 340, damping: 30 };
const projectGridVariants = { hidden: {}, visible: { transition: { staggerChildren: 0.07 } } };
const projectCardVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: springTransition },
};

function useCaseStudyAnchors() {
  useEffect(() => {
    const reveal = (hash, scroll = false) => {
      let id;
      try { id = decodeURIComponent(hash.slice(1)); } catch { return; }
      const target = document.getElementById(id);
      if (!target?.matches('.case-study')) return;
      const trigger = target.querySelector('.case-trigger');
      if (trigger?.getAttribute('aria-expanded') !== 'true') trigger?.click();
      if (scroll) requestAnimationFrame(() => target.scrollIntoView({ block: 'start' }));
    };
    const onHashChange = () => reveal(window.location.hash, true);
    const onClick = event => {
      const link = event.target.closest?.('a[href^="#"]');
      if (link) reveal(link.hash);
    };
    onHashChange();
    window.addEventListener('hashchange', onHashChange);
    document.addEventListener('click', onClick);
    return () => { window.removeEventListener('hashchange', onHashChange); document.removeEventListener('click', onClick); };
  }, []);
}

export default function App() {
  useCaseStudyAnchors();
  const shouldReduceMotion = useReducedMotion();
  const projectOrder = site.projectOrder || projects.map(project => project.id);
  const orderedProjects = [...projects]
    .sort((left, right) => projectOrder.indexOf(left.id) - projectOrder.indexOf(right.id))
    .map((project, index) => ({ ...project, number: String(index + 1).padStart(2, '0') }));
  return (
    <>
      <a className="skip" href="#main">Skip to content</a>
      <header className="site-header"><div className="wrap header-inner">
        <a className="brand" href="#top"><span className="brand-mark" aria-hidden="true">DG.</span><span>{site.name}<small>BUSINESS + TECHNOLOGY</small></span></a>
        <nav className="nav" aria-label="Main navigation"><a href="#top">Home</a><a href="#work">Work</a><a href="#case-studies">Project notes</a><a href="#about">Background</a><a href="#experience">Experience</a><a href="#contact">Contact</a></nav>
      </div></header>
      <main id="main" tabIndex={-1}>
        <section className="hero wrap" id="top" aria-labelledby="hero-title">
          <div className="hero-copy"><p className="eyebrow">{site.name} <span aria-hidden="true">/</span> {site.eyebrow}</p><h1 id="hero-title">{site.headline}<span>{site.headlineEmphasis}</span></h1><p className="hero-intro">{site.intro} {site.professionalFocus}</p><div className="hero-actions"><a className="button button--primary" href={`mailto:${site.email}`}>Contact me<Arrow /></a><a className="button button--secondary" href={assetHref(site.resume)} download>Download résumé<Arrow /></a><a className="text-link" href="#work">Explore projects<Arrow down /></a></div><div className="hero-links"><TextLink href={site.linkedin}>LinkedIn</TextLink><TextLink href={site.github}>GitHub</TextLink></div><p className="hero-availability"><span className="dot" aria-hidden="true" />{site.availability}</p></div>
          <aside className="hero-focus" aria-label="Selected project stack"><p className="eyebrow">Stack in selected work</p><ul>{site.activeStack.map(item => <li key={item}>{item}</li>)}</ul></aside>
        </section>
        <section className="section section--work wrap" id="work" aria-labelledby="work-title">
          <SectionHeading number="01" label="SELECTED WORK" title="Projects with a purpose." id="work-title" description="Software, data, and operations projects—with my role and the evidence close at hand." />
          <motion.div className="project-grid" variants={projectGridVariants} initial={shouldReduceMotion ? false : 'hidden'} whileInView={shouldReduceMotion ? undefined : 'visible'} viewport={{ once: true, amount: 0.1 }}>
            {orderedProjects.map((project, index) => <motion.div className="project-card-reveal" key={project.id} variants={projectCardVariants}><ProjectCard project={project} eager={index === 0} /></motion.div>)}
          </motion.div>
          <div className="project-notes" id="case-studies" aria-labelledby="notes-title">
            <SectionHeading label="PROJECT NOTES" title="The work, in context." id="notes-title" description="Open a case study for the problem, contribution, decisions, checks, and limitations." />
            <Accordion.Root className="case-list" type="multiple">{orderedProjects.map(project => <CaseStudy key={project.id} project={project} />)}</Accordion.Root>
            <aside className="group-note"><p><strong>Course note.</strong> The required group customer project and my specific contribution are still being confirmed. I’ll add the team context and evidence when they’re ready.</p></aside>
          </div>
        </section>
        <section className="section wrap" id="about" aria-labelledby="about-title"><SectionHeading number="02" label="BACKGROUND & APPROACH" title="A business lens. A builder’s curiosity." id="about-title" description="Understand the need, make the work tangible, and check the result." /><div className="background-grid"><div className="about-copy"><p className="lead">{site.about}</p><h3 className="small-heading">What I’m exploring</h3><ul className="interest-list">{site.interests.map(interest => <li key={interest}>{interest}</li>)}</ul></div><div className="approach-content" id="approach"><h3>How I approach the work</h3><div className="principles"><div><span aria-hidden="true">01</span><h4>Understand the need</h4><p>Ask how the work gets done and where people encounter friction.</p></div><div><span aria-hidden="true">02</span><h4>Make it tangible</h4><p>Build something specific enough to try, discuss, and improve.</p></div><div><span aria-hidden="true">03</span><h4>Check the work</h4><p>Use tests, evidence, and honest limitations to guide the next step.</p></div></div><dl className="skills">{site.skills.map(skill => <div key={skill.label}><dt>{skill.label}</dt><dd>{skill.text}</dd></div>)}</dl></div></div></section>
        <section className="section wrap" id="experience" aria-labelledby="experience-title"><SectionHeading number="03" label="TECHNICAL LEADERSHIP / EXPERIENCE" title="Where I’ve put the work to use." id="experience-title" /><div className="experience">{site.experience.map(item => <article className="experience-entry" key={`${item.organization}-${item.title}`}><span className="experience-dates">{item.dates}</span><h3>{item.title}</h3><p className="experience-meta">{item.organization}</p><p>{item.summary}</p></article>)}</div></section>
        <section className="contact wrap" id="contact" aria-labelledby="contact-title"><div><p className="eyebrow">04 / CONTACT</p><h2 id="contact-title">Let’s make<br />something useful.</h2></div><div className="contact-copy"><p>Have an opportunity or a project in mind? I’d welcome a conversation.</p><a className="button button--primary" href={`mailto:${site.email}`}>Email Diego<Arrow /></a><a className="email-link" href={`mailto:${site.email}`}>{site.email}</a><div className="contact-links"><TextLink href={site.linkedin}>LinkedIn</TextLink><TextLink href={site.github}>GitHub</TextLink><TextLink href={site.resume}>View résumé</TextLink></div></div></section>
      </main>
      <footer className="wrap"><span>© {new Date().getFullYear()} {site.name}</span><a href="#top">Back to top ↑</a><TextLink href={site.portfolioRepo}>Portfolio source</TextLink></footer>
    </>
  );
}
