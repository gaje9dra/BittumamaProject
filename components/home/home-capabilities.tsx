import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { homepageContent } from "@/data/homepage";

export function HomeCapabilities() {
  const { capabilities } = homepageContent;

  return (
    <section
      id="home-capabilities"
      aria-labelledby="home-capabilities-title"
      className="border-y border-border bg-surface-muted scroll-anchor"
    >
      <Container size="wide" className="layout-section-lg">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-x-8 xl:gap-x-12">
          <div className="lg:col-span-4 lg:col-start-1">
            <p className="type-label text-muted-foreground">{capabilities.eyebrow}</p>
            <Heading id="home-capabilities-title" level={2} className="mt-4 max-w-[15ch]">
              {capabilities.title}
            </Heading>
            <Text size="default" className="mt-6 max-w-[34ch] text-muted-foreground">
              {capabilities.intro}
            </Text>

            <div className="mt-10 border-t border-border pt-4">
              <p className="type-caption max-w-[28ch] text-muted-foreground">
                Research / Intelligence / Education / Applied expertise
              </p>
            </div>
          </div>

          <div className="lg:col-span-8 lg:col-start-5">
            <div className="border-t border-border">
              {capabilities.items.map((item) => (
                <Link
                  key={item.index}
                  href={item.href}
                  className="group grid gap-5 border-b border-border py-7 transition-[background-color,padding] duration-[var(--motion-fast)] ease-[var(--motion-ease-standard)] hover:bg-background sm:grid-cols-[3.5rem_minmax(10rem,.65fr)_minmax(0,1fr)_2rem] sm:items-center sm:px-5 sm:hover:px-6"
                >
                  <span className="type-caption text-muted-foreground">{item.index}</span>

                  <span className="type-h4 text-foreground transition-colors duration-[var(--motion-fast)] group-hover:text-primary">
                    {item.label}
                  </span>

                  <span className="type-body-sm max-w-[38ch] text-muted-foreground">
                    {item.description}
                  </span>

                  <span
                    aria-hidden="true"
                    className="flex size-8 items-center justify-center rounded-full border border-border text-muted-foreground transition-[color,border-color,transform] duration-[var(--motion-fast)] group-hover:border-primary group-hover:text-primary group-hover:translate-x-0.5"
                  >
                    <ArrowUpRight className="size-4" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
