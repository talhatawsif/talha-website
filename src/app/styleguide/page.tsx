import type { Metadata } from "next";

export const metadata: Metadata = { title: "Styleguide", robots: { index: false, follow: false } };

const surfaces = ["bg", "surface", "sunken"] as const;
const bgClass = { bg: "bg-bg", surface: "bg-surface", sunken: "bg-sunken" } as const;
const sizes = [
  ["text-xl font-semibold", "24 px page name"],
  ["text-lg font-semibold", "18 px section heading"],
  ["text-base font-semibold", "15 px item title"],
  ["text-base", "15 px body"],
  ["text-sm", "13 px secondary"],
  ["text-xs", "12 px minimum"],
];

export default function Styleguide() {
  return (
    <main id="main" className="mx-auto max-w-page px-4 py-6 md:px-6">
      <h1 className="text-xl font-semibold">Styleguide</h1>
      <p className="text-sm text-text-muted">Token and type check. Not indexed.</p>

      {surfaces.map((s) => (
        <section key={s} className={`${bgClass[s]} mt-6 border border-border p-4`} aria-label={`Text on ${s}`}>
          <h2 className="text-lg font-semibold">On {s}</h2>
          <p>Primary text on {s}.</p>
          <p className="text-sm text-text-muted">Muted text on {s}.</p>
          <p><a href="#main">Link in accent</a></p>
          <div className="mt-2 flex flex-wrap gap-2 text-sm">
            <span className="rounded-sm bg-success-bg px-2 py-0.5 text-success">Open to work</span>
            <span className="rounded-sm bg-machine-bg px-2 py-0.5 text-machine">Built with Claude Code</span>
            <span className="rounded-sm bg-warning-bg px-2 py-0.5 text-warning">Waking up</span>
            <span className="rounded-sm bg-sunken px-2 py-0.5 font-mono text-text">FHIR R4</span>
          </div>
        </section>
      ))}

      <section className="mt-6 border border-border bg-surface p-4" aria-label="Buttons">
        <h2 className="text-lg font-semibold">Buttons</h2>
        <div className="mt-2 flex gap-2">
          <a href="#main" className="rounded-sm bg-accent px-3 py-1.5 text-sm font-medium text-on-accent no-underline">Primary</a>
          <a href="#main" className="rounded-sm border border-border-strong px-3 py-1.5 text-sm font-medium text-text no-underline">Secondary</a>
        </div>
      </section>

      <section className="mt-6 border border-border bg-surface p-4" aria-label="Type scale">
        <h2 className="text-lg font-semibold">Type</h2>
        {sizes.map(([cls, label]) => (
          <p key={label} className={cls}>{label}</p>
        ))}
        <p className="font-mono text-sm">Mono: ORU^R01 · 2025-03-01 · 1,234</p>
      </section>
    </main>
  );
}
