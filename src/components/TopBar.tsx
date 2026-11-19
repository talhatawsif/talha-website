import Link from "next/link";
import { Download } from "lucide-react";
import { profile } from "@/content/site";
import { hasCv } from "@/lib/cv";
import { LinkButton } from "./Button";

export const navItems = [
  ["Projects", "/#projects"],
  ["Experience", "/#experience"],
  ["Education", "/#education"],
  ["Skills", "/#skills"],
  ["Contact", "/#contact"],
] as const;

const linkCls = "rounded-sm px-2 py-1 text-sm text-text no-underline hover:bg-sunken";

export function TopBar() {
  const cv = hasCv();
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-surface">
      <div className="mx-auto flex h-12 max-w-page items-center justify-between gap-3 px-4 md:px-6">
        <Link href="/" className="font-semibold text-text no-underline">{profile.name}</Link>
        <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
          {navItems.map(([label, href]) => (
            <a key={href} href={href} className={linkCls}>{label}</a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          {cv && (
            <LinkButton href={profile.cvUrl} variant="primary" download>
              <Download size={16} strokeWidth={1.5} aria-hidden="true" />
              Download CV
            </LinkButton>
          )}
          <details className="relative md:hidden">
            <summary className="cursor-pointer rounded-sm border border-border-strong px-3 py-1.5 text-sm">Menu</summary>
            <nav aria-label="Main (menu)" className="absolute right-0 mt-1 flex w-44 flex-col border border-border bg-surface p-1 shadow-overlay">
              {navItems.map(([label, href]) => (
                <a key={href} href={href} className={linkCls}>{label}</a>
              ))}
            </nav>
          </details>
        </div>
      </div>
    </header>
  );
}
