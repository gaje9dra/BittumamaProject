import { notFound } from "next/navigation";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { ServiceHero } from "@/components/services/service-hero";
import { ServiceHighlights } from "@/components/services/service-highlights";
import { ServiceFAQ } from "@/components/services/service-faq";
import { ServiceAudience } from "@/components/services/service-audience";
import { ServiceCta } from "@/components/services/service-cta";
import { RelatedServices } from "@/components/services/related-services";
import { services, type Service } from "@/data/services";

export default function ServiceDetailPlaygroundPage() {
  if (process.env.NODE_ENV === "production") notFound();

  const baseService = services[0];

  const previewServices: Service[] = [
    {
      ...baseService,
      id: "preview-faq-multiple",
      title: "Thesis Support for Extended Research Projects",
      faq: [
        {
          question: "What does this service cover?",
          answer: "Thesis assistance, editing and proofreading within the stated service scope.",
        },
        {
          question: "Who is this service for?",
          answer: "Students and researchers working on thesis requirements.",
        },
        {
          question: "What information is needed to begin?",
          answer: "The research topic and relevant project requirements provide the starting context.",
        },
      ],
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
      id: "preview-faq-one",
      title: "Dissertation Support",
      faq: [
        {
          question: "How can I enquire about this service?",
          answer: "Use the service contact action to share your dissertation requirement and research context.",
        },
      ],
      highlights: undefined,
      audience: undefined,
    },
    {
      ...services[2],
      id: "preview-faq-long",
      title: "Research Paper Support for Extended Academic Projects",
      shortDescription:
        "Research paper writing, review and editing support across a longer service description used only to test responsive text flow.",
      faq: [
        {
          question: "What information should be shared before discussing this research paper service?",
          answer: "Share the research topic, the stage of the paper, and the specific writing, review or editing requirement so the enquiry can be understood in context. This long answer is included only to test wrapping and expanded disclosure behavior.",
        },
      ],
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
            Responsive preview for service detail content, optional highlights, FAQ disclosure,
            related services, long titles and the final CTA.
          </p>
        </Container>
      </section>

      {previewServices.map((service) => (
        <div key={service.id} className="border-b border-border">
          <ServiceHero service={service} />
          <ServiceHighlights service={service} />
          <ServiceAudience service={service} />
          <ServiceFAQ service={service} />
          <RelatedServices service={service} />
          <ServiceCta service={service} />
        </div>
      ))}
    </main>
  );
}
