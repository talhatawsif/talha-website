import { atAGlance, certifications, education, experience, institutions, licenceContext, licences, monthYear as shortMonthYear, profile, projects } from "../../content/site.ts";

export type Scripted = { text: string; citations: string[]; intent: string };

/** "Some text." -> "Some text [id]." One cited sentence. */
const cited = (text: string, id: string | string[]) => `${text.replace(/[.\s]+$/, "")} ${[id].flat().map((i) => `[${i}]`).join(" ")}.`;
const pack = (intent: string, parts: [string, string | string[]][]): Scripted => ({
  intent,
  text: parts.map(([t, id]) => cited(t, id)).join(" "),
  citations: [...new Set(parts.flatMap(([, id]) => [id].flat()))],
});

const lowerFirst = (t: string) => t.charAt(0).toLowerCase() + t.slice(1);
const a = (noun: string) => `${/^[aeiou]/i.test(noun) ? "an" : "a"} ${noun}`;
/** "A, B and C" */
const list = (items: string[]) => (items.length < 2 ? items.join("") : `${items.slice(0, -1).join(", ")} and ${items.at(-1)}`);
const csv = (v: string) => list(v.split(", "));
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const monthYear = (iso: string) => `${months[Number(iso.slice(5, 7)) - 1]} ${iso.slice(0, 4)}`;
const words = ["no", "one", "two", "three", "four", "five", "six"];

const norm = (q: string) => q.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();

function lev(x: string, y: string) {
  const d = Array.from({ length: x.length + 1 }, (_, i) => [i, ...Array(y.length).fill(0)]);
  for (let j = 1; j <= y.length; j++) d[0][j] = j;
  for (let i = 1; i <= x.length; i++)
    for (let j = 1; j <= y.length; j++) d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (x[i - 1] === y[j - 1] ? 0 : 1));
  return d[x.length][y.length];
}

// Names the visitor may type. Matched on the squashed text ("clin iq" -> "cliniq") and, for typos, within one edit.
const aliases: Record<string, string[]> = { cliniq: ["cliniq", "clinq"], pawlift: ["pawlift", "pawlft"], "adhd-buddy": ["adhdbuddy", "adhd"] };
const fuzzy: Record<string, string> = { cliniq: "cliniq", pawlift: "pawlift", "adhd-buddy": "adhdbuddy" };

function mentioned(q: string) {
  const ws = q.split(" ");
  const squashed = q.replace(/ /g, "");
  const near = [...ws, ...ws.slice(1).map((w, i) => ws[i] + w)];
  return projects.filter((p) => aliases[p.slug].some((x) => squashed.includes(x)) || near.some((w) => w.length >= 6 && lev(w, fuzzy[p.slug]) <= 1));
}

const has = (q: string, re: RegExp) => re.test(q);
const intro = (p: (typeof projects)[number]): [string, string] => [`${p.name} is ${p.kind}`, `projects.${p.slug}`];
const glance = (label: string) => atAGlance.find((g) => g.label === label)?.value ?? "";

function project(p: (typeof projects)[number]): Scripted {
  const id = `projects.${p.slug}`;
  const what = /^An? /.test(p.summary) ? `It works as ${lowerFirst(p.summary)}` : p.summary;
  return pack("project", [intro(p), [what, id], [`It is built with ${list(p.caseStudy.stackLine.split(" · "))}`, id], [`There is a live demo at ${p.liveUrl}`, id]]);
}

const licenceList = () => list(licences.map((l) => `the ${l.name} (${l.issuer}, accepted ${shortMonthYear(l.accepted)})`));

/** Licences, not certifications; "registered for", never "integrated with". */
function licencesAnswer(): Scripted {
  return pack("licences", [
    [`Talha is a registered NCTS licensee, holding ${licenceList()}`, "licences"],
    [`He is registered with an NTS API client for ClinIQ, and he ${licenceContext.confirmed}`, "licences"],
  ]);
}

function educationAnswer(): Scripted {
  const by = (id: string) => education.find((e) => e.institution === id)!;
  const kent = by("kent");
  const swin = by("swinburne");
  const brac = by("bracu");
  const c = certifications[0];
  return pack("education", [
    [`Talha is in the final year of a ${kent.qualification} at ${institutions.kent.short}, finishing in ${monthYear(kent.expectedEnd!)}`, "education"],
    [`Before IT he studied ${swin.field} at ${institutions.swinburne.short} (${swin.start}–${swin.end}) and completed the first year of ${brac.field} at ${institutions.bracu.short}`, "education"],
    [`He also holds ${institutions[c.institution].short}'s ${c.name}`, "certifications"],
    [`He is also a registered NCTS licensee, holding ${list(licences.map((l) => `the ${l.name}`))}`, "licences"],
  ]);
}

const skillTemplates: Record<string, (v: string) => string> = {
  "Health IT": (v) => `Talha works in health IT, with ${csv(v)}, and is a registered NCTS licensee`,
  Software: (v) => `For software he uses ${csv(v)}`,
  "AI and automation": (v) => `On the AI side he works with ${csv(v)}`,
  "Cloud and testing": (v) => `For cloud and testing he uses ${csv(v)}`,
};

function experienceAnswer(): Scripted {
  const since = experience.at(-1)!.dates.match(/\d{4}/)![0];
  const parts: [string, string][] = [[`Talha has worked alongside his studies since ${since}, and has trained new staff in every role`, "summary"]];
  experience.forEach((e, i) => {
    const present = /present/i.test(e.dates);
    const lead = present ? (i === 0 ? "He currently works as" : "He also works as") : `Earlier, from ${e.dates.replace(" – ", " to ")}, he worked as`;
    parts.push([`${lead} ${a(e.role)}, with ${list(e.organisation.split("; "))}`, "experience"]);
  });
  return pack("experience", parts);
}

export function scriptedAnswer(question: string): Scripted | null {
  const q = norm(question);

  const named = mentioned(q);
  if (named.length === 1) return project(named[0]);
  if (named.length > 1) return pack("projects", named.map(intro));
  if (has(q, /\b(licen[cs]\w*|ncts|affiliate|national terminology|terminology service|nts)\b/)) return licencesAnswer();
  if (has(q, /\b(projects?|portfolio|apps?|built|build|made|created)\b/))
    return pack("projects", [[`Talha has built ${words[projects.length] ?? projects.length} full-stack apps: ${list(projects.map((p) => p.name))}`, "summary"], ...projects.map(intro)]);

  if (has(q, /\b(fhir|hl7|snomed|au core|cds hooks|interoperability)\b/)) {
    const cliniq = projects[0];
    const r = cliniq.caseStudy.results[0];
    return pack("fhir", [
      [`Talha has worked with FHIR and HL7 v2 mainly through ${cliniq.name}, ${lowerFirst(cliniq.summary)}`, `projects.${cliniq.slug}`],
      [`Its ${r.measure} found ${r.result} (${r.note})`, `projects.${cliniq.slug}`],
      [`His health IT skills include ${csv(glance("Health IT"))}`, "skills"],
      [`He is also a registered NCTS licensee, holding ${list(licences.map((l) => `the ${l.name}`))}`, "licences"],
    ]);
  }

  if (has(q, /\b(availab\w*|open to work|looking for|start|hire|hiring|internships?|part time|full time|graduate)\b/)) {
    const [now, later] = profile.available.split(" · ");
    return pack("availability", [
      [`Talha is available for ${lowerFirst(now)}, with ${lowerFirst(later)}`, "profile"],
      [`He is based in ${profile.location}`, "profile"],
      [`The quickest way to reach him is by email at ${profile.email} or on LinkedIn`, "contact"],
    ]);
  }

  if (has(q, /\b(contact|email|e mail|cv|resume|reach|linkedin|github|get in touch)\b/))
    return pack("contact", [
      [`You can email Talha at ${profile.email}`, "contact"],
      [`He is also on LinkedIn at ${profile.linkedin} and GitHub at ${profile.github}`, "contact"],
      [`His CV is on this site at ${profile.cvUrl}`, "contact"],
    ]);

  if (has(q, /\b(education|degrees?|stud\w*|universit\w*|uni|kent|swinburne|brac|stanford|qualifications?|bachelor|certifications?|certificate|school)\b/)) return educationAnswer();

  if (has(q, /\b(skills?|stack|technolog\w*|programming|typescript|python|react|sql|tools?|frameworks?|proficient)\b/))
    return pack("skills", atAGlance.map((g) => [(skillTemplates[g.label] ?? ((v: string) => `${g.label}: ${csv(v)}`))(g.value), g.label === "Health IT" ? ["skills", "licences"] : "skills"] as [string, string | string[]]));

  if (has(q, /\b(experience|work history|jobs?|employment|employers?|worked|career|annotat\w*|crown|kfc)\b/)) return experienceAnswer();

  return null;
}
