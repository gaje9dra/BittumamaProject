import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { homepageContent } from "@/data/homepage";

export function HomeIntelligence() {
  const { intelligence } = homepageContent;

  return (
    <section aria-labelledby="home-intelligence-title" className="layout-section-xl bg-primary text-primary-foreground">
      <Container size="wide">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(18rem,.9fr)] lg:items-end lg:gap-20">
          <div>
            <p className="type-label text-primary-foreground/75">{intelligence.eyebrow}</p>
            <Heading id="home-intelligence-title" level={2} className="mt-5 max-w-[18ch] text-primary-foreground">
              {intelligence.title}
            </Heading>
            <Text size="lg" className="mt-7 max-w-[58ch] text-primary-foreground/80">
              {intelligence.description}
            </Text>
            <Link
              href={intelligence.action.href}
              className="group mt-9 inline-flex min-h-11 items-center gap-2 type-button text-primary-foreground underline decoration-primary-foreground/40 underline-offset-4 transition-[color,text-decoration-color] duration-[var(--motion-fast)] hover:decoration-primary-foreground focus-visible:outline-2 focus-visible:outline-offset-3"
            >
              {intelligence.action.label}
              <ArrowUpRight aria-hidden="true" className="size-4 transition-transform duration-[var(--motion-fast)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </div>

          <div className="border-t border-primary-foreground/20 lg:border-l lg:border-t-0 lg:pl-8">
            <ul className="grid grid-cols-2 border-b border-primary-foreground/20">
              {intelligence.labels.map((label, index) => (
                <li key={label} className="border-t border-primary-foreground/20 py-5 first:border-t-0 sm:px-3 lg:first:border-t-0">
                  <span className="type-caption block text-primary-foreground/60">0{index + 1}</span>
                  <span className="type-h5 mt-2 block text-primary-foreground">{label}</span>
                </li>
              ))}
            </ul>
            <p className="type-caption mt-5 max-w-[34ch] text-primary-foreground/60">
              Future content slot: featured research, methodology, or evidence-led visual.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
