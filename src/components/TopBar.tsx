import Link from "next/link";
import { Download } from "lucide-react";
import { profile } from "@/content/site";
import { LinkButton } from "./Button";
import { CommandPalette } from "./CommandPalette";
import { MobileMenu } from "./MobileMenu";
import { NavLinks } from "./NavLinks";
import { ThemeToggle } from "./theme";

export const navItems = [
  ["Projects", "/#projects"],
  ["Experience", "/#experience"],
  ["Education", "/#education"],
  ["Skills", "/#skills"],
  ["Contact", "/#contact"],
] as const;

const linkCls = "inline-block rounded-sm px-2 py-1 text-sm text-text no-underline hover:bg-sunken";

export function TopBar() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-surface print:hidden">
      <div className="mx-auto flex h-12 max-w-page items-center justify-between gap-3 px-4 md:px-6">
        <Link href="/" className="inline-block py-1 font-semibold text-text no-underline">{profile.name}</Link>
        <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
          <NavLinks items={navItems} />
        </nav>
        <div className="flex items-center gap-2">
          <CommandPalette />
          <ThemeToggle />
                      <LinkButton href={profile.cvUrl} variant="primary" download>
              <Download size={16} strokeWidth={1.5} aria-hidden="true" />
              Download CV
            </LinkButton>
          <MobileMenu>
            <nav aria-label="Main (menu)" className="absolute right-0 mt-1 flex w-44 flex-col border border-border bg-surface p-1 shadow-overlay">
              {navItems.map(([label, href]) => (
                <a key={href} href={href} className={linkCls}>{label}</a>
              ))}
            </nav>
          </MobileMenu>
        </div>
      </div>
    </header>
  );
}
