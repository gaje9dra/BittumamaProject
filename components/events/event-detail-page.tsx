import Link from "next/link";
import { notFound } from "next/navigation";
import type { Event } from "@/data/events";
import { getRelatedEvents } from "@/data/events";
import { Container } from "@/components/ui/container";

function EventFacts({ event }: { event: Event }) {
  const facts = [
    ["Date", event.date],
    ["Time", event.time],
    ["Format", event.format],
    ["Location", event.location],
    ["Category", event.category],
  ].filter((item): item is [string, string] => Boolean(item[1]));

  return (
    <dl className="grid gap-5 border-y border-border py-6 sm:grid-cols-2 lg:grid-cols-3">
      {facts.map(([label, value]) => (
        <div key={label}>
          <dt className="type-label text-muted-foreground">{label}</dt>
          <dd className="type-body-sm mt-1">{value}</dd>
        </div>
      ))}
    </dl>
  );
}

export function EventDetailPage({ event }: { event?: Event }) {
  if (!event) notFound();

  const related = getRelatedEvents(event);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="border-b border-border">
        <Container width="standard" className="py-12 sm:py-16">
          <Link href="/workshops" className="type-caption text-muted-foreground underline underline-offset-4 hover:text-foreground">Workshops &amp; Events</Link>
          <p className="type-label mt-8 text-primary">{event.category}</p>
          <h1 className="type-h1 mt-2 max-w-[22ch]">{event.title}</h1>
          <p className="type-body-large mt-5 max-w-3xl text-muted-foreground">{event.shortDescription}</p>
          <div className="mt-8"><EventFacts event={event} /></div>
          {(event.registrationHref && event.registrationLabel) || event.registrationStatus ? (
            <div className="mt-7 flex flex-wrap items-center gap-3">
              {event.registrationHref && event.registrationLabel ? (
                <a href={event.registrationHref} className="inline-flex min-h-11 items-center rounded-[var(--radius-md)] bg-primary px-5 type-button text-primary-foreground hover:bg-primary-700 focus-visible:outline-2 focus-visible:outline-offset-3">{event.registrationLabel}</a>
              ) : event.registrationStatus ? (
                <span className="type-button rounded-[var(--radius-md)] border border-border px-5 py-3 text-muted-foreground">{event.registrationStatus}</span>
              ) : null}
            </div>
          ) : null}
        </Container>
      </section>

      {event.description && (
        <section className="border-b border-border">
          <Container width="reading" className="py-12">
            <h2 className="type-h3">About this event</h2>
            <p className="type-body mt-5 text-muted-foreground">{event.description}</p>
          </Container>
        </section>
      )}

      {event.audience?.length ? (
        <section className="border-b border-border">
          <Container width="standard" className="py-12">
            <h2 className="type-h3">Who it is for</h2>
            <ul className="mt-6 divide-y divide-border border-y border-border">
              {event.audience.map((item) => <li key={item} className="type-body-sm py-4">{item}</li>)}
            </ul>
          </Container>
        </section>
      ) : null}

      {event.speaker ? (
        <section className="border-b border-border">
          <Container width="standard" className="py-12">
            <h2 className="type-h3">Speaker / Facilitator</h2>
            <p className="type-body mt-4">{event.speaker}</p>
            {event.speakerRole && <p className="type-body-sm mt-1 text-muted-foreground">{event.speakerRole}</p>}
          </Container>
        </section>
      ) : null}

      {related.length ? (
        <section className="border-b border-border">
          <Container width="wide" className="py-12">
            <h2 className="type-h3">Related Events</h2>
            <div className="mt-6 divide-y divide-border border-y border-border">
              {related.map((item) => (
                <Link key={item.id} href={"/workshops/" + item.slug} className="flex min-h-16 items-center justify-between gap-5 py-4 hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-3">
                  <span><span className="type-label block text-muted-foreground">{item.date}</span><span className="type-h4 mt-1 block">{item.title}</span></span>
                  <span className="type-button shrink-0">View Event</span>
                </Link>
              ))}
            </div>
          </Container>
        </section>
      ) : null}

      <section className="border-b border-border">
        <Container width="standard" className="py-12">
          <div className="flex flex-wrap items-center justify-between gap-5">
            <div>
              <p className="type-label text-muted-foreground">Workshops &amp; Events</p>
              <h2 className="type-h3 mt-2">Explore upcoming events.</h2>
            </div>
            <Link href="/workshops" className="inline-flex min-h-11 items-center rounded-[var(--radius-md)] border border-primary bg-primary px-5 type-button text-primary-foreground hover:bg-primary-700 focus-visible:outline-2 focus-visible:outline-offset-3">Explore Upcoming Events</Link>
          </div>
        </Container>
      </section>
    </main>
  );
}
