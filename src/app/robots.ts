import type { MetadataRoute } from "next";
import { siteBase } from "@/lib/site-url";

export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: "*", allow: "/", disallow: "/styleguide" }, sitemap: `${siteBase}/sitemap.xml` };
}
