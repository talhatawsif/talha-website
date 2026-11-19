import Link from "next/link";
import Image from "next/image";
import { projects, type Project } from "@/content/site";
import { LinkButton } from "./Button";
import { DataTable } from "./DataTable";
import { ProjectStatus } from "./ProjectStatus";
import { Chips, MachineNote, Txt } from "./Section";
import { Hl7Explainer } from "./Hl7Explainer";

function P({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section aria-labelledby={`${id}-h`} className="reveal border-b border-border bg-surface">
      <div className="mx-auto max-w-page px-4 py-6 md:px-6">
        <h2 id={`${id}-h`} className="mb-3 text-lg font-semibold">{title}</h2>
        {children}
      </div>
    </section>
  );
}

const Bullets = ({ items }: { items: string[] }) => (
  <ul className="list-disc space-y-1.5 pl-5">
    {items.map((i) => (
      <li key={i}>{i}</li>
    ))}
  </ul>
);

function Demo({ p }: { p: Project }) {
  const v = p.videoUrl;
  const yt = v?.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([\w-]{11})/)?.[1];
  if (yt)
    return <iframe className="aspect-video w-full rounded-sm border border-border" src={`https://www.youtube-nocookie.com/embed/${yt}`} title={`${p.name} demo video`} allowFullScreen loading="lazy" />;
  if (v) return <video controls preload="metadata" className="aspect-video w-full rounded-sm border border-border" src={v} poster={p.thumbnail} />;
  return <div className="flex aspect-video w-full items-center justify-center rounded-sm border border-dashed border-border-strong bg-sunken text-text-muted">Demo video coming soon</div>;
}

export function CaseStudy({ project: p }: { project: Project }) {
  const c = p.caseStudy;
  const i = projects.findIndex((x) => x.slug === p.slug);
  const prev = projects[(i + projects.length - 1) % projects.length];
  const next = projects[(i + 1) % projects.length];
  return (
    <main id="main">
      <header className="border-b border-border bg-surface">
        <div className="mx-auto max-w-page px-4 py-5 md:px-6">
          <p className="text-sm"><Link href="/#projects">All projects</Link></p>
          <h1 className="mt-1 text-xl font-semibold" style={{ viewTransitionName: `title-${p.slug}` }}>{p.name}</h1>
          <p className="text-text-muted">{p.tagline}</p>
          <div className="mt-2 flex flex-wrap items-center gap-2"><ProjectStatus slug={p.slug} /><Chips items={p.tags} /></div>
          <div className="mt-3 flex flex-wrap gap-2">
            <LinkButton href={p.liveUrl} variant="primary" newTab>Live demo</LinkButton>
            <LinkButton href={p.codeUrl} newTab>Code</LinkButton>
          </div>
          {p.liveNote && <p className="mt-1.5 text-xs text-text-muted">{p.liveNote}</p>}
        </div>
      </header>

      <P id="problem" title="The problem"><p className="max-w-[72ch]">{c.problem}</p></P>
      <P id="demo" title="Demo"><Demo p={p} /></P>
      {p.slug === "cliniq" && <P id="explainer" title="From HL7 v2 to FHIR"><Hl7Explainer /></P>}
      <P id="features" title="What it does"><Bullets items={c.features} /></P>
      <P id="built" title="How it's built">
        <Bullets items={c.built} />
        <p className="mt-3 font-mono text-sm text-text-muted">{c.stackLine}</p>
      </P>
      <P id="hard" title="Hard problems I solved">
        <ol className="space-y-3">
          {c.hardProblems.map((h) => (
            <li key={h.title}>
              <h3 className="text-base font-semibold">{h.title}</h3>
              <p><span className="text-text-muted">What I did: </span>{h.did}</p>
              {h.why && <p><span className="text-text-muted">Why it matters: </span>{h.why}</p>}
            </li>
          ))}
        </ol>
      </P>
      <P id="results" title="Results">
        <DataTable caption={`${p.name} results`} columns={["Measure", "Result", "Note"]} rows={c.results.map((r) => [r.measure, <Txt key="r">{r.result}</Txt>, r.note])} />
      </P>
      <P id="screenshots" title="Screenshots">
        <ul className="grid gap-4 md:grid-cols-2">
          {c.screenshots.map((s) => (
            <li key={s.caption}>
              {s.src ? (
                <Image src={s.src} alt={s.alt ?? s.caption} width={1280} height={800} sizes="(min-width: 768px) 500px, 100vw" className="h-auto w-full rounded-sm border border-border" />
              ) : (
                <div className="flex aspect-video items-center justify-center rounded-sm border border-dashed border-border-strong bg-sunken text-sm text-text-muted">[TODO: screenshot]</div>
              )}
              <p className="mt-1 text-sm text-text-muted">{s.caption}</p>
            </li>
          ))}
        </ul>
      </P>
      <P id="how" title="How I built it"><MachineNote>{c.howIBuilt}</MachineNote></P>
      <P id="limits" title="Limits and what's next"><Bullets items={c.limits} /></P>

      <nav aria-label="Projects" className="mx-auto flex max-w-page flex-wrap justify-between gap-3 px-4 py-6 text-sm md:px-6">
        <Link href={`/projects/${prev.slug}`}>Previous: {prev.name}</Link>
        <Link href="/#projects">Back to all projects</Link>
        <Link href={`/projects/${next.slug}`}>Next: {next.name}</Link>
      </nav>
    </main>
  );
}
