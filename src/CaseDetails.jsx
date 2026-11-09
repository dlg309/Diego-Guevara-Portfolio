import { ProjectMedia, TextLink } from './ProjectMedia';

export default function CaseDetails({ project }) {
  const sectionUrls = new Set(project.sections.flatMap(section => (section.links || []).map(link => link.url)));
  const remainingLinks = (project.links || []).filter(link => !sectionUrls.has(link.url));
  return (
          <div className="case-body">
        <div className="case-intro"><p>{project.overview}</p></div>
        <div className="case-content">
          <ProjectMedia project={project} detail />
          <div className="case-sections">{project.sections.map(section => <section key={section.title}><h4>{section.title}</h4><p>{section.text}</p>{section.links?.map(link => <TextLink key={link.url} href={link.url}>{link.label}</TextLink>)}</section>)}</div>
        </div>
        {remainingLinks.length > 0 && <div className="case-links">{remainingLinks.map(link => <TextLink key={link.url} href={link.url}>{link.label}</TextLink>)}</div>}
        <a className="back-link" href="#work">↑ Back to selected work</a>
          </div>
  );
}
