"use client";

import { X } from "lucide-react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { trapTab } from "@/lib/trap-tab";
import { LinkButton } from "./Button";

const alt = "Stanford Medicine CME transcript: AI in Healthcare series, five courses, 54.5 credits, Aug 2026";

/** Opens from its button, the command palette (an event), or the #transcript hash. */
export function TranscriptDialog() {
  const ref = useRef<HTMLDialogElement>(null);
  const path = usePathname();

  useEffect(() => {
    const open = () => { if (!ref.current?.open) ref.current?.showModal(); };
    const fromHash = () => { if (location.hash === "#transcript") open(); };
    fromHash();
    window.addEventListener("open-transcript", open);
    window.addEventListener("hashchange", fromHash);
    return () => {
      window.removeEventListener("open-transcript", open);
      window.removeEventListener("hashchange", fromHash);
    };
  }, [path]);

  return (
    <>
      <button type="button" onClick={() => ref.current?.showModal()} className="rounded-sm border border-border-strong bg-surface px-3 py-1.5 text-sm font-medium text-text print:hidden">
        View transcript<span className="sr-only"> for the Stanford AI in Healthcare Specialisation</span>
      </button>
      <dialog
        ref={ref}
        aria-label="Stanford Medicine transcript"
        onClose={() => { if (location.hash === "#transcript") history.replaceState(null, "", location.pathname); }}
        onKeyDown={trapTab}
        onClick={(e) => { if (e.target === ref.current) ref.current?.close(); }}
        className="fixed inset-y-0 left-auto right-0 m-0 h-full max-h-none w-[min(760px,100vw)] max-w-none border-l border-border bg-surface p-0 text-text shadow-overlay backdrop:bg-text/30"
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between gap-2 border-b border-border px-4 py-3">
            <h2 className="text-base font-semibold">Stanford Medicine transcript</h2>
            <button type="button" onClick={() => ref.current?.close()} className="inline-flex items-center rounded-sm border border-border-strong px-2.5 py-1.5 text-sm" aria-label="Close">
              <X size={16} strokeWidth={1.5} aria-hidden="true" />
            </button>
          </div>
          <div tabIndex={0} className="flex-1 overflow-auto bg-sunken" aria-label="Transcript image, scrollable">
            <Image src="/credentials/stanford-transcript.webp" alt={alt} width={1100} height={1423} sizes="(min-width: 768px) 760px, 100vw" className="h-auto w-full" />
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border px-4 py-3">
            <p className="text-sm text-text-muted">Address removed for privacy.</p>
            <LinkButton href="/credentials/stanford-transcript.pdf" newTab>Open PDF<span className="sr-only"> of the Stanford Medicine transcript</span></LinkButton>
          </div>
        </div>
      </dialog>
    </>
  );
}
