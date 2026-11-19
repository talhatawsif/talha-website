import Image from "next/image";
import { Mail } from "lucide-react";
import { profile } from "@/content/site";
import { buildPractitioner } from "@/lib/fhir";
import { FhirDrawer } from "./FhirDrawer";
import { InstitutionLogo } from "./InstitutionLogo";
import { LinkButton } from "./Button";

const facts = [
  ["Location", profile.location],
  ["Studying", profile.studying],
  ["Available", profile.available],
  ["Languages", profile.languages],
] as const;

export function IdentityBanner() {
  return (
    <section id="profile" aria-label="Identity" className="border-y border-border bg-surface">
      <div className="mx-auto flex max-w-page flex-wrap gap-4 px-4 py-4 md:px-6">
        <Image src={profile.photo} alt="Talha Tawsif" width={96} height={96} priority className="h-24 w-24 rounded-sm border border-border object-cover" />
        <div className="min-w-0 flex-1 basis-72">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <h1 className="text-xl font-semibold leading-tight">{profile.name}</h1>
            <span className="rounded-sm bg-success-bg px-2 py-0.5 text-sm font-medium text-success">Open to work</span>
            <FhirDrawer json={JSON.stringify(buildPractitioner(), null, 2)} />
          </div>
          <p className="text-text-muted">{profile.role}</p>
          <dl className="mt-3 grid gap-x-6 gap-y-2 sm:grid-cols-2">
            {facts.map(([label, value]) => (
              <div key={label}>
                <dt className="text-xs text-text-muted">{label}</dt>
                <dd className="flex items-center gap-2 text-[14px]">
                  {label === "Studying" && <InstitutionLogo id={profile.studyingInstitution} />}
                  <span>{value}</span>
                </dd>
              </div>
            ))}
          </dl>
          <div className="mt-3 flex flex-wrap gap-2">
            <LinkButton href={profile.linkedin}>LinkedIn</LinkButton>
            <LinkButton href={profile.github}>GitHub</LinkButton>
            <LinkButton href={`mailto:${profile.email}`}>
              <Mail size={16} strokeWidth={1.5} aria-hidden="true" />
              Email
            </LinkButton>
          </div>
        </div>
      </div>
    </section>
  );
}
