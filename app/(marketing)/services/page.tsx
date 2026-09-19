import type { Metadata } from "next";
import { ServicesCategoryIndex } from "@/components/services/services-category-index";
import { ServicesCta } from "@/components/services/services-cta";
import { ServicesDirectory } from "@/components/services/services-directory";
import { ServicesHero } from "@/components/services/services-hero";
import { ServicesNeedIndex } from "@/components/services/services-need-index";

export const metadata: Metadata = {
  title: "Services | Bittumama",
  description: "Research, thesis, analysis, publication, mentoring and research technology services.",
};

export default function ServicesPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <ServicesHero />
      <ServicesCategoryIndex />
      <ServicesNeedIndex />
      <ServicesDirectory />
      <ServicesCta />
    </main>
  );
}
