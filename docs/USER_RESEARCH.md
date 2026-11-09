# Portfolio user research plan

**Status: pending.** No participant sessions, findings, preference claims, or retests have been recorded. Browser and accessibility checks do not replace observing people use the site.

## Purpose and setup

Learn whether an internship reviewer can quickly understand Diego’s interests, identify his contribution, inspect evidence, and find a way to contact him. A second perspective is a potential collaborator looking for a practical explanation of a project. These are hypotheses to test, not conclusions.

Run a short one-on-one session with consenting peers, a mentor, or a reviewer. Aim for a mix of mobile and desktop use where possible. Show the current local or otherwise authorized site. Ask each participant to think aloud; observe without steering them or explaining the layout. Ask permission before taking notes, and ask separately before any audio, video, or screen recording. A participant may skip a question or stop at any time. No tracking or recording has been installed.

## First impression: five seconds

Show the top of the homepage for five seconds, then hide it. Ask:

1. “What does Diego do or study? What kinds of opportunities or work is he interested in?”
2. “What do you remember about the site, and what did it communicate?”

Record what they actually say before revealing the page again. Do not fill gaps or prompt an answer. A missed detail is a signal to investigate, not proof that every visitor will miss it.

## Desirability

After the five-second questions, let the participant view the page. Ask: “What three to five words describe how this site feels?” Follow with: “What on the page made you choose those words?” Compare their own words with the intended clear, curious, practical tone without implying a correct answer.

## Task-based usability

Start each task at the homepage. Read each prompt neutrally, allow the participant to use their own path, and ask them to say when they think they are done. Observe hesitation, missed links, and their actual words. Count clicks or taps where useful, but do not treat a small number of participants as a representative conversion rate.

1. “Find the ALPFA NJIT app and explain what Diego contributed and who owns the repository.”
2. “Find a project that connects Diego’s work experience with a practical problem. What does it do?”
3. “Find and open Diego’s résumé.” Note the number of clicks or taps from the homepage; the design target is no more than two.
4. “Find a way to contact Diego. What would you do if your device has no email app configured?” Note clicks or taps from the homepage; the target is no more than two.

After each task, ask “What, if anything, was confusing?” Avoid leading questions or helping unless the participant requests it; record any assistance. Check the résumé and email destination in advance so a technical outage is not mistaken for a navigation issue.

## Required peer review task

Ask one real reviewer to complete this task from the homepage without coaching: “Find my individual project, explain what I contributed to the group project, then locate my code, résumé, and professional profiles.” Record their actual observation, any issue they encounter, the change made in response, and the retest result in `PORTFOLIO_RECORD.md`. Keep the record blank until this review has happened; do not infer feedback from automated checks.

## Navigation check: tree test

If the site’s navigation labels or hierarchy change, show a text-only list of the actual top-level links from the current build, without styling. Ask where the participant would first look for Diego’s résumé, his ALPFA contribution, and work experience. Record the first choice and any revised choice. Keep the list synchronized with the site; do not tell the participant where the answer lives. Skip this exercise if no navigation question remains.

## Recording observations and retesting

Keep raw notes, participant identities, and contact information in an ignored local `private/` file, not in this public document or the site. Use participant codes instead of names. `.gitignore` is not encryption. With consent, make a new local note using this structure:

```text
Session date / participant code:
Device and viewport or browser:
Consent to notes / recording (separate decisions):
Five-second recall and exact words:
Desirability words / explanation:
Task 1–4: outcome, path, clicks or taps, hesitation, help given:
Tree test: first choice / revised choice (if conducted):
Issue observed / evidence:
Change made / date:
Retest with participant or another reviewer / date / actual result:
Open questions:
```

In the public project record, publish only a consented, non-identifying summary and actual change/retest evidence. Do not imply that an issue was filed or a peer review completed unless it happened.

A/B experiments, heatmaps, and session replay are not needed to start this small study. Consider them later only for a specific question, with enough consenting visitors and appropriate privacy protections; obtain authorization before adding tools or recording sessions.
