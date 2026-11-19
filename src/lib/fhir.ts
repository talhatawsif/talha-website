import { certifications, education, institutions, languageCodes, licences, profile } from "@/content/site";

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
      { system: "phone", value: profile.phone },
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
      // R4 Practitioner.qualification covers licences as well as degrees.
      ...licences.map((l) => ({ code: { text: l.name }, period: { start: l.accepted }, issuer: { display: l.issuer } })),
    ],
    communication: languageCodes.map(([code, text]) => ({ coding: [{ system: "urn:ietf:bcp:47", code, display: text }], text })),
  };
}
