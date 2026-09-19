import type { Service } from "@/data/services";
import { RelatedServices } from "@/components/services/related-services";
import { ServiceAudience } from "@/components/services/service-audience";
import { ServiceCta } from "@/components/services/service-cta";
import { ServiceHero } from "@/components/services/service-hero";
import { ServiceHighlights } from "@/components/services/service-highlights";
import { ServiceOverview } from "@/components/services/service-overview";

type ServiceDetailPageProps = {
  service: Service;
};

export function ServiceDetailPage({ service }: ServiceDetailPageProps) {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <ServiceHero service={service} />
      <ServiceOverview service={service} />
      <ServiceHighlights service={service} />
      <ServiceAudience service={service} />
      <RelatedServices service={service} />
      <ServiceCta service={service} />
    </main>
  );
}
