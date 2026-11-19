import type { MetadataRoute } from "next";
import { projects } from "@/content/site";
import { siteBase } from "@/lib/site-url";

export default function sitemap(): MetadataRoute.Sitemap {
  return ["", ...projects.map((p) => `/projects/${p.slug}`)].map((path) => ({ url: `${siteBase}${path}` }));
}
