import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { homepageContent } from "@/data/homepage";

export function HomePositioning() {
  const { positioning } = homepageContent;

  return (
    <section aria-labelledby="home-positioning-title" className="layout-section-lg">
      <Container size="wide">
        <div className="layout-editorial">
          <p className="type-label text-muted-foreground">{positioning.eyebrow}</p>
          <div>
            <Heading id="home-positioning-title" level={2} className="type-measure-section max-w-[22ch]">
              {positioning.title}
            </Heading>
            <Text size="lg" className="mt-6 max-w-[60ch] text-muted-foreground">
              {positioning.description}
            </Text>

            <nav aria-label="Homepage areas" className="mt-12 border-t border-border">
              {positioning.links.map((item, index) => (
                <Link
                  key={item.href + item.label}
                  href={item.href}
                  className="group grid gap-3 border-b border-border py-5 transition-colors duration-[var(--motion-fast)] hover:bg-surface-muted sm:grid-cols-[3rem_minmax(10rem,.55fr)_minmax(0,1fr)_auto] sm:items-center sm:px-4"
                >
                  <span className="type-caption text-muted-foreground">0{index + 1}</span>
                  <span className="type-h5 text-foreground">{item.label}</span>
                  <span className="type-body-sm max-w-[38ch] text-muted-foreground">{item.description}</span>
                  <ArrowUpRight aria-hidden="true" className="size-4 text-muted-foreground transition-transform duration-[var(--motion-fast)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </Container>
    </section>
  );
}
