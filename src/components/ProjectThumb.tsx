import Image from "next/image";
import { ViewTransition } from "react";
import type { Project } from "@/content/site";

/** 16:9 panel in the project's colour with its mark at 40% height; screenshot once `thumbnail` is set. */
export function ProjectThumb({ project }: { project: Project }) {
  return (
    <ViewTransition name={`thumb-${project.slug}`} share="morph" default="none">
    <div
      className="relative flex aspect-video w-full items-center justify-center overflow-hidden rounded-sm border border-border"
      style={{ backgroundColor: project.color }}
    >
      {project.thumbnail ? (
        <Image src={project.thumbnail} alt={`${project.name} screenshot`} fill sizes="(min-width: 768px) 240px, 100vw" className="object-cover" />
      ) : (
        <Image src={project.mark} alt={`${project.name} logo`} width={64} height={64} className="h-[40%] w-auto" />
      )}
    </div>
    </ViewTransition>
  );
}
