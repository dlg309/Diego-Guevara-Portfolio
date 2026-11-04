# Portfolio project record

## Audience and promise

Primary reader: an internship recruiter scanning for what Diego has done and can explain. Hypothesis: clear contributions and checked results help them decide whether to investigate further. Secondary reader: a potential collaborator looking for a practical problem-solving approach and a way to connect. Hypothesis: plain language and project context make a technical project approachable. These are hypotheses, not user research findings.

Promise: make Diego’s work, contribution, checks, and next steps easy to understand, and offer a path to connect when a publishable contact route is available. Voice: **clear, curious, practical**.

## Design choice

- **A — evidence-first professional (selected):** restrained charcoal, slate, and warm neutral palette, high-contrast type, scannable project cards, and case notes close to evidence. Tradeoff: less expressive than a personal notebook, but faster to scan and simpler to maintain.
- **B — builder’s notebook:** soft neutral background, a stacked hero and stronger card rule, using the same content and components. Tradeoff: more editorial personality, but the longer opening pushes project evidence farther down. Run `npm run preview:alternative` for the isolated local comparison; it is not included in `dist/`.
- Reference: [GOV.UK Design System headings](https://design-system.service.gov.uk/styles/headings/). Adapted the principle of consistent, hierarchical headings and captions, not its branding. No real user preference is claimed.

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

- **Changed:** built a static, responsive portfolio with editable content and a local alternative presentation. Added ZipHeatMap and reordered the work and case studies: ALPFA NJIT App, ZipHeatMap, Tempo, then Rock, Paper, Scissors.
- **Checked:** `npm install` and `npm run build` passed. Local Chromium checks at 375, 768, and 1440 px found no horizontal page overflow or missing internal anchors; keyboard focus and the skip link worked. Axe reported no violations at 375 and 1440 px after contrast and accessible-name fixes. The six published GitHub URLs returned HTTP 200. These checks are not a full screen-reader or human usability review. Project check results on the website are historical results from the RPS project record, not newly rerun here.
- **Next:** verify professional details, confirm any further individual contributions and whether the required group project is represented, preserve relevant project evidence, and carry out real peer review.

## Peer review and retest

Pending: reviewer / issue link, observed problem, actual change, and retest result. Do not fill these in until they happen.

## Public and private boundary

This file contains only material intended for public sharing. Role comparisons, eligibility, and personal reflection belong in an ignored local `private/` file, not the site or public project record.
