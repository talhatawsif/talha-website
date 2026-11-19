import type { Project } from "@/content/site";

export function ProjectStatus({ slug }: { slug: Project["slug"] }) {
  void slug;
  return <span className="rounded-sm bg-sunken px-2 py-0.5 text-xs text-text-muted">Status unknown</span>;
}
