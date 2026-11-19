import models from "@/content/models.json";
import { askAssistant, isResting, MAX_QUESTION } from "@/lib/assistant/ask";

const config = () => ({ key: process.env.OPENROUTER_API_KEY, models: models.models.slice(0, 2) });
const noStore = { headers: { "Cache-Control": "no-store" } };

/** Tells the panel whether to show the question box. Never exposes the key. */
export async function GET() {
  const { key, models: m } = config();
  return Response.json({ available: !!key && m.length > 0, resting: isResting() }, noStore);
}

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as { question?: unknown } | null;
  const q = typeof body?.question === "string" ? body.question.slice(0, MAX_QUESTION + 1) : "";
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown";
  try {
    const { model, reason, ...result } = await askAssistant(q, ip, config());
    return Response.json(result, { headers: { "Cache-Control": "no-store", "x-assistant-reason": reason, ...(model ? { "x-assistant-model": model } : {}) } });
  } catch {
    return Response.json({ status: "error", text: "The assistant could not answer just now. Please email me.", citations: [] }, { headers: { "Cache-Control": "no-store", "x-assistant-reason": "error" } });
  }
}
