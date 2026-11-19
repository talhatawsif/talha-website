import { describe, expect, it } from "vitest";
import { validIds } from "@/lib/assistant/context";
import { scriptedAnswer } from "@/lib/assistant/scripted";
import { atAGlance, education, experience, profile, projects } from "@/content/site";

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
  const qs = ["What is ClinIQ?", "What is PawLift?", "What is ADHD Buddy?", "What projects has he built?", "education", "skills", "FHIR experience", "work experience", "availability", "contact"];

  it.each(qs)("%s: 2–4 sentences, every one cited with a valid section id", (q) => {
    const a = scriptedAnswer(q)!;
    const sentences = a.text.match(/\[[a-z][a-z0-9.-]*\]\./g) ?? [];
    expect(sentences.length).toBeGreaterThanOrEqual(2);
    expect(sentences.length).toBeLessThanOrEqual(4);
    expect(a.citations.every((id) => validIds.has(id))).toBe(true);
    for (const m of a.text.matchAll(/\[([a-z][a-z0-9.-]*)\]/g)) expect(validIds.has(m[1])).toBe(true);
  });

  it("is built from site.ts", () => {
    expect(scriptedAnswer("What is PawLift?")!.text).toContain(projects[1].summary.replace(/\.$/, ""));
    expect(scriptedAnswer("What is PawLift?")!.citations).toEqual(["projects.pawlift"]);
    expect(scriptedAnswer("education")!.text).toContain(profile.studying);
    expect(scriptedAnswer("education")!.text).toContain(education[1].institutionLabel);
    expect(scriptedAnswer("skills")!.text).toContain(atAGlance[0].value);
    expect(scriptedAnswer("jobs")!.text).toContain(experience[0].role);
    expect(scriptedAnswer("availability")!.text).toContain("Graduate roles from Jul 2027");
    expect(scriptedAnswer("contact")!.text).toContain(profile.email);
  });

  it("answers about all three projects when asked what he built", () => {
    expect(scriptedAnswer("what has he built")!.citations).toEqual(["projects.cliniq", "projects.pawlift", "projects.adhd-buddy"]);
  });
});
