import { NOT_ON_SITE } from "./guard.ts";

const cite = /\[([a-z][a-z0-9.-]*)\]/g;
// Citations are swapped for dot-free tokens first, because ids like projects.cliniq contain "." .
const sentence = /[^.!?\n]*[.!?]+(?:\s*⟦\d+⟧)*|[^.!?\n]+$/g;

/** Keeps only sentences that end in a citation to a known section id; at most 4. */
export function filterCited(text: string, valid: ReadonlySet<string>): { text: string; citations: string[] } {
  const body = text.trim();
  if (body.toLowerCase() === NOT_ON_SITE.toLowerCase()) return { text: NOT_ON_SITE, citations: [] };
  const ids: string[] = [];
  const masked = body.replace(cite, (_, id: string) => `⟦${ids.push(id) - 1}⟧`);
  const kept: string[] = [];
  const citations: string[] = [];
  for (const raw of masked.match(sentence) ?? []) {
    const s = raw.trim();
    const used = [...s.matchAll(/⟦(\d+)⟧/g)].map((m) => ids[Number(m[1])]);
    const endsWithCite = /⟦\d+⟧\s*[.!?]?\s*$/.test(s);
    if (!used.length || !endsWithCite || !used.every((id) => valid.has(id))) continue;
    kept.push(s.replace(/⟦(\d+)⟧/g, (_, i: string) => `[${ids[Number(i)]}]`));
    citations.push(...used);
    if (kept.length === 4) break;
  }
  return kept.length ? { text: kept.join(" "), citations: [...new Set(citations)] } : { text: NOT_ON_SITE, citations: [] };
}
