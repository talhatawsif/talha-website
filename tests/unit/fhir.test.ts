import { describe, expect, it } from "vitest";
import { buildPractitioner } from "@/lib/fhir";

describe("Practitioner resource", () => {
  const p = buildPractitioner();
  it("has the R4 basics", () => {
    expect(p.resourceType).toBe("Practitioner");
    expect(p.name[0].family).toBe("Tawsif");
    expect(p.name[0].given).toEqual(["Talha"]);
  });
  it("lists every degree and the Stanford specialisation as qualifications", () => {
    const names = p.qualification.map((q) => q.code.text);
    expect(names).toHaveLength(4);
    expect(names.some((n) => n.includes("AI in Healthcare"))).toBe(true);
  });
  it("lists languages and city-only address", () => {
    expect(p.communication.map((c) => c.coding[0].code)).toEqual(["en", "bn", "hi", "ur"]);
    expect(Object.keys(p.address[0]).sort()).toEqual(["city", "country", "state"]);
  });
});
