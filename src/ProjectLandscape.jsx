const landmarks = [
  { id: 'alpfa', x: 155, y: 160, label: 'ALPFA NJIT App' },
  { id: 'zipheatmap', x: 445, y: 165, label: 'ZipHeatMap' },
  { id: 'tempo', x: 125, y: 365, label: 'Tempo' },
  { id: 'echo-mountain', x: 455, y: 365, label: 'Echo Mountain' },
  { id: 'rps', x: 295, y: 490, label: 'Rock, Paper, Scissors' },
];

function DataColumn({ x, y, height }) {
  return <g transform={`translate(${x} ${y})`}>
    <path d={`M-10 0V${-height}L0 ${-height + 6}V6Z`} fill="#344f6e" />
    <path d={`M0 6V${-height + 6}L10 ${-height}V0Z`} fill="#597ba2" />
    <path d={`M-10 ${-height}L0 ${-height - 6}L10 ${-height}L0 ${-height + 6}Z`} fill="#a9caff" />
  </g>;
}

function LandmarkArt({ id }) {
  if (id === 'alpfa') return <g>
    <path d="M-25-95L37-86V15L-25 6Z" fill="#263e5b" stroke="#597ba2" />
    <rect x="-33" y="-100" width="61" height="107" rx="9" fill="#142238" stroke="#a9caff" />
    <rect x="-27" y="-84" width="49" height="81" rx="3" fill="#213650" />
    <path d="M-10-92H6" stroke="#7894b5" strokeWidth="2" strokeLinecap="round" />
    <circle cx="-16" cy="-69" r="5" fill="#a9caff" />
    <path d="M-5-72H13M-5-66H7" stroke="#a9caff" strokeWidth="2" strokeLinecap="round" />
    <rect x="-20" y="-53" width="35" height="18" rx="3" fill="#3c5b7e" />
    <rect x="-20" y="-28" width="35" height="18" rx="3" fill="#344e6c" />
    <path d="M-14-46H8M-14-21H8" stroke="#c7ddff" strokeWidth="2" />
  </g>;
  if (id === 'zipheatmap') return <g>
    <path d="M-70-14L-10-49L69-4L9 31Z" fill="#263e57" stroke="#59718f" />
    <path d="M-50-13L-7-38L49-6L6 19Z" fill="none" stroke="#7894b5" strokeDasharray="3 4" />
    <DataColumn x={-32} y={-8} height={26} />
    <DataColumn x={-7} y={-21} height={54} />
    <DataColumn x={17} y={-7} height={38} />
    <DataColumn x={41} y={6} height={20} />
    <path d="M-49 7L-20 24M35-27L58-14" stroke="#a9caff" strokeWidth="2" />
  </g>;
  if (id === 'tempo') return <g>
    <path d="M-48-72L60-61V18L-48 7Z" fill="#263e5b" stroke="#597ba2" />
    <rect x="-55" y="-80" width="108" height="86" rx="7" fill="#142238" stroke="#a9caff" />
    <path d="M-55-55H53" stroke="#597ba2" />
    <path d="M-31-87V-72M28-87V-72" stroke="#c7ddff" strokeWidth="4" strokeLinecap="round" />
    <path d="M-35-39H-21M-5-39H9M25-39H38M-35-16H-21M-5-16H9M25-16H38" stroke="#597ba2" strokeWidth="7" strokeLinecap="round" />
    <rect x="-14" y="-47" width="30" height="23" rx="4" fill="#a9caff" />
    <path d="M-6-36L-1-31L7-40" fill="none" stroke="#142238" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </g>;
  if (id === 'echo-mountain') return <g>
    <path d="M-75 16L-20-87L45 16Z" fill="#405c7d" />
    <path d="M-20-87L-8-14L45 16Z" fill="#263d58" />
    <path d="M-20-87L-40-49L-25-54L-10-39L0-53Z" fill="#b8cce2" />
    <path d="M-8 16L35-54L80 16Z" fill="#597ba2" />
    <path d="M35-54L42-7L80 16Z" fill="#344f6e" />
    <path d="M35-54L21-30L35-34L48-29Z" fill="#c7ddff" />
    <path d="M-13-33L-28-11L-16 0L-27 16" fill="none" stroke="#a9caff" strokeWidth="2" strokeLinecap="round" />
  </g>;
  return <g transform="translate(0 40) scale(.65)">
    <path d="M-65-50L-26-57L-15-12L-54-4Z" fill="#344f6e" stroke="#7894b5" />
    <path d="M-22-71H22V-18H-22Z" fill="#213650" stroke="#a9caff" />
    <path d="M26-57L65-50L54-4L15-12Z" fill="#344f6e" stroke="#7894b5" />
    <text x="-40" y="-25" transform="rotate(-10 -40 -25)" className="landscape-token">R</text>
    <text x="0" y="-36" className="landscape-token">P</text>
    <text x="40" y="-25" transform="rotate(10 40 -25)" className="landscape-token">S</text>
  </g>;
}

export default function ProjectLandscape({ projects }) {
  return <div className="project-landscape">
    <svg viewBox="0 0 600 610" role="group" aria-labelledby="landscape-title landscape-description">
      <title id="landscape-title">A landscape of Diego’s projects</title>
      <desc id="landscape-description">Select a project to open its case study. A phone, data columns, a calendar, mountains, and game cards represent the work. The scene is illustrative; the columns do not represent donor data or measured results.</desc>
      <g className="landscape-connections" fill="none">
        <path d="M155 180V250L295 320L445 250V185M295 320V390H125M295 390H455M295 390V515" />
        <path className="landscape-signal" d="M155 180V250L295 320L445 250V185M295 320V390H125M295 390H455M295 390V515" />
      </g>
      <path d="M279 320L295 311L311 320L295 329Z" fill="#344f6e" stroke="#a9caff" />
      {landmarks.map(landmark => {
        const project = projects.find(item => item.id === landmark.id);
        if (!project) return null;
        return <a className="landscape-project" href={`#${project.id}`} key={project.id} aria-label={project.id === 'rps' ? undefined : `Read case study for ${project.title}`}>
          <g transform={`translate(${landmark.x} ${landmark.y})`}>
            <rect className="landscape-hit" x="-108" y={project.id === 'rps' ? -15 : -95} width="216" height={project.id === 'rps' ? 115 : 195} rx="10" />
            <g className="landscape-landmark" aria-hidden="true">
              <g transform="scale(.85)">
              <path d="M-74 26L0-15L74 26V36L0 78L-74 36Z" fill="#101b2d" stroke="#344966" />
              <path className="landscape-platform" d="M-74 26L0-15L74 26L0 68Z" fill="#17263d" stroke="#59718f" />
              <LandmarkArt id={project.id} />
              </g>
            </g>
            <text x="0" y="80" className="landscape-label">{landmark.label}<tspan className="landscape-arrow"> ↗</tspan></text>
          </g>
        </a>;
      })}
    </svg>
  </div>;
}
