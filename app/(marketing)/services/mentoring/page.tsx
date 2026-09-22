import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ServiceDetailPage } from "@/components/services/service-detail-page";
import { canonicalServices } from "@/data/services";
import { createContentMetadata } from "@/lib/metadata";

const service = canonicalServices.find((item) => item.slug === "research-guidance");

export const metadata: Metadata = createContentMetadata({
  title: "Research Mentoring | Bittumama",
  description: service?.shortDescription ?? "Focused research guidance for methodology, structure and next steps.",
  canonical: "/services/mentoring",
});

export default function MentoringPage() {
  if (!service) notFound();
  return <ServiceDetailPage service={{ ...service, title: "Research Mentoring" }} />;
}
