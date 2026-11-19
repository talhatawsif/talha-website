// Usage: npm run probe:models  (run once, only when Talha asks).
// Reads OpenRouter's public model list (free call), then sends one short question to at most 2 free models.
import { writeFileSync } from "node:fs";
import { buildContext, validIds } from "../src/lib/assistant/context.ts";
import { filterCited } from "../src/lib/assistant/filter.ts";
import { assertFree, NOT_ON_SITE } from "../src/lib/assistant/guard.ts";

const key = process.env.OPENROUTER_API_KEY;
if (!key) throw new Error("Set OPENROUTER_API_KEY in .env.local (run with: node --env-file=.env.local scripts/probe-models.ts)");

type M = { id: string; context_length?: number; pricing?: Record<string, string> };
const list = ((await (await fetch("https://openrouter.ai/api/v1/models")).json()) as { data: M[] }).data;
// Prefer mainstream instruction-tuned models; skip previews, code, reasoning-only, vision and tiny ones.
const skip = /preview|code|reasoning|omni|-vl\b|thinking|\b\d(\.\d)?b\b/i;
const score = (id: string) => (/-it\b|instruct/i.test(id) ? 2 : 0) + (/^(google|meta-llama|qwen|mistralai|openai)\//.test(id) ? 1 : 0);
const candidates = list
  .filter((m) => m.id.endsWith(":free") && Object.values(m.pricing ?? {}).every((p) => Number(p) === 0) && !skip.test(m.id))
  .sort((a, b) => score(b.id) - score(a.id) || (b.context_length ?? 0) - (a.context_length ?? 0))
  .slice(0, 2);

if (process.argv.includes("--dry")) {
  console.log("Would test:", candidates.map((m) => m.id).join(", "));
  process.exit(0);
}

const passed: string[] = [];
for (const m of candidates) {
  assertFree(m.id);
  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: m.id,
      max_tokens: 300,
      reasoning: { enabled: false },
      messages: [
        { role: "system", content: `Answer only from the content, in at most 4 sentences, ending each sentence with a citation like [projects.cliniq]. Otherwise reply: ${NOT_ON_SITE}\n\n${buildContext()}` },
        { role: "user", content: "What is ClinIQ?" },
      ],
    }),
    signal: AbortSignal.timeout(8000),
  }).catch(() => null);
  const out = res?.ok ? filterCited(((await res.json().catch(() => ({}))) as { choices?: { message?: { content?: string } }[] }).choices?.[0]?.message?.content ?? "", validIds) : null;
  console.log(m.id, out && out.citations.length ? "pass" : `fail (${res ? `HTTP ${res.status}, no valid citation` : "timeout or network error"})`);
  if (out && out.citations.length) passed.push(m.id);
}
writeFileSync(new URL("../src/content/models.json", import.meta.url), JSON.stringify({ models: passed }, null, 2) + "\n");
