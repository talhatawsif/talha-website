import { ExternalLink } from "lucide-react";
import type { ReactNode } from "react";

const base = "inline-flex items-center gap-1.5 rounded-sm px-3 py-1.5 text-sm font-medium no-underline";
const styles = {
  primary: `${base} bg-accent text-on-accent`,
  secondary: `${base} border border-border-strong text-text bg-surface`,
};

export function LinkButton({ href, variant = "secondary", children, newTab, download }: { href: string; variant?: keyof typeof styles; children: ReactNode; newTab?: boolean; download?: boolean }) {
  return (
    <a href={href} className={styles[variant]} {...(newTab ? { target: "_blank", rel: "noopener" } : {})} {...(download ? { download: true } : {})}>
      {children}
      {newTab && (
        <>
          <ExternalLink size={16} strokeWidth={1.5} aria-hidden="true" />
          <span className="sr-only">(opens in new tab)</span>
        </>
      )}
    </a>
  );
}
