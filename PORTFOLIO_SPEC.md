# Portfolio site — build spec for Claude Code

You are building Talha Tawsif's personal portfolio site. Read this whole file before writing code. It holds the design rules, the page structure and **all of the copy**. Do not invent facts, numbers, employers, dates or skills: if something is missing, leave a visible `[TODO: …]` placeholder and list it in your final report.

## 0. Goal

A recruiter or hiring manager lands here from LinkedIn or a CV. In 10 seconds they know who Talha is; in 30 seconds they have seen proof (live apps, real numbers); in one click they can contact him or download his CV.

The look is **ClinIQ's**: a quiet, professional Australian healthcare-software interface. It should feel like software a hospital already runs, not a startup landing page. Plain, direct, dense but calm.

## 1. Tech

- Next.js (App Router, latest stable), TypeScript strict, Tailwind CSS v4. Read `node_modules/next/dist/docs/` before relying on any Next.js API you are unsure of.
- Fully static (every page prerendered). No database, no auth, no API routes, no contact form.
- All content lives in one typed file, `src/content/site.ts`. Components never hard-code copy.
- Fonts via `next/font/google`: **Public Sans** (UI and body), **IBM Plex Mono** (code-like labels: standards, tech tags, ids).
- Icons: `lucide-react`, 16 px, 1.5 px stroke.
- `@vercel/analytics` for page views.
- Metadata: title, description, Open Graph and Twitter cards on every page; an OG image generated with `next/og` (name, one-line pitch, accent bar; no photo). `sitemap.ts` and `robots.ts`. A favicon: the initials "TT" in white on the accent colour, square, 4 px radius.
- Deployed on Vercel. Domain to be decided; use `[TODO: domain]` in metadata until then.

## 2. Design rules (copied from ClinIQ's UI contract; these win over any default)

**Principles**
1. Content first, chrome last. No hero illustrations, no decorative graphics, no marketing filler.
2. Colour carries meaning only: neutral greys everywhere; colour for links, the primary button, focus, and status chips.
3. Dense but calm: strict alignment, hairline borders between sections, generous line height.
4. Every date is written `Mon YYYY` (e.g. `Mar 2025`). Australian English throughout.

**Banned**
- Gradients, glassmorphism, glow, coloured shadows, animated backgrounds, parallax, cursor effects, typing effects, particle backgrounds.
- Purple/indigo, "sparkle" AI icons, emoji anywhere.
- Large rounded cards with drop shadows; icon-in-coloured-circle tiles; centred narrow hero with a giant heading.
- Filler copy: "Welcome!", "Passionate", "Seamlessly", "Powered by AI", exclamation marks.
- The Next.js starter look: its fonts, favicon, metadata and default page title.

**Type**
- Base 15 px body, 13 px secondary, 12 px minimum. Headings: 24 px (page name), 18 px (section), 15 px semibold (item titles). Weights 400, 500, 600 only. Sentence case everywhere.
- `font-variant-numeric: tabular-nums` on dates and numbers.

**Colour tokens** (CSS variables in `globals.css`, exposed through Tailwind `@theme`; components use tokens only, never raw hex or Tailwind palette classes)

| Token | Light | Dark | Use |
|---|---|---|---|
| `bg` | `#F6F7F9` | `#0F1418` | Page background |
| `surface` | `#FFFFFF` | `#161D23` | Panels |
| `sunken` | `#EEF1F4` | `#1D262E` | Table headers, tag chips |
| `border` | `#D5DAE1` | `#2C3742` | Hairlines |
| `border-strong` | `#AEB6C2` | `#445261` | Buttons (secondary) |
| `text` | `#17212B` | `#E6EAEE` | Primary text |
| `text-muted` | `#55616F` | `#A3AEBA` | Secondary text |
| `accent` | `#0F5EA8` | `#6FB1F0` | Links, primary button, focus ring |
| `success` / `success-bg` | `#1B6B3A` / `#E6F4EA` | `#6CC58A` / `#143021` | "Open to work" chip, "Live" chip |
| `machine` / `machine-bg` | `#0B6B6B` / `#E6F3F2` | `#6FC7C2` / `#12302F` | "Built with Claude Code" note |

Light and dark follow `prefers-color-scheme`. Every text/background pair meets WCAG 2.2 AA.

**Space and shape**: 4 px grid. Radius 4 px everywhere (6 px max). No shadows on page content; one soft shadow level for overlays only (command palette, drawers). Max content width 1040 px, page gutters 16 px (24 px from 768 px up).

**Motion (2026, but clinical)**: motion is allowed when it explains something or confirms an action, never as decoration. Durations 120–240 ms, ease-out, opacity and transform only. Everything in section 9 that moves must switch off under `prefers-reduced-motion` and still make sense static.

**Accessibility**: semantic landmarks (`header`, `main`, `nav`, `footer`), one `h1` per page, skip link, visible focus ring in `accent`, every image has alt text, every link says where it goes. External links open in the same tab unless they are demos (demos open in a new tab with `rel="noopener"` and a visible "opens in new tab" icon with an accessible label).

## 3. Layout

A sticky top bar (48 px, `surface`, bottom hairline): left "Talha Tawsif" (links home); right anchor links: Projects · Experience · Education · Skills · Contact, and a primary button "Download CV". On phones the anchor links collapse into a plain disclosure menu (a `<details>` element is fine), never a hamburger animation.

Below it, an **identity banner** styled like ClinIQ's patient banner: one full-width `surface` strip with a hairline border, containing in one row (wrapping on phones):
- Photo: 96 × 96 px, 4 px radius, `/public/talha.jpg` (`[TODO: photo]` grey box with initials until supplied).
- Name (24 px semibold) and role line.
- A row of labelled facts in a definition-list style (label in 12 px muted, value in 14 px): Location · Studying · Available · Languages.
- Chips: "Open to work" (`success`), and three link buttons: LinkedIn, GitHub, Email.

Then sections as plain panels separated by hairlines, each with an 18 px heading. Tables for experience and education (with a `sunken` header row), not cards.

## 4. Pages

- `/` — everything in section 5, in this order: Summary, Projects, Experience, Education, Skills, Certifications, Contact.
- `/projects/cliniq`, `/projects/pawlift`, `/projects/adhd-buddy` — case studies (section 6).
- `404` page in the same style: "Page not found" and a link home.

## 5. Home page copy (use exactly; edit only for length if a layout truly needs it)

### Identity banner
- Name: **Talha Tawsif**
- Role line: **Software developer · Health tech and integration**
- Location: Melbourne, Victoria
- Studying: Bachelor of Information Technology, Kent Institute Australia (graduating Jun 2027)
- Available: Part-time and internships now · Graduate roles from Jul 2027
- Languages: English, Bengali (native), Hindi, Urdu
- Links: LinkedIn `https://www.linkedin.com/in/talha-tawsif` · GitHub `https://github.com/talhatawsif` · Email `talhatawsif.dev@gmail.com`
- CV button: `/cv/Talha-Tawsif-CV.pdf` (`[TODO: CV file]`; hide the button if the file is missing at build time)

### Summary (section heading: "Summary")
> I build software that moves clinical data safely between systems. Before IT, I studied electrical and electronic engineering at BRAC University and biomedical engineering at Swinburne, and I completed Stanford Medicine's AI in Healthcare Specialisation. So I come to health software already knowing the anatomy, the imaging and the clinical data behind it.
>
> I've designed and shipped three full-stack apps. The main one, ClinIQ, converts HL7 v2 pathology messages into FHIR, codes clinical notes to SNOMED CT-AU with a clinician review step, and validates 20 synthetic patients against AU Core with 0 errors. I also evaluate AI model responses for accuracy and safety as a freelance AI data annotator.
>
> Alongside full-time study I've held a job since 2022, and I've trained new staff in every role. I'm reliable, I learn fast, and I finish what I start.

Under it, a compact "At a glance" definition list (two columns on desktop, one on phones):
- Health IT: FHIR R4, HL7 v2, SNOMED CT-AU, AU Core, SMART on FHIR, CDS Hooks
- Software: TypeScript, Python, SQL, Next.js, React, PostgreSQL, Supabase
- AI and automation: LLM integration and evaluation, n8n workflows, AI-assisted development (Claude Code)
- Cloud and testing: Google Cloud Run, Vercel, Docker, GitHub Actions, Playwright, Vitest

### Projects (section heading: "Projects")
A list (not a card grid) of three rows. Each row: a 16:9 thumbnail on the left, then title, one-line summary, mono tech tags, a "Live" chip, and links: **Case study** (internal) · **Live demo** (new tab) · **Code** (new tab).

1. **ClinIQ** — Australian health-data integration demo
   - Summary: A demo electronic health record that turns HL7 v2 pathology messages and clinical notes into validated, SNOMED CT-AU coded FHIR data, with a clinician review step.
   - Tags: FHIR R4 · HL7 v2 · SNOMED CT-AU · Next.js · Python · Cloud Run
   - Live: `https://cliniq-inky-ten.vercel.app` (note under the link, 12 px muted: "One-click demo sign-in. First load can take up to a minute while the server wakes.")
   - Code: `https://github.com/talhatawsif/cliniq`
2. **PawLift** — Rescue animal transport coordination
   - Summary: A phone-first app that matches volunteer drivers' existing trips with rescue animals that need a lift, with privacy-first Postgres design.
   - Tags: Next.js · PostgreSQL · PostGIS · Row-level security · Playwright
   - Live: `https://pawlift-three.vercel.app`
   - Code: `https://github.com/talhatawsif/pawlift`
3. **ADHD Buddy** — A task-starting app for adults with ADHD
   - Summary: Built for the hardest part of ADHD: starting. Quick capture, a 5-minute focus runway and reminders that back off instead of nagging.
   - Tags: Next.js · TypeScript · Supabase · Tailwind CSS
   - Live: `https://adhd-buddy.vercel.app`
   - Code: `https://github.com/talhatawsif/adhd-buddy`

Under the list, one line in the `machine` style: "All three were built with Claude Code as my AI coding partner. I wrote and revised the specifications, made the design decisions, and tested and deployed each one."

### Experience (section heading: "Experience")
Table columns: Dates · Role · Organisation · What I did. Newest first.

| Dates | Role | Organisation | What I did |
|---|---|---|---|
| Nov 2025 – present | AI Data Annotator & Evaluator (freelance, remote) | Outlier; Prolific and OneForma since Nov 2026 | Evaluate and rank large language model responses for accuracy, truthfulness and safety. Write original prompts and reference answers in reasoning, Python and SQL. |
| Jan 2024 – present | Facility Operations Team Member (part-time) | Crown Melbourne via ISS Facility Services (Apr 2025 – Nov 2026), then Millennium Services Group (Nov 2026 – present); Maid to Clean (Jan 2024 – May 2025) | Kept on through the Crown contract handover; part-time permanent. Train new team members on site procedures, equipment and hygiene standards. High-traffic public areas to strict safety protocols. |
| Feb 2022 – 2024 | Hospitality Team Member (part-time and casual) | KFC Crown Southbank (Apr 2022 – Nov 2023); McDonald's, Bourke & Russell St (2022); Domino's, Flinders St (2024) | Customer service, food preparation, opening and closing duties in high-volume city venues. Trained new recruits. |

### Education (section heading: "Education")

| Dates | Qualification | Institution | Notes |
|---|---|---|---|
| Mar 2025 – Jun 2027 (expected) | Bachelor of Information Technology | Kent Institute Australia, Melbourne | Software Engineering, Systems Analysis & Design, Database Fundamentals, Object-Oriented Design and Programming, Web Page Design and Development, Data Communication and Networking, Cloud and Beyond, Data Structures & Algorithms. Capstone project in Trimester 1 2027. |
| 2022 – 2024 | Bachelor of Engineering (Honours), Biomedical — studied before transferring to IT | Swinburne University of Technology | Medical Imaging Systems, Anatomy & Physiology, Engineering Materials, Circuits & Electronics, Calculus, Linear Algebra, Mathematical Methods & Statistics, Introduction to Programming. |
| 2021 – 2022 | Bachelor of Science in Electrical and Electronic Engineering (BSEEE) — first year completed | BRAC University, Dhaka | `[TODO: first-year units from transcript]` |

### Certifications (section heading: "Certifications")
- **AI in Healthcare Specialisation**, Stanford University School of Medicine (online), Aug 2026. Five courses: Introduction to Healthcare; Introduction to Clinical Data; Fundamentals of AI and Machine Learning in Healthcare; Evaluations of AI Applications in Healthcare; AI in Healthcare Capstone Project. Link: `[TODO: credential URL]`.

### Skills (section heading: "Skills")
Four labelled groups of mono chips (`sunken` background, 4 px radius):
- Health IT: FHIR R4, AU Core, AU Patient Summary, HL7 v2, SMART on FHIR, CDS Hooks, SNOMED CT-AU, LOINC, clinical NLP (medspaCy)
- Software: TypeScript, JavaScript, Python, SQL, Next.js, React, Node.js, FastAPI, PostgreSQL, PostGIS, Supabase, REST APIs, OAuth 2.0 (PKCE), Tailwind CSS
- AI and automation: LLM integration (OpenRouter), prompt-injection resistance, LLM evaluation, n8n workflows, AI-assisted development (Claude Code), data annotation
- Cloud, testing and practice: Google Cloud Run, Vercel, Docker, GitHub Actions, Playwright, Vitest, accessibility testing (axe), row-level security, decision records, technical documentation
- Domain: anatomy and physiology, medical imaging, circuit analysis, engineering mathematics

### Contact (section heading: "Contact")
> I'm open to part-time roles and internships now, and graduate roles from July 2027, in health tech, integration, software engineering or AI and automation, in Melbourne. The quickest way to reach me is email or LinkedIn.

Then the same three link buttons as the banner, plus Download CV.

Footer: "© 2026 Talha Tawsif · Melbourne" and "Built with Next.js, deployed on Vercel."

## 6. Case study pages

Same top bar. A compact header strip: project name (h1), one-line summary, chips (Live, stack tags), and buttons Live demo · Code. Then these sections, each a panel with an 18 px heading:

1. **The problem** — 2–3 sentences.
2. **Demo** — `[TODO: demo video]` placeholder: a 16:9 `sunken` box with "Demo video coming soon" until a file or YouTube URL is set in `site.ts` (`videoUrl`). When set, use a `<video controls preload="metadata">` with a poster, or a privacy-enhanced YouTube embed if the URL is YouTube.
3. **What it does** — bullet list.
4. **How it's built** — bullet list and a mono stack line.
5. **Hard problems I solved** — 2–3 short items, each "Problem → what I did → why it matters".
6. **Results** — a small table of verified numbers (Measure · Result · Note).
7. **Screenshots** — `[TODO: screenshots]` grid placeholders (2 columns desktop, 1 phone) with captions; real images go in `/public/projects/<slug>/`.
8. **How I built it** — the `machine`-style note about Claude Code, specific to the project.
9. **Limits and what's next** — honest bullets.
10. Footer links: previous / next project, back to all projects.

### ClinIQ
- Problem: In Australian health services, much clinical meaning sits in HL7 v2 messages and free-text notes, while registries, referrals and decision support need coded, structured FHIR data. ClinIQ is a prototype of a safe way to bridge that gap, using synthetic patients only.
- What it does: HL7 v2 ORU^R01 pathology to FHIR with acknowledgements, where resends and corrections update the same record; clinical notes to SNOMED CT-AU coded findings kept "unconfirmed" until a clinician confirms, changes or rejects them, with FHIR Provenance; a patient chart with pathology and vital trends and a "View FHIR JSON" drawer; CDS Hooks cards (CKD-EPI 2021 eGFR, BMI, diabetes and hypertension care gaps); AU Patient Summary export; SMART on FHIR launch (read-only); a guarded LLM chart assistant that answers only from the record, cites every sentence and refuses advice; staff sign-in with MFA, an audit log and daily quotas; n8n workflows for a pathology inbox and a weekly care-gap sweep.
- How it's built: Next.js and TypeScript on Vercel; a private HAPI FHIR R4 server on Google Cloud Run (Sydney) reached only by the app's service account; Supabase Postgres and Auth; a Python FastAPI and medspaCy NLP service on Cloud Run; n8n; Vitest, Playwright with axe, GitHub Actions CI. Stack line: `Next.js · TypeScript · HAPI FHIR · Cloud Run · Supabase · Python · medspaCy · n8n · Playwright`.
- Hard problems:
  1. Safe HL7 v2 to FHIR → resource ids derived from the order, sender and patient so repeats are idempotent; review fixed wrong-patient overwrites, added a date-of-birth cross-check and duplicate-OBX handling, each with a test → duplicated or misattributed lab results are patient-safety faults.
  2. Making machine output safe → only affirmed findings are coded; negated, family, hypothetical, uncertain and historical mentions are shown with a reason and never written; writes are unconfirmed with Provenance; review uses `If-Match` versioning → no machine guess reaches the record without a person.
  3. A guarded assistant on free models → free model ids enforced in code with a cost breaker; scripted answers first, then one cited model call and a sentence-level output filter; 13 free models probed with a repeatable script and 5 passed the grounded-answer test → reliable answers without paying for an API.
- Results table:
  - AU Core 2.0.0 validation · 0 errors · 20 synthetic patients
  - AU Patient Summary validation · 0 errors · 20 of 20 documents
  - Note extraction · 93.2% precision, 57.5% recall · 12 notes; labels AI-written, not clinician-reviewed
  - Assistant evaluation · 0 uncited sentences shown, 3 of 3 prompt injections resisted, 6 of 10 answerable questions answered · one run of 20 questions
  - Automated tests · `[TODO: real counts from the test runner]`
- How I built it: "I chose the problem and the Australian standards, wrote and revised the specification and its acceptance tests, made and recorded each design decision, set up the cloud accounts and deployments, and decided what not to claim. I built it with Claude Code as my AI coding partner."
- Limits: synthetic data only; not a medical device and not clinician-reviewed; one HL7 message type over HTTP; SMART and CDS Hooks tested against public sandboxes; extraction recall 57.5%; free hosting means a slow first load.

### PawLift
- Problem: Rescue groups, pounds, shelters and vets often need to move an animal but can't find a driver. Many volunteers are already driving somewhere nearby. PawLift connects the two.
- What it does: route matching that ranks lifts by estimated detour along the volunteer's own trip; the full lift lifecycle (claim, organisation confirms, pickup, delivery, completion, plus offers, reassign, cancel and incident reports); exact addresses, contacts and medical notes shown only to the confirmed driver during the trip and hidden after delivery; organisation and volunteer verification with recorded checks; foster carers who confirm arrival; admin oversight where viewing private details needs a stated reason and is logged; navigation handed to Google Maps, Apple Maps or Waze.
- How it's built: Next.js (App Router, Server Actions) and TypeScript; Supabase Postgres with PostGIS, row-level security, Storage and pg_cron; MapLibre with OpenStreetMap tiles; openrouteservice behind a server-side adapter; Vitest, Playwright and axe. Stack line: `Next.js · TypeScript · Supabase · PostgreSQL · PostGIS · MapLibre · Playwright`.
- Hard problems:
  1. Two drivers claiming the same animal → every state change is one Postgres function that locks rows, re-checks permissions and writes the audit log in the same transaction; a later review found a possible deadlock and fixed it by using one lock order everywhere → an animal never ends up with two drivers, or none.
  2. Keeping private details private → private data in separate tables readable only through access functions, revoked automatically on withdraw, reassign, cancel or delivery → the same least-privilege and access-logging pattern health systems use for patient data.
  3. Honest route estimates on a free API quota → at most 6 routing calls per search with caching; without a key every estimate is labelled DEMO and straight-line distance is never passed off as travel time.
- Results table:
  - Database security tests (RLS and permissions) · 223 of 223 passed · Nov 2026 gate
  - Race-condition test · 1 of 5 simultaneous claims succeeds · as designed
  - Accessibility · no serious or critical WCAG 2.1 A/AA issues · 41 page visits at 1280 px and 375 px
  - Scale · 37 pages, 22 tables, 44 recorded design decisions
- How I built it: "I owned the product, including removing multi-driver relays after building them, for animal-welfare reasons. I built it with Claude Code through staged checkpoints with written decision records and test gates."
- Limits: demo on fictional data, not yet launched with real organisations; not yet tested on real phones or with screen readers; notifications are in-app only.

### ADHD Buddy
- Problem: For many adults with ADHD the hard part is starting a task, not finishing it. Most task apps treat the problem as discipline. ADHD Buddy is built around getting started.
- What it does: quick capture (save a thought now, sort later into Urgent, Someday or Needs breakdown); task breakdown into small steps the user writes; focus sessions with an optional 5-minute runway before a 5–45 minute timer, logging planned vs actual time; a focus streak that rewards consistency, not session length, so it never rewards hyperfocus; reminders that back off (10 min → 30 min → 1 hr → next day); a task timeline from plan to first focus to finish, with a history page.
- How it's built: Next.js (App Router, server components), TypeScript, Tailwind CSS, Supabase Auth and Postgres with row-level security, Vercel. Stack line: `Next.js · TypeScript · Tailwind CSS · Supabase · Vercel`.
- Hard problems:
  1. Each user's data private at the database level → Postgres row-level security tied to the signed-in user, because the browser talks to the database directly.
  2. Recording milestones correctly → first-focus and finish times only write if still empty, so a later session can't overwrite them; out-of-order timestamps handled.
  3. Getting it live → server-side session refresh and redirects, Vercel environment variables and deployment issues, all written up in a public debug log.
- Results table:
  - Releases · 2 (v0.1.0, v0.2.0) · changelog in the repo
  - Scale · 7 pages, 4 database tables
- How I built it: "I set the product direction and the reasoning behind every feature, documented in the README, and built it with Claude Code."
- Limits: reminders show only while the dashboard is open; the timer runs in the browser; no automated tests yet.

### Thumbnails and logos (no image uploads needed)
Project logos are ready in `public/brand/` (`cliniq-mark.svg`, `pawlift-mark.svg`, `adhd-buddy-mark.svg`) and the favicon in `public/brand/tt-favicon.svg`. Build each project thumbnail as a React component, not an image: a 16:9 panel in the project's own colour (ClinIQ `#0F5EA8`, PawLift `#2F7D55`, ADHD Buddy `#18181B`) with its mark centred at 40% of the panel height. Once real screenshots exist (`thumbnail` set in `site.ts`), show the screenshot instead. Talha's photo is `public/talha.jpg`. **Institution logos (Talha asked for these):** show a small logo (24 px high, monochrome-friendly, on a white tile with a hairline border) beside Stanford University School of Medicine, Kent Institute Australia, Swinburne University of Technology and BRAC University in the Education and Certifications tables and in the identity banner's "Studying" fact. Get each from the institution's own website or its Wikimedia Commons page, save it to `public/logos/` (`stanford.svg`, `kent.svg`, `swinburne.svg`, `bracu.svg`, or `.png`), record the source URL in `public/logos/SOURCES.md`, and use it only to identify where he studied (no recolouring, stretching or cropping). Never redraw a logo by hand. If a file cannot be fetched, show a neutral initials tile (e.g. "SU") instead and list it in the final report. No employer or technology logos: names in text only.

## 7. Content model (`src/content/site.ts`)

Typed objects: `profile`, `summary`, `atAGlance`, `projects[]` (slug, name, tagline, summary, tags, liveUrl, liveNote, codeUrl, thumbnail, videoUrl, caseStudy {problem, features[], built[], stackLine, hardProblems[], results[], screenshots[], howIBuilt, limits[]}), `experience[]`, `education[]`, `certifications[]`, `skills[]`, `contact`. Any field holding `[TODO…]` renders as a visible dashed-border placeholder, so nothing silently ships empty.

## 8. Quality bar before you call it done

- `npm run lint`, `tsc --noEmit` and `npm run build` pass.
- A Playwright smoke test visits `/` and each case study at 1280 px and 390 px, checks the h1, and runs axe (no serious or critical issues).
- No horizontal scrolling at 390 px. Tables become stacked rows on phones (each cell with its label).
- Lighthouse (or equivalent) performance and accessibility both 95+ on `/`.
- `grep` finds no raw hex values or Tailwind palette colour classes in `src/components`.
- Final report: what you built, every `[TODO]` still open, and the exact commands to run and deploy.

## 9. Modern features (the "built in 2026" layer)

The theme stays quiet and clinical. The sophistication shows in how the site works, not in decoration. A developer looking at it should think "this person knows the current platform"; a recruiter should simply find it fast and polished. Build these after sections 1–8 pass.

1. **Command palette (⌘K / Ctrl+K).** A `/`-or-⌘K searchable dialog listing every section, project, case study and link (LinkedIn, GitHub, Email, Download CV), plus "Copy email" and "Toggle theme". Keyboard first: arrow keys, Enter, Escape, focus trapped, `role="dialog"` with a label. A small "⌘K" hint button in the top bar so people discover it. No library heavier than `cmdk`.
2. **Live service status.** Each project row shows a status chip fed by a route handler (`/api/status`, revalidated every 5 minutes on Vercel) that does a server-side `HEAD`/`GET` with a 4 s timeout to each live URL and returns `up`, `slow` or `waking` plus the response time. Render as "Live · 240 ms" (`success`), "Waking up" (`warning` tokens: `#8A5A00` / `#FFF4D6`, dark `#E5B454` / `#3A2E10`) or "Unreachable" (muted, never red). For ClinIQ, use its own `/api/health` endpoint if it answers without auth; otherwise the page URL. The site must still build and render if the check fails (chip shows "Status unknown"). Like a hospital system's service monitor.
3. **"View as FHIR" drawer.** Next to the name in the identity banner, a small mono button "View as FHIR". It opens a right-side drawer (like ClinIQ's "View FHIR JSON") showing Talha's profile as a valid FHIR R4 `Practitioner` resource: name, qualifications (each degree, the Stanford Specialisation), communication languages, address city only, telecom (email, LinkedIn, GitHub). Syntax-highlighted JSON in IBM Plex Mono with a Copy button. Build the resource from `site.ts` so it never drifts. Validate its shape against the FHIR R4 Practitioner structure (keep to standard elements; no invented extensions). This is the signature detail: memorable, on-theme, and it proves he knows FHIR.
4. **Interactive HL7 to FHIR explainer** on the ClinIQ case study. A two-pane panel: left, a short sample ORU^R01 message (synthetic, hard-coded, clearly labelled "synthetic sample"); right, the FHIR Observation it becomes. Hovering or focusing a segment (MSH, PID, OBR, OBX) highlights the matching FHIR fields on the right with a 160 ms fade, plus a one-line caption explaining the mapping. Fully keyboard accessible (segments are buttons). Static data only: no parsing service, no network.
5. **View Transitions** between the home page and case studies: the project thumbnail and title morph into the case study header (`view-transition-name` per project). Graceful fallback where unsupported.
6. **Section scroll-spy.** The top bar highlights the section in view (IntersectionObserver), and the URL hash updates without jumping.
7. **Subtle reveal.** Section panels fade and rise 8 px into place once, on first scroll into view, using CSS scroll-driven animations (`animation-timeline: view()`) with a no-JS, no-motion fallback. Never on the identity banner (it must be visible instantly).
8. **Theme toggle** (light, dark, system) in the top bar and the command palette, remembered in `localStorage` (wrapped in try/catch), with no flash of the wrong theme on load (inline script in `<head>`).
9. **Print stylesheet.** Printing the home page (or saving as PDF) produces a clean one-to-two-page CV: no top bar, no thumbnails, no buttons, links printed as URLs, black on white.
10. **Structured data.** JSON-LD `Person` on the home page (name, jobTitle, alumniOf, knowsAbout, sameAs LinkedIn and GitHub) and `SoftwareSourceCode`/`CreativeWork` on each case study, so search engines and AI search tools read the profile correctly.
11. **Dynamic OG images** per page with `next/og`: home uses name and pitch; each case study uses its project name, tagline and stack line, in the site's tokens.
12. **Performance as a feature.** Static pages, images through `next/image` (AVIF/WebP, explicit sizes), fonts self-hosted, zero layout shift, no client JS on pages that don't need it (the palette, drawer, explainer and status are small client islands). Target Lighthouse 100 for performance, accessibility, best practices and SEO, and show it: a small footer line "Lighthouse 100 · 0 KB layout shift" only once measured, otherwise leave it out.

13. **"Ask about my work" assistant (approved by Talha).** A small panel on the home page (and an "Ask" entry in the command palette) where a visitor types a question about Talha and gets a short answer. Same guardrails as ClinIQ's chart assistant:
   - **Grounded only in `site.ts`.** Build a context from the site content; the system prompt says to answer only from it, in at most 4 sentences, in Australian English, and to say "That isn't on my site yet. Please email me." for anything else.
   - **Every sentence cited.** Each sentence ends with a citation to a section id (e.g. `[projects.cliniq]`); a server-side filter drops any sentence without a valid citation, and the UI turns citations into links that scroll to that section.
   - **Refuses** advice, opinions, anything about other people, salary, visa or personal details beyond the site, and instructions hidden in the question (prompt injection). Include 6 or more unit tests for these refusals and for the citation filter.
   - **Free models only, enforced in code.** Call OpenRouter's chat completions API from a server route handler only. The key is read from `process.env.OPENROUTER_API_KEY` and is never sent to the browser, logged or committed. Allow only model ids ending in `:free`; throw before any request otherwise. Talha's OpenRouter account has a usage limit, so keep testing light: a small script (`npm run probe:models`) reads OpenRouter's public models list (this call is free), keeps `:free` models, and sends **at most 2 models one short grounded test question each** (2 requests in total, never more), then writes the ones that pass, best first, to `src/content/models.json`. Run it once, only when Talha asks. At runtime use at most 2 models: try the first and fall back to the second on error or timeout (8 s). Unit tests mock OpenRouter and never call it.
   - **Cost breaker.** If any response reports a non-zero cost or the model id lacks `:free`, disable the assistant for the rest of the day and show "The assistant is resting. Please email me instead."
   - **Abuse limits.** 400-character question limit; per-IP limit of 5 questions a minute and 30 a day (in-memory is acceptable for a portfolio; note it is per instance); `max_tokens` 300; no conversation history beyond the current question.
   - **Honest label** under the box in the `machine` style: "Answers come from this site only, using a free AI model. It can make mistakes."
   - If `OPENROUTER_API_KEY` is missing, the panel shows "Ask me directly" with the email link instead, and the build still passes.

## 10. How to work

0. This folder is not empty: it already holds this spec, `CLAUDE.md` and `public/`. `create-next-app` refuses non-empty folders, so scaffold into a temporary folder and move the files in, keeping what is here.

1. Read this file. Reply with a short build plan and any question that truly blocks you. Then start.
2. Build in this order: tokens and fonts → layout and top bar → identity banner → home sections → case study template → three case studies → metadata, OG image, sitemap → tests → then section 9, one feature per commit, re-running the tests after each.
3. Commit after each step with a clear message.
4. Never commit secrets. This site needs none.
