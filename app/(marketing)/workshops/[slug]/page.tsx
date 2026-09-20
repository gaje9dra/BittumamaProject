import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EventDetailPage } from "@/components/events/event-detail-page";
import { getEventHref } from "@/lib/events/paths";
import { getPublishedEventBySlug } from "@/lib/events/repository";
import { createContentMetadata } from "@/lib/metadata";

export const dynamic = "force-dynamic";

type WorkshopDetailRouteProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: WorkshopDetailRouteProps): Promise<Metadata> {
  const { slug } = await params;
  const event = await getPublishedEventBySlug(slug);
  if (!event) return { title: "Event Not Found | Bittumama" };

  return createContentMetadata({
    seo: event.seo,
    title: event.title,
    description: event.shortDescription,
    image: event.image,
    canonical: getEventHref(event),
  });
}

export default async function WorkshopDetailRoute({ params }: WorkshopDetailRouteProps) {
  const { slug } = await params;
  const event = await getPublishedEventBySlug(slug);
  if (!event) notFound();

  return <EventDetailPage event={event} />;
}
