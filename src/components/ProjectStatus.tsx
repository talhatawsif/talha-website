import type { Project } from "@/content/site";
import { describeStatus, type ServiceStatus } from "@/lib/status-label";
import { getStatuses } from "@/lib/status";

const tones = { success: "bg-success-bg text-success", warning: "bg-warning-bg text-warning", muted: "bg-sunken text-text-muted" };

/** Rendered on the server from the cached status check (revalidated every 5 minutes), so the HTML already has it. */
export async function ProjectStatus({ slug }: { slug: Project["slug"] }) {
  const all: Record<string, ServiceStatus | undefined> = await getStatuses().catch(() => ({}));
  const { text, tone } = describeStatus(all[slug]);
  return <span className={`rounded-sm px-2 py-0.5 text-xs tabular-nums print:hidden ${tones[tone]}`}>{text}</span>;
}
