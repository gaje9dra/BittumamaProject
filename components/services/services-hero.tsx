import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";

export function ServicesHero() {
  return (
    <section aria-labelledby="services-page-title" className="border-b border-border bg-background">
      <Container size="wide" className="py-10 sm:py-14 lg:py-16">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-x-8 xl:gap-x-12">
          <div className="lg:col-span-7">
            <p className="type-label text-muted-foreground">Services</p>
            <Heading id="services-page-title" level={1} className="mt-4 max-w-[15ch]">
              Research support, from methodology to publication.
            </Heading>
          </div>
          <p className="type-body-sm max-w-[42ch] text-muted-foreground lg:col-span-4 lg:col-start-9">
            Practical support for thesis, research, analysis, publication and ongoing research work.
          </p>
        </div>
      </Container>
    </section>
  );
}
