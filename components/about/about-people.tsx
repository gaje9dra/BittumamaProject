import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { experts } from "@/data/expertise";

export function AboutPeople() {
  if (!experts.length) return null;

  return <section aria-labelledby="about-people-title" className="border-b border-border bg-background">
    <Container size="wide" className="layout-section">
      <div className="grid gap-6 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
        <div>
          <p className="type-label text-muted-foreground">The people behind the work</p>
          <Heading id="about-people-title" level={2} className="mt-3 max-w-[20ch]">Meet the experts.</Heading>
        </div>
        <Link href="/experts" className="group inline-flex min-h-11 items-center gap-2 type-button text-primary underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-3">
          Explore Experts
          <ArrowUpRight aria-hidden="true" className="size-4 transition-transform duration-[var(--motion-fast)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </Link>
      </div>
    </Container>
  </section>;
}
