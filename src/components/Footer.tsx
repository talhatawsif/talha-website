import { footer } from "@/content/site";

export function Footer() {
  return (
    <footer className="mt-8 border-t border-border">
      <div className="mx-auto flex max-w-page flex-wrap justify-between gap-2 px-4 py-6 text-sm text-text-muted md:px-6">
        <p>{footer.left}</p>
        <p>{footer.right}</p>
      </div>
    </footer>
  );
}
