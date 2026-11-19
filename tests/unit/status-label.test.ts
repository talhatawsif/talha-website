import { describe, expect, it } from "vitest";
import { describeStatus } from "@/lib/status-label";

describe("describeStatus", () => {
  it.each([
    [{ state: "up", ms: 240 }, "Live · 240 ms", "success"],
    [{ state: "slow", ms: 2500 }, "Live · slow, 2500 ms", "warning"],
    [{ state: "waking", ms: 4000 }, "Waking up", "warning"],
    [{ state: "down", ms: 10 }, "Unreachable", "muted"],
    [undefined, "Checking status", "muted"],
  ] as const)("%j", (s, text, tone) => expect(describeStatus(s as never)).toEqual({ text, tone }));
});
