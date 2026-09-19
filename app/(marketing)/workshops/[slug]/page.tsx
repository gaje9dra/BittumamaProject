import type { Metadata } from "next";
import { EventDetailPage } from "@/components/events/event-detail-page";
import { events, getEventBySlug } from "@/data/events";

export function generateStaticParams() {
  return events.map((event) => ({ slug: event.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const event = getEventBySlug(slug);

  if (!event) return { title: "Event Not Found | Bittumama" };

  return {
    title: event.seo?.title ?? event.title + " | Bittumama Workshops & Events",
    description: event.seo?.description ?? event.shortDescription,
    alternates: { canonical: "/workshops/" + event.slug },
  };
}

export default async function WorkshopDetailRoute({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <EventDetailPage event={getEventBySlug(slug)} />;
}
