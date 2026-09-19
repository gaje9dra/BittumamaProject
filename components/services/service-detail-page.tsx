import type { Service } from "@/data/services";
import { ServiceCta } from "@/components/services/service-cta";
import { ServiceHero } from "@/components/services/service-hero";
import { ServiceOverview } from "@/components/services/service-overview";
import { ServiceHighlights } from "@/components/services/service-highlights";
import { RelatedServices } from "@/components/services/related-services";

type ServiceDetailPageProps = {
  service: Service;
};

export function ServiceDetailPage({ service }: ServiceDetailPageProps) {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <ServiceHero service={service} />
      <ServiceOverview service={service} />
      <ServiceHighlights service={service} />
      <RelatedServices service={service} />
      <ServiceCta service={service} />
    </main>
  );
}
