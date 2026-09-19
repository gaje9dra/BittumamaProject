import type { Metadata } from "next";
import { ServicesAudience } from "@/components/services/services-audience";
import { ServicesCategoryIndex } from "@/components/services/services-category-index";
import { ServicesCta } from "@/components/services/services-cta";
import { ServicesDirectory } from "@/components/services/services-directory";
import { ServicesHero } from "@/components/services/services-hero";

export const metadata: Metadata = {
  title: "Services | Bittumama",
  description:
    "Thesis, dissertation, research paper and data analysis support.",
};

export default function ServicesPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <ServicesHero />
      <ServicesCategoryIndex />
      <ServicesDirectory />
      <ServicesAudience />
      <ServicesCta />
    </main>
  );
}
