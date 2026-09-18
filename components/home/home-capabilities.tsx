import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { homepageContent } from "@/data/homepage";

export function HomeCapabilities() {
  const { capabilities } = homepageContent;

  return (
    <section aria-labelledby="home-capabilities-title" className="border-y border-border bg-surface-muted">
      <Container size="wide" className="layout-section-lg">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,.72fr)_minmax(0,1.28fr)] lg:gap-16">
          <div>
            <p className="type-label text-muted-foreground">{capabilities.eyebrow}</p>
            <Heading id="home-capabilities-title" level={2} className="mt-4 max-w-[16ch]">
              {capabilities.title}
            </Heading>
            <Text size="default" className="mt-6 max-w-[38ch] text-muted-foreground">
              {capabilities.intro}
            </Text>
          </div>

          <div className="border-t border-border">
            {capabilities.items.map((item) => (
              <Link
                key={item.index}
                href={item.href}
                className="group grid gap-4 border-b border-border py-6 sm:grid-cols-[3rem_minmax(9rem,.55fr)_minmax(0,1fr)_auto] sm:items-start"
              >
                <span className="type-caption pt-1 font-medium text-muted-foreground">{item.index}</span>
                <span className="type-h5 text-foreground">{item.label}</span>
                <span className="type-body-sm max-w-[38ch] text-muted-foreground">{item.description}</span>
                <ArrowUpRight aria-hidden="true" className="size-4 text-muted-foreground transition-transform duration-[var(--motion-fast)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
