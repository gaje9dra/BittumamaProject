import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import type { Service } from "@/data/services";

type ServiceHighlightsProps = {
  service: Service;
};

export function ServiceHighlights({ service }: ServiceHighlightsProps) {
  if (!service.highlights?.length) return null;

  return (
    <section
      aria-labelledby="service-highlights-title"
      className="bg-background"
    >
      <Container size="wide" className="layout-section-lg">
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-x-8 xl:gap-x-12">
          <div className="lg:col-span-4">
            <p className="type-label text-muted-foreground">02 / Highlights</p>
            <Heading
              id="service-highlights-title"
              level={2}
              className="mt-4 max-w-[18ch]"
            >
              Key areas of support.
            </Heading>
          </div>

          <ol className="border-t border-border lg:col-span-8 lg:col-start-5">
            {service.highlights.map((highlight, index) => (
              <li
                key={`${service.id}-highlight-${index}`}
                className="grid gap-5 border-b border-border py-6 sm:grid-cols-[3rem_minmax(0,1fr)] sm:gap-6"
              >
                <span className="type-caption text-muted-foreground">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <Heading level={3} className="max-w-[30ch]">
                    {highlight.title}
                  </Heading>
                  <p className="type-body-sm mt-2 max-w-[52ch] text-muted-foreground">
                    {highlight.description}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </Container>
    </section>
  );
}
