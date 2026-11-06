import site from './content/site.json';
import projects from './content/projects.json';

// The original content uses an assets prefix; Vite copies public files to the root.
const assetHref = (href = '') => href.startsWith('./assets/') ? `./${href.slice('./assets/'.length)}` : href;

function Arrow({ down = false }) {
  return <span aria-hidden="true">{down ? '↓' : '↗'}</span>;
}

function TextLink({ href, children, className = 'text-link' }) {
  return <a className={className} href={assetHref(href)}>{children} <Arrow /></a>;
}

function ImageFigure({ image, className = '' }) {
  return (
    <figure className={className}>
      <img src={assetHref(image.src)} alt={image.alt} loading="lazy" decoding="async" />
      <figcaption>
        {image.caption}
        {image.fullSize && <> <a href={assetHref(image.src)}>{image.linkLabel || <>View full-size screenshot<span className="sr-only">: {image.alt}</span></>}</a></>}
      </figcaption>
    </figure>
  );
}

function ProjectVisual({ project, detail = false }) {
  const { image, gallery } = project;
  const isPhoneGallery = project.galleryLayout === 'phone';
  if (!image?.src) return null;

  if (gallery?.length && isPhoneGallery && !detail) {
    return (
      <figure className="project-card__visual app-preview">
        <div className="app-preview-images">
          {[image, gallery[0]].map((item) => (
            <img key={item.src} src={assetHref(item.src)} alt={item.alt} loading="lazy" decoding="async" />
          ))}
        </div>
        <figcaption>{project.galleryPreviewCaption}</figcaption>
      </figure>
    );
  }

  if (gallery?.length && detail) {
    const additionalImages = isPhoneGallery ? gallery.slice(1) : gallery;
    return (
      <div className="case-visual app-gallery">
        {isPhoneGallery ? (
          <div className="app-gallery-grid">
            {[image, gallery[0]].map((item) => <ImageFigure key={item.src} image={item} />)}
          </div>
        ) : <ImageFigure image={image} className="case-screenshot" />}
        {additionalImages.length > 0 && (
          <details className="more-screens">
            <summary>More project screenshots<span className="sr-only"> for {project.title}</span> <span aria-hidden="true">↓</span></summary>
            <div className={isPhoneGallery ? 'app-gallery-grid' : 'screenshot-gallery'}>
              {additionalImages.map((item) => <ImageFigure key={item.src} image={item} className={isPhoneGallery ? '' : 'case-screenshot'} />)}
            </div>
          </details>
        )}
      </div>
    );
  }

  return <ImageFigure image={image} className={detail ? 'case-visual' : 'project-card__visual'} />;
}

function ProjectCard({ project }) {
  return (
    <article className="project-card">
      <div className="project-card__meta"><span>{project.number} <span aria-hidden="true">/</span> {project.kind}</span><span className="status">{project.status}</span></div>
      <ProjectVisual project={project} />
      <div className="project-card__body">
        <h3>{project.title}</h3>
        <p className="project-card__summary">{project.summary}</p>
        <p className="project-card__contribution"><strong>{project.cardContributionLabel || 'My contribution:'}</strong> {project.cardContribution || project.overview}</p>
      </div>
      <div className="project-card__footer">
        <div className="tags" aria-label="Technologies and topics">{project.tags.map((tag) => <span className="tag" key={tag}>{tag}</span>)}</div>
        <a className="text-link" href={`#${project.id}`}>Read case study <span className="sr-only">for {project.title} </span><Arrow /></a>
      </div>
    </article>
  );
}

function CaseStudy({ project }) {
  const sectionUrls = new Set(project.sections.flatMap((section) => (section.links || []).map((link) => link.url)));
  const remainingLinks = project.links.filter((link) => !sectionUrls.has(link.url));
  return (
    <article className="case" id={project.id}>
      <div className="case-intro">
        <p className="eyebrow">CASE {project.number} <span aria-hidden="true">/</span> {project.kind}</p>
        <h3>{project.title}</h3>
        <p className="status">{project.status}</p>
        <p>{project.overview}</p>
        <a className="back-link" href="#work"><span aria-hidden="true">← </span>Back to selected work</a>
      </div>
      <div className="case-content">
        <ProjectVisual project={project} detail />
        <div className="case-grid">
          {project.sections.map((section) => (
            <div key={section.title}>
              <h4>{section.title}</h4>
              <p>{section.text}</p>
              {(section.links || []).map((link) => <TextLink key={link.url} className="text-link evidence-link" href={link.url}>{link.label}</TextLink>)}
            </div>
          ))}
        </div>
        {remainingLinks.length > 0 && <div className="case-links">{remainingLinks.map((link) => <TextLink key={link.url} href={link.url}>{link.label}</TextLink>)}</div>}
      </div>
    </article>
  );
}

function SectionHeading({ number, label, children, description }) {
  return (
    <div className="section-heading">
      <div><p className="eyebrow"><span className="section-number">{number} /</span> {label}</p><h2>{children}</h2></div>
      {description && <p>{description}</p>}
    </div>
  );
}

export default function App() {
  return (
    <>
      <a className="skip" href="#main">Skip to content</a>
      <header className="site-header">
        <div className="wrap header-inner">
          <a className="brand" href="#top"><span className="brand-mark" aria-hidden="true">DG<span>.</span></span><span>{site.name}<small>PORTFOLIO</small></span></a>
          <nav className="nav" aria-label="Main navigation">
            <a href="#top">Home</a>
            <a href="#work">Work</a>
            <a href="#about">About</a>
            <a href="#approach">Approach</a>
            <a href="#case-studies">Project notes</a>
            <a className="nav-contact" href="#contact">Contact</a>
          </nav>
        </div>
      </header>
      <main id="main">
        <section className="hero wrap" id="top" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="eyebrow"><span className="dot" aria-hidden="true" /> HI, I’M {site.name} <span className="eyebrow-divider" aria-hidden="true">/</span> {site.eyebrow}</p>
            <h1 id="hero-title">{site.headline}<br /><em>{site.headlineEmphasis}</em></h1>
            <p className="hero-intro">{site.intro}</p><p className="hero-availability">{site.availability}</p>
            <div className="hero-actions"><a className="button button--primary" href="#work">Explore my work <Arrow down /></a><a className="button button--secondary" href={assetHref(site.resume)}>View résumé <Arrow /></a></div>
          </div>
          <aside className="hero-aside" aria-label="Project notes">
            <p className="micro-label">FROM IDEA TO APPLICATION</p><h2>Projects with a purpose.</h2>
            <p>Explore the problems, decisions, and contributions behind each project.</p>
            <a className="text-link" href="#case-studies">Explore project notes <Arrow /></a>
          </aside>
          <div className="hero-foot"><span><span className="dot" aria-hidden="true" /> BUSINESS + INFORMATION SYSTEMS</span><span>SCROLL TO EXPLORE <Arrow down /></span></div>
        </section>

        <section className="work section" id="work"><div className="wrap">
          <SectionHeading number="01" label="SELECTED WORK" description="A selection of projects across software, data, and operations—with a closer look at my role in each.">Ideas meet <em>action.</em></SectionHeading>
          <div className="project-grid">{projects.map((project) => <ProjectCard key={project.id} project={project} />)}</div>
          <div className="section-end"><span>THE WORK, IN CONTEXT</span><a className="text-link" href="#case-studies">Explore the project notes <Arrow down /></a></div>
        </div></section>

        <section className="about section" id="about"><div className="wrap">
          <div className="about-grid">
            <div><p className="eyebrow"><span className="section-number">02 /</span> ABOUT ME</p><h2>Business thinking.<br /><em>Builder’s curiosity.</em></h2></div>
            <div className="about-copy"><p className="lead">{site.about}</p><div className="interest-heading">WHAT I’M EXPLORING <span aria-hidden="true">↘</span></div><ul className="interest-list">{site.interests.map((interest, index) => <li key={interest}><span aria-hidden="true">0{index + 1}</span>{interest}</li>)}</ul></div>
          </div>
          <div className="experience"><div><p className="eyebrow">EXPERIENCE</p><h3>Work that shapes how I think.</h3></div><div className="experience-list">{site.experience.map((item) => <article key={`${item.organization}-${item.title}`}><div className="experience-title"><h4>{item.title}</h4><span>{item.dates}</span></div><p className="experience-meta">{item.organization}</p><p>{item.summary}</p></article>)}</div></div>
        </div></section>

        <section className="approach section" id="approach"><div className="wrap">
          <SectionHeading number="03" label="MY APPROACH" description="I’m developing a practice grounded in asking questions, making things, and checking what actually works.">Thoughtful work,<br /><em>down to the details.</em></SectionHeading>
          <div className="principles"><div><span>01</span><h3>Start with people</h3><p>Understand the need and the context before deciding what to build.</p></div><div><span>02</span><h3>Make it tangible</h3><p>Turn an idea into something specific enough to try, discuss, and improve.</p></div><div><span>03</span><h3>Check the work</h3><p>Use evidence, testing, and honest limitations to guide the next iteration.</p></div></div>
          <div className="skills"><p className="eyebrow">TOOLS &amp; INTERESTS</p><div>{site.skills.map((skill) => <p key={skill.label}><strong>{skill.label}</strong> {skill.text}</p>)}</div></div>
        </div></section>

        <section className="case-section section" id="case-studies"><div className="wrap">
          <SectionHeading number="04" label="PROJECT NOTES" description="More about the problems, contributions, decisions, and checks behind the work.">A closer <em>look.</em></SectionHeading>
          {projects.map((project) => <CaseStudy key={project.id} project={project} />)}
          <aside className="group-note" aria-label="Course group project status"><p><strong>Course group project · Pending.</strong> The required group customer project and my specific contribution are still being confirmed. I’ll add the project, team context, and evidence here when they’re ready.</p></aside>
        </div></section>

        <section className="contact section" id="contact"><div className="wrap contact-grid">
          <div><p className="eyebrow"><span className="section-number">05 /</span> LET’S CONNECT</p><h2>Good work starts<br />with a <em>conversation.</em></h2></div>
          <div className="contact-copy"><p>I’m interested in opportunities to learn, collaborate, and help solve practical problems. You can explore my work on GitHub.</p><a className="email-link" href={`mailto:${site.email}`}>{site.email} <Arrow /></a><div className="contact-links"><TextLink href={site.github}>GitHub</TextLink><TextLink href={site.linkedin}>LinkedIn</TextLink><TextLink href={site.resume}>View résumé</TextLink></div></div>
        </div></section>
      </main>
      <footer><div className="wrap footer-inner"><span>© {site.name}</span><span>Built with curiosity &amp; care.</span><TextLink href={site.portfolioRepo}>Portfolio source</TextLink></div></footer>
    </>
  );
}
