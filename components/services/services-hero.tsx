import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";

export function ServicesHero() {
  return (
    <section aria-labelledby="services-page-title" className="border-b border-border bg-background">
      <Container size="wide" className="layout-section-lg">
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-x-8 xl:gap-x-12">
          <div className="lg:col-span-8 lg:col-start-1">
            <p className="type-label text-muted-foreground">Services</p>
            <Heading id="services-page-title" level={1} className="mt-5 max-w-[16ch]">
              Research & Academic Support
            </Heading>
          </div>
          <p className="type-body-lg max-w-[42ch] text-muted-foreground lg:col-span-4 lg:col-start-9 lg:self-end">
            Thesis, dissertation, research paper and data analysis support.
          </p>
        </div>
      </Container>
    </section>
  );
}
