import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { ScrollTransition } from "@/components/ui/scroll-transition";
import { ScrollStagger } from "@/components/ui/scroll-stagger";
import { PRICING_ITEMS } from "@/data/pricing";

export function HomepagePricingSection() {
  return (
    <section
      id="pricing"
      aria-labelledby="pricing-title"
      className="border-y border-border bg-[#f6f0e5]"
    >
      <Container size="wide" className="layout-section-lg">
        <ScrollTransition distance={44}>
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="type-label text-[#a9150d]">PRICING</p>
              <h2
                id="pricing-title"
                className="mt-3 max-w-[15ch] font-display text-[clamp(2.15rem,4vw,3.5rem)] font-semibold leading-[0.98] tracking-[-0.045em] text-foreground"
              >
                Research support, <span className="text-[#b3130d]">clearly priced.</span>
              </h2>
              <p className="mt-4 max-w-[48rem] text-[0.92rem] leading-6 text-muted-foreground sm:text-[1.05rem]">
                Indicative pricing for selected research, academic and publication services.
              </p>
            </div>

            <div className="flex items-center gap-3 pb-1" aria-hidden="true">
              <span className="h-px w-16 bg-border" />
              <span className="size-2 rotate-45 bg-[#f0c400]" />
              <span className="h-px w-16 bg-border" />
            </div>
          </div>

          <ScrollStagger className="mt-10" stagger={0.08} distance={24}>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
              {PRICING_ITEMS.map((item) => (
                <Link
                  key={item.number}
                  href={`/pricing/${item.slug}`}
                  aria-label={`View pricing details for ${item.title}, ${item.scope}`}
                  className="group relative flex min-h-[15.5rem] flex-col overflow-hidden rounded-[0.5rem] border border-[#d8d0c3] bg-white px-5 py-5 shadow-[0_10px_30px_rgba(20,50,82,.06)] transition-[transform,box-shadow] duration-200 ease-out hover:-translate-y-1 hover:shadow-[0_18px_42px_rgba(20,50,82,.12)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#173f6b]"
                  
                >
                  <div className="flex items-start justify-between">
                    <span className="font-display text-3xl font-semibold tracking-[-0.04em] text-[#173f6b]/20">
                      {item.number}
                    </span>
                    <span className="flex size-9 items-center justify-center rounded-full border border-[#173f6b]/15 text-[#173f6b]">
                      <ArrowUpRight aria-hidden="true" className="size-4" />
                    </span>
                  </div>

                  <div className="mt-auto">
                    <h3 className="font-display text-[1.25rem] font-semibold leading-[1.08] tracking-[-0.025em] text-[#173f6b]">
                      {item.title}
                    </h3>
                    <span className="mt-3 block h-[3px] w-9 bg-[#ffd400] transition-[width] duration-200 group-hover:w-14" />
                    <p className="mt-3 min-h-10 text-[0.82rem] leading-5 text-muted-foreground">
                      {item.scope}
                    </p>
                    <p className="mt-3 font-display text-[1.7rem] font-semibold tracking-[-0.035em] text-[#b3130d]">
                      {item.price}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </ScrollStagger>
        </ScrollTransition>
      </Container>
    </section>
  );
}
