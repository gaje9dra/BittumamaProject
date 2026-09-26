import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Check } from "lucide-react";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/container";
import { ScrollTransition } from "@/components/ui/scroll-transition";
import { PRICING_ITEMS } from "@/data/pricing";
import { createPageMetadata } from "@/lib/metadata";
import { globalActions } from "@/data/site-config";

type PricingPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return PRICING_ITEMS.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: PricingPageProps): Promise<Metadata> {
  const { slug } = await params;
  const item = PRICING_ITEMS.find((pricing) => pricing.slug === slug);

  if (!item) {
    return createPageMetadata({
      title: "Pricing",
      description: "SkillVeda research support pricing.",
    });
  }

  return createPageMetadata({
    title: item.title,
    description: item.description,
  });
}

export default async function PricingDetailPage({ params }: PricingPageProps) {
  const { slug } = await params;
  const item = PRICING_ITEMS.find((pricing) => pricing.slug === slug);

  if (!item) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="border-b border-border bg-[#f6f0e5]">
        <Container size="wide" className="layout-section-lg">
          <ScrollTransition distance={36}>
            <Link
              href="/#pricing"
              className="inline-flex items-center gap-2 type-button text-[#173f6b] transition-colors hover:text-[#b3130d] focus-visible:outline-2 focus-visible:outline-offset-4"
            >
              <ArrowLeft aria-hidden="true" className="size-4" />
              Back to pricing
            </Link>

            <div className="mt-12 grid gap-12 lg:grid-cols-[minmax(0,1.25fr)_minmax(18rem,0.75fr)] lg:items-end">
              <div>
                <p className="type-label text-[#a9150d]">PRICING / {item.number}</p>
                <h1 className="mt-4 max-w-[12ch] font-display text-[clamp(3rem,7vw,6.5rem)] font-semibold leading-[0.9] tracking-[-0.06em] text-foreground">
                  {item.title}
                </h1>
                <p className="mt-7 max-w-[46rem] text-lg leading-8 text-muted-foreground">
                  {item.description}
                </p>
              </div>

              <div className="rounded-[0.6rem] border border-[#d8d0c3] bg-white p-7 shadow-[0_18px_45px_rgba(20,50,82,.08)]">
                <p className="type-label text-muted-foreground">INDICATIVE PRICE</p>
                <p className="mt-3 font-display text-4xl font-semibold tracking-[-0.04em] text-[#b3130d]">
                  {item.price}
                </p>
                <div className="mt-5 border-t border-border pt-5">
                  <p className="type-label text-[#173f6b]">SCOPE</p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.scope}</p>
                </div>
              </div>
            </div>
          </ScrollTransition>
        </Container>
      </section>

      <section>
        <Container size="wide" className="layout-section-lg">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
            <ScrollTransition distance={28}>
              <p className="type-label text-[#a9150d]">SERVICE DETAILS</p>
              <h2 className="mt-4 max-w-[12ch] font-display text-4xl font-semibold leading-[0.98] tracking-[-0.045em] text-[#173f6b] sm:text-5xl">
                A clear scope for your research requirement.
              </h2>
            </ScrollTransition>

            <ScrollTransition distance={28} mode="visual">
              <div className="border-y border-border">
                {item.details.map((detail) => (
                  <div key={detail} className="flex items-start gap-4 border-b border-border py-5 last:border-b-0">
                    <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-[#ffd400] text-[#173f6b]">
                      <Check aria-hidden="true" className="size-3.5" />
                    </span>
                    <p className="text-base leading-7 text-muted-foreground">{detail}</p>
                  </div>
                ))}
              </div>
            </ScrollTransition>
          </div>
        </Container>
      </section>

      <section className="border-y border-border bg-[#173f6b] text-white">
        <Container size="wide" className="py-14 sm:py-16 lg:py-20">
          <div className="flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="type-label text-white/65">NEXT STEP</p>
              <h2 className="mt-4 max-w-[14ch] font-display text-4xl font-semibold leading-[0.98] tracking-[-0.045em] sm:text-5xl">
                Discuss your exact requirement.
              </h2>
              <p className="mt-4 max-w-[40rem] text-sm leading-6 text-white/70 sm:text-base">
                Pricing is indicative. Share your project details to confirm the scope, requirements and final quotation.
              </p>
            </div>

            <Link
              href={globalActions.contact.href}
              className="group inline-flex min-h-12 shrink-0 items-center gap-3 border-b border-white/60 pb-2 type-button text-white transition-colors hover:border-white focus-visible:outline-2 focus-visible:outline-offset-4"
            >
              Start an Enquiry
              <ArrowUpRight
                aria-hidden="true"
                className="size-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </Link>
          </div>
        </Container>
      </section>
    </main>
  );
}
