// Falls back to localhost until NEXT_PUBLIC_SITE_URL is set (domain is still a [TODO] in site.ts).
export const siteBase = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
