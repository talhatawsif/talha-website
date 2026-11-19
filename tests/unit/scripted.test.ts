import { describe, expect, it } from "vitest";
import { validIds } from "@/lib/assistant/context";
import { scriptedAnswer } from "@/lib/assistant/scripted";
import { atAGlance, education, experience, licenceContext, licences, profile, projects } from "@/content/site";

const intent = (q: string) => scriptedAnswer(q)?.intent;

describe("scripted answers: intents and phrasings", () => {
  it.each([
    ["What is ClinIQ?", "project"],
    ["tell me about clin iq", "project"],
    ["whats CLINIQ", "project"],
    ["what is the clinic project", "project"],
    ["What is PawLift?", "project"],
    ["tell me about paw lift", "project"],
    ["pawlft", "project"],
    ["What is ADHD Buddy?", "project"],
    ["tell me about adhd-buddy", "project"],
    ["adhdbuddy", "project"],
    ["What projects has he built?", "projects"],
    ["what has he built", "projects"],
    ["Show me his portfolio", "projects"],
    ["compare cliniq and pawlift", "projects"],
    ["What is his education?", "education"],
    ["Which degree does he have?", "education"],
    ["Where did he study?", "education"],
    ["Did he go to Stanford?", "education"],
    ["What are his skills?", "skills"],
    ["What tech stack does he use?", "skills"],
    ["Does he know Python?", "skills"],
    ["Does he have a SNOMED licence?", "licences"],
    ["Is he an NCTS licensee?", "licences"],
    ["What licences does he hold?", "licences"],
    ["Tell me about the Australian National Terminology Licence", "licences"],
    ["Does he have FHIR experience?", "fhir"],
    ["Tell me about his HL7 work", "fhir"],
    ["What is his work experience?", "experience"],
    ["What jobs has he had?", "experience"],
    ["Work history please", "experience"],
    ["Is he available?", "availability"],
    ["Is he open to work?", "availability"],
    ["When can he start?", "availability"],
    ["Is he looking for internships?", "availability"],
    ["How do I contact him?", "contact"],
    ["What is his email?", "contact"],
    ["Where can I get his CV?", "contact"],
    ["LinkedIn?", "contact"],
  ])("%s -> %s", (q, expected) => expect(intent(q)).toBe(expected));

  it("returns null for anything else", () => {
    expect(scriptedAnswer("What are his hobbies?")).toBeNull();
    expect(scriptedAnswer("What is the weather?")).toBeNull();
  });
});

describe("scripted answers: content", () => {
  const qs = ["Does he have an NCTS licence?", "What is ClinIQ?", "What is PawLift?", "What is ADHD Buddy?", "What projects has he built?", "education", "skills", "FHIR experience", "work experience", "availability", "contact"];

  it.each(qs)("%s: 2–4 sentences, every one cited with a valid section id", (q) => {
    const a = scriptedAnswer(q)!;
    const sentences = a.text.match(/\[[a-z][a-z0-9.-]*\]\./g) ?? [];
    expect(sentences.length).toBeGreaterThanOrEqual(2);
    expect(sentences.length).toBeLessThanOrEqual(4);
    expect(a.citations.every((id) => validIds.has(id))).toBe(true);
    for (const m of a.text.matchAll(/\[([a-z][a-z0-9.-]*)\]/g)) expect(validIds.has(m[1])).toBe(true);
  });

  it("education reads as natural sentences built from site.ts", () => {
    expect(scriptedAnswer("education")!.text).toBe(
      "Talha is in the final year of a Bachelor of Information Technology at Kent Institute Australia, finishing in June 2027 [education]. " +
        "Before IT he studied biomedical engineering at Swinburne University of Technology (2022–2024) and completed the first year of electrical and electronic engineering at BRAC University [education]. " +
        "He also holds Stanford Medicine's AI in Healthcare Specialisation [certifications]. " +
        "He is also a registered NCTS licensee, holding the SNOMED CT Affiliate Licence and the Australian National Terminology Licence [licences].",
    );
  });

  it("every intent is natural prose built from site.ts values", () => {
    const t = (q: string) => scriptedAnswer(q)!.text;
    expect(t("What is PawLift?")).toContain(`It works as ${projects[1].summary.charAt(0).toLowerCase()}${projects[1].summary.slice(1).replace(/\.$/, "")}`);
    expect(t("What is PawLift?")).toContain("It is built with Next.js, TypeScript, Supabase, PostgreSQL, PostGIS, MapLibre and Playwright [projects.pawlift].");
    expect(t("What is PawLift?")).toContain(`There is a live demo at ${projects[1].liveUrl} [projects.pawlift].`);
    expect(t("what has he built").startsWith("Talha has built three full-stack apps: ClinIQ, PawLift and ADHD Buddy [summary].")).toBe(true);
    expect(t("skills")).toContain(`Talha works in health IT, with FHIR R4, HL7 v2, SNOMED CT-AU, AU Core, SMART on FHIR and CDS Hooks, and is a registered NCTS licensee [skills] [licences].`);
    expect(t("FHIR experience")).toContain("mainly through ClinIQ, a demo electronic health record");
    expect(t("FHIR experience")).toContain("Its AU Core 2.0.0 validation found 0 errors (20 synthetic patients) [projects.cliniq].");
    expect(t("work experience")).toContain(`He currently works as an ${experience[0].role},`);
    expect(t("work experience")).toContain("Earlier, from Feb 2022 to 2024, he worked as a Hospitality Team Member");
    expect(t("availability")).toContain("Talha is available for part-time and internships now, with graduate roles from Jul 2027 [profile].");
    expect(t("contact")).toContain(`You can email Talha at ${profile.email} [contact].`);
    expect(t("contact")).toContain(`His CV is on this site at ${profile.cvUrl} [contact].`);
    expect(t("education")).toContain(education[1].qualification.length ? "Swinburne University of Technology (2022–2024)" : "");
    expect(atAGlance.length).toBe(4);
  });

  it.each(projects.map((p) => [p.name, p.kind, p.slug]))("%s answer opens with a full sentence", (name, kind, slug) => {
    const text = scriptedAnswer(`What is ${name}?`)!.text;
    expect(text.startsWith(`${name} is ${kind} [projects.${slug}].`)).toBe(true);
  });

  it("PawLift opens with its sentence", () => {
    expect(scriptedAnswer("What is PawLift?")!.text.startsWith("PawLift is a rescue animal transport coordination app [projects.pawlift].")).toBe(true);
  });

  it("answers about all three projects when asked what he built", () => {
    expect(scriptedAnswer("what has he built")!.citations).toEqual(["summary", "projects.cliniq", "projects.pawlift", "projects.adhd-buddy"]);
  });
});

describe("licences intent", () => {
  const a = scriptedAnswer("Does he have a SNOMED licence?")!;

  it("answers from the licences list, cited [licences]", () => {
    expect(a.citations).toEqual(["licences"]);
    for (const l of licences) expect(a.text).toContain(l.name);
    expect(a.text).toContain("accepted Nov 2026");
    expect(a.text).toContain("registered with an NTS API client for ClinIQ");
    expect(a.text).toContain(licenceContext.confirmed);
  });
  it("credentials, skills and FHIR answers mention the licences", () => {
    for (const q of ["education", "skills", "FHIR experience"]) expect(scriptedAnswer(q)!.citations).toContain("licences");
  });
  it("keeps the wording rules: licences not certifications, registered not integrated, no secrets", () => {
    const all = [a.text, scriptedAnswer("education")!.text, scriptedAnswer("skills")!.text, scriptedAnswer("fhir")!.text].join(" ");
    expect(all).not.toMatch(/certified|integrated with|client[ _-]?id|secret/i);
    expect(JSON.stringify([licences, licenceContext])).not.toMatch(/certif|integrated with|client[ _-]?id|secret/i);
  });
});
