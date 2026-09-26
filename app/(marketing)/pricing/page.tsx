import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { ScrollTransition } from "@/components/ui/scroll-transition";
import { ScrollStagger } from "@/components/ui/scroll-stagger";
import { PRICING_ITEMS } from "@/data/pricing";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Pricing",
  description: "SkillVeda research, academic and publication service pricing.",
});

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-[#f6f0e5] text-foreground">
      <Container size="wide" className="layout-section-lg">
        <ScrollTransition distance={44}>
          <p className="type-label text-[#a9150d]">PRICING</p>
          <h1 className="mt-3 max-w-[15ch] font-display text-[clamp(2.7rem,6vw,5.5rem)] font-semibold leading-[0.92] tracking-[-0.055em]">
            Research support, <span className="text-[#b3130d]">clearly priced.</span>
          </h1>
          <p className="mt-5 max-w-[48rem] text-base leading-7 text-muted-foreground sm:text-lg">
            Indicative pricing for selected research, academic and publication services.
          </p>
          <ScrollStagger className="mt-12" stagger={0.08} distance={24}>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
              {PRICING_ITEMS.map((item) => (
                <Link
                  key={item.number}
                  href={`/pricing/${item.slug}`}
                  className="group relative flex min-h-[15.5rem] flex-col overflow-hidden rounded-[0.5rem] border border-[#d8d0c3] bg-white px-5 py-5 shadow-[0_10px_30px_rgba(20,50,82,.06)] transition-[transform,box-shadow] duration-200 hover:-translate-y-1 hover:shadow-[0_18px_42px_rgba(20,50,82,.12)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#173f6b]"
                >
                  <div className="flex items-start justify-between">
                    <span className="font-display text-3xl font-semibold tracking-[-0.04em] text-[#173f6b]/20">{item.number}</span>
                    <span className="flex size-9 items-center justify-center rounded-full border border-[#173f6b]/15 text-[#173f6b]">
                      <ArrowUpRight aria-hidden="true" className="size-4" />
                    </span>
                  </div>
                  <div className="mt-auto">
                    <h2 className="font-display text-[1.25rem] font-semibold leading-[1.08] tracking-[-0.025em] text-[#173f6b]">{item.title}</h2>
                    <span className="mt-3 block h-[3px] w-9 bg-[#ffd400] transition-[width] duration-200 group-hover:w-14" />
                    <p className="mt-3 min-h-10 text-[0.82rem] leading-5 text-muted-foreground">{item.scope}</p>
                    <p className="mt-3 font-display text-[1.7rem] font-semibold tracking-[-0.035em] text-[#b3130d]">{item.price}</p>
                  </div>
                </Link>
              ))}
            </div>
          </ScrollStagger>
        </ScrollTransition>
      </Container>
    </main>
  );
}
