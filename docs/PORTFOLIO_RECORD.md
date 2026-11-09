# Portfolio project record

## Audience and promise

Primary reader: an internship recruiter scanning for what Diego has done and can explain. Hypothesis: clear contributions and checked results help them decide whether to investigate further. Secondary reader: a potential collaborator looking for a practical problem-solving approach and a way to connect. Hypothesis: plain language and project context make a technical project approachable. These are hypotheses, not user research findings.

Promise: make Diego’s work, contribution, checks, and next steps easy to understand, and offer a path to connect when a publishable contact route is available. Voice: **clear, curious, practical**.

## Design choice

- **A — evidence-first (selected):** one system-sans family, a dark neutral base, restrained blue actions, real project imagery, and scannable contribution/evidence links. The opening prioritizes Diego’s business-and-technology focus and a résumé action. The production hero uses the actual ALPFA app screens; Echo Mountain remains a supporting project rather than the portfolio’s identity. Tradeoff: the restrained visual language has less editorial flourish, but keeps the work broad across business and technology roles.
- **B — editorial comparison:** serif display type, a more expressive stacked composition, and a larger Echo Mountain feature, using the same verified introduction and representative ALPFA project. It adds personality but gives a game project more opening emphasis and takes more space before the project collection. The comparison is in `private/design-review/alternatives.html` with local captures; it is excluded from `dist/`.
- References: [Figma’s UI design guide](https://www.figma.com/resource-library/what-is-ui-design/) for hierarchy and consistent interaction patterns, [GOV.UK headings](https://design-system.service.gov.uk/styles/headings/) for consistent structure, and the publicly accessible [Mobbin landing page](https://mobbin.com/) for browsing-oriented visual hierarchy. The gated Mobbin pattern library was not inspected; no branding or product screenshots were copied. No real user preference is claimed.

## Stories and acceptance checks

1. Recruiter: understand Diego’s contribution. **Check:** each published case describes his role separately from team or agent work, or explicitly says it needs confirmation.
2. Technical reviewer: inspect evidence. **Check:** available repository, specification, and PR links are descriptive and functional; unavailable links are omitted.
3. Collaborator: understand interests and connect. **Check:** introduction and project context are visible; add a real direct contact route before sharing widely.
4. Mobile visitor: read without horizontal page scrolling. **Check:** cards and columns stack at narrow widths and text remains usable.
5. Keyboard visitor: navigate the page. **Check:** skip link appears on focus, links have visible focus, and all sections are reachable.

## Evidence and status

- [RPS repository](https://github.com/dlg309/RPS_Game218), [specification and recorded checks](https://github.com/dlg309/RPS_Game218/blob/main/SPEC.md), [PR](https://github.com/dlg309/RPS_Game218/pull/2). The documented coding-agent assistance and user review are distinguished in the case.
- [ALPFA NJIT App](https://github.com/AnabhayanA/alpfa-njit-app): collaborative Expo / React Native app in Diego’s partner’s repository. Local project history attributes E-Board profile, image, and error-fix commits to Diego; [one E-Board commit](https://github.com/AnabhayanA/alpfa-njit-app/commit/768aa0d) is public. The project documentation describes chapter events, photo sharing, reminders, and a separate backend, with final cross-device QA and production builds still pending. Its course group-project fit remains unconfirmed.
- ZipHeatMap: Diego identifies it as a MATLAB app he developed for his department to explore donor origins. The local package instructions describe validation, state summaries, filtering, and map exports. The Windows app was not run for this portfolio; the supplied package and spreadsheets are excluded from Git and the site build.
- [Tempo repository](https://github.com/dlg309/Tempo-AI-Assistant): the public default branch is the earlier React/Vite and FastAPI project. The local Next.js/Supabase rebuild is ahead of its [published branch](https://github.com/dlg309/Tempo-AI-Assistant/tree/revamp/tempo-next) by two commits. The project notes document optional Gemini-assisted proposals, manual planning, and snapshot-based calendar feeds. They report 54 unit and 24 embedded database checks plus desktop/mobile flows using simulated services; a later live desktop flow stopped at a Gemini provider outage. Those historical notes are not new portfolio tests. Diego’s résumé describes his earlier database/API contributions; the rebuild record describes coding-agent assistance.
- Required group customer case study: **pending identification and evidence**. The ALPFA mobile app is presented as collaborative work, but its suitability for the required course customer project has not been confirmed.
- Course guidance URLs supplied in the brief could not be accessed during this build; check official course materials and Canvas. The proposed portfolio rubric is illustrative, not a confirmed grade rubric; RPS-001 remains separate.

## Changed / checked / next

- **Changed:** revised the introduction and hero focus panel; shortened card contributions; added clearly labeled project visuals to cards and case studies; placed selected evidence links near their claims; and reduced the course note. ALPFA now uses Diego-provided screenshots of the dashboard, events, About, loading screen, and app credit. The case study labels event details as a snapshot and includes full-size links; three additional screenshots can be expanded. ZipHeatMap and Tempo use original illustrative diagrams. RPS uses a real screenshot of a completed local round with synthetic moves; a temporary emoji font supplied missing glyphs during capture. The order and detailed contribution and limitation text remain intact.
- **Checked:** on November 5, 2026, `npm ci --ignore-scripts` and `npm run build` passed. Playwright Chromium at 320, 375, 768 and 1440 px and Playwright Firefox at 375 and 1440 px showed no page overflow, broken internal anchors, or missing project images; reduced motion and the skip link were checked. All 32 links received visible keyboard focus in a Chromium pass. Axe scans reported no violations at 375 and 1440 px in Chromium. Mobile touch emulation followed all four case links; the résumé and full-size RPS image returned HTTP 200. GitHub destinations returned HTTP 200; LinkedIn returned HTTP 999, so its profile could not be independently verified. WebKit, real Safari, Chrome and Edge, a manual screen reader, and actual user sessions were not tested. Historical project check results were not rerun for this portfolio.
- **Screenshot update checked:** the build passed; all five ALPFA JPEGs loaded with alternative text in Playwright Chromium and Firefox. The gallery opened and closed with a keyboard, no horizontal overflow appeared at 320–1440 px, and Chromium axe scans at 320, 375, and 1440 px reported no violations. No manual screen-reader or real-user testing was conducted.
- **Follow-up checked (November 9, 2026):** raised evidence metadata to 14px and card corners to 8px; reconciled this record with the evidence-first production direction and added the pending peer-review task and blank outcome fields. `npm run check`, all 3 existing tests, the production build, and `npm audit --audit-level=high` passed; the audit reported 0 vulnerabilities. The integrated browser showed no horizontal overflow, broken images, unnamed links, invalid internal anchors, console errors, or failed requests at 360, 390, 768, 1024, 1440, landscape 844×390, and 720 CSS px (a zoom-width approximation, not an actual 200% browser-zoom test). The skip link received first keyboard focus; an ALPFA case opened at 390 and 1440; the résumé returned HTTP 200. Computed contrast ratios were 11.47:1 for muted text on the page background, 7.69:1 for metadata on a raised surface, 12.58:1 for the accent on the background, and 11.01:1 for button text on its accent surface. Desktop and mobile opening views were inspected. No type-check or lint scripts are configured; Axe, manual screen-reader use, real-device/browser testing, actual 200% zoom, and peer sessions were not run in this pass.
- **Next:** supply safe synthetic-data screenshots for ZipHeatMap and Tempo if desired; verify professional details and group-project status; and carry out real peer review using the pending [research plan](USER_RESEARCH.md).

## Peer review and retest

Required task, still pending with a real reviewer: “Find my individual project, explain what I contributed to the group project, then locate my code, résumé, and professional profiles.”

- Reviewer / date:
- Observed issue:
- Change made:
- Retest / date / actual result:

Do not fill these fields until the review and retest happen. The required course customer project is still unconfirmed; ALPFA is presented as collaborative work, not claimed as that course project.

## Public and private boundary

This file contains only material intended for public sharing. Role comparisons, eligibility, and personal reflection belong in an ignored local `private/` file, not the site or public project record.
