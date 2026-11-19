import { institutions, type InstitutionId } from "@/content/site";

/** 24 px-high logo on a white tile; initials tile when no logo file exists. */
export function InstitutionLogo({ id }: { id: InstitutionId }) {
  const i = institutions[id];
  return (
    <span className="inline-flex h-8 min-w-8 shrink-0 items-center justify-center rounded-sm border border-border bg-white px-1 align-middle">
      {i.logo ? (
        // eslint-disable-next-line @next/next/no-img-element -- tiny fixed-height logo; sizes are explicit
        <img src={i.logo} alt={i.name} height={24} width={Math.round(24 * (i.ratio ?? 1))} className="h-6 w-auto" />
      ) : (
        <span className="font-mono text-xs font-medium text-neutral-700" role="img" aria-label={i.name}>{i.initials}</span>
      )}
    </span>
  );
}
