import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import { NavBar } from "@/components/NavBar";
import { Footer } from "@/components/Footer";
import { readSiteConfig } from "@/lib/siteConfig";

const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display"
});

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans"
});

export const metadata: Metadata = {
  title: "Integratd — Luxury automation that saves you money",
  description:
    "Smart home and smart building automation with Loxone — lighting, climate, security, energy and more. Cloud-free, privacy-first.",
  metadataBase: new URL("https://www.integratd.com")
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const config = await readSiteConfig();
  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`}>
      <body className="min-h-screen antialiased">
        <NavBar logo={config.logo} />
        <main className="min-h-screen">{children}</main>
        <Footer footerLogo={config.footerLogo} />
      </body>
    </html>
  );
}


