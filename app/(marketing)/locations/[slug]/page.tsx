import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LocationPageView } from "@/components/locations/location-page";
import { getLocationBySlug } from "@/data/locations";
import { createPageMetadata } from "@/lib/metadata";
import { getRequestedPublishedServices } from "@/lib/services/repository";

type LocationPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: LocationPageProps): Promise<Metadata> {
  const { slug } = await params;
  const location = getLocationBySlug(slug);

  if (!location) return {};

  return createPageMetadata({
    title: location.seoTitle,
    description: location.seoDescription,
    image: location.image,
    canonical: "/locations/" + location.id,
  });
}

export const dynamic = "force-dynamic";

export default async function LocationPage({ params }: LocationPageProps) {
  const { slug } = await params;
  const location = getLocationBySlug(slug);

  if (!location) notFound();

  const services = await getRequestedPublishedServices();
  const serviceSlugs = new Set(location.serviceSlugs);
  const relatedServices = services.filter((service) => serviceSlugs.has(service.slug));

  return <LocationPageView location={location} services={relatedServices} />;
}

export function generateStaticParams() {
  return locationPages.map((location) => ({ slug: location.id }));
}
