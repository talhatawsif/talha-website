"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useSyncExternalStore } from "react";

export type Theme = "system" | "light" | "dark";
const next: Record<Theme, Theme> = { system: "light", light: "dark", dark: "system" };

const subscribe = (cb: () => void) => {
  const mo = new MutationObserver(cb);
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => mo.disconnect();
};
const read = (): Theme => (document.documentElement.dataset.theme as Theme | undefined) ?? "system";

export function setTheme(t: Theme) {
  const root = document.documentElement;
  if (t === "system") delete root.dataset.theme;
  else root.dataset.theme = t;
  try {
    if (t === "system") localStorage.removeItem("theme");
    else localStorage.setItem("theme", t);
  } catch {}
}

export function useTheme() {
  const theme = useSyncExternalStore(subscribe, read, () => "system" as Theme);
  return { theme, cycle: () => setTheme(next[theme]) };
}

const icons = { system: Monitor, light: Sun, dark: Moon };

export function ThemeToggle() {
  const { theme, cycle } = useTheme();
  const Icon = icons[theme];
  return (
    <button type="button" onClick={cycle} className="inline-flex h-8 w-8 items-center justify-center rounded-sm border border-border-strong text-text" aria-label={`Theme: ${theme}. Switch to ${next[theme]}`}>
      <Icon size={16} strokeWidth={1.5} aria-hidden="true" />
    </button>
  );
}
