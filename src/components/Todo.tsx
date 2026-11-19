export function Todo({ children }: { children: string }) {
  return <span className="inline-block rounded-sm border border-dashed border-border-strong px-1.5 text-sm text-text-muted">{children}</span>;
}
