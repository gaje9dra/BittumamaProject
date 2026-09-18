import { HomeAudience } from "@/components/home/home-audience";
import { HomeCapabilities } from "@/components/home/home-capabilities";
import { HomeCta } from "@/components/home/home-cta";
import { HomeExpertise } from "@/components/home/home-expertise";
import { HomeHero } from "@/components/home/home-hero";
import { HomeInsights } from "@/components/home/home-insights";
import { HomeIntelligence } from "@/components/home/home-intelligence";
import { HomePositioning } from "@/components/home/home-positioning";
import { HomeProcess } from "@/components/home/home-process";
import { HomeServices } from "@/components/home/home-services";
import { HomeTrust } from "@/components/home/home-trust";
import { HomeServiceDiscovery } from "@/components/home/home-service-discovery";

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <HomeHero />
      <HomePositioning />
      <HomeCapabilities />
      <HomeIntelligence />
      <HomeServices />
      <HomeServiceDiscovery />
      <HomeAudience />
      <HomeProcess />
      <HomeTrust />
      <HomeExpertise />
      <HomeInsights />
      <HomeCta />
    </main>
  );
}
