import type { Metadata } from "next";
import { IBM_Plex_Mono, Public_Sans } from "next/font/google";
import { Footer } from "@/components/Footer";
import { TopBar } from "@/components/TopBar";
import "./globals.css";

const sans = Public_Sans({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-public-sans", display: "swap" });
const mono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-plex-mono", display: "swap" });

export const metadata: Metadata = {
  title: "Talha Tawsif",
  description: "Software developer in Melbourne working on health tech and integration.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable}`}>
      <body>
        <a href="#main" className="skip-link">Skip to content</a>
        <TopBar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
