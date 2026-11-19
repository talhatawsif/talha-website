"use client";

import { Command } from "cmdk";
import { Command as CommandIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { profile, projects } from "@/content/site";
import { setTheme, useTheme } from "./theme";

const sections = [
  ["Summary", "summary"],
  ["Projects", "projects"],
  ["Experience", "experience"],
  ["Education", "education"],
  ["Skills", "skills"],
  ["Certifications", "certifications"],
  ["Contact", "contact"],
] as const;

const itemCls = "flex cursor-pointer items-center justify-between rounded-sm px-3 py-2 text-sm data-[selected=true]:bg-sunken";

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [notice, setNotice] = useState("");
  const router = useRouter();
  const { cycle } = useTheme();
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      const typing = t.closest("input, textarea, select, [contenteditable]");
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      } else if (e.key === "/" && !typing && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        setOpen(true);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const run = useCallback((fn: () => void) => { setOpen(false); fn(); }, []);
  const go = (path: string) => run(() => router.push(path));
  const ext = (url: string) => run(() => window.open(url, "_blank", "noopener"));
  const tell = (m: string) => { setNotice(m); clearTimeout(timer.current); timer.current = setTimeout(() => setNotice(""), 2500); };

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} aria-label="Open command palette" aria-keyshortcuts="Control+K Meta+K" className="hidden h-8 items-center gap-1 rounded-sm border border-border-strong px-2 font-mono text-xs text-text-muted sm:inline-flex">
        <CommandIcon size={16} strokeWidth={1.5} aria-hidden="true" />K
      </button>
      <p role="status" className="sr-only">{notice}</p>
      <Command.Dialog open={open} onOpenChange={setOpen} label="Command palette" overlayClassName="fixed inset-0 z-50 bg-text/30" contentClassName="fixed left-1/2 top-24 z-50 w-[min(560px,calc(100vw-32px))] -translate-x-1/2 rounded-lg border border-border bg-surface shadow-overlay">
        <Command.Input placeholder="Search sections, projects and links" className="w-full border-b border-border bg-transparent px-3 py-3 text-base outline-none" />
        <Command.List className="max-h-80 overflow-y-auto p-1">
          <Command.Empty className="px-3 py-4 text-sm text-text-muted">No matches.</Command.Empty>
          <Command.Group heading="Sections" className="text-xs text-text-muted [&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-1">
            {sections.map(([label, id]) => (
              <Command.Item key={id} value={`Section ${label}`} className={itemCls} onSelect={() => run(() => { if (location.pathname === "/") { document.getElementById(id)?.scrollIntoView(); history.replaceState(null, "", `#${id}`); } else router.push(`/#${id}`); })}>{label}</Command.Item>
            ))}
          </Command.Group>
          <Command.Group heading="Projects" className="text-xs text-text-muted [&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-1">
            {projects.map((p) => (
              <Command.Item key={p.slug} value={`Case study ${p.name}`} className={itemCls} onSelect={() => go(`/projects/${p.slug}`)}>
                {p.name} case study<span className="text-xs text-text-muted">{p.tagline}</span>
              </Command.Item>
            ))}
            {projects.map((p) => (
              <Command.Item key={`live-${p.slug}`} value={`Live demo ${p.name}`} className={itemCls} onSelect={() => ext(p.liveUrl)}>{p.name} live demo</Command.Item>
            ))}
          </Command.Group>
          <Command.Group heading="Links" className="text-xs text-text-muted [&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-1">
            <Command.Item value="LinkedIn" className={itemCls} onSelect={() => run(() => { location.href = profile.linkedin; })}>LinkedIn</Command.Item>
            <Command.Item value="GitHub" className={itemCls} onSelect={() => run(() => { location.href = profile.github; })}>GitHub</Command.Item>
            <Command.Item value="View transcript Stanford Medicine" className={itemCls} onSelect={() => run(() => { if (location.pathname === "/") setTimeout(() => window.dispatchEvent(new Event("open-transcript")), 50); else router.push("/#transcript"); })}>View transcript</Command.Item>
            <Command.Item value="Email" className={itemCls} onSelect={() => run(() => { location.href = `mailto:${profile.email}`; })}>Email</Command.Item>
            <Command.Item value="Download CV" className={itemCls} onSelect={() => run(() => { location.href = profile.cvUrl; })}>Download CV</Command.Item>
          </Command.Group>
          <Command.Group heading="Actions" className="text-xs text-text-muted [&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-1">
            <Command.Item value="Ask about my work" className={itemCls} onSelect={() => run(() => { if (location.pathname === "/") { document.getElementById("ask")?.scrollIntoView(); document.getElementById("ask-input")?.focus({ preventScroll: true }); } else router.push("/#ask"); })}>Ask about my work</Command.Item>
            <Command.Item value="Copy email" className={itemCls} onSelect={async () => { setOpen(false); try { await navigator.clipboard.writeText(profile.email); tell("Email copied"); } catch { tell("Could not copy. Email is " + profile.email); } }}>Copy email</Command.Item>
            <Command.Item value="Toggle theme" className={itemCls} onSelect={() => { setOpen(false); cycle(); }}>Toggle theme</Command.Item>
            <Command.Item value="Use system theme" className={itemCls} onSelect={() => run(() => setTheme("system"))}>Use system theme</Command.Item>
          </Command.Group>
        </Command.List>
      </Command.Dialog>
    </>
  );
}
