import { HomeAbout } from "@/components/home/home-about";
import { HomeAudience } from "@/components/home/home-audience";
import { HomeExpertise } from "@/components/home/home-expertise";
import { HomeHero } from "@/components/home/home-hero";
import { HomeInsights } from "@/components/home/home-insights";
import { HomeIntelligence } from "@/components/home/home-intelligence";
import { HomePositioning } from "@/components/home/home-positioning";
import { HomeProcess } from "@/components/home/home-process";
import { HomeTrust } from "@/components/home/home-trust";
import { HomeEvents } from "@/components/home/home-events";
import type { Metadata } from "next";
import { HomeServiceDiscovery } from "@/components/home/home-service-discovery";

export const metadata: Metadata = {
  title: "Bittumama — Research, Intelligence & Expertise",
  description:
    "Research support, academic services, analysis, expertise and knowledge resources from Bittumama.",
};

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <HomeHero />
      <HomePositioning />
      <HomeIntelligence />
      <HomeServiceDiscovery />
      <HomeAudience />
      <HomeProcess />
      <HomeTrust />
      <HomeExpertise />
      <HomeEvents />
      <HomeInsights />
      <HomeAbout />
    </main>
  );
}
