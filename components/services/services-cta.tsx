import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";

export function ServicesCta() {
  return (
    <section aria-labelledby="services-cta-title" className="bg-primary text-primary-foreground">
      <Container size="wide" className="layout-section-lg">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-x-8 xl:gap-x-12">
          <div className="lg:col-span-7">
            <p className="type-label text-primary-foreground/70">Next step</p>
            <Heading id="services-cta-title" level={2} className="mt-4 max-w-[18ch] text-primary-foreground">
              Discuss your research requirement.
            </Heading>
          </div>
          <div className="lg:col-span-4 lg:col-start-9">
            <p className="type-body-sm max-w-[40ch] text-primary-foreground/80">
              Tell us which service you need and the context of your research work.
            </p>
            <Link
              href="/contact"
              className="group mt-6 inline-flex min-h-11 items-center gap-2 type-button rounded-[var(--radius-md)] bg-background px-5 text-foreground hover:bg-surface-muted focus-visible:outline-2 focus-visible:outline-offset-3"
            >
              Discuss Your Requirement
              <ArrowUpRight aria-hidden="true" className="size-4 transition-transform duration-[var(--motion-fast)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
