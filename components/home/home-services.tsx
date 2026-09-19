import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { homepageContent } from "@/data/homepage";

export function HomeServices() {
  const { services } = homepageContent;

  return (
    <section id="home-services" aria-labelledby="home-services-title" className="scroll-anchor bg-surface-muted">
      <Container size="wide" className="layout-section-xl">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-x-8 xl:gap-x-12">
          <div className="lg:col-span-4">
            <p className="type-label text-muted-foreground">{services.eyebrow}</p>
            <Heading id="home-services-title" level={2} className="mt-5 max-w-[16ch]">{services.title}</Heading>
            <Text size="lg" className="mt-7 max-w-[43ch] text-muted-foreground">{services.description}</Text>
            <Link href={services.action.href} className="group mt-9 inline-flex min-h-11 items-center gap-2 type-button text-primary underline decoration-primary/30 underline-offset-4 transition-[color,text-decoration-color] duration-[var(--motion-fast)] hover:decoration-primary focus-visible:outline-2 focus-visible:outline-offset-3">
              {services.action.label}
              <ArrowUpRight aria-hidden="true" className="size-4 transition-transform duration-[var(--motion-fast)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </div>

          <div className="lg:col-span-8 lg:col-start-5">
            <div className="border-t border-border">
              {services.items.map((service, index) => (
                <Link key={service.id} href={service.href} className="group grid min-h-32 gap-5 border-b border-border py-7 transition-colors duration-[var(--motion-fast)] hover:bg-background/70 focus-visible:bg-background/70 focus-visible:outline-2 focus-visible:outline-offset-[-2px] sm:grid-cols-[3rem_minmax(0,1fr)_minmax(12rem,.45fr)_auto] sm:items-start sm:gap-6 sm:py-8">
                  <span className="type-caption text-muted-foreground">{String(index + 1).padStart(2, "0")}</span>
                  <div>
                    <p className="type-h4 max-w-[22ch] transition-transform duration-[var(--motion-fast)] group-hover:translate-x-0.5">{service.title}</p>
                    <p className="type-body-sm mt-3 max-w-[48ch] text-muted-foreground">{service.shortDescription}</p>
                  </div>
                  <dl className="grid grid-cols-2 gap-x-5 gap-y-2 sm:block sm:border-l sm:border-border sm:pl-6">
                    <div><dt className="type-caption text-muted-foreground/80">Audience</dt><dd className="type-body-sm mt-1">{service.audience}</dd></div>
                    <div className="sm:mt-4"><dt className="type-caption text-muted-foreground/80">Category</dt><dd className="type-body-sm mt-1">{service.category}</dd></div>
                  </dl>
                  <ArrowUpRight aria-hidden="true" className="mt-1 size-5 text-muted-foreground transition-transform duration-[var(--motion-fast)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </Link>
              ))}
            </div>
            <p className="mt-6 max-w-[60ch] type-caption text-muted-foreground"></p>
          </div>
        </div>
      </Container>
    </section>
  );
}
