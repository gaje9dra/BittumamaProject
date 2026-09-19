import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import type { Service } from "@/data/services";

type ServiceCtaProps = {
  service: Service;
};

export function ServiceCta({ service }: ServiceCtaProps) {
  return (
    <section
      aria-labelledby="service-cta-title"
      className="bg-primary text-primary-foreground"
    >
      <Container size="wide" className="layout-section-lg">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-x-8 xl:gap-x-12">
          <div className="lg:col-span-8">
            <p className="type-label text-primary-100">04 / Next step</p>
            <Heading
              id="service-cta-title"
              level={2}
              className="mt-5 max-w-[18ch] text-primary-foreground"
            >
              Discuss your {service.title.toLowerCase()} requirement.
            </Heading>
          </div>

          <div className="lg:col-span-4 lg:pb-1">
            <p className="type-body-sm max-w-[40ch] text-primary-100">
              Tell us what support you need and the context of your research work.
            </p>
            <Button
              asChild
              className="group mt-7 bg-background text-foreground hover:bg-surface-muted active:bg-surface-interactive"
            >
              <Link href="/contact">
                Discuss Your Requirement
                <ArrowUpRight
                  aria-hidden="true"
                  className="size-4 transition-transform duration-[var(--motion-fast)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </Link>
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
