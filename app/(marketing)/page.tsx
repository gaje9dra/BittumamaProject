import { HomeAudience } from "@/components/home/home-audience";
import { HomepageVisualShowcase } from "@/components/home/homepage-visual-showcase";
import { HomeIntelligence } from "@/components/home/home-intelligence";
import { HomePositioning } from "@/components/home/home-positioning";
import { HomeProcess } from "@/components/home/home-process";
import { HomeServiceDiscovery } from "@/components/home/home-service-discovery";
import { FeaturedServicesSection } from "@/components/home/featured-services-section";
import { GlobalPresenceSection } from "@/components/home/global-presence-section";
import { HomepageStatisticsSection } from "@/components/home/homepage-statistics-section";
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
      <HomepageVisualShowcase />
      <FeaturedServicesSection />
      <HomePositioning />
      <HomeIntelligence />
      <HomeServiceDiscovery />
      <HomeAudience services={services} />
      <HomeProcess />
      <GlobalPresenceSection />
      <HomepageStatisticsSection />
    </main>
  );
}
