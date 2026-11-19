import { cacheLife } from "next/cache";
import { projects } from "@/content/site";

import type { ServiceState, ServiceStatus } from "./status-label";

export type { ServiceState, ServiceStatus };

async function probe(url: string): Promise<ServiceStatus & { ok: boolean }> {
  const t0 = Date.now();
  try {
    const res = await fetch(url, { method: "GET", redirect: "follow", signal: AbortSignal.timeout(4000), cache: "no-store" });
    const ms = Date.now() - t0;
    if (!res.ok) return { ok: false, state: res.status >= 500 ? "waking" : "down", ms };
    return { ok: true, state: ms > 2000 ? "slow" : "up", ms };
  } catch (e) {
    const timedOut = e instanceof Error && (e.name === "TimeoutError" || e.name === "AbortError");
    return { ok: false, state: timedOut ? "waking" : "down", ms: Date.now() - t0 };
  }
}

/** Checked server-side, cached and revalidated every 5 minutes. Never throws. */
export async function getStatuses(): Promise<Record<string, ServiceStatus>> {
  "use cache";
  cacheLife({ stale: 300, revalidate: 300, expire: 3600 });
  const entries = await Promise.all(
    projects.map(async (p) => {
      // ClinIQ has its own health endpoint; use it only if it answers without auth.
      let r = p.slug === "cliniq" ? await probe(`${p.liveUrl}/api/health`) : undefined;
      if (!r?.ok) r = await probe(p.liveUrl);
      return [p.slug, { state: r.state, ms: r.ms }] as const;
    }),
  );
  return Object.fromEntries(entries);
}
