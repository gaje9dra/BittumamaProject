import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ServiceDetailPage } from "@/components/services/service-detail-page";
import { canonicalServices } from "@/data/services";
import { createContentMetadata } from "@/lib/metadata";

const service = canonicalServices.find((item) => item.slug === "thesis-assistance");

export const metadata: Metadata = createContentMetadata({
  title: "Thesis Support | Bittumama",
  description: service?.shortDescription ?? "Structured thesis support for research planning, writing and refinement.",
  canonical: "/services/thesis-support",
});

export default function ThesisSupportPage() {
  if (!service) notFound();
  return <ServiceDetailPage service={{ ...service, title: "Thesis Support" }} />;
}
