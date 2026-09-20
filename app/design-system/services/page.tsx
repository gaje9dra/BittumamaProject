import { notFound } from "next/navigation";
import { getPublishedServices } from "@/lib/services/repository";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { ServiceFinder } from "@/components/services/service-finder";
import { ServicesCategoryIndex } from "@/components/services/services-category-index";
import { ServicesDirectory } from "@/components/services/services-directory";
import { ServicesHero } from "@/components/services/services-hero";
import { ServicesCta } from "@/components/services/services-cta";

export default async function ServicesPlaygroundPage() {
  const services = await getPublishedServices();
  const categories = Array.from(new Set(services.map((service) => service.category)));
  if (process.env.NODE_ENV === "production") notFound();

  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="border-b border-border">
        <Container size="wide" className="py-6">
          <p className="type-label text-muted-foreground">Development reference</p>
          <Heading level={1} className="mt-3">Services — dedicated experience</Heading>
          <p className="type-body-sm mt-3 max-w-[60ch] text-muted-foreground">
            Development-only inspection of the service finder, category navigation, indexed catalogue, service states and responsive composition.
          </p>
        </Container>
      </section>
      <ServicesHero />
      <ServiceFinder services={services} />
      <ServicesCategoryIndex categories={categories} />
      <ServicesDirectory services={services} />
      <ServicesCta />
    </main>
  );
}
