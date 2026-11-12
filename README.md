# Diego Guevara — portfolio

A portfolio for internship opportunities and selected coursework, built with React, HTML, CSS, and Vite. The matte black and navy design presents project cards and expandable case studies. Content is stored separately from the React components so it can be updated without redesigning the page. The site does not require a database, API keys, or analytics.

## Run it

Install Node.js 20.19 or newer in the 20.x series, or Node.js 22.12 or newer, and npm. Then, from this folder:

```sh
npm ci
npm run dev
```

Open the local address printed in the terminal. Vite reloads the site as you edit files. Stop the server with Ctrl+C. To generate the deployable site:

```sh
npm run build
```

Preview the built site locally with `npm run preview`, then open the address printed in the terminal. The React application requires JavaScript. Vite can select another port if the default is occupied. Both development and preview bind to localhost by default.

For browser tests or generated PDF and social-image assets, install Chromium once with `npx playwright install chromium`. GitHub Actions installs it automatically.

## Update content

- `src/content/site.json`: name, two-line headline (`headline` and `headlineEmphasis`), introduction, professional focus, interests, grouped skills, experience, profile URLs, contact email, both résumé paths, and `projectOrder`. The `projectOrder` array controls the visible order of both cards and case studies. Add confirmed experience entries to the `experience` array using `title`, `organization`, optional `dates`, and `summary`.
- `src/content/projects.json`: project labels, status, tags, `role`, `scope`, `verifiedContribution`, optional `proofLabel`, case-study sections, visuals, links, and an optional verified `demoUrl`. Add or remove sections as evidence becomes available. Keep `id` unique, short, and URL-safe; display numbers are derived from `projectOrder` in `site.json`. Use real links and describe your own contribution accurately. A section can include its own `links` array for evidence beside a claim.
- `src/App.jsx`: React components, page structure, and some section headings and explanatory sentences. ALPFA is identified as a personal collaborative project, not the required IS218 customer project.
- `src/style.css`: colors, font roles, 4px spacing scale, content widths, radii, motion, and shadows are CSS variables in `:root`; component and responsive rules follow. The single system-sans stack uses installed platform fonts; no font files or font services are loaded.
- `docs/PORTFOLIO_RECORD.md`: concise public course record and review follow-up.
- `docs/USER_RESEARCH.md`: a ready-to-use, pending plan for real-user testing.

JSON needs double quotes, commas between entries, and no trailing comma. For example, this is **sample data only**, not a claim about Diego:

```json
{"title":"Example role","organization":"Example organization","dates":"2025–2026","summary":"Replace with a verified contribution."}
```

To add a project, copy an existing object in `projects.json`, change its unique `id`, text, sections, tags, and verified links, then add its ID to `projectOrder` in `site.json`. Remove unverified sections and links; an empty `links` array is fine. Rebuild and check the card and case study. Case-study links open their matching accordion, including direct `#project-id` URLs. Radix provides the accordion and modal navigation behavior; CSS handles background scroll locking so the production CSP can remain strict. Project cards render immediately without an animation runtime. Case-study detail code preloads as the section approaches and loads on demand if needed. For a collaborative case, explain what you did, what teammates did, and what remains planned. Add the required customer project only when its course status and evidence are known.

## Résumé, contact, and images

The main download is the one-page `public/Diego_Guevara_Resume_One_Page.pdf`, generated from `docs/resume-one-page.html`. The contact section also links to the detailed `public/Diego_Guevara_Resume.pdf`, generated from `docs/resume.html`. After changing either HTML source, run `npm run assets:generate` to regenerate both PDFs and the branded `public/visuals/portfolio-social.png` preview from `docs/share-preview.html`. Commit the generated files, run the checks, and verify the deployed links. The two paths are set by `resume` and `resumeDetailed` in `site.json`. The public email and LinkedIn URL are in the same file.

Add a real project screenshot to `public/` and add an image object to the relevant project, for example **using your own actual filename and description**:

```json
"image": {"src":"./assets/example-screen.png", "alt":"Description of what the screenshot shows", "caption":"Screenshot of the actual project", "fullSize":true}
```

Set `fullSize` to `true` to provide a link to the original image, or omit it for diagrams. `public/visuals/` contains user-provided ALPFA app screenshots, a labeled ZipHeatMap workflow diagram, and locally captured project screenshots. Tempo shows its local interface with fictional sample data and a mocked backend. RPS shows a real local game session. Echo Mountain shows the browser game’s downhill, trick-run, halfpipe, and mobile interfaces; the RPS capture uses a local emoji font to render the existing hand icons. Each project’s `image` controls its main visual; its optional `gallery` array controls additional screenshots, captions, and full-size links. ALPFA uses `galleryLayout: "phone"` for its portrait app screens. `cardCaption` controls the card caption. Use `previewFit: "top"` only for a deliberately labeled dashboard detail; the full image remains available in the case study. Image `width` and `height` reserve layout space and should match the source asset. Replace any of them by updating its project’s `image` object and keeping the alt text and caption accurate. Use descriptive alt text for meaningful images, never invent a screenshot, and only include files you have permission to publish. Vite copies `public/` to the root of `dist/`; the React asset helper maps the existing `./assets/` content paths to those public files. Do not put private documents in `public/`.

## Local design review

The latest two-direction comparison, baseline and revised screenshots, browser-check output, and an unfilled peer-review record are kept in ignored `private/design-review/`. They are local review artifacts, not user-study findings or deployment assets. The selected direction uses a compact sans hierarchy, restrained surfaces, direct evidence links, and expandable case studies. The serif comparison is an alternative, not a tested user preference.

## Course record and privacy

Update the public record with actual evidence, changed/checked/next notes, and a real peer review and retest when they happen. The example rubric in the brief is a quality guide; consult Canvas for official requirements and deadlines. RPS-001 is a separate assignment.

`private/README.md` is a tracked blank template. Copy it to `private/career-research.md` for role cards, comparisons, and personal reflections. Files under `private/` other than the template are ignored by Git and excluded from the build. The temporary project copies under `docs/Tempo-AI-Assistant/`, `docs/Tempo/`, `docs/RPS_218Game/`, `docs/echo-mountain/`, and `docs/alpfa-njit-app/` are also ignored and excluded from the build; the portfolio does not depend on them. This is a safeguard, not encryption: check `git status` and `git diff --cached` before committing, and never use `git add -f` for private material. Anything already committed or shared needs separate removal; `.gitignore` cannot undo that.

## Security and verification

Before sharing a change, run:

```sh
npm ci
npm run check
npm test
npm run build
npm run test:browser
npm run deadcode
npm run assets:check
npm audit --audit-level=high
npm run size
```

`npm run check` verifies HTTPS link formatting, image descriptions, referenced local assets, and common accidental secret filenames or symlinks in `public/`. It is not a full secret scanner. The tests also check that the development server blocks `docs/` and `private/`, including encoded paths. Do not expose the development server to the internet; publish only `dist/`. Environment files are ignored by Git, but already tracked or previously shared secrets still require separate removal and rotation.

The production build includes a restrictive Content Security Policy meta tag. Response headers in `public/_headers` support static hosting on Netlify and Cloudflare Pages; `vercel.json` supplies corresponding headers on Vercel. These include framing protection, MIME sniffing protection, a referrer policy, and restrictions on camera, microphone, and location. Other hosts must be configured to send equivalent HTTP headers; meta tags alone cannot provide all of them. Once hosting is chosen, verify HTTPS and the actual response headers on the deployed site. The policy may need deliberate updates if external fonts, analytics, APIs, or other services are added.

GitHub Actions runs content checks, unit tests, Chromium desktop/mobile browser and accessibility checks, dead-code and asset checks, dependency audit, CodeQL, bundle budgets, and the Pages build. Dependabot requests weekly dependency and action updates when enabled for the repository.

## GitHub Pages deployment

The `Deploy portfolio to GitHub Pages` workflow checks and builds the site, then publishes only `dist/` when changes are pushed to `main`. Keep **GitHub Actions** as the publishing source in repository **Settings → Pages**. The deployed project site is available at `https://dlg309.github.io/Diego-Guevara-Portfolio/`. The workflow can also be run manually from the Actions tab.

`vite.config.js` uses relative asset paths for the repository subdirectory. GitHub Pages enforces the production Content Security Policy meta tag, but does not apply `public/_headers` or `vercel.json`; their HTTP-header-only protections require a host that supports custom headers. Check the live URL, images, résumé, and contact links after deployment.

## Still to add or confirm

- Identify the actual required IS218 customer project, your contribution, teammates’ work, links, checks, and limitations. You confirmed ALPFA is a personal collaborative project, not that course project.
- Share any further ALPFA contributions, production QA evidence, or credential badge links you want published. The ALPFA repository belongs to your partner.
- Update Tempo’s published rebuild status and checks as it changes; provide a hosted demo when one is ready. The default branch still contains the earlier version.
- Supply a shareable SelfGrow Figma prototype or images if you want its design work shown on the site. Add other projects or screenshots only when you are comfortable publishing them.
- Complete real peer review and a retest using `docs/USER_RESEARCH.md`. Check Canvas for current course requirements and deadlines; no peer findings or course approval are claimed here.


## Code and asset maintenance

Run `npm run deadcode`, `npm run assets:check`, then `npm run build && npm run size` before submitting changes. `npm run metrics` prints raw/gzip chunk sizes. GitHub's debloat workflow repeats these checks and compares PR builds with their base; CodeQL runs security and quality scans. See [the audit report](docs/DEBLOAT_AUDIT.md) for measurements, scope, exceptions, and the dry-run GitHub maintenance script. Changes merged to `main` publish through the Pages workflow after its checks pass.
