import Image from "next/image";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { ResearchBreadcrumbs } from "@/components/research/research-breadcrumbs";
import type { ResearchEntry } from "@/data/research";

export function ResearchDetailHero({ research }: { research: ResearchEntry }) {
  return (
    <section aria-labelledby="research-detail-title" className="border-b border-border bg-background">
      <ResearchBreadcrumbs title={research.title} />
      <Container size="wide" className="layout-section-lg">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-x-8 xl:gap-x-12">
          <div className="lg:col-span-8">
            <p className="type-label text-muted-foreground">{research.type ?? research.category}</p>
            <Heading id="research-detail-title" level={1} className="mt-5 max-w-[16ch]">{research.title}</Heading>
            <p className="type-body-lg mt-6 max-w-[54ch] text-muted-foreground">{research.shortDescription}</p>
          </div>
          <div className="lg:col-span-4 lg:col-start-9 lg:flex lg:flex-col lg:justify-end lg:gap-8">
            {research.image && (
              <figure className="relative aspect-[4/3] overflow-hidden border border-border bg-surface-muted">
                <Image
                  src={research.image}
                  alt={research.title}
                  fill
                  sizes="(min-width: 1280px) 30vw, (min-width: 1024px) 33vw, 100vw"
                  className="object-cover"
                />
              </figure>
            )}
            <dl className="w-full border-t border-border">
              {research.category && <div className="grid gap-2 border-b border-border py-4 sm:grid-cols-[7rem_minmax(0,1fr)] sm:gap-6"><dt className="type-caption text-muted-foreground">Category</dt><dd className="type-body-sm">{research.category}</dd></div>}
              {research.topic && <div className="grid gap-2 border-b border-border py-4 sm:grid-cols-[7rem_minmax(0,1fr)] sm:gap-6"><dt className="type-caption text-muted-foreground">Topic</dt><dd className="type-body-sm">{research.topic}</dd></div>}
              {research.date && <div className="grid gap-2 border-b border-border py-4 sm:grid-cols-[7rem_minmax(0,1fr)] sm:gap-6"><dt className="type-caption text-muted-foreground">Date</dt><dd className="type-body-sm">{research.date}</dd></div>}
              {research.status && <div className="grid gap-2 border-b border-border py-4 sm:grid-cols-[7rem_minmax(0,1fr)] sm:gap-6"><dt className="type-caption text-muted-foreground">Status</dt><dd className="type-body-sm">{research.status}</dd></div>}
            </dl>
          </div>
        </div>
      </Container>
    </section>
  );
}
