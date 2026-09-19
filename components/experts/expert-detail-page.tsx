import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { ExpertDetailContent } from "@/components/experts/expert-detail-content";
import { ExpertsCta } from "@/components/experts/experts-cta";
import type { Expert } from "@/data/expertise";

export function ExpertDetailPage({ expert }: { expert: Expert }) {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <section aria-labelledby="expert-detail-title" className="border-b border-border">
        <Container size="wide" className="py-8 sm:py-10 lg:py-12">
          <Link href="/experts" className="type-caption text-muted-foreground underline decoration-border underline-offset-4 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2">
            ← Back to Experts
          </Link>
          <div className="mt-8 grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-x-8 xl:gap-x-12">
            <div className="lg:col-span-8">
              {expert.discipline && <p className="type-label text-muted-foreground">{expert.discipline}</p>}
              <Heading id="expert-detail-title" level={1} className="mt-3 max-w-[18ch]">{expert.name}</Heading>
              {expert.role && <p className="type-body-lg mt-4 max-w-[50ch] text-muted-foreground">{expert.role}</p>}
              {expert.shortBio && <p className="type-body mt-5 max-w-[60ch]">{expert.shortBio}</p>}
            </div>
            {expert.image ? (
              <figure className="relative aspect-[4/3] overflow-hidden border border-border bg-surface-muted lg:col-span-4">
                <Image src={expert.image} alt={expert.name} fill sizes="(min-width: 1024px) 33vw, 100vw" className="object-cover" />
              </figure>
            ) : null}
          </div>
        </Container>
      </section>
      <ExpertDetailContent expert={expert} />
      <ExpertsCta />
    </main>
  );
}
