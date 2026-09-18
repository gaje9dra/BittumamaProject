import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { homepageContent } from "@/data/homepage";

export function HomeExpertise() {
  const { expertise } = homepageContent;

  return (
    <section aria-labelledby="home-expertise-title" className="layout-section-xl">
      <Container size="wide">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,.9fr)_minmax(0,1.1fr)] lg:gap-20">
          <div className="relative min-h-[24rem] overflow-hidden border border-border bg-surface-muted">
            <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(135deg,transparent_49.5%,var(--border)_49.5%,var(--border)_50.5%,transparent_50.5%)]" />
            <div className="absolute inset-x-6 bottom-6 border-t border-border pt-4">
              <span className="type-caption text-muted-foreground">
                People / expertise visual placeholder
              </span>
            </div>
          </div>

          <div className="flex flex-col justify-end">
            <p className="type-label text-muted-foreground">{expertise.eyebrow}</p>
            <Heading id="home-expertise-title" level={2} className="mt-5 max-w-[18ch]">
              {expertise.title}
            </Heading>
            <Text size="lg" className="mt-7 max-w-[55ch] text-muted-foreground">
              {expertise.description}
            </Text>
            <Link
              href={expertise.action.href}
              className="group mt-9 inline-flex min-h-11 w-fit items-center gap-2 type-button text-foreground underline decoration-border underline-offset-4 transition-[color,text-decoration-color] duration-[var(--motion-fast)] hover:text-primary hover:decoration-primary focus-visible:outline-2 focus-visible:outline-offset-3"
            >
              {expertise.action.label}
              <ArrowUpRight aria-hidden="true" className="size-4 transition-transform duration-[var(--motion-fast)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
