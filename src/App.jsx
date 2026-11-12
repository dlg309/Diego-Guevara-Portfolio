import { lazy, Suspense, useEffect, useLayoutEffect, useRef, useState } from 'react';
import * as Accordion from '@radix-ui/react-accordion';
import * as Dialog from '@radix-ui/react-dialog';
import { Arrow, TextLink, ProjectMedia, assetHref } from './ProjectMedia';
import ContactActions from './ContactActions';
import site from './content/site.json';
import projects from './content/projects.json';

let loadedCaseDetails;
let caseDetailsRequest;
const loadCaseDetails = () => caseDetailsRequest ??= import('./CaseDetails').then(module => {
  loadedCaseDetails = module.default;
  return module;
});
const CaseDetails = lazy(loadCaseDetails);
const ProjectLandscape = lazy(() => import('./ProjectLandscape'));

const navigationItems = [
  { label: 'Home', href: '#top' },
  { label: 'Work', href: '#work' },
  { label: 'Case studies', href: '#case-studies' },
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
            <a className="mobile-nav-link" href={assetHref(site.resume)}>View résumé<span aria-hidden="true">↗</span></a>
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
        <div className="project-actions"><a className="text-link" href={`#${project.id}`}>Read case study<span className="sr-only"> for {project.title}</span><Arrow /></a>{project.demoUrl && <TextLink href={project.demoUrl}>Play {project.title}</TextLink>}</div>
        <ul className="tags" aria-label={`Technologies and topics for ${project.title}`}>{project.tags.map(tag => <li key={tag}>{tag}</li>)}</ul>
      </div>
    </article>
  );
}

function MeasuredCaseBody({ project }) {
  const content = useRef(null);
  // Keep the chosen component type stable when the sticky header rerenders.
  const [Details] = useState(() => loadedCaseDetails ?? CaseDetails);
  useLayoutEffect(() => {
    const body = content.current;
    const panel = body.parentElement;
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let previousHeight;
    let resizeAnimation;
    const measure = () => {
      const height = body.getBoundingClientRect().height;
      if (height === previousHeight) return;
      const fromHeight = panel.getBoundingClientRect().height;
      panel.style.setProperty('--case-content-height', `${height}px`);
      // Suspense and expanded galleries can change the natural height after
      // Radix has measured it. Retarget from the currently visible height.
      if (previousHeight !== undefined && panel.dataset.state === 'open') {
        resizeAnimation?.cancel();
        resizeAnimation = panel.animate(
          [{ height: `${fromHeight}px` }, { height: `${height}px` }],
          { duration: motion.matches ? 300 : 480, easing: 'cubic-bezier(0.4, 0, 0.2, 1)' },
        );
      }
      previousHeight = height;
    };
    const stopResizing = event => {
      if (event.target === panel && event.animationName === 'case-study-close') resizeAnimation?.cancel();
    };
    const onMotionChange = () => { if (motion.matches) resizeAnimation?.cancel(); };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(body);
    panel.addEventListener('animationstart', stopResizing);
    motion.addEventListener('change', onMotionChange);
    return () => {
      observer.disconnect();
      resizeAnimation?.cancel();
      panel.removeEventListener('animationstart', stopResizing);
      motion.removeEventListener('change', onMotionChange);
      panel.style.removeProperty('--case-content-height');
      panel.style.removeProperty('--case-closing-height');
    };
  }, []);
  return <div className="case-measure" ref={content}><Suspense fallback={<p role="status">Loading case study…</p>}><Details project={project} /></Suspense></div>;
}

function CaseStudy({ project }) {
  const panel = useRef(null);
  return (
    <Accordion.Item asChild className="case-study" value={project.id}>
      <article id={project.id}>
        <Accordion.Header className="case-heading">
          <Accordion.Trigger className="case-trigger" onClick={() => {
            if (panel.current?.dataset.state === 'open') {
              panel.current.style.setProperty('--case-closing-height', `${panel.current.getBoundingClientRect().height}px`);
            }
          }}>
            <span className="case-number" aria-hidden="true">{project.number}</span>
            <span className="case-summary-title"><span className="case-kind">{project.kind}</span><span className="case-title">{project.title}</span></span>
            <span className="status">{project.status}</span>
            <span className="case-toggle" aria-hidden="true" />
          </Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content className="case-panel" ref={panel}>
          <MeasuredCaseBody project={project} />
        </Accordion.Content>
      </article>
    </Accordion.Item>
  );
}

function SectionHeading({ number, label, title, description, id }) {
  return <div className="section-heading"><div><p className="eyebrow">{number && `${number} / `}{label}</p><h2 id={id}>{title}</h2></div>{description && <p>{description}</p>}</div>;
}

function SkillGroups({ groups }) {
  return <div className="skill-groups" aria-label="Skills by area">{groups.map(group => <section className="skill-group" key={group.label}><h4>{group.label}</h4><ul>{group.items.map(item => <li key={item}>{item}</li>)}</ul></section>)}</div>;
}

function CredentialsAndInvolvement({ items }) {
  return <div className="credentials"><h3>Credentials & involvement</h3><div className="credentials-grid">{items.map(item => <article className="credential" key={item.title}><div className="credential-top"><h4>{item.title}</h4><span>{item.status}</span></div><p className="credential-organization">{item.organization}</p><p>{item.description}</p>{item.url && <TextLink href={item.url}>{item.linkLabel}</TextLink>}</article>)}</div></div>;
}

function useCaseStudyAnchors() {
  useEffect(() => {
    // Load the small details chunk before the visitor reaches the dropdowns,
    // keeping the first disclosure from animating a loading placeholder.
    const notes = document.getElementById('case-studies');
    const preload = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) {
        loadCaseDetails().catch(() => {});
        preload.disconnect();
      }
    }, { rootMargin: '600px' });
    if (notes) preload.observe(notes);
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
      if (link) reveal(link.getAttribute('href'));
    };
    onHashChange();
    window.addEventListener('hashchange', onHashChange);
    document.addEventListener('click', onClick);
    return () => { preload.disconnect(); window.removeEventListener('hashchange', onHashChange); document.removeEventListener('click', onClick); };
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
  const [showLandscape, setShowLandscape] = useState(() => typeof window !== 'undefined' && window.matchMedia('(min-width: 1200px)').matches);
  useEffect(() => {
    const viewport = window.matchMedia('(min-width: 1200px)');
    const update = () => setShowLandscape(viewport.matches);
    viewport.addEventListener('change', update);
    return () => viewport.removeEventListener('change', update);
  }, []);
  useEffect(() => {
    let frame = 0;
    let scrollbarTimeout;
    const root = document.documentElement;
    root.classList.add('scrollbar-auto-hide');
    const showScrollbar = () => {
      root.classList.add('scrollbar-visible');
      window.clearTimeout(scrollbarTimeout);
      scrollbarTimeout = window.setTimeout(() => root.classList.remove('scrollbar-visible'), 900);
    };
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
    const onScroll = () => { showScrollbar(); updateHeader(); };
    const onPointerMove = event => {
      if (event.clientX >= root.clientWidth - 20) showScrollbar();
    };
    updateHeader();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('resize', updateHeader);
    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(scrollbarTimeout);
      root.classList.remove('scrollbar-auto-hide', 'scrollbar-visible');
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('resize', updateHeader);
    };
  }, []);
  return (
    <>
      <a className="skip" href="#main">Skip to content</a>
      <header className={`site-header${isScrolled ? ' site-header--scrolled' : ''}`}><div className="wrap header-inner">
        <a className="brand" href="#top"><span className="brand-mark" aria-hidden="true">DG.</span><span>{site.name}<small>BUSINESS + TECHNOLOGY</small></span></a>
        <SiteNavigation activeSection={activeSection} />
        <a className="header-resume" href={assetHref(site.resume)}>Résumé <Arrow /></a>
        <MobileNavigation activeSection={activeSection} />
      </div></header>
      <main id="main" tabIndex={-1}>
        <section className="hero wrap" id="top" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="eyebrow">{site.eyebrow}</p>
            <h1 id="hero-title">{site.headline}<span>{site.headlineEmphasis}</span></h1>
            <p className="hero-intro">{site.intro} {site.professionalFocus}</p>
            <div className="hero-actions">
              <a className="button button--primary" href="#work">Explore my work<Arrow down /></a>
              <a className="button button--secondary" href={assetHref(site.resume)} download>Download résumé<Arrow /></a>
            </div>
            <p className="hero-availability"><span className="dot" aria-hidden="true" />{site.availability}</p>
            <div className="hero-links"><TextLink href={`mailto:${site.email}`}>Contact me</TextLink><TextLink href={site.linkedin}>LinkedIn</TextLink><TextLink href={site.github}>GitHub</TextLink></div>
          </div>
          {showLandscape && <Suspense fallback={null}><ProjectLandscape projects={orderedProjects} /></Suspense>}
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
        <section className="section wrap" id="about" aria-labelledby="about-title"><SectionHeading number="02" label="BACKGROUND & APPROACH" title="A business lens. A builder’s curiosity." id="about-title" description="Understand the need, make the work tangible, and check the result." /><div className="background-grid"><div className="about-copy"><p className="lead">{site.about}</p><p>{site.aboutDetail}</p><h3 className="small-heading">What I’m exploring</h3><ul className="interest-list">{site.interests.map(interest => <li key={interest}>{interest}</li>)}</ul></div><div className="approach-content" id="approach"><h3>How I approach the work</h3><div className="principles"><div><span aria-hidden="true">01</span><h4>Understand the need</h4><p>Ask how the work gets done and where people encounter friction.</p></div><div><span aria-hidden="true">02</span><h4>Make it tangible</h4><p>Build something specific enough to try, discuss, and improve.</p></div><div><span aria-hidden="true">03</span><h4>Check the work</h4><p>Use tests, evidence, and honest limitations to guide the next step.</p></div></div></div></div><div className="skills-area"><h3>Skills used in projects and coursework</h3><SkillGroups groups={site.skillGroups} /></div></section>
        <section className="section wrap" id="experience" aria-labelledby="experience-title"><SectionHeading number="03" label="EXPERIENCE & INVOLVEMENT" title="Where I’ve put the work to use." id="experience-title" /><div className="experience">{site.experience.map(item => <article className="experience-entry" key={`${item.organization}-${item.title}`}><span className="experience-dates">{item.dates}</span><h3>{item.title}</h3><p className="experience-meta">{item.organization}</p><p>{item.summary}</p></article>)}</div><CredentialsAndInvolvement items={site.credentialsAndInvolvement} /></section>
        <section className="contact wrap" id="contact" aria-labelledby="contact-title"><div><p className="eyebrow">04 / CONTACT</p><h2 id="contact-title">Let’s make<br />something useful.</h2></div><div className="contact-copy"><p>Have an opportunity or a project in mind? I’d welcome a conversation.</p><ContactActions email={site.email} resume={site.resume} resumeDetailed={site.resumeDetailed} linkedin={site.linkedin} github={site.github} /></div></section>
{/*  */}      </main>
      <footer className="wrap"><span>© {new Date().getFullYear()} {site.name}</span><a href="#top">Back to top ↑</a><TextLink href={site.portfolioRepo}>Portfolio source</TextLink></footer>
    </>
  );
}
