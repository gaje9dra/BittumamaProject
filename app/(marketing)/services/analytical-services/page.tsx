import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ServiceDetailPage } from "@/components/services/service-detail-page";
import { canonicalServices } from "@/data/services";
import { createContentMetadata } from "@/lib/metadata";

const service = canonicalServices.find((item) => item.slug === "data-analysis-visualization");

export const metadata: Metadata = createContentMetadata({
  title: "Analytical Services | Bittumama",
  description: service?.shortDescription ?? "Statistical analysis, data visualisation and research interpretation support.",
  canonical: "/services/analytical-services",
});

export default function AnalyticalServicesPage() {
  if (!service) notFound();
  return <ServiceDetailPage service={{ ...service, title: "Analytical Services" }} />;
}
