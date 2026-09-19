import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { services } from "@/data/services";

const needs = [
  { label: "I need thesis or dissertation support", slugs: ["thesis-support", "dissertation-support"] },
  { label: "I need literature or methodology support", slugs: ["literature-review", "research-methodology"] },
  { label: "I need statistical or data analysis", slugs: ["data-analysis"] },
  { label: "I need publication support", slugs: ["publication-services"] },
  { label: "I need ongoing research guidance", slugs: ["mentoring"] },
  { label: "I need research technology", slugs: ["ai-research-engine"] },
];

export function ServicesNeedIndex() {
  const availableNeeds = needs
    .map((need) => ({
      ...need,
      services: need.slugs.map((slug) => services.find((service) => service.slug === slug)).filter(Boolean),
    }))
    .filter((need) => need.services.length > 0);

  return (
    <section id="service-discovery" aria-labelledby="service-discovery-title" className="border-b border-border bg-background scroll-anchor">
      <Container size="wide" className="layout-section-lg">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-x-8 xl:gap-x-12">
          <div className="lg:col-span-4">
            <p className="type-label text-muted-foreground">Service discovery</p>
            <Heading id="service-discovery-title" level={2} className="mt-4 max-w-[18ch]">
              Start with what you need.
            </Heading>
            <p className="type-body-sm mt-4 max-w-[38ch] text-muted-foreground">
              Match your current research requirement to the relevant service.
            </p>
          </div>
          <ol className="border-t border-border lg:col-span-8 lg:col-start-5">
            {availableNeeds.map((need, index) => (
              <li key={need.label} className="border-b border-border">
                <div className="grid gap-3 py-5 sm:grid-cols-[3rem_minmax(0,1fr)_minmax(12rem,.5fr)] sm:gap-6 sm:items-center">
                  <span className="type-caption text-muted-foreground">{String(index + 1).padStart(2, "0")}</span>
                  <p className="type-body-sm">{need.label}</p>
                  <div className="flex flex-wrap gap-x-4 gap-y-2">
                    {need.services.map((service) => (
                      <Link
                        key={service!.id}
                        href={service!.href}
                        className="group inline-flex min-h-10 items-center gap-2 type-button text-primary underline decoration-primary/30 underline-offset-4 hover:decoration-primary focus-visible:outline-2 focus-visible:outline-offset-3"
                      >
                        {service!.title}
                        <ArrowUpRight aria-hidden="true" className="size-4 transition-transform duration-[var(--motion-fast)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                      </Link>
                    ))}
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </Container>
    </section>
  );
}
