import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";

export function AboutCta() {
  return <section aria-labelledby="about-cta-title" className="border-t border-border bg-surface-muted">
    <Container size="wide" className="layout-section-lg">
      <div className="grid gap-8 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
        <div>
          <p className="type-label text-muted-foreground">Next step</p>
          <Heading id="about-cta-title" level={2} className="mt-3 max-w-[24ch]">Explore the work behind the organization.</Heading>
          <p className="type-body-sm mt-3 max-w-[48ch] text-muted-foreground">Choose the part of Bittumama that matches what you want to understand or use.</p>
        </div>
        <div className="flex flex-wrap gap-5">
          <Link href="/services" className="group inline-flex min-h-11 items-center gap-2 type-button text-primary underline decoration-primary/30 underline-offset-4 hover:decoration-primary focus-visible:outline-2 focus-visible:outline-offset-3">Explore Services<ArrowUpRight aria-hidden="true" className="size-4 transition-transform duration-[var(--motion-fast)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5" /></Link>
          <Link href="/contact" className="group inline-flex min-h-11 items-center gap-2 type-button text-primary underline decoration-primary/30 underline-offset-4 hover:decoration-primary focus-visible:outline-2 focus-visible:outline-offset-3">Contact Bittumama<ArrowUpRight aria-hidden="true" className="size-4 transition-transform duration-[var(--motion-fast)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5" /></Link>
        </div>
      </div>
    </Container>
  </section>;
}
