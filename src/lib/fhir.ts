import { certifications, education, institutions, languageCodes, profile } from "@/content/site";

/** FHIR R4 Practitioner built from site.ts, standard elements only. */
export function buildPractitioner() {
  const parts = profile.name.split(" ");
  const family = parts.at(-1)!;
  return {
    resourceType: "Practitioner",
    id: "talha-tawsif",
    active: true,
    name: [{ use: "official", text: profile.name, family, given: parts.slice(0, -1) }],
    telecom: [
      { system: "email", value: profile.email },
      { system: "url", value: profile.linkedin },
      { system: "url", value: profile.github },
    ],
    address: [{ city: profile.location.split(",")[0], state: "VIC", country: "AU" }],
    qualification: [
      ...education.map((e) => ({
        code: { text: e.qualification },
        period: { start: e.start, ...(e.end ? { end: e.end } : {}) },
        issuer: { display: institutions[e.institution].name },
      })),
      ...certifications.map((c) => ({
        code: { text: c.name },
        period: { end: c.issued },
        issuer: { display: institutions[c.institution].name },
      })),
    ],
    communication: languageCodes.map(([code, text]) => ({ coding: [{ system: "urn:ietf:bcp:47", code, display: text }], text })),
  };
}
