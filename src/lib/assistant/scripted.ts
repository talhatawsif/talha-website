import { atAGlance, certifications, education, experience, profile, projects } from "../../content/site.ts";

export type Scripted = { text: string; citations: string[]; intent: string };

/** "Some text." -> "Some text [id]." One cited sentence. */
const cited = (text: string, id: string) => `${text.replace(/[.\s]+$/, "")} [${id}].`;
const pack = (intent: string, parts: [string, string][]): Scripted => ({
  intent,
  text: parts.map(([t, id]) => cited(t, id)).join(" "),
  citations: [...new Set(parts.map(([, id]) => id))],
});

const norm = (q: string) => q.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();

function lev(a: string, b: string) {
  const d = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 1; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++)
    for (let j = 1; j <= b.length; j++) d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  return d[a.length][b.length];
}

// Names the visitor may type. Matched on the squashed text ("clin iq" -> "cliniq") and, for typos, within one edit.
const aliases: Record<string, string[]> = { cliniq: ["cliniq", "clinq"], pawlift: ["pawlift", "pawlft"], "adhd-buddy": ["adhdbuddy", "adhd"] };
const fuzzy: Record<string, string> = { cliniq: "cliniq", pawlift: "pawlift", "adhd-buddy": "adhdbuddy" };

function mentioned(q: string) {
  const words = q.split(" ");
  const squashed = q.replace(/ /g, "");
  const near = [...words, ...words.slice(1).map((w, i) => words[i] + w)];
  return projects.filter((p) => aliases[p.slug].some((a) => squashed.includes(a)) || near.some((w) => w.length >= 6 && lev(w, fuzzy[p.slug]) <= 1));
}

const has = (q: string, re: RegExp) => re.test(q);

export function scriptedAnswer(question: string): Scripted | null {
  const q = norm(question);

  const named = mentioned(q);
  if (named.length === 1) {
    const p = named[0];
    const id = `projects.${p.slug}`;
    return pack("project", [
      [`${p.name} is ${p.kind}`, id],
      [p.summary, id],
      [`It is built with ${p.caseStudy.stackLine.split(" · ").join(", ")}`, id],
    ]);
  }
  if (named.length > 1 || has(q, /\b(projects?|portfolio|apps?|built|build|made|created)\b/))
    return pack("projects", (named.length > 1 ? named : projects).map((p) => [`${p.name} is ${p.kind}`, `projects.${p.slug}`] as [string, string]));

  if (has(q, /\b(fhir|hl7|snomed|au core|cds hooks|interoperability)\b/)) {
    const cliniq = projects[0];
    const health = atAGlance[0];
    return pack("fhir", [
      [cliniq.summary, `projects.${cliniq.slug}`],
      [`${health.label}: ${health.value}`, "skills"],
    ]);
  }

  if (has(q, /\b(availab\w*|open to work|looking for|start|hire|hiring|internships?|part time|full time|graduate)\b/))
    return pack("availability", [
      [`He is open to work: ${profile.available.replace(" · ", "; ")}`, "profile"],
      [`He is based in ${profile.location}`, "profile"],
      [`Email: ${profile.email}`, "contact"],
    ]);

  if (has(q, /\b(contact|email|e mail|cv|resume|reach|linkedin|github|get in touch)\b/))
    return pack("contact", [
      [`Email: ${profile.email}`, "contact"],
      [`LinkedIn: ${profile.linkedin}`, "contact"],
      [`GitHub: ${profile.github}`, "contact"],
      [`His CV is at ${profile.cvUrl}`, "contact"],
    ]);

  if (has(q, /\b(education|degrees?|stud\w*|universit\w*|uni|kent|swinburne|brac|stanford|qualifications?|bachelor|certifications?|certificate|school)\b/)) {
    const c = certifications[0];
    return pack("education", [
      [`He is studying ${profile.studying}`, "education"],
      ...education.slice(1).map((e) => [`${e.qualification}, ${e.institutionLabel}, ${e.dates}`, "education"] as [string, string]),
      [`${c.name}, ${c.issuer}, ${c.date}`, "certifications"],
    ]);
  }

  if (has(q, /\b(skills?|stack|technolog\w*|programming|typescript|python|react|sql|tools?|frameworks?|proficient)\b/))
    return pack("skills", atAGlance.map((a) => [`${a.label}: ${a.value}`, "skills"] as [string, string]));

  if (has(q, /\b(experience|work history|jobs?|employment|employers?|worked|career|annotat\w*|crown|kfc)\b/))
    return pack("experience", experience.map((e) => [`${e.role}, ${e.dates}`, "experience"] as [string, string]));

  return null;
}
