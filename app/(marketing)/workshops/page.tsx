import type { Metadata } from "next";
import { EventCategories } from "@/components/events/event-categories";
import { EventFeatured } from "@/components/events/event-featured";
import { EventsCta } from "@/components/events/events-cta";
import { EventsDiscovery } from "@/components/events/events-discovery";
import { EventsIntroduction } from "@/components/events/events-introduction";
import { createPageMetadata } from "@/lib/metadata";
import { getPublishedEventCategories, getFeaturedEvents, getUpcomingEvents } from "@/lib/events/repository";

export const dynamic = "force-dynamic";

export const metadata: Metadata = createPageMetadata({
  title: "Workshops & Events | Bittumama",
  description: "Discover workshops, learning sessions and research-focused events from Bittumama.",
});

export default async function WorkshopsPage() {
  const [categories, featuredEvents, upcoming] = await Promise.all([
    getPublishedEventCategories(),
    getFeaturedEvents(),
    getUpcomingEvents(),
  ]);
  const featured = featuredEvents[0];

  return (
    <main className="min-h-screen bg-background text-foreground">
      <EventsIntroduction />
      <EventFeatured event={featured} />
      <EventCategories categories={categories} />
      <EventsDiscovery events={upcoming} />
      {upcoming.length > 0 && <EventsCta />}
    </main>
  );
}
