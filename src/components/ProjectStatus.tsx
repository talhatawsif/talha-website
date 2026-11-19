"use client";

import { useEffect, useState } from "react";
import type { Project } from "@/content/site";
import type { ServiceStatus } from "@/lib/status";

type All = Record<string, ServiceStatus | undefined>;
let shared: Promise<All> | undefined;
const load = () => (shared ??= fetch("/api/status").then((r): Promise<All> => (r.ok ? r.json() : Promise.resolve({}))).catch((): All => ({})));

const chip = "rounded-sm px-2 py-0.5 text-xs tabular-nums print:hidden";

export function ProjectStatus({ slug }: { slug: Project["slug"] }) {
  const [s, setS] = useState<ServiceStatus | undefined>();
  useEffect(() => {
    let live = true;
    load().then((all) => live && setS(all[slug]));
    return () => { live = false; };
  }, [slug]);

  if (!s) return <span className={`${chip} bg-sunken text-text-muted`}>Status unknown</span>;
  if (s.state === "up") return <span className={`${chip} bg-success-bg text-success`}>Live · {s.ms} ms</span>;
  if (s.state === "slow") return <span className={`${chip} bg-warning-bg text-warning`}>Live · slow, {s.ms} ms</span>;
  if (s.state === "waking") return <span className={`${chip} bg-warning-bg text-warning`}>Waking up</span>;
  return <span className={`${chip} bg-sunken text-text-muted`}>Unreachable</span>;
}
