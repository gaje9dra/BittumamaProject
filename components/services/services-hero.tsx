import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";

export function ServicesHero() {
  return (
    <section aria-labelledby="services-page-title" className="border-b border-border bg-background">
      <Container size="wide" className="py-10 sm:py-14 lg:py-16">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between sm:gap-8">
          <div>
            <p className="type-label text-muted-foreground">Services</p>
            <Heading id="services-page-title" level={1} className="mt-3 max-w-[18ch]">
              Research support you can engage for.
            </Heading>
          </div>
          <p className="type-body-sm max-w-[48ch] text-muted-foreground sm:pb-1">
            Thesis, research, analysis, publication, mentoring and research technology services.
          </p>
        </div>
      </Container>
    </section>
  );
}
