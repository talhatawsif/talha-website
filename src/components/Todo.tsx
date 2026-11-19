import { showTodos } from "@/content/site";

/** Visible placeholder in development only. */
export function Todo({ children }: { children: string }) {
  if (!showTodos) return null;
  return <span className="inline-block rounded-sm border border-dashed border-border-strong px-1.5 text-sm text-text-muted">{children}</span>;
}
