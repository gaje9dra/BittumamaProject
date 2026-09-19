import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ServiceDetailPage } from "@/components/services/service-detail-page";
import { getAllServices, getServiceBySlug, getServiceHref } from "@/data/services";

type ServicePageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getAllServices().map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({
  params,
}: ServicePageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = getServiceBySlug(slug);

  if (!service) {
    return {};
  }

  return {
    title: `${service.title} | Bittumama`,
    description: service.shortDescription,
    alternates: { canonical: getServiceHref(service) },
  };
}

export default async function ServicePage({ params }: ServicePageProps) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);

  if (!service) {
    notFound();
  }

  return <ServiceDetailPage service={service} />;
}
