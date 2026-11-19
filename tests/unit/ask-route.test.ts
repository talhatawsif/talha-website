import { afterEach, describe, expect, it, vi } from "vitest";

describe("POST /api/ask", () => {
  afterEach(() => vi.unstubAllGlobals());
  it("returns the answering model in x-assistant-model, not in the body", async () => {
    vi.stubEnv("OPENROUTER_API_KEY", "test-key");
    vi.stubGlobal("fetch", vi.fn(async () => new Response(JSON.stringify({ model: "google/gemma:free", usage: { cost: 0 }, choices: [{ message: { content: "He studies IT [profile]." } }] }))));
    vi.spyOn(console, "log").mockImplementation(() => {});
    const { POST } = await import("@/app/api/ask/route");
    const res = await POST(new Request("http://x/api/ask", { method: "POST", body: JSON.stringify({ question: "Where does he study?" }), headers: { "x-forwarded-for": "11.0.0.1" } }));
    expect(res.headers.get("x-assistant-model")).toBe("google/gemma:free");
    expect(await res.json()).toMatchObject({ status: "ok" });
  });
});
