import type { Metadata } from "next";
import { IBM_Plex_Sans, Literata } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { siteConfig } from "@/data/site-config";

const bodyFont = IBM_Plex_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body",
  weight: ["400", "500", "600"],
});

const displayFont = Literata({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-display",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: siteConfig.defaultMetadata.title,
  description: siteConfig.defaultMetadata.description,
  openGraph: {
    title: siteConfig.defaultMetadata.title,
    description: siteConfig.defaultMetadata.description,
    siteName: siteConfig.siteName,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${bodyFont.variable} ${displayFont.variable}`}>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
