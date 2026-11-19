import Image from "next/image";
import { institutions, type InstitutionId } from "@/content/site";

/** Decorative: the institution's name always sits in the text beside it. 24 px-high logo on a white tile, or initials. */
export function InstitutionLogo({ id }: { id: InstitutionId }) {
  const i = institutions[id];
  return (
    <span aria-hidden="true" className="inline-flex h-8 min-w-8 shrink-0 items-center justify-center rounded-sm border border-border bg-tile px-1 align-middle">
      {i.logo ? (
        <Image src={i.logo} alt="" height={24} width={Math.round(24 * (i.ratio ?? 1))} className="h-6 w-auto" />
      ) : (
        <span className="font-mono text-xs font-medium text-tile-text">{i.initials}</span>
      )}
    </span>
  );
}
