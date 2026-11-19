import { notFound } from "next/navigation";
import { projects } from "@/content/site";
import { ogImage } from "@/lib/og-image";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Project case study";
export const generateStaticParams = () => projects.map((p) => ({ slug: p.slug }));

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = projects.find((x) => x.slug === slug);
  if (!p) notFound();
  return ogImage(p.name, p.tagline, p.caseStudy.stackLine);
}
