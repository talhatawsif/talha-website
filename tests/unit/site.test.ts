import { describe, expect, it } from "vitest";
import { allContent, collectTodos, isTodo, projects } from "@/content/site";

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
});
