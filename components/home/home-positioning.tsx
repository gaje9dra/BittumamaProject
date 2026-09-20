import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { ScrollHeading } from "@/components/ui/scroll-heading";
import { Text } from "@/components/ui/text";
import { homepageContent } from "@/data/homepage";

export function HomePositioning() {
  const { positioning } = homepageContent;

  return (
    <section
      id="home-positioning"
      aria-labelledby="home-positioning-title"
      className="layout-section-lg scroll-anchor"
    >
      <Container size="wide">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-x-8 xl:gap-x-12">
          <div className="lg:col-span-2">
            <p className="type-label text-muted-foreground">{positioning.eyebrow}</p>
          </div>

          <div className="lg:col-span-6 lg:col-start-3">
            <ScrollHeading
              id="home-positioning-title"
              level={2}
              className="type-h2 max-w-[20ch]"
            >
              {positioning.title}
            </ScrollHeading>
          </div>

          <div className="lg:col-span-4 lg:col-start-9 lg:pt-2">
            <Text size="lg" className="max-w-[36ch] text-muted-foreground">
              {positioning.description}
            </Text>

            <Link
              href={positioning.action.href}
              className="group mt-8 inline-flex min-h-11 items-center gap-2 type-button text-foreground underline decoration-border underline-offset-4 transition-[color,text-decoration-color] duration-[var(--motion-fast)] hover:text-primary hover:decoration-primary focus-visible:outline-2 focus-visible:outline-offset-3"
            >
              {positioning.action.label}
              <ArrowUpRight
                aria-hidden="true"
                className="size-4 transition-transform duration-[var(--motion-fast)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </Link>
          </div>
        </div>

      </Container>
    </section>
  );
}
