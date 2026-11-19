import { NOT_ON_SITE } from "./guard.ts";

const cite = /\[([a-z][a-z0-9.-]*)\]/g;
const leadingCites = /^\s*(?:⟦\d+⟧\s*)+/;
const abbreviation = /\b(?:e\.g|i\.e|etc|vs|cf)\.\s*$/i;
const segmenter = new Intl.Segmenter("en", { granularity: "sentence" });

/** Sentences via ICU rules, so "Next.js", "v0.2.0" and "e.g." do not split. Citations are masked first because ids contain ".". */
function sentences(masked: string): string[] {
  const out: string[] = [];
  let carry = "";
  for (const { segment: seg } of segmenter.segment(masked)) {
    let segment = seg;
    const lead = !carry && out.length ? segment.match(leadingCites)?.[0] : undefined;
    if (lead) {
      out[out.length - 1] += lead; // "text. [id] Next sentence": the citation belongs to the previous sentence
      segment = segment.slice(lead.length);
      if (!segment.trim()) continue;
    }
    if (abbreviation.test(segment.trim())) carry += segment; // "e.g. Next.js" split after the abbreviation
    else {
      out.push(carry + segment);
      carry = "";
    }
  }
  if (carry) out.push(carry);
  return out.map((s) => s.trim()).filter(Boolean);
}

/** Keeps only sentences that end in a citation to a known section id; at most 4. */
export function filterCited(text: string, valid: ReadonlySet<string>): { text: string; citations: string[] } {
  const body = text.trim();
  if (body.toLowerCase() === NOT_ON_SITE.toLowerCase()) return { text: NOT_ON_SITE, citations: [] };
  const ids: string[] = [];
  const masked = body.replace(cite, (_, id: string) => `⟦${ids.push(id) - 1}⟧`);
  const kept: string[] = [];
  const citations: string[] = [];
  for (const s of sentences(masked)) {
    const used = [...s.matchAll(/⟦(\d+)⟧/g)].map((m) => ids[Number(m[1])]);
    const endsWithCite = /⟦\d+⟧\s*[.!?]?\s*$/.test(s);
    if (!used.length || !endsWithCite || !used.every((id) => valid.has(id))) continue;
    kept.push(s.replace(/⟦(\d+)⟧/g, (_, i: string) => `[${ids[Number(i)]}]`));
    citations.push(...used);
    if (kept.length === 4) break;
  }
  return kept.length ? { text: kept.join(" "), citations: [...new Set(citations)] } : { text: NOT_ON_SITE, citations: [] };
}
