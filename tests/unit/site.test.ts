import { describe, expect, it } from "vitest";
import { allContent, collectTodos, formatPhone, isTodo, licences, monthYear, projects, summary } from "@/content/site";

function urls(v: unknown): string[] {
  if (typeof v === "string") return /^https?:\/\//.test(v) ? [v] : [];
  if (Array.isArray(v)) return v.flatMap(urls);
  if (v && typeof v === "object") return Object.values(v).flatMap(urls);
  return [];
}

describe("site content", () => {
  it("has the three projects", () => {
    expect(projects.map((p) => p.slug)).toEqual(["cliniq", "pawlift", "adhd-buddy"]);
  });

  it("uses https for every URL", () => {
    const all = urls(allContent);
    expect(all.length).toBeGreaterThan(5);
    expect(all.filter((u) => !u.startsWith("https://"))).toEqual([]);
  });

  it("detects and lists open TODOs", () => {
    const todos = collectTodos(allContent);
    console.log(`Open TODOs (${todos.length}):\n${todos.join("\n")}`);
    expect(isTodo("[TODO: x]")).toBe(true);
    expect(todos.length).toBeGreaterThan(0);
  });

  it("lists the two NCTS licences, accepted 19 Nov 2026", () => {
    expect(licences.map((l) => l.name)).toEqual(["SNOMED CT Affiliate Licence", "Australian National Terminology Licence"]);
    expect(licences.map((l) => l.issuer)).toEqual(["SNOMED International, via NCTS", "Australian Digital Health Agency, NCTS"]);
    expect(licences.every((l) => l.accepted === "2026-11-19" && monthYear(l.accepted) === "Nov 2026")).toBe(true);
  });
  it("summary mentions the licences without claiming a live integration", () => {
    const text = summary.join(" ");
    expect(text).toContain("registered NCTS licensee (SNOMED CT and Australian National Terminology licences)");
    expect(text).not.toMatch(/certified|integrated with/i);
  });
  it("formats the phone number", () => expect(formatPhone("+61499390833")).toBe("+61 499 390 833"));
});
