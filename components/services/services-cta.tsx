import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";

export function ServicesCta() {
  return (
    <section aria-labelledby="services-cta-title" className="bg-primary text-primary-foreground">
      <Container size="wide" className="layout-section-lg">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-x-8 xl:gap-x-12">
          <div className="lg:col-span-8">
            <p className="type-label text-primary-100">03 / Next step</p>
            <Heading id="services-cta-title" level={2} className="mt-4 max-w-[18ch] text-primary-foreground">
              Need help choosing a service?
            </Heading>
          </div>

          <div className="lg:col-span-4 lg:pb-1">
            <p className="type-body-sm max-w-[40ch] text-primary-100">
              Share your thesis, dissertation, research paper or data analysis requirement.
            </p>
            <Link
              href="/contact"
              className="group mt-7 inline-flex min-h-11 items-center gap-2 type-button rounded-[var(--radius-md)] bg-background px-5 text-foreground transition-colors duration-[var(--motion-fast)] hover:bg-surface-muted focus-visible:outline-2 focus-visible:outline-offset-3"
            >
              Request Research Support
              <ArrowUpRight
                aria-hidden="true"
                className="size-4 transition-transform duration-[var(--motion-fast)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
