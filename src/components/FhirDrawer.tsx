"use client";

import { Check, Copy, X } from "lucide-react";
import { Fragment, useRef, useState } from "react";

const token = /("(?:\\.|[^"\\])*")(\s*:)?|\b(true|false|null)\b|(-?\d+(?:\.\d+)?)/g;

function highlight(json: string) {
  const out: React.ReactNode[] = [];
  let last = 0;
  for (const m of json.matchAll(token)) {
    out.push(json.slice(last, m.index));
    const cls = m[1] ? (m[2] ? "text-accent" : "text-success") : "text-machine";
    out.push(m[1] && m[2] ? <Fragment key={m.index}><span className={cls}>{m[1]}</span>{m[2]}</Fragment> : <span key={m.index} className={cls}>{m[0]}</span>);
    last = m.index + m[0].length;
  }
  out.push(json.slice(last));
  return out;
}

export function FhirDrawer({ json }: { json: string }) {
  const ref = useRef<HTMLDialogElement>(null);
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(json);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };
  return (
    <>
      <button type="button" onClick={() => ref.current?.showModal()} className="rounded-sm border border-border-strong px-2 py-0.5 font-mono text-xs text-text print:hidden">
        View as FHIR
      </button>
      <dialog
        ref={ref}
        aria-label="Profile as a FHIR Practitioner resource"
        onClick={(e) => { if (e.target === ref.current) ref.current?.close(); }}
        className="fixed inset-y-0 left-auto right-0 m-0 h-full max-h-none w-[min(560px,100vw)] max-w-none border-l border-border bg-surface p-0 text-text shadow-overlay backdrop:bg-text/30"
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between gap-2 border-b border-border px-4 py-3">
            <div>
              <h2 className="text-base font-semibold">Profile as FHIR</h2>
              <p className="text-xs text-text-muted">Practitioner, FHIR R4. Built from the same content as this page.</p>
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={copy} className="inline-flex items-center gap-1.5 rounded-sm border border-border-strong px-2.5 py-1.5 text-sm">
                {copied ? <Check size={16} strokeWidth={1.5} aria-hidden="true" /> : <Copy size={16} strokeWidth={1.5} aria-hidden="true" />}
                {copied ? "Copied" : "Copy"}
              </button>
              <button type="button" onClick={() => ref.current?.close()} className="inline-flex items-center gap-1.5 rounded-sm border border-border-strong px-2.5 py-1.5 text-sm" aria-label="Close">
                <X size={16} strokeWidth={1.5} aria-hidden="true" />
              </button>
            </div>
          </div>
          <pre tabIndex={0} className="flex-1 overflow-auto bg-sunken p-4 font-mono text-xs leading-relaxed" aria-label="FHIR JSON"><code>{highlight(json)}</code></pre>
        </div>
      </dialog>
    </>
  );
}
