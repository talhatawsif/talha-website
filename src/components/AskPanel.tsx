"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { profile } from "@/content/site";
import { citationHref } from "@/lib/assistant/context";
import { MachineNote, Section } from "./Section";

type Reply = { status: string; text: string; citations: string[] };
const MAX = 400;

function Answer({ r }: { r: Reply }) {
  // Turn [section.id] markers into links that scroll to the section.
  const parts = r.text.split(/(\[[a-z][a-z0-9.-]*\])/g);
  return (
    <p className="mt-3 max-w-[72ch]" role="status">
      {parts.map((p, i) => {
        const id = p.match(/^\[(.+)\]$/)?.[1];
        return id && r.citations.includes(id) ? <Link key={i} href={citationHref(id)} className="font-mono text-xs">[{id}]</Link> : <span key={i}>{p}</span>;
      })}
    </p>
  );
}

export function AskPanel() {
  const [state, setState] = useState<"loading" | "on" | "off" | "resting">("loading");
  const [q, setQ] = useState("");
  const [busy, setBusy] = useState(false);
  const [reply, setReply] = useState<Reply | null>(null);

  useEffect(() => {
    fetch("/api/ask", { cache: "no-store" })
      .then((r) => r.json())
      .then((d: { available: boolean; resting: boolean }) => setState(d.resting ? "resting" : d.available ? "on" : "off"))
      .catch(() => setState("off"));
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!q.trim() || busy) return;
    setBusy(true);
    try {
      const res = await fetch("/api/ask", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ question: q }) });
      const r: Reply = await res.json();
      setReply(r);
      if (r.status === "resting") setState("resting");
      if (r.status === "unavailable") setState("off");
    } catch {
      setReply({ status: "error", text: "The assistant could not answer just now. Please email me.", citations: [] });
    }
    setBusy(false);
  }

  const direct = (
    <p>Ask me directly: <a href={`mailto:${profile.email}`}>{profile.email}</a></p>
  );

  return (
    <Section id="ask" title="Ask about my work" noPrint>
      {state === "off" && direct}
      {state === "resting" && <p>The assistant is resting. Please email me instead: <a href={`mailto:${profile.email}`}>{profile.email}</a></p>}
      {state === "loading" && <p className="text-sm text-text-muted">Checking the assistant.</p>}
      {state === "on" && (
        <form onSubmit={submit} className="max-w-[72ch]">
          <label htmlFor="ask-input" className="mb-1 block text-sm font-medium">Your question</label>
          <textarea id="ask-input" value={q} onChange={(e) => setQ(e.target.value)} maxLength={MAX} rows={2} className="w-full rounded-sm border border-border-strong bg-surface p-2" />
          <div className="mt-2 flex items-center gap-3">
            <button type="submit" disabled={busy || !q.trim()} className="rounded-sm bg-accent px-3 py-1.5 text-sm font-medium text-on-accent disabled:opacity-60">{busy ? "Thinking" : "Ask"}</button>
            <span className="text-xs text-text-muted tabular-nums">{q.length} / {MAX}</span>
          </div>
          {reply && <Answer r={reply} />}
        </form>
      )}
      <div className="mt-4"><MachineNote>Answers come from this site only, using a free AI model. It can make mistakes.</MachineNote></div>
    </Section>
  );
}
