"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const linkCls = "inline-block rounded-sm px-2 py-1 text-sm text-text no-underline hover:bg-sunken";

/** Anchor links with scroll-spy (home page only); updates the hash without jumping. */
export function NavLinks({ items }: { items: readonly (readonly [string, string])[] }) {
  const home = usePathname() === "/";
  const [active, setActive] = useState("");

  useEffect(() => {
    if (!home) return;
    const els = items.map(([, href]) => document.getElementById(href.replace("/#", ""))).filter((e): e is HTMLElement => !!e);
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setActive(e.target.id);
            history.replaceState(null, "", `#${e.target.id}`);
          }
        }
      },
      { rootMargin: "-30% 0px -60% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [home, items]);

  return (
    <>
      {items.map(([label, href]) => {
        const on = home && active === href.replace("/#", "");
        return (
          <a key={href} href={href} className={`${linkCls} ${on ? "font-semibold text-accent" : ""}`} aria-current={on ? "location" : undefined}>
            {label}
          </a>
        );
      })}
    </>
  );
}
