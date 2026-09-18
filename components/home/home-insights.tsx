import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { homepageContent } from "@/data/homepage";

export function HomeInsights() {
  const { insights } = homepageContent;

  return (
    <section aria-labelledby="home-insights-title" className="border-t border-border bg-surface-muted">
      <Container size="wide" className="layout-section-lg">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,.7fr)_minmax(0,1.3fr)] lg:gap-16">
          <div>
            <p className="type-label text-muted-foreground">{insights.eyebrow}</p>
            <Heading id="home-insights-title" level={2} className="mt-4 max-w-[15ch]">
              {insights.title}
            </Heading>
            <Text className="mt-6 max-w-[38ch] text-muted-foreground">
              {insights.description}
            </Text>
          </div>

          <div className="border-t border-border">
            {insights.items.map((item, index) => (
              <Link
                key={item.label}
                href={item.href}
                className="group grid gap-3 border-b border-border py-6 sm:grid-cols-[3rem_minmax(0,1fr)_auto] sm:items-center"
              >
                <span className="type-caption text-muted-foreground">0{index + 1}</span>
                <div>
                  <span className="type-h5 block text-foreground">{item.label}</span>
                  <span className="type-caption mt-1 block text-muted-foreground">{item.meta}</span>
                </div>
                <ArrowUpRight aria-hidden="true" className="size-4 text-muted-foreground transition-transform duration-[var(--motion-fast)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
