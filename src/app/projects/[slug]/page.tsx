import { notFound } from "next/navigation";
import { CaseStudy } from "@/components/CaseStudy";
import { projects } from "@/content/site";

export const generateStaticParams = () => projects.map((p) => ({ slug: p.slug }));

export default async function Page({ params }: PageProps<"/projects/[slug]">) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) notFound();
  return <CaseStudy project={project} />;
}
