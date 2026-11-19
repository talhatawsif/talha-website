import { profile } from "@/content/site";
import { ogImage } from "@/lib/og-image";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Talha Tawsif, software developer";

export default function Image() {
  return ogImage(profile.name, profile.role);
}
