"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/** Marks each .reveal section .is-in the first time it is seen. A section is never left hidden: anything on screen,
 *  above the viewport or named by the URL hash is revealed at once, and the rest start a little before they enter. */
export function RevealObserver() {
  const path = usePathname();
  useEffect(() => {
    const els = [...document.querySelectorAll<HTMLElement>(".reveal")];
    const show = (el: Element | null | undefined) => el?.classList.add("is-in");
    const fromHash = () => show(document.getElementById(decodeURIComponent(location.hash.slice(1)))?.closest(".reveal"));

    // Before the hidden state applies, so nothing flashes.
    for (const el of els) if (el.getBoundingClientRect().top < window.innerHeight) show(el);
    fromHash();
    document.documentElement.classList.add("js-reveal");

    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        // Also catch up anything the viewport has already passed (fast scrolling, jumps), so nothing stays hidden above.
        for (const el of els) if (el.getBoundingClientRect().top < window.innerHeight * 1.15) { show(el); io.unobserve(el); }
      },
      { rootMargin: "0px 0px 15% 0px" },
    );
    els.filter((el) => !el.classList.contains("is-in")).forEach((el) => io.observe(el));
    window.addEventListener("hashchange", fromHash);
    return () => {
      io.disconnect();
      window.removeEventListener("hashchange", fromHash);
    };
  }, [path]);
  return null;
}
