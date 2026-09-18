import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { homepageContent } from "@/data/homepage";

export function HomeCta() {
  const { cta } = homepageContent;

  return (
    <section aria-labelledby="home-cta-title" className="layout-section-xl">
      <Container size="narrow">
        <div className="border-t-2 border-primary pt-7">
          <p className="type-label text-muted-foreground">{cta.eyebrow}</p>
          <Heading id="home-cta-title" level={2} className="mt-5 max-w-[18ch]">
            {cta.title}
          </Heading>
          <Text size="lg" className="mt-7 max-w-[56ch] text-muted-foreground">
            {cta.description}
          </Text>
          <Link
            href={cta.action.href}
            className="group mt-9 inline-flex min-h-11 items-center gap-2 rounded-[var(--radius-md)] bg-primary px-5 type-button text-primary-foreground transition-colors duration-[var(--motion-fast)] hover:bg-primary-700 focus-visible:outline-2 focus-visible:outline-offset-3"
          >
            {cta.action.label}
            <ArrowUpRight aria-hidden="true" className="size-4 transition-transform duration-[var(--motion-fast)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </div>
      </Container>
    </section>
  );
}
