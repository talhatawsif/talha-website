"use client";

import { useRef, type ReactNode } from "react";

/** Plain <details> disclosure that closes after a link is chosen. */
export function MobileMenu({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDetailsElement>(null);
  return (
    <details ref={ref} className="relative md:hidden" onClick={(e) => { if ((e.target as HTMLElement).closest("a")) ref.current?.removeAttribute("open"); }}>
      <summary className="cursor-pointer rounded-sm border border-border-strong px-3 py-1.5 text-sm">Menu</summary>
      {children}
    </details>
  );
}
