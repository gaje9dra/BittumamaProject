import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EventDetailPage } from "@/components/events/event-detail-page";
import { getAllEvents, getEventBySlug, getEventHref } from "@/data/events";
import { createContentMetadata } from "@/lib/metadata";

export function generateStaticParams() {
  return getAllEvents().map((event) => ({ slug: event.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const event = getEventBySlug(slug);

  if (!event) return { title: "Event Not Found | Bittumama" };

  return createContentMetadata({
    seo: event.seo,
    title: event.title,
    description: event.shortDescription,
    image: event.image,
    canonical: getEventHref(event),
  });
}

export default async function WorkshopDetailRoute({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const event = getEventBySlug(slug);

  if (!event) {
    notFound();
  }

  return <EventDetailPage event={event} />;
}
