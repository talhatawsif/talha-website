import type { Metadata } from "next";
import { IBM_Plex_Mono, Public_Sans } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { Footer } from "@/components/Footer";
import { RevealObserver } from "@/components/RevealObserver";
import { TopBar } from "@/components/TopBar";
import { siteBase } from "@/lib/site-url";
import "./globals.css";

const sans = Public_Sans({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-public-sans", display: "swap" });
const mono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-plex-mono", display: "swap" });

// Runs before first paint so a saved theme never flashes the wrong one.
const themeScript = `try{var t=localStorage.getItem("theme");if(t==="light"||t==="dark")document.documentElement.dataset.theme=t}catch(e){}`;

const description = "Software developer in Melbourne working on health tech and integration: FHIR, HL7 v2 and full-stack apps.";

export const metadata: Metadata = {
  metadataBase: new URL(siteBase),
  title: { default: "Talha Tawsif · Software developer, health tech and integration", template: "%s · Talha Tawsif" },
  description,
  alternates: { canonical: "/" },
  openGraph: { type: "website", siteName: "Talha Tawsif", locale: "en_AU", title: "Talha Tawsif", description },
  twitter: { card: "summary_large_image", title: "Talha Tawsif", description },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" suppressHydrationWarning className={`${sans.variable} ${mono.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <a href="#main" className="skip-link">Skip to content</a>
        <TopBar />
        {children}
        <Footer />
        <RevealObserver />
        <Analytics />
      </body>
    </html>
  );
}
