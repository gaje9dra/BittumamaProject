import { notFound } from "next/navigation";
import { EventCategories } from "@/components/events/event-categories";
import { EventFeatured } from "@/components/events/event-featured";
import { EventsCta } from "@/components/events/events-cta";
import { EventsDiscovery } from "@/components/events/events-discovery";
import { EventsIntroduction } from "@/components/events/events-introduction";
import { getPublishedEventCategories, getFeaturedEvents, getPublishedEvents, getUpcomingEvents } from "@/lib/events/repository";

export const dynamic = "force-dynamic";

export default async function WorkshopsDesignPreview() {
  if (process.env.NODE_ENV === "production") notFound();

  const [previewEvents, categories, featuredEvents, upcoming] = await Promise.all([
    getPublishedEvents(),
    getPublishedEventCategories(),
    getFeaturedEvents(),
    getUpcomingEvents(),
  ]);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="border-b border-accent bg-surface-muted">
        <div className="mx-auto max-w-[var(--container-standard)] px-[var(--page-gutter)] py-3">
          <p className="type-label text-accent-foreground">Development reference</p>
          <p className="type-caption mt-1 text-muted-foreground">
            Production preview uses the canonical event dataset; no test events are injected.
          </p>
        </div>
      </div>
      <EventsIntroduction />
      <EventFeatured event={previewEvents.find((event) => event.featured) ?? featuredEvents[0]} />
      <EventCategories categories={categories} />
      <EventsDiscovery events={upcoming} />
      <EventsCta />
    </main>
  );
}
