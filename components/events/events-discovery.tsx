import Link from "next/link";
import { Container } from "@/components/ui/container";
import type { Event } from "@/data/events";

function formatDate(date: string) {
  const parsed = new Date(date + "T00:00:00");
  return {
    day: new Intl.DateTimeFormat("en", { day: "2-digit" }).format(parsed),
    month: new Intl.DateTimeFormat("en", { month: "short" }).format(parsed).toUpperCase(),
  };
}

function EventMeta({ event }: { event: Event }) {
  const metadata = [event.time, event.format, event.location, event.category].filter(Boolean);
  return metadata.length ? (
    <p className="type-caption mt-3 text-muted-foreground" aria-label="Event details">
      {metadata.join(" · ")}
    </p>
  ) : null;
}

export function EventsDiscovery({ events }: { events: Event[] }) {
  if (!events.length) {
    return (
      <section aria-labelledby="events-empty-title" className="border-b border-border">
        <Container size="default" className="py-16 sm:py-20">
          <div className="max-w-2xl border-l-2 border-primary pl-5 sm:pl-7">
            <p className="type-label text-muted-foreground">Upcoming events</p>
            <h2 id="events-empty-title" className="type-h3 mt-2">
              No upcoming events
            </h2>
            <p className="type-body mt-3 text-muted-foreground">
              Check back for the next workshop or research event.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/research"
                className="inline-flex min-h-11 items-center rounded-[var(--radius-md)] border border-primary bg-primary px-5 type-button text-primary-foreground transition-colors duration-[var(--motion-fast)] hover:bg-primary-700 focus-visible:outline-2 focus-visible:outline-offset-3"
              >
                Explore Research
              </Link>
              <Link
                href="/articles"
                className="inline-flex min-h-11 items-center rounded-[var(--radius-md)] border border-border px-5 type-button text-foreground transition-colors duration-[var(--motion-fast)] hover:bg-surface-muted focus-visible:outline-2 focus-visible:outline-offset-3"
              >
                Explore Articles
              </Link>
            </div>
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section aria-labelledby="upcoming-events-title" className="border-b border-border">
      <Container size="wide" className="py-14 sm:py-18">
        <div className="mb-7 flex items-end justify-between gap-6 border-b border-border pb-4">
          <div>
            <p className="type-label text-muted-foreground">Upcoming</p>
            <h2 id="upcoming-events-title" className="type-h3 mt-1">Events you can attend</h2>
          </div>
        </div>
        <div className="divide-y divide-border border-y border-border">
          {Array.from(new Set(events.map((event) => event.category))).map((category) => {
            const categoryEvents = events.filter((event) => event.category === category);
            const categoryId = "event-category-" + category.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
            return (
              <section key={category} id={categoryId} className="scroll-anchor">
                <div className="border-b border-border bg-surface-muted px-4 py-3 sm:px-5">
                  <p className="type-label text-muted-foreground">{category}</p>
                </div>
                {categoryEvents.map((event) => {
            const date = formatDate(event.date);
            return (
              <article key={event.id} className="group grid min-w-0 gap-5 py-6 sm:grid-cols-[7rem_minmax(0,1fr)_auto] sm:items-start sm:gap-7">
                <time dateTime={event.date} className="block text-primary">
                  <span className="type-h2 block leading-none">{date.day}</span>
                  <span className="type-label mt-1 block">{date.month}</span>
                </time>
                <div className="min-w-0">
                  <p className="type-label text-muted-foreground">{event.category}</p>
                  <h3 className="type-h4 mt-2">
                    <Link href={"/workshops/" + event.slug} className="hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-3">
                      {event.title}
                    </Link>
                  </h3>
                  <p className="type-body-sm mt-2 max-w-2xl text-muted-foreground">{event.shortDescription}</p>
                  <EventMeta event={event} />
                </div>
                <div className="flex flex-wrap items-center gap-3 sm:justify-end">
                  {event.registrationStatus && (
                    <span className="type-caption rounded-full border border-border px-3 py-1 text-muted-foreground">
                      {event.registrationStatus}
                    </span>
                  )}
                  <Link
                    href={"/workshops/" + event.slug}
                    className="type-button inline-flex min-h-11 items-center text-primary underline decoration-primary/40 underline-offset-4 hover:decoration-primary focus-visible:outline-2 focus-visible:outline-offset-3"
                  >
                    View Event
                  </Link>
                </div>
              </article>
            );
                })}
              </section>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
