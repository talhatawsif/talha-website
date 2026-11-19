import { atAGlance, certifications, contact, education, experience, profile, projects, skills, summary } from "../../content/site.ts";

const list = (xs: string[]) => xs.map((x) => `- ${x}`).join("\n");

/** Each block is tagged with the section id the model must cite. */
export const sections: Record<string, string> = {
  profile: `Name: ${profile.name}. Role: ${profile.role}. Location: ${profile.location}. Studying: ${profile.studying}. Available: ${profile.available}. Languages: ${profile.languages}.`,
  summary: [...summary, ...atAGlance.map((a) => `${a.label}: ${a.value}`)].join("\n"),
  ...Object.fromEntries(
    projects.map((p) => [
      `projects.${p.slug}`,
      [
        `${p.name}: ${p.tagline}. ${p.summary}`,
        `Problem: ${p.caseStudy.problem}`,
        `What it does:\n${list(p.caseStudy.features)}`,
        `How it's built:\n${list(p.caseStudy.built)}`,
        `Stack: ${p.caseStudy.stackLine}`,
        `Hard problems:\n${list(p.caseStudy.hardProblems.map((h) => `${h.title}: ${h.did}${h.why ? " " + h.why : ""}`))}`,
        `Results:\n${list(p.caseStudy.results.map((r) => `${r.measure}: ${r.result}${r.note ? " (" + r.note + ")" : ""}`))}`,
        `Limits:\n${list(p.caseStudy.limits)}`,
        `How Talha worked: ${p.caseStudy.howIBuilt}`,
      ].join("\n"),
    ]),
  ),
  experience: experience.map((e) => `${e.dates}: ${e.role}, ${e.organisation}. ${e.did}`).join("\n"),
  education: education.map((e) => `${e.dates}: ${e.qualification}, ${e.institutionLabel}. ${e.notes}`).join("\n"),
  certifications: certifications.map((c) => `${c.name}, ${c.issuer}, ${c.date}. Courses: ${c.courses.join("; ")}.`).join("\n"),
  skills: skills.map((g) => `${g.group}: ${g.items.join(", ")}`).join("\n"),
  contact: `${contact.text} Email: ${profile.email}.`,
};

export const validIds = new Set(Object.keys(sections));

export const buildContext = () => Object.entries(sections).map(([id, text]) => `[${id}]\n${text}`).join("\n\n");

/** Where a citation links to. */
export const citationHref = (id: string) => (id.startsWith("projects.") ? `/projects/${id.slice(9)}` : `/#${id}`);
