import { HomeAudience } from "@/components/home/home-audience";
import { HomeHero } from "@/components/home/home-hero";
import { HomeIntelligence } from "@/components/home/home-intelligence";
import { HomePositioning } from "@/components/home/home-positioning";
import { HomeProcess } from "@/components/home/home-process";
import { HomeServiceDiscovery } from "@/components/home/home-service-discovery";
import type { Metadata } from "next";
import { site } from "@/data/site";

export const metadata: Metadata = site.defaultSeo;

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <HomeHero />
      <HomePositioning />
      <HomeIntelligence />
      <HomeServiceDiscovery />
      <HomeAudience />
      <HomeProcess />
    </main>
  );
}
