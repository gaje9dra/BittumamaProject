import { notFound } from "next/navigation";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { ServiceHero } from "@/components/services/service-hero";
import { ServiceOverview } from "@/components/services/service-overview";
import { ServiceHighlights } from "@/components/services/service-highlights";
import { RelatedServices } from "@/components/services/related-services";
import { services, type Service } from "@/data/services";

export default function ServiceDetailPlaygroundPage() {
  if (process.env.NODE_ENV === "production") notFound();

  const baseService = services[0];

  const previewServices: Service[] = [
    {
      ...baseService,
      id: "preview-highlights",
      title: "Thesis Support for Extended Research Projects",
      highlights: [
        {
          title: "Research structure",
          description: "Preview content for testing the optional highlight layout.",
        },
        {
          title: "Academic editing",
          description: "Preview content for testing a second verified-data slot.",
        },
      ],
    },
    {
      ...services[1],
      id: "preview-no-highlights",
      title: "Dissertation Support",
      highlights: undefined,
      audience: undefined,
    },
    {
      ...services[2],
      id: "preview-long-content",
      title: "Research Paper Support for Extended Academic Projects",
      shortDescription:
        "Research paper writing, review and editing support across a longer service description used only to test responsive text flow.",
    },
  ];

  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="layout-section-sm border-b border-border">
        <Container size="wide">
          <p className="type-label text-muted-foreground">Development reference</p>
          <Heading level={1} className="mt-3">
            Service Detail
          </Heading>
          <p className="type-body-sm mt-3 max-w-[56ch] text-muted-foreground">
            Responsive preview for the service detail foundation, optional highlights,
            related services and long titles.
          </p>
        </Container>
      </section>

      {previewServices.map((service) => (
        <div key={service.id} className="border-b border-border">
          <ServiceHero service={service} />
          <ServiceOverview service={service} />
          <ServiceHighlights service={service} />
          <RelatedServices service={service} />
        </div>
      ))}
    </main>
  );
}
