"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/** Marks each .reveal section .is-in the first time it enters the viewport. */
export function RevealObserver() {
  const path = usePathname();
  useEffect(() => {
    const els = [...document.querySelectorAll<HTMLElement>(".reveal")];
    // Sections already on screen are shown before the hidden state applies, so nothing flashes.
    for (const el of els) if (el.getBoundingClientRect().top < window.innerHeight) el.classList.add("is-in");
    document.documentElement.classList.add("js-reveal");
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); }
    }, { rootMargin: "0px 0px -8% 0px" });
    els.filter((el) => !el.classList.contains("is-in")).forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [path]);
  return null;
}
