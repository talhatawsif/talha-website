import Link from "next/link";
import { ViewTransition } from "react";
import { Download, Mail } from "lucide-react";
import { atAGlance, certifications, claudeNote, contact, education, experience, profile, projects, skills, summary } from "@/content/site";
import { LinkButton } from "./Button";
import { DataTable } from "./DataTable";
import { InstitutionLogo } from "./InstitutionLogo";
import { TranscriptDialog } from "./TranscriptDialog";
import { ProjectThumb } from "./ProjectThumb";
import { Chips, MachineNote, Section, Txt } from "./Section";
import { ProjectStatus } from "./ProjectStatus";

export function SummarySection() {
  return (
    <Section id="summary" title="Summary">
      <div className="max-w-[72ch] space-y-3">
        {summary.map((p) => (
          <p key={p}>{p}</p>
        ))}
      </div>
      <h3 className="mb-2 mt-5 text-base font-semibold">At a glance</h3>
      <dl className="grid gap-x-8 gap-y-2 md:grid-cols-2">
        {atAGlance.map((a) => (
          <div key={a.label}>
            <dt className="text-xs text-text-muted">{a.label}</dt>
            <dd className="text-[14px]">{a.value}</dd>
          </div>
        ))}
      </dl>
    </Section>
  );
}

export function ProjectsSection() {
  return (
    <Section id="projects" title="Projects">
      <ul className="divide-y divide-border border-y border-border">
        {projects.map((p) => (
          <li key={p.slug} className="grid gap-4 py-4 md:grid-cols-[240px_1fr]">
            <Link href={`/projects/${p.slug}`} aria-label={`${p.name} case study`} tabIndex={-1} className="print:hidden">
              <ProjectThumb project={p} />
            </Link>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <ViewTransition name={`title-${p.slug}`} share="morph" default="none"><h3 className="text-base font-semibold">{p.name}</h3></ViewTransition>
                <ProjectStatus slug={p.slug} />
              </div>
              <p className="text-sm text-text-muted">{p.tagline}</p>
              <p className="mt-1">{p.summary}</p>
              <div className="mt-2"><Chips items={p.tags} /></div>
              <div className="mt-3 flex flex-wrap gap-2">
                <LinkButton href={`/projects/${p.slug}`}>Case study<span className="sr-only"> for {p.name}</span></LinkButton>
                <LinkButton href={p.liveUrl} newTab>Live demo<span className="sr-only"> of {p.name}</span></LinkButton>
                <LinkButton href={p.codeUrl} newTab>Code<span className="sr-only"> for {p.name}</span></LinkButton>
              </div>
              {p.liveNote && <p className="mt-1.5 text-xs text-text-muted">{p.liveNote}</p>}
            </div>
          </li>
        ))}
      </ul>
      <div className="mt-4"><MachineNote>{claudeNote}</MachineNote></div>
    </Section>
  );
}

export function ExperienceSection() {
  return (
    <Section id="experience" title="Experience">
      <DataTable
        caption="Work experience, newest first"
        columns={["Dates", "Role", "Organisation", "What I did"]}
        rows={experience.map((e) => [e.dates, e.role, e.organisation, e.did])}
      />
    </Section>
  );
}

export function EducationSection() {
  return (
    <Section id="education" title="Education">
      <DataTable
        caption="Education"
        columns={["Dates", "Qualification", "Institution", "Notes"]}
        rows={education.map((e) => [
          e.dates,
          e.qualification,
          <span key="i" className="flex items-start gap-2"><InstitutionLogo id={e.institution} /><span>{e.institutionLabel}</span></span>,
          <Txt key="n">{e.notes}</Txt>,
        ])}
      />
    </Section>
  );
}

export function CertificationsSection() {
  return (
    <Section id="certifications" title="Certifications">
      {certifications.map((c) => (
        <div key={c.name} className="flex gap-3">
          <InstitutionLogo id={c.institution} />
          <div>
            <h3 className="text-base font-semibold">{c.name}</h3>
            <p className="text-sm text-text-muted">{c.issuer}, {c.date}</p>
            <p className="mt-1 text-sm">Five courses: {c.courses.join("; ")}.</p>
            <div className="mt-2"><TranscriptDialog /></div>
          </div>
        </div>
      ))}
    </Section>
  );
}

export function SkillsSection() {
  return (
    <Section id="skills" title="Skills">
      <dl className="space-y-3">
        {skills.map((g) => (
          <div key={g.group}>
            <dt className="mb-1 text-sm font-medium">{g.group}</dt>
            <dd><Chips items={g.items} /></dd>
          </div>
        ))}
      </dl>
    </Section>
  );
}

export function ContactSection() {
  return (
    <Section id="contact" title="Contact">
      <p className="max-w-[72ch]">{contact.text}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        <LinkButton href={profile.linkedin}>LinkedIn</LinkButton>
        <LinkButton href={profile.github}>GitHub</LinkButton>
        <LinkButton href={`mailto:${profile.email}`}><Mail size={16} strokeWidth={1.5} aria-hidden="true" />Email</LinkButton>
                  <LinkButton href={profile.cvUrl} variant="primary" download><Download size={16} strokeWidth={1.5} aria-hidden="true" />Download CV</LinkButton>
      </div>
    </Section>
  );
}
