import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { about } from "@/data/about";

export function AboutRelationships() {
  return <section aria-labelledby="about-relationships-title" className="border-b border-border bg-surface-muted">
    <Container size="wide" className="layout-section-lg">
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-x-8 xl:gap-x-12">
        <div className="lg:col-span-4">
          <p className="type-label text-muted-foreground">Organization structure</p>
          <Heading id="about-relationships-title" level={2} className="mt-3 max-w-[20ch]">How the public-facing work fits together.</Heading>
          <p className="type-body-sm mt-4 max-w-[38ch] text-muted-foreground">These areas are separate experiences within the same organization, with each page serving a different visitor need.</p>
        </div>
        <ol className="lg:col-span-7 lg:col-start-6">
          {about.relationships.map((item, index) => <li key={item.title} className="border-t border-border">
            <Link href={item.href} className="group grid gap-3 py-6 sm:grid-cols-[2.5rem_minmax(9rem,.35fr)_minmax(0,1fr)_auto] sm:items-start sm:gap-5 focus-visible:outline-2 focus-visible:outline-offset-[-2px]">
              <span className="type-caption text-muted-foreground">{String(index + 1).padStart(2, "0")}</span>
              <Heading level={3}>{item.title}</Heading>
              <p className="type-body-sm max-w-[40ch] text-muted-foreground">{item.description}</p>
              <span className="inline-flex min-h-11 items-center gap-2 type-button text-primary underline decoration-primary/30 underline-offset-4">
                {item.action}
                <ArrowUpRight aria-hidden="true" className="size-4 transition-transform duration-[var(--motion-fast)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </span>
            </Link>
          </li>)}
        </ol>
      </div>
    </Container>
  </section>;
}
