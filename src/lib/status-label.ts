export type ServiceState = "up" | "slow" | "waking" | "down";
export type ServiceStatus = { state: ServiceState; ms: number };

/** Chip text and tone for a status; a missing status means the check is not ready. */
export function describeStatus(s?: ServiceStatus): { text: string; tone: "success" | "warning" | "muted" } {
  if (!s) return { text: "Checking status", tone: "muted" };
  if (s.state === "up") return { text: `Live · ${s.ms} ms`, tone: "success" };
  if (s.state === "slow") return { text: `Live · slow, ${s.ms} ms`, tone: "warning" };
  if (s.state === "waking") return { text: "Waking up", tone: "warning" };
  return { text: "Unreachable", tone: "muted" };
}
