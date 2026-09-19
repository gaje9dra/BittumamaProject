import type { Metadata } from "next";
import { EventCategories } from "@/components/events/event-categories";
import { EventFeatured } from "@/components/events/event-featured";
import { EventsCta } from "@/components/events/events-cta";
import { EventsDiscovery } from "@/components/events/events-discovery";
import { EventsIntroduction } from "@/components/events/events-introduction";
import { eventCategories } from "@/data/events";
import { getFeaturedWorkshops, getUpcomingWorkshops } from "@/lib/content";

export const metadata: Metadata = {
  title: "Workshops & Events | Bittumama",
  description: "Discover workshops, learning sessions and research-focused events from Bittumama.",
};

export default function WorkshopsPage() {
  const upcoming = getUpcomingWorkshops();
  const featured = getFeaturedWorkshops()[0];

  return (
    <main className="min-h-screen bg-background text-foreground">
      <EventsIntroduction />
      <EventFeatured event={featured} />
      <EventCategories categories={eventCategories} />
      <EventsDiscovery events={upcoming} />
      {upcoming.length > 0 && <EventsCta />}
    </main>
  );
}
