import type { Metadata } from "next";
import "./globals.css";
import { siteConfig } from "@/data/site-config";
import { runContentIntegrityValidation } from "@/lib/content/validation";
import { PageViewTracker } from "@/components/analytics/page-view-tracker";
import { WhatsAppContactButton } from "@/components/layout/whatsapp-contact-button";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: siteConfig.defaultMetadata.title,
  description: siteConfig.defaultMetadata.description,
  openGraph: {
    title: siteConfig.defaultMetadata.title,
    description: siteConfig.defaultMetadata.description,
    siteName: siteConfig.siteName,
  },
};

runContentIntegrityValidation();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
        <WhatsAppContactButton />
        <PageViewTracker />
      </body>
    </html>
  );
}
