import Link from "next/link";
import { Container } from "@/components/ui/container";

export function EventsCta() {
  return (
    <section className="border-b border-border">
      <Container size="default" className="py-12 sm:py-14">
        <div className="flex flex-col gap-5 border-t border-primary pt-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="type-label text-muted-foreground">Workshops &amp; Events</p>
            <h2 className="type-h3 mt-2 max-w-[26ch]">Explore research and knowledge work between events.</h2>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/research" className="inline-flex min-h-11 items-center rounded-[var(--radius-md)] border border-border px-5 type-button hover:bg-surface-muted focus-visible:outline-2 focus-visible:outline-offset-3">Explore Research</Link>
            <Link href="/articles" className="inline-flex min-h-11 items-center rounded-[var(--radius-md)] border border-primary bg-primary px-5 type-button text-primary-foreground hover:bg-primary-700 focus-visible:outline-2 focus-visible:outline-offset-3">Explore Articles</Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
