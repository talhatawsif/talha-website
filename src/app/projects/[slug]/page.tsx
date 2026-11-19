import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { CaseStudy } from "@/components/CaseStudy";
import { projects } from "@/content/site";

export const generateStaticParams = () => projects.map((p) => ({ slug: p.slug }));

export async function generateMetadata({ params }: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const p = projects.find((x) => x.slug === slug);
  if (!p) return {};
  return {
    title: `${p.name} case study`,
    description: p.summary,
    alternates: { canonical: `/projects/${p.slug}` },
    openGraph: { title: `${p.name} case study`, description: p.summary, type: "article" },
    twitter: { title: `${p.name} case study`, description: p.summary },
  };
}

export default async function Page({ params }: PageProps<"/projects/[slug]">) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) notFound();
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "SoftwareSourceCode",
          name: project.name,
          description: project.summary,
          codeRepository: project.codeUrl,
          url: project.liveUrl,
          author: { "@type": "Person", name: "Talha Tawsif" },
          keywords: project.tags.join(", "),
        }}
      />
      <CaseStudy project={project} />
    </>
  );
}
