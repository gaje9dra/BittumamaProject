import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";

export function ResearchCta() {
  return (
    <section aria-labelledby="research-cta-title" className="border-t border-border bg-surface-muted">
      <Container size="wide" className="layout-section-lg">
        <div className="grid gap-8 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
          <div>
            <p className="type-label text-muted-foreground">Research enquiries</p>
            <Heading id="research-cta-title" level={2} className="mt-4 max-w-[22ch]">
              Have a research question?
            </Heading>
            <p className="type-body-sm mt-3 max-w-[48ch] text-muted-foreground">
              Contact Bittumama for a research enquiry or to discuss the information you need.
            </p>
          </div>
          <Link href="/contact" className="group inline-flex min-h-11 items-center gap-2 type-button text-primary underline decoration-primary/30 underline-offset-4 hover:decoration-primary focus-visible:outline-2 focus-visible:outline-offset-3">
            Contact Bittumama
            <ArrowUpRight aria-hidden="true" className="size-4 transition-transform duration-[var(--motion-fast)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </div>
      </Container>
    </section>
  );
}
