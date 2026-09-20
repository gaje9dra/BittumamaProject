import type { Metadata } from "next";
import { ServicesCategoryIndex } from "@/components/services/services-category-index";
import { ServicesCta } from "@/components/services/services-cta";
import { ServicesDirectory } from "@/components/services/services-directory";
import { ServicesHero } from "@/components/services/services-hero";
import { ServiceFinder } from "@/components/services/service-finder";
import { createPageMetadata } from "@/lib/metadata";
import { getPublishedServices } from "@/lib/services/repository";

export const dynamic = "force-dynamic";

export const metadata: Metadata = createPageMetadata({
  title: "Research & Academic Services | Bittumama",
  description: "Thesis, research, analysis, publication, mentoring and research technology services.",
});

export default async function ServicesPage() {
  const services = await getPublishedServices();
  const categories = Array.from(new Set(services.map((service) => service.category)));

  return (
    <main className="min-h-screen bg-background text-foreground">
      <ServicesHero />
      <ServiceFinder services={services} />
      <ServicesCategoryIndex categories={categories} />
      <ServicesDirectory services={services} />
      <ServicesCta />
    </main>
  );
}
