import type { Metadata } from "next";
import { ServicesCategoryIndex } from "@/components/services/services-category-index";
import { ServicesCta } from "@/components/services/services-cta";
import { ServicesDirectory } from "@/components/services/services-directory";
import { ServicesHero } from "@/components/services/services-hero";
import { ServiceFinder } from "@/components/services/service-finder";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Research & Academic Services | Bittumama",
  description: "Thesis, research, analysis, publication, mentoring and research technology services.",
});

export default function ServicesPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <ServicesHero />
      <ServiceFinder />
      <ServicesCategoryIndex />
      <ServicesDirectory />
      <ServicesCta />
    </main>
  );
}
