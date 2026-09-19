import Link from "next/link";
import { Container } from "@/components/ui/container";
import type { Event } from "@/data/events";

export function EventFeatured({ event }: { event?: Event }) {
  if (!event) return null;

  return (
    <section aria-labelledby="featured-event-title" className="border-b border-border bg-surface-muted">
      <Container size="wide" className="py-12 sm:py-16">
        <div className="grid gap-8 lg:grid-cols-[8rem_minmax(0,1fr)_18rem] lg:items-end">
          <div>
            <p className="type-label text-primary">Featured event</p>
            <time dateTime={event.date} className="type-h2 mt-3 block">{event.date}</time>
          </div>
          <div>
            <h2 id="featured-event-title" className="type-h3 max-w-[24ch]">{event.title}</h2>
            <p className="type-body mt-4 max-w-2xl text-muted-foreground">{event.shortDescription}</p>
            <p className="type-caption mt-4 text-muted-foreground">
              {[event.time, event.format, event.location, event.category].filter(Boolean).join(" · ")}
            </p>
          </div>
          <div className="flex flex-wrap gap-3 lg:justify-end">
            {event.registrationHref && event.registrationLabel && (
              <a href={event.registrationHref} className="inline-flex min-h-11 items-center rounded-[var(--radius-md)] border border-primary bg-primary px-5 type-button text-primary-foreground hover:bg-primary-700 focus-visible:outline-2 focus-visible:outline-offset-3">
                {event.registrationLabel}
              </a>
            )}
            <Link href={event.href ?? "/workshops/" + event.slug} className="inline-flex min-h-11 items-center rounded-[var(--radius-md)] border border-border px-5 type-button hover:bg-background focus-visible:outline-2 focus-visible:outline-offset-3">
              View Details
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
