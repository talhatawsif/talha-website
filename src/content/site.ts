export type Result = { measure: string; result: string; note: string };
export type HardProblem = { title: string; did: string; why?: string };
export type Screenshot = { caption?: string; src?: string; alt?: string };

export type CaseStudy = {
  problem: string;
  features: string[];
  built: string[];
  stackLine: string;
  hardProblems: HardProblem[];
  results: Result[];
  screenshots: Screenshot[];
  howIBuilt: string;
  limits: string[];
};

export type Project = {
  slug: "cliniq" | "pawlift" | "adhd-buddy";
  name: string;
  tagline: string;
  /** Completes "<name> is …" for the assistant's scripted answers. */
  kind: string;
  summary: string;
  tags: string[];
  color: string;
  mark: string;
  liveUrl: string;
  liveNote?: string;
  codeUrl: string;
  thumbnail?: string;
  videoUrl?: string;
  cvDates: string;
  cvBullets: string[];
  caseStudy: CaseStudy;
};

export type InstitutionId = "kent" | "swinburne" | "bracu" | "stanford";

export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "[TODO: domain]";

export const institutions: Record<InstitutionId, { name: string; short: string; initials: string; logo?: string; ratio?: number }> = {
  kent: { name: "Kent Institute Australia", short: "Kent Institute Australia", initials: "KI", logo: "/logos/kent.png", ratio: 300 / 157 },
  swinburne: { name: "Swinburne University of Technology", short: "Swinburne University of Technology", initials: "SU", logo: "/logos/swinburne.svg", ratio: 500 / 252.84 },
  bracu: { name: "BRAC University", short: "BRAC University", initials: "BU", logo: "/logos/bracu.jpg", ratio: 229 / 136 },
  stanford: { name: "Stanford University School of Medicine", short: "Stanford Medicine", initials: "SM", logo: "/logos/stanford.jpg", ratio: 2400 / 778 },
};

export const languageCodes = [["en", "English"], ["bn", "Bengali"], ["hi", "Hindi"], ["ur", "Urdu"]] as const;

export const profile = {
  name: "Talha Tawsif",
  role: "Software developer · Health tech and integration",
  location: "Melbourne, Victoria, Australia",
  studying: "Bachelor of Information Technology, Kent Institute Australia (graduating Jun 2027)",
  studyingInstitution: "kent" as InstitutionId,
  available: "Part-time and internships now · Graduate roles from Jul 2027",
  languages: "English, Bengali (native), Hindi, Urdu",
  linkedin: "https://www.linkedin.com/in/talha-tawsif",
  github: "https://github.com/talhatawsif",
  email: "talhatawsif.dev@gmail.com",
  /** International format, used for tel: links. Shown with spaces; kept off the CV by design. */
  phone: "+61499390833",
  cvUrl: "/cv.pdf",
  photo: "/talha.jpg",
};

export const summary = [
  "I build software that moves clinical data safely between systems. Before IT, I studied biomedical engineering at Swinburne University of Technology and electrical and electronic engineering at BRAC University, and I completed Stanford Medicine's AI in Healthcare Specialisation. So I come to health software already knowing the anatomy, the imaging and the clinical data behind it.",
  "I've designed and shipped three full-stack apps. The main one, ClinIQ, converts HL7 v2 pathology messages into FHIR, codes clinical notes to SNOMED CT-AU with a clinician review step, and validates 20 synthetic patients against AU Core with 0 errors. PawLift matches volunteer drivers' existing trips with rescue animals that need a lift, keeps private addresses and medical notes visible only to the confirmed driver, and passes 223 of 223 database security tests. I also evaluate AI model responses for accuracy and safety as a freelance AI data annotator.",
  "Alongside full-time study I've held a job since 2022, and I've trained new staff in every role. I'm reliable, I learn fast, and I finish what I start.",
];

export const atAGlance = [
  { label: "Health IT", value: "FHIR R4, HL7 v2, SNOMED CT-AU, AU Core, SMART on FHIR, CDS Hooks" },
  { label: "Software", value: "TypeScript, Python, SQL, Next.js, React, PostgreSQL, Supabase" },
  { label: "AI and automation", value: "LLM integration and evaluation, n8n workflows, AI-assisted development (Claude Code)" },
  { label: "Cloud and testing", value: "Google Cloud Run, Vercel, Docker, GitHub Actions, Playwright, Vitest" },
];

/** Only what the CV needs that the site does not already hold. */
export const cv = {
  summary:
    "Final-year IT student who builds software that moves clinical data safely between systems. Before IT I studied biomedical engineering (Swinburne University of Technology) and electrical and electronic engineering (BRAC University), and I completed Stanford Medicine's AI in Healthcare Specialisation. I have designed and shipped three full-stack apps, including an HL7 v2 to FHIR integration demo validated against AU Core with 0 errors. I evaluate AI model responses for accuracy and safety as a freelance annotator, and I have held a job alongside full-time study since 2022, training new staff in every role.",
  availability: "Available for part-time and internship roles now, and graduate roles from July 2027.",
  languages: "English (full professional), Bengali (native), Hindi and Urdu (spoken)",
};

export const claudeNote =
  "All three were built with Claude Code as my AI coding partner. I wrote and revised the specifications, made the design decisions, and tested and deployed each one.";

export const projects: Project[] = [
  {
    slug: "cliniq",
    name: "ClinIQ",
    tagline: "Australian health-data integration demo",
    kind: "an Australian health-data integration demo",
    summary:
      "A demo electronic health record that turns HL7 v2 pathology messages and clinical notes into validated, SNOMED CT-AU coded FHIR data, with a clinician review step.",
    tags: ["FHIR R4", "HL7 v2", "SNOMED CT-AU", "Next.js", "Python", "Cloud Run"],
    color: "#0F5EA8",
    mark: "/brand/cliniq-mark.svg",
    liveUrl: "https://cliniq-inky-ten.vercel.app",
    liveNote: "One-click demo sign-in. First load can take up to a minute while the server wakes.",
    codeUrl: "https://github.com/talhatawsif/cliniq",
    cvDates: "Aug 2026 – present",
    cvBullets: [
      "Converts HL7 v2 ORU^R01 pathology messages to FHIR R4 with acknowledgements; resends and corrections update the same record instead of duplicating it.",
      "Codes clinical notes to SNOMED CT-AU, kept unconfirmed until a clinician approves them, with FHIR Provenance; 93.2% precision, 57.5% recall on 12 notes (AI-written labels).",
      "20 synthetic patients validate against AU Core 2.0.0 and AU Patient Summary with 0 errors; CDS Hooks decision support and a SMART on FHIR launch.",
      "Guarded LLM chart assistant on free OpenRouter models: cited answers only; 3 of 3 prompt injections resisted in a 20-question evaluation.",
      "Designed the spec, standards and safety limits, and built, tested and deployed it with Claude Code; GitHub Actions CI, Vitest and Playwright with accessibility checks.",
    ],
    caseStudy: {
      problem:
        "In Australian health services, much clinical meaning sits in HL7 v2 messages and free-text notes, while registries, referrals and decision support need coded, structured FHIR data. ClinIQ is a prototype of a safe way to bridge that gap, using synthetic patients only.",
      features: [
        "HL7 v2 ORU^R01 pathology to FHIR with acknowledgements, where resends and corrections update the same record",
        'Clinical notes to SNOMED CT-AU coded findings kept "unconfirmed" until a clinician confirms, changes or rejects them, with FHIR Provenance',
        'A patient chart with pathology and vital trends and a "View FHIR JSON" drawer',
        "CDS Hooks cards (CKD-EPI 2021 eGFR, BMI, diabetes and hypertension care gaps)",
        "AU Patient Summary export",
        "SMART on FHIR launch (read-only)",
        "A guarded LLM chart assistant that answers only from the record, cites every sentence and refuses advice",
        "Staff sign-in with MFA, an audit log and daily quotas",
        "n8n workflows for a pathology inbox and a weekly care-gap sweep",
      ],
      built: [
        "Next.js and TypeScript on Vercel",
        "A private HAPI FHIR R4 server on Google Cloud Run (Sydney) reached only by the app's service account",
        "Supabase Postgres and Auth",
        "A Python FastAPI and medspaCy NLP service on Cloud Run",
        "n8n",
        "Vitest, Playwright with axe, GitHub Actions CI",
      ],
      stackLine: "Next.js · TypeScript · HAPI FHIR · Cloud Run · Supabase · Python · medspaCy · n8n · Playwright",
      hardProblems: [
        {
          title: "Safe HL7 v2 to FHIR",
          did: "Resource ids derived from the order, sender and patient so repeats are idempotent; review fixed wrong-patient overwrites, added a date-of-birth cross-check and duplicate-OBX handling, each with a test.",
          why: "Duplicated or misattributed lab results are patient-safety faults.",
        },
        {
          title: "Making machine output safe",
          did: "Only affirmed findings are coded; negated, family, hypothetical, uncertain and historical mentions are shown with a reason and never written; writes are unconfirmed with Provenance; review uses `If-Match` versioning.",
          why: "No machine guess reaches the record without a person.",
        },
        {
          title: "A guarded assistant on free models",
          did: "Free model ids enforced in code with a cost breaker; scripted answers first, then one cited model call and a sentence-level output filter; 13 free models probed with a repeatable script and 5 passed the grounded-answer test.",
          why: "Reliable answers without paying for an API.",
        },
      ],
      results: [
        { measure: "AU Core 2.0.0 validation", result: "0 errors", note: "20 synthetic patients" },
        { measure: "AU Patient Summary validation", result: "0 errors", note: "20 of 20 documents" },
        { measure: "Note extraction", result: "93.2% precision, 57.5% recall", note: "12 notes; labels AI-written, not clinician-reviewed" },
        {
          measure: "Assistant evaluation",
          result: "0 uncited sentences shown, 3 of 3 prompt injections resisted, 6 of 10 answerable questions answered",
          note: "one run of 20 questions",
        },
        { measure: "Automated tests", result: "[TODO: real counts from the test runner]", note: "" },
      ],
      screenshots: [{}, {}, {}, {}],
      howIBuilt:
        "I chose the problem and the Australian standards, wrote and revised the specification and its acceptance tests, made and recorded each design decision, set up the cloud accounts and deployments, and decided what not to claim. I built it with Claude Code as my AI coding partner.",
      limits: [
        "Synthetic data only; not a medical device and not clinician-reviewed",
        "One HL7 message type over HTTP",
        "SMART and CDS Hooks tested against public sandboxes",
        "Extraction recall 57.5%",
        "Free hosting means a slow first load",
      ],
    },
  },
  {
    slug: "pawlift",
    name: "PawLift",
    tagline: "Rescue animal transport coordination",
    kind: "a rescue animal transport coordination app",
    summary:
      "A phone-first app that matches volunteer drivers' existing trips with rescue animals that need a lift, with privacy-first Postgres design.",
    tags: ["Next.js", "PostgreSQL", "PostGIS", "Row-level security", "Playwright"],
    color: "#2F7D55",
    mark: "/brand/pawlift-mark.svg",
    liveUrl: "https://pawlift-three.vercel.app",
    codeUrl: "https://github.com/talhatawsif/pawlift",
    cvDates: "Nov 2026 – present",
    cvBullets: [
      "Matches volunteer drivers' existing trips with rescue animals needing transport, ranked by estimated detour.",
      "Every state change is one audited Postgres transaction; a race test confirms only 1 of 5 simultaneous claims succeeds.",
      "Private addresses and medical notes visible only to the confirmed driver; 223 database security tests and automated WCAG 2.1 checks.",
    ],
    caseStudy: {
      problem:
        "Rescue groups, pounds, shelters and vets often need to move an animal but can't find a driver. Many volunteers are already driving somewhere nearby. PawLift connects the two.",
      features: [
        "Route matching that ranks lifts by estimated detour along the volunteer's own trip",
        "The full lift lifecycle (claim, organisation confirms, pickup, delivery, completion, plus offers, reassign, cancel and incident reports)",
        "Exact addresses, contacts and medical notes shown only to the confirmed driver during the trip and hidden after delivery",
        "Organisation and volunteer verification with recorded checks",
        "Foster carers who confirm arrival",
        "Admin oversight where viewing private details needs a stated reason and is logged",
        "Navigation handed to Google Maps, Apple Maps or Waze",
      ],
      built: [
        "Next.js (App Router, Server Actions) and TypeScript",
        "Supabase Postgres with PostGIS, row-level security, Storage and pg_cron",
        "MapLibre with OpenStreetMap tiles",
        "openrouteservice behind a server-side adapter",
        "Vitest, Playwright and axe",
      ],
      stackLine: "Next.js · TypeScript · Supabase · PostgreSQL · PostGIS · MapLibre · Playwright",
      hardProblems: [
        {
          title: "Two drivers claiming the same animal",
          did: "Every state change is one Postgres function that locks rows, re-checks permissions and writes the audit log in the same transaction; a later review found a possible deadlock and fixed it by using one lock order everywhere.",
          why: "An animal never ends up with two drivers, or none.",
        },
        {
          title: "Keeping private details private",
          did: "Private data in separate tables readable only through access functions, revoked automatically on withdraw, reassign, cancel or delivery.",
          why: "The same least-privilege and access-logging pattern health systems use for patient data.",
        },
        {
          title: "Honest route estimates on a free API quota",
          did: "At most 6 routing calls per search with caching; without a key every estimate is labelled DEMO and straight-line distance is never passed off as travel time.",
        },
      ],
      results: [
        { measure: "Database security tests (RLS and permissions)", result: "223 of 223 passed", note: "Nov 2026 gate" },
        { measure: "Race-condition test", result: "1 of 5 simultaneous claims succeeds", note: "as designed" },
        { measure: "Accessibility", result: "No serious or critical WCAG 2.1 A/AA issues", note: "41 page visits at 1280 px and 375 px" },
        { measure: "Scale", result: "37 pages, 22 tables, 44 recorded design decisions", note: "" },
      ],
      screenshots: [{}, {}, {}, {}],
      howIBuilt:
        "I owned the product, including removing multi-driver relays after building them, for animal-welfare reasons. I built it with Claude Code through staged checkpoints with written decision records and test gates.",
      limits: [
        "Demo on fictional data, not yet launched with real organisations",
        "Not yet tested on real phones or with screen readers",
        "Notifications are in-app only",
      ],
    },
  },
  {
    slug: "adhd-buddy",
    name: "ADHD Buddy",
    tagline: "A task-starting app for adults with ADHD",
    kind: "a task-starting app for adults with ADHD",
    summary:
      "Built for the hardest part of ADHD: starting. Quick capture, a 5-minute focus runway and reminders that back off instead of nagging.",
    tags: ["Next.js", "TypeScript", "Supabase", "Tailwind CSS"],
    color: "#18181B",
    mark: "/brand/adhd-buddy-mark.svg",
    liveUrl: "https://adhd-buddy.vercel.app",
    codeUrl: "https://github.com/talhatawsif/adhd-buddy",
    cvDates: "Aug 2026 – Oct 2026",
    cvBullets: [
      "Quick capture, user-written next steps, a 5-minute focus runway and reminders that back off instead of nagging; row-level security on user data.",
    ],
    caseStudy: {
      problem:
        "For many adults with ADHD the hard part is starting a task, not finishing it. Most task apps treat the problem as discipline. ADHD Buddy is built around getting started.",
      features: [
        "Quick capture (save a thought now, sort later into Urgent, Someday or Needs breakdown)",
        "Task breakdown into small steps the user writes",
        "Focus sessions with an optional 5-minute runway before a 5–45 minute timer, logging planned vs actual time",
        "A focus streak that rewards consistency, not session length, so it never rewards hyperfocus",
        "Reminders that back off (10 min → 30 min → 1 hr → next day)",
        "A task timeline from plan to first focus to finish, with a history page",
      ],
      built: ["Next.js (App Router, server components), TypeScript, Tailwind CSS, Supabase Auth and Postgres with row-level security, Vercel"],
      stackLine: "Next.js · TypeScript · Tailwind CSS · Supabase · Vercel",
      hardProblems: [
        {
          title: "Each user's data private at the database level",
          did: "Postgres row-level security tied to the signed-in user, because the browser talks to the database directly.",
        },
        {
          title: "Recording milestones correctly",
          did: "First-focus and finish times only write if still empty, so a later session can't overwrite them; out-of-order timestamps handled.",
        },
        {
          title: "Getting it live",
          did: "Server-side session refresh and redirects, Vercel environment variables and deployment issues, all written up in a public debug log.",
        },
      ],
      results: [
        { measure: "Releases", result: "2 (v0.1.0, v0.2.0)", note: "changelog in the repo" },
        { measure: "Scale", result: "7 pages, 4 database tables", note: "" },
      ],
      screenshots: [{}, {}, {}, {}],
      howIBuilt:
        "I set the product direction and the reasoning behind every feature, documented in the README, and built it with Claude Code.",
      limits: ["Reminders show only while the dashboard is open", "The timer runs in the browser", "No automated tests yet"],
    },
  },
];

export const experience = [
  {
    dates: "Nov 2025 – present",
    role: "AI Data Annotator & Evaluator (freelance, remote)",
    organisation: "Outlier (since Nov 2025); Prolific and OneForma (since Nov 2026)",
    did: "Evaluate and rank large language model responses for accuracy, truthfulness and safety. Write original prompts and reference answers in reasoning, Python and SQL.",
  },
  {
    dates: "Jan 2024 – present",
    role: "Facility Operations Team Member (part-time)",
    organisation:
      "Crown Melbourne via ISS Facility Services (Apr 2025 – Nov 2026), then Millennium Services Group (Nov 2026 – present); Maid to Clean (Jan 2024 – May 2025)",
    did: "Kept on through the Crown contract handover; part-time permanent. Train new team members on site procedures, equipment and hygiene standards. Clean and sanitise high-traffic public areas to strict safety protocols.",
  },
  {
    dates: "Feb 2022 – 2024",
    role: "Hospitality Team Member (part-time and casual)",
    organisation: "KFC Crown Southbank (Apr 2022 – Nov 2023); McDonald's, Bourke & Russell St (2022); Domino's, Flinders St (2024)",
    did: "Customer service, food preparation, opening and closing duties in high-volume city venues. Trained new recruits.",
  },
];

export const education: {
  dates: string;
  qualification: string;
  institution: InstitutionId;
  institutionLabel: string;
  start: string;
  end?: string;
  /** Expected finish, for a degree in progress. */
  expectedEnd?: string;
  /** Field of study, in lower case, for the assistant's sentences. */
  field?: string;
  notes: string;
}[] = [
  {
    dates: "Mar 2025 – Jun 2027 (expected)",
    qualification: "Bachelor of Information Technology",
    institution: "kent",
    institutionLabel: "Kent Institute Australia, Melbourne",
    start: "2025-03",
    expectedEnd: "2027-06",
    notes:
      "Software Engineering, Systems Analysis & Design, Database Fundamentals, Object-Oriented Design and Programming, Web Page Design and Development, Data Communication and Networking, Cloud and Beyond, Data Structures & Algorithms. Capstone project in Trimester 1 2027.",
  },
  {
    dates: "2022 – 2024",
    qualification: "Bachelor of Engineering (Honours), Biomedical — studied before transferring to IT",
    institution: "swinburne",
    institutionLabel: "Swinburne University of Technology",
    start: "2022",
    end: "2024",
    field: "biomedical engineering",
    notes:
      "Medical Imaging Systems, Anatomy & Physiology, Engineering Materials, Circuits & Electronics, Calculus, Linear Algebra, Mathematical Methods & Statistics, Introduction to Programming.",
  },
  {
    dates: "2021 – 2022",
    qualification: "Bachelor of Science in Electrical and Electronic Engineering (BSEEE) — first year completed",
    institution: "bracu",
    institutionLabel: "BRAC University, Dhaka",
    start: "2021",
    end: "2022",
    field: "electrical and electronic engineering",
    notes: "First-year foundations in mathematics, physics, electrical circuits and programming, including Electrical Circuits I with laboratory (EEE101) and Computer Programming (EEE103).",
  },
];

export const certifications = [
  {
    name: "AI in Healthcare Specialisation",
    issuer: "Stanford University School of Medicine (online)",
    institution: "stanford" as InstitutionId,
    date: "Aug 2026",
    issued: "2026-08",
    credits: 54.5,
    courses: [
      "Introduction to Healthcare",
      "Introduction to Clinical Data",
      "Fundamentals of AI and Machine Learning in Healthcare",
      "Evaluations of AI Applications in Healthcare",
      "AI in Healthcare Capstone Project",
    ],
  },
];

export const skills = [
  { group: "Health IT", items: ["FHIR R4", "AU Core", "AU Patient Summary", "HL7 v2", "SMART on FHIR", "CDS Hooks", "SNOMED CT-AU", "LOINC", "clinical NLP (medspaCy)"] },
  {
    group: "Software",
    items: ["TypeScript", "JavaScript", "Python", "SQL", "Next.js", "React", "Node.js", "FastAPI", "PostgreSQL", "PostGIS", "Supabase", "REST APIs", "OAuth 2.0 (PKCE)", "Tailwind CSS"],
  },
  {
    group: "AI and automation",
    items: ["LLM integration (OpenRouter)", "prompt-injection resistance", "LLM evaluation", "n8n workflows", "AI-assisted development (Claude Code)", "data annotation"],
  },
  {
    group: "Cloud, testing and practice",
    items: ["Google Cloud Run", "Vercel", "Docker", "GitHub Actions", "Playwright", "Vitest", "accessibility testing (axe)", "row-level security", "decision records", "technical documentation"],
  },
  { group: "Domain", items: ["anatomy and physiology", "medical imaging", "circuit analysis", "engineering mathematics"] },
];

export const contact = {
  text: "I'm open to part-time roles and internships now, and graduate roles from July 2027, in health tech, integration, software engineering or AI and automation, in Melbourne. The quickest way to reach me is email or LinkedIn.",
};

export const footer = {
  left: "© 2026 Talha Tawsif · Melbourne",
  right: "Built with Next.js, deployed on Vercel.",
};

/** Placeholders show only in development; production hides them. */
export const showTodos = process.env.NODE_ENV !== "production";

export const isTodo = (v: unknown): v is string => typeof v === "string" && v.startsWith("[TODO");

/** Every open `[TODO…]` in the content, as `path: text`. */
export function collectTodos(value: unknown, path = "site"): string[] {
  if (isTodo(value)) return [`${path}: ${value}`];
  if (Array.isArray(value)) return value.flatMap((v, i) => collectTodos(v, `${path}[${i}]`));
  if (value && typeof value === "object") return Object.entries(value).flatMap(([k, v]) => collectTodos(v, `${path}.${k}`));
  return [];
}

export const allContent = { siteUrl, profile, summary, atAGlance, projects, experience, education, certifications, skills, contact };
