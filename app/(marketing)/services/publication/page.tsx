import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ServiceDetailPage } from "@/components/services/service-detail-page";
import { canonicalServices } from "@/data/services";
import { createContentMetadata } from "@/lib/metadata";

const service = canonicalServices.find((item) => item.slug === "research-paper");

export const metadata: Metadata = createContentMetadata({
  title: "Publication | Bittumama",
  description: service?.shortDescription ?? "Research paper support for manuscript preparation and publication requirements.",
  canonical: "/services/publication",
});

export default function PublicationPage() {
  if (!service) notFound();
  return <ServiceDetailPage service={{ ...service, title: "Publication" }} />;
}
