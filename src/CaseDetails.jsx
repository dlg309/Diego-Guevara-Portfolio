import { ProjectMedia, TextLink } from './ProjectMedia';

const stageNames = ['Problem', 'My contribution', 'What was built', 'Evidence and checks', 'Status and limitations'];
const sectionStages = {
  alpfa: [0, 1, 2, null, 3],
  zipheatmap: [0, 1, 2, 3, 4],
  tempo: [0, 1, 2, 3, 4],
  'echo-mountain': [0, 1, 2, 3, 4],
  rps: [0, 1, 2, 3, 4],
};

export default function CaseDetails({ project }) {
  const sectionUrls = new Set(project.sections.flatMap(section => (section.links || []).map(link => link.url)));
  const remainingLinks = (project.links || []).filter(link => !sectionUrls.has(link.url));
  const stages = sectionStages[project.id] || project.sections.map((_, index) => index);
  return (
    <div className="case-body">
        <div className="case-intro"><p>{project.overview}</p></div>
        <dl className="project-proof"><div><dt>My role</dt><dd>{project.role}</dd></div><div><dt>Scope</dt><dd>{project.scope}</dd></div><div><dt>{project.proofLabel || 'Verified contribution'}</dt><dd>{project.verifiedContribution}</dd></div></dl>
        <div className="case-content">
          <ProjectMedia project={project} detail />
          <div className="case-sections">{stages.map((sectionIndex, index) => {
            const section = project.sections[sectionIndex];
            const isAlpfaEvidence = project.id === 'alpfa' && sectionIndex === null;
            return <section key={stageNames[index]}><h4>{stageNames[index]}</h4>{isAlpfaEvidence ? <><p>The linked commits document my E-Board, headshot, and loading-screen work. Cross-device QA and production builds remain pending.</p>{project.sections[1].links?.map(link => <TextLink key={link.url} href={link.url}>{link.label}</TextLink>)}</> : <><p>{section.text}</p>{!(project.id === 'alpfa' && sectionIndex === 1) && section.links?.map(link => <TextLink key={link.url} href={link.url}>{link.label}</TextLink>)}</>}</section>;
          })}</div>
        </div>
        {remainingLinks.length > 0 && <div className="case-links">{remainingLinks.map(link => <TextLink key={link.url} href={link.url}>{link.label}</TextLink>)}</div>}
        <a className="back-link" href="#work">↑ Back to selected work</a>
    </div>
  );
}
