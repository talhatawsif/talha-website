import { afterEach, describe, expect, it, vi } from "vitest";

describe("POST /api/ask", () => {
  afterEach(() => vi.unstubAllGlobals());
  it("returns the answering model in x-assistant-model, not in the body", async () => {
    vi.stubEnv("OPENROUTER_API_KEY", "test-key");
    vi.stubGlobal("fetch", vi.fn(async () => new Response(JSON.stringify({ model: "google/gemma:free", usage: { cost: 0 }, choices: [{ message: { content: "He studies IT [profile]." } }] }))));
    vi.spyOn(console, "log").mockImplementation(() => {});
    const { POST } = await import("@/app/api/ask/route");
    const res = await POST(new Request("http://x/api/ask", { method: "POST", body: JSON.stringify({ question: "What are his hobbies?" }), headers: { "x-forwarded-for": "11.0.0.1" } }));
    expect(res.headers.get("x-assistant-model")).toBe("google/gemma:free");
    expect(res.headers.get("x-assistant-reason")).toBe("model_ok");
    expect(await res.json()).toMatchObject({ status: "ok" });
  });
  it("sets x-assistant-reason: scripted for a scripted answer", async () => {
    const { POST } = await import("@/app/api/ask/route");
    const res = await POST(new Request("http://x/api/ask", { method: "POST", body: JSON.stringify({ question: "What is PawLift?" }), headers: { "x-forwarded-for": "11.0.0.2" } }));
    expect(res.headers.get("x-assistant-reason")).toBe("scripted");
    expect(res.headers.get("x-assistant-model")).toBeNull();
  });
});
