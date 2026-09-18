import { HomeCapabilities } from "@/components/home/home-capabilities";
import { HomeCta } from "@/components/home/home-cta";
import { HomeExpertise } from "@/components/home/home-expertise";
import { HomeHero } from "@/components/home/home-hero";
import { HomeInsights } from "@/components/home/home-insights";
import { HomeIntelligence } from "@/components/home/home-intelligence";
import { HomePositioning } from "@/components/home/home-positioning";

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <HomeHero />
      <HomePositioning />
      <HomeCapabilities />
      <HomeIntelligence />
      <HomeExpertise />
      <HomeInsights />
      <HomeCta />
    </main>
  );
}
