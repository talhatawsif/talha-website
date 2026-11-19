import type { ReactNode } from "react";
import { isTodo } from "@/content/site";
import { Todo } from "./Todo";

export function Section({ id, title, children, noPrint }: { id: string; title: string; children: ReactNode; noPrint?: boolean }) {
  return (
    <section id={id} aria-labelledby={`${id}-h`} className={`reveal border-b border-border bg-surface ${noPrint ? "print:hidden" : ""}`}>
      <div className="mx-auto max-w-page px-4 py-6 md:px-6">
        <h2 id={`${id}-h`} className="mb-3 text-lg font-semibold">{title}</h2>
        {children}
      </div>
    </section>
  );
}

/** Text, or a dashed placeholder when the value is a [TODO…]. */
export function Txt({ children }: { children: string }) {
  return isTodo(children) ? <Todo>{children}</Todo> : <>{children}</>;
}

export function MachineNote({ children }: { children: ReactNode }) {
  return <p className="rounded-sm bg-machine-bg px-3 py-2 text-sm text-machine">{children}</p>;
}

export function Chips({ items, mono = true }: { items: string[]; mono?: boolean }) {
  return (
    <ul className="flex flex-wrap gap-1.5">
      {items.map((t) => (
        <li key={t} className={`rounded-sm bg-sunken px-2 py-0.5 text-xs ${mono ? "font-mono" : ""}`}>{t}</li>
      ))}
    </ul>
  );
}
