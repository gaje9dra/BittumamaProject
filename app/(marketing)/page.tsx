import { HomeAudience } from "@/components/home/home-audience";
import { HomeHero } from "@/components/home/home-hero";
import { HomeIntelligence } from "@/components/home/home-intelligence";
import { HomePositioning } from "@/components/home/home-positioning";
import { HomeProcess } from "@/components/home/home-process";
import { HomeServiceDiscovery } from "@/components/home/home-service-discovery";
import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/metadata";
import { siteConfig } from "@/data/site-config";
import { getPublishedServices } from "@/lib/services/repository";

export const metadata: Metadata = createPageMetadata({
  title: siteConfig.defaultMetadata.title,
  description: siteConfig.defaultMetadata.description,
});

export default async function Home() {
  const services = await getPublishedServices();

  return (
    <main className="min-h-screen bg-background text-foreground">
      <HomeHero />
      <HomePositioning />
      <HomeIntelligence />
      <HomeServiceDiscovery />
      <HomeAudience services={services} />
      <HomeProcess />
    </main>
  );
}
