# talha-website — build plan

How to use this file: work through the phases in order, **one phase per Claude Code session**. Each phase has a prompt to paste, the tasks, the files it touches, and checks that must pass before moving on. `PORTFOLIO_SPEC.md` holds the design rules and every word of copy; this file holds the order. If they disagree, the spec wins and the disagreement is noted in the final report.

Commands used throughout: `npm run lint` · `npm run typecheck` · `npm run build` · `npm run test` (unit) · `npm run e2e` (Playwright). After each phase: commit with a clear message, then run the checks.

---

## Phase 0 — Set up (about 15 min)

**Paste into Claude Code:**
> Read CLAUDE.md, PORTFOLIO_SPEC.md and BUILD_PLAN.md. Do Phase 0 only, then stop and report.

**Tasks**
1. `git init` (the folder already has `.gitignore` that blocks `.env*`; keep it).
2. Scaffold Next.js (latest stable, App Router, TypeScript, Tailwind v4, ESLint, `src/` directory) in a temporary folder, then move its files in. Keep the existing `PORTFOLIO_SPEC.md`, `CLAUDE.md`, `BUILD_PLAN.md`, `.gitignore`, `.env.example` and `public/`.
3. Remove the starter look: default page, `next.svg`, `vercel.svg`, starter fonts, default metadata.
4. Add scripts: `typecheck` (`tsc --noEmit`), `test` (Vitest), `e2e` (Playwright).
5. Install: `lucide-react`, `@vercel/analytics`, `cmdk`; dev: `vitest`, `@playwright/test`, `@axe-core/playwright`.
6. Strict TypeScript; path alias `@/` → `src/`.

**Checks:** `npm run build` passes · `git status` shows no `.env.local` · first commit made.

---

## Phase 1 — Design tokens and fonts (about 20 min)

**Paste:** `Do Phase 1 of BUILD_PLAN.md, then stop and report.`

**Tasks**
1. `src/app/globals.css`: every colour token from spec section 2 (light and dark via `prefers-color-scheme`, plus a `[data-theme]` override for the later toggle), exposed through Tailwind `@theme`. Include the warning tokens from spec section 9.2.
2. Fonts with `next/font/google`: Public Sans (body), IBM Plex Mono (mono). Base 15 px, tabular numbers utility.
3. Global focus ring in `accent`, skip link, reduced-motion media query that disables all animation.
4. A tiny `/styleguide` page (excluded from sitemap, `noindex`) showing every token, type size and chip, for checking contrast.

**Files:** `globals.css`, `app/layout.tsx`, `app/styleguide/page.tsx`.

**Checks:** build passes · every token pair on `/styleguide` passes axe colour contrast · `grep` finds no raw hex outside `globals.css`.

---

## Phase 2 — Content file (about 30 min)

**Paste:** `Do Phase 2 of BUILD_PLAN.md, then stop and report.`

**Tasks**
1. `src/content/site.ts` with typed objects exactly as spec section 7: `profile`, `summary`, `atAGlance`, `projects[]` (with full `caseStudy` for all three), `experience[]`, `education[]`, `certifications[]`, `skills[]`, `contact`.
2. Copy every word from spec sections 5 and 6. Do not paraphrase. Mark every missing item `[TODO: …]`.
3. A `Todo` component that renders any `[TODO…]` value as a dashed-border placeholder.
4. Unit test: `site.ts` has three projects with slugs `cliniq`, `pawlift`, `adhd-buddy`, every URL is `https://`, and a list of open TODOs prints in the test output.

**Checks:** typecheck passes · test passes and prints the open TODOs.

---

## Phase 3 — Layout, top bar, identity banner (about 45 min)

**Paste:** `Do Phase 3 of BUILD_PLAN.md, then stop and report.`

**Tasks**
1. Root layout: skip link, sticky 48 px top bar (name left; anchors Projects · Experience · Education · Skills · Contact; Download CV button right, hidden if the PDF is missing), footer from spec.
2. Phone menu: a `<details>` disclosure, no animation.
3. Identity banner (spec section 3): photo `public/talha.jpg` at 96 × 96, 4 px radius, alt "Talha Tawsif"; name, role line; label/value facts (Location, Studying, Available, Languages); "Open to work" chip; LinkedIn, GitHub and Email buttons.
4. Institution logo tiles (spec "Institution logos"): fetch the four official files into `public/logos/` with sources in `public/logos/SOURCES.md`; initials tile fallback for any that fail. Kent tile appears beside "Studying".
5. Favicon from `public/brand/tt-favicon.svg` (plus generated PNG sizes for Apple touch icon).

**Checks:** build passes · no horizontal scroll at 390 px · banner visible without scrolling at 1280 × 800 · axe clean on `/`.

---

## Phase 4 — Home page sections (about 60 min)

**Paste:** `Do Phase 4 of BUILD_PLAN.md, then stop and report.`

**Tasks** (each section reads only from `site.ts`)
1. Summary with the "At a glance" definition list.
2. Projects list: thumbnail component (project colour panel with its mark from `public/brand/`), title, summary, mono tags, status chip placeholder ("Status unknown" until Phase 8), links Case study · Live demo (new tab, labelled icon) · Code. ClinIQ's slow-first-load note.
3. The `machine`-style "Built with Claude Code" line under the list.
4. Experience and Education as real tables with `sunken` header rows; on phones each row stacks with cell labels. Institution logo tiles in Education.
5. Certifications (Stanford tile), Skills chip groups, Contact section with buttons.

**Checks:** build · lint · axe clean at 1280 and 390 px · tables readable at 390 px · every link has a clear accessible name.

---

## Phase 5 — Case study pages (about 60 min)

**Paste:** `Do Phase 5 of BUILD_PLAN.md, then stop and report.`

**Tasks**
1. `src/app/projects/[slug]/page.tsx` with `generateStaticParams` for the three slugs; 404 for anything else.
2. Header strip, then the ten sections from spec section 6 in order: Problem, Demo (video placeholder until `videoUrl` is set), What it does, How it's built, Hard problems, Results table, Screenshots (placeholders), How I built it (`machine` style), Limits and what's next, previous/next links.
3. Results tables render the exact rows from the spec, including the TODO for ClinIQ's test counts.
4. Custom 404 page in the same style.

**Checks:** all three pages prerender in `npm run build` · axe clean · each page has one `h1`.

---

## Phase 6 — Metadata, share images, search (about 30 min)

**Paste:** `Do Phase 6 of BUILD_PLAN.md, then stop and report.`

**Tasks**
1. Per-page `metadata`: title, description, canonical (`[TODO: domain]` until set, fall back to the Vercel URL via env `NEXT_PUBLIC_SITE_URL`).
2. `opengraph-image.tsx` for home and each case study with `next/og` (spec section 9.11).
3. `sitemap.ts`, `robots.ts` (`/styleguide` disallowed).
4. JSON-LD: `Person` on home, `CreativeWork`/`SoftwareSourceCode` on case studies (spec section 9.10).
5. `@vercel/analytics` in the root layout.

**Checks:** build · open each OG image route and check it renders · JSON-LD passes a schema check (paste into validator.schema.org manually; note in report).

---

## Phase 7 — Tests and the quality bar (about 30 min)

**Paste:** `Do Phase 7 of BUILD_PLAN.md, then stop and report.`

**Tasks**
1. Playwright smoke spec: `/` and the three case studies at 1280 × 800 and 390 × 844; check `h1`, no horizontal scroll, axe (no serious or critical), and that every internal link resolves.
2. Grep check script (`npm run check:tokens`) that fails on raw hex or Tailwind palette colour classes in `src/components` and `src/app` (except `globals.css`).
3. Add `npm run ci` = lint + typecheck + test + check:tokens + build.

**Checks:** `npm run ci` and `npm run e2e` pass. **This is the first deployable version.**

---

## Phase 8 — Deploy the plain site (Talha, about 10 min)

1. Push to a new GitHub repo `talha-website` (public).
2. Vercel → Add New Project → import it. Set `NEXT_PUBLIC_SITE_URL` to the Vercel URL. Do **not** add the OpenRouter key yet.
3. Open the live site on your phone and laptop. Send Claude (chat) the link for a recruiter-eye review.

---

## Phase 9 — Modern features, one per session (about 3–4 hours total)

**Paste for each:** `Do Phase 9, step <N> of BUILD_PLAN.md only, then run npm run ci and npm run e2e and report.`

Order (each its own commit, spec section 9 has the details):
1. **Theme toggle** (light / dark / system, no flash on load).
2. **Scroll-spy** top bar.
3. **Command palette** (⌘K / Ctrl+K, `/`), with a ⌘K hint button.
4. **Live status chips**: `/api/status` route, revalidate 300 s, 4 s timeout, ClinIQ "Waking up" handling; site still builds if checks fail.
5. **"View as FHIR" drawer**: Practitioner resource built from `site.ts`; unit test that it has `resourceType: "Practitioner"`, name, qualifications and communication.
6. **HL7 → FHIR explainer** on the ClinIQ case study (static synthetic sample, keyboard accessible).
7. **View transitions** (thumbnail and title morph into the case study header).
8. **Subtle reveal** with CSS scroll-driven animations (never on the identity banner).
9. **Print-as-CV stylesheet**; check with the browser's print preview.
10. **Performance pass**: `next/image` everywhere, check layout shift, aim for Lighthouse 100; report the four scores.

---

## Phase 10 — "Ask about my work" assistant (about 90 min)

**Before starting (Talha):** delete the OpenRouter key that was pasted into chat, create a new one, and put it in `.env.local` as `OPENROUTER_API_KEY=...`. Never paste it into Claude Code's chat; it reads the file.

**Paste:** `Do Phase 10 of BUILD_PLAN.md, then stop and report. Do not run probe:models until I say so.`

**Tasks** (spec section 9.13 has every rule)
1. `src/lib/assistant/`: context builder from `site.ts` with section ids; prompt; `:free`-only guard that throws before any request; citation filter; refusal pre-filter; cost breaker; per-IP limits; 8 s timeout and one fallback model.
2. `src/app/api/ask/route.ts` (server only; key from env; never logged).
3. Panel on the home page plus an "Ask" entry in the command palette; citations link to sections; honest label; "Ask me directly" fallback when the key is missing.
4. Unit tests with OpenRouter **mocked**: non-free model id throws; uncited sentences dropped; at least 6 refusal cases (salary, visa, personal details, opinions on others, advice, prompt injection); cost breaker trips on non-zero cost.
5. `scripts/probe-models.ts` (`npm run probe:models`): at most 2 free models, one short question each, 2 requests total; writes `src/content/models.json`.

**Then (Talha):** say "run probe:models once" in Claude Code. Check `models.json` has 1–2 models. Ask the assistant 5 questions yourself, including one it should refuse.

**Checks:** `npm run ci` passes with no network calls in tests · key absent from the client bundle (`grep -r "sk-or" .next/static` finds nothing).

---

## Phase 11 — Launch (Talha, about 20 min)

1. Vercel → Settings → Environment Variables: add `OPENROUTER_API_KEY` (Production only). Redeploy.
2. Optional: buy a domain, add it in Vercel, then set `NEXT_PUBLIC_SITE_URL` to it and redeploy.
3. Add the site to LinkedIn: Contact info → Website (type Portfolio), and as the first Featured item.
4. Send Claude (chat) the live link for a final recruiter-eye review.

---

## Later, when ready (no rush)

- Demo videos: set `videoUrl` per project in `site.ts`.
- Screenshots: put PNGs in `public/projects/<slug>/` and list them in `site.ts`.
- CV PDF: `public/cv/Talha-Tawsif-CV.pdf` (no street address).
- ClinIQ test counts: run its test suite and replace the TODO.
- BRAC units: add from the transcript.
