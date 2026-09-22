import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { ServiceBreadcrumbs } from "@/components/services/service-breadcrumbs";
import type { Service } from "@/data/services";

type ServiceHeroProps = { service: Service };

export function ServiceHero({ service }: ServiceHeroProps) {
  const isComingSoon = service.status === "Coming Soon";
  return (
    <section aria-labelledby="service-title" className="border-b border-border bg-background">
      <Container size="wide" className="py-8 sm:py-10 lg:py-12">
        <ServiceBreadcrumbs serviceName={service.title} />
        <div className="mt-8 grid gap-7 lg:grid-cols-12 lg:items-end lg:gap-x-8 xl:gap-x-12">
          <div className="lg:col-span-8"><div className="flex flex-wrap items-center gap-3"><p className="type-label text-muted-foreground">{service.category}</p>
            {isComingSoon && <span className="type-caption border border-border px-2 py-1 text-muted-foreground">Coming Soon</span>}
          </div><Heading id="service-title" level={1} className="mt-3 max-w-[16ch]">{service.title}</Heading></div>
          <div className="lg:col-span-4 lg:col-start-9"><p className="type-body-lg max-w-[42ch] text-muted-foreground">{service.shortDescription}</p>
            <Button asChild size="lg" className="group mt-6 w-fit"><Link href={`/contact?service=${encodeURIComponent(service.slug)}`}>Request Support<ArrowUpRight aria-hidden="true" className="size-4 transition-transform duration-[var(--motion-fast)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5" /></Link></Button>
          </div>
        </div>
      </Container>
    </section>
  );
}