import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import * as Accordion from '@radix-ui/react-accordion';
import * as Dialog from '@radix-ui/react-dialog';
import { Arrow, TextLink, ProjectMedia, assetHref } from './ProjectMedia';
import site from './content/site.json';
import projects from './content/projects.json';

const CaseDetails = lazy(() => import('./CaseDetails'));

const navigationItems = [
  { label: 'Home', href: '#top' },
  { label: 'Work', href: '#work' },
  { label: 'Project notes', href: '#case-studies' },
  { label: 'Background', href: '#about' },
  { label: 'Experience', href: '#experience' },
  { label: 'Contact', href: '#contact' },
];

function SiteNavigation({ activeSection }) {
  return (
    <nav className="nav" aria-label="Main navigation">
      <ul className="nav-list">
        {navigationItems.map(item => <li key={item.href}><a className="nav-link" href={item.href} aria-current={activeSection === item.href ? 'location' : undefined}>{item.label}</a></li>)}
      </ul>
    </nav>
  );
}

function MobileNavigation({ activeSection }) {
  const [open, setOpen] = useState(false);
  const destination = useRef(null);
  useEffect(() => {
    document.body.classList.toggle('navigation-open', open);
    return () => document.body.classList.remove('navigation-open');
  }, [open]);
  return (
    <Dialog.Root open={open} onOpenChange={nextOpen => { if (nextOpen) destination.current = null; setOpen(nextOpen); }}>
      <Dialog.Trigger className="menu-toggle" aria-label="Open navigation menu">
        <span className="menu-icon" aria-hidden="true"><span /></span>
        <span className="menu-label">Menu</span>
      </Dialog.Trigger>
      <Dialog.Portal>
        {/* CSS scroll locking preserves the modal focus trap without injected styles. */}
        {open && <div className="mobile-nav-overlay" aria-hidden="true" />}
        <Dialog.Content className="mobile-nav-panel" onCloseAutoFocus={event => {
          if (!destination.current) return;
          const target = document.querySelector(destination.current);
          destination.current = null;
          if (!target) return;
          // A chosen anchor should receive focus; restoring the menu trigger
          // would scroll a non-sticky landscape header back to the page top.
          event.preventDefault();
          requestAnimationFrame(() => {
            target.tabIndex = -1;
            target.focus({ preventScroll: true });
            target.scrollIntoView({ block: 'start', behavior: 'instant' });
          });
        }}>
          <div className="mobile-nav-heading">
            <Dialog.Title>Navigate</Dialog.Title>
            <Dialog.Close className="menu-close" aria-label="Close navigation"><span aria-hidden="true" /></Dialog.Close>
          </div>
          <Dialog.Description className="sr-only">Choose a section of the portfolio.</Dialog.Description>
          <nav className="mobile-nav" aria-label="Mobile navigation">
            {navigationItems.map(item => <Dialog.Close asChild key={item.href}><a className="mobile-nav-link" href={item.href} onClick={() => { destination.current = item.href; }} aria-current={activeSection === item.href ? 'location' : undefined}>{item.label}<span aria-hidden="true">↘</span></a></Dialog.Close>)}
          </nav>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function ProjectCard({ project, eager = false }) {
  return (
    <article className="project-card" aria-labelledby={`card-${project.id}`}>
      <div className="project-card__intro">
        <div className="project-meta"><span>{project.number} / {project.kind}</span><span className="status">{project.status}</span></div>
        <h3 id={`card-${project.id}`}>{project.title}</h3>
        <p>{project.summary}</p>
        <p className="contribution"><strong>My contribution</strong>{project.cardContribution}</p>
      </div>
      <ProjectMedia project={project} eager={eager} />
      <div className="project-card__footer">
        <div className="project-actions"><a className="text-link" href={`#${project.id}`}>Read case study<span className="sr-only"> for {project.title}</span><Arrow /></a></div>
        <ul className="tags" aria-label={`Technologies and topics for ${project.title}`}>{project.tags.map(tag => <li key={tag}>{tag}</li>)}</ul>
      </div>
    </article>
  );
}

function CaseStudy({ project }) {
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
          <Suspense fallback={<p role="status">Loading case study…</p>}><CaseDetails project={project} /></Suspense>
        </Accordion.Content>
      </article>
    </Accordion.Item>
  );
}

function SectionHeading({ number, label, title, description, id }) {
  return <div className="section-heading"><div><p className="eyebrow">{number && `${number} / `}{label}</p><h2 id={id}>{title}</h2></div>{description && <p>{description}</p>}</div>;
}

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

const projectOrder = site.projectOrder || projects.map(project => project.id);
const orderedProjects = [...projects]
    .sort((left, right) => projectOrder.indexOf(left.id) - projectOrder.indexOf(right.id))
    .map((project, index) => ({ ...project, number: String(index + 1).padStart(2, '0') }));

export default function App() {
  useCaseStudyAnchors();
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('#top');
  useEffect(() => {
    let frame = 0;
    const updateHeader = () => {
      setIsScrolled(window.scrollY > 120);
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const marker = window.innerHeight * 0.3;
        const atPageEnd = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
        const current = atPageEnd ? navigationItems[navigationItems.length - 1] : navigationItems.findLast(item => {
          const section = document.querySelector(item.href);
          return section && section.getBoundingClientRect().top <= marker;
        });
        setActiveSection(current?.href || '#top');
      });
    };
    updateHeader();
    window.addEventListener('scroll', updateHeader, { passive: true });
    window.addEventListener('resize', updateHeader);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', updateHeader);
      window.removeEventListener('resize', updateHeader);
    };
  }, []);
  return (
    <>
      <a className="skip" href="#main">Skip to content</a>
      <header className={`site-header${isScrolled ? ' site-header--scrolled' : ''}`}><div className="wrap header-inner">
        <a className="brand" href="#top"><span className="brand-mark" aria-hidden="true">DG.</span><span>{site.name}<small>BUSINESS + TECHNOLOGY</small></span></a>
        <SiteNavigation activeSection={activeSection} />
        <MobileNavigation activeSection={activeSection} />
      </div></header>
      <main id="main" tabIndex={-1}>
        <section className="hero wrap" id="top" aria-labelledby="hero-title">
          <div className="hero-copy"><p className="eyebrow">{site.name} <span aria-hidden="true">/</span> {site.eyebrow}</p><h1 id="hero-title">{site.headline}<span>{site.headlineEmphasis}</span></h1><p className="hero-intro">{site.intro} {site.professionalFocus}</p><div className="hero-actions"><a className="button button--primary" href={`mailto:${site.email}`}>Contact me<Arrow /></a><a className="button button--secondary" href={assetHref(site.resume)} download>Download résumé<Arrow /></a><a className="text-link" href="#work">Explore projects<Arrow down /></a></div><div className="hero-links"><TextLink href={site.linkedin}>LinkedIn</TextLink><TextLink href={site.github}>GitHub</TextLink></div><p className="hero-availability"><span className="dot" aria-hidden="true" />{site.availability}</p></div>
          <aside className="hero-focus" aria-label="Selected project stack"><p className="eyebrow">Stack in selected work</p><ul>{site.activeStack.map(item => <li key={item}>{item}</li>)}</ul></aside>
        </section>
        <section className="section section--work wrap" id="work" aria-labelledby="work-title">
          <SectionHeading number="01" label="SELECTED WORK" title="Projects with a purpose." id="work-title" description="Software, data, and operations projects—with my role and the evidence close at hand." />
          <div className="project-grid">
            {orderedProjects.map((project, index) => <ProjectCard key={project.id} project={project} eager={index === 0} />)}
          </div>
          <div className="project-notes" id="case-studies" aria-labelledby="notes-title">
            <SectionHeading label="PROJECT NOTES" title="The work, in context." id="notes-title" description="Open a case study for the problem, contribution, decisions, checks, and limitations." />
            <Accordion.Root className="case-list" type="multiple">{orderedProjects.map(project => <CaseStudy key={project.id} project={project} />)}</Accordion.Root>
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
