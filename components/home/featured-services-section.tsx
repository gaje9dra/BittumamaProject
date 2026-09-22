import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  FileText,
  GraduationCap,
} from "lucide-react";
import { Container } from "@/components/ui/container";
import { ScrollTransition } from "@/components/ui/scroll-transition";
import { ScrollStagger } from "@/components/ui/scroll-stagger";

const HOME_SERVICE_CARDS = [
  {
    number: "01",
    title: "Thesis Support",
    description:
      "Expert guidance through every chapter — from proposal to final submission, structured around your research requirement.",
    href: "/services/thesis-support",
    icon: BookOpen,
    art: "thesis",
  },
  {
    number: "02",
    title: "Publication",
    description:
      "Research paper support for manuscript preparation, academic presentation and submission requirements.",
    href: "/services/publication",
    icon: FileText,
    art: "publication",
  },
  {
    number: "03",
    title: "Analytical Services",
    description:
      "Statistical analysis, data visualisation and research interpretation using appropriate analytical methods.",
    href: "/services/analytical-services",
    icon: BarChart3,
    art: "analysis",
  },
  {
    number: "04",
    title: "Mentoring",
    description:
      "Focused research guidance to help you make clearer decisions about methodology, structure and next steps.",
    href: "/services/mentoring",
    icon: GraduationCap,
    art: "mentoring",
  },
] as const;

function CardArtwork({ type }: { type: (typeof HOME_SERVICE_CARDS)[number]["art"] }) {
  if (type === "thesis") {
    return (
      <svg viewBox="0 0 360 220" aria-hidden="true" className="absolute inset-0 h-full w-full opacity-[0.18]">
        <path d="M52 174c16-67 40-112 73-137 21 31 37 66 43 112 15-54 38-93 70-119 18 32 26 77 24 127" fill="none" stroke="currentColor" strokeWidth="18" strokeLinecap="round" />
        <path d="M45 186h285M77 151h88M206 135h76" stroke="currentColor" strokeWidth="5" />
        <circle cx="82" cy="70" r="29" fill="currentColor" opacity=".7" />
      </svg>
    );
  }

  if (type === "publication") {
    return (
      <svg viewBox="0 0 360 220" aria-hidden="true" className="absolute inset-0 h-full w-full opacity-[0.18]">
        <path d="M72 166 142 96l55 55-70 35Z" fill="currentColor" />
        <path d="m161 90 28-28 55 55-28 28Z" fill="none" stroke="currentColor" strokeWidth="12" />
        <path d="M88 176h190M108 49l40 23M76 78l43 11M259 72l-12 41" stroke="currentColor" strokeWidth="7" />
        <circle cx="281" cy="48" r="18" fill="currentColor" />
      </svg>
    );
  }

  if (type === "analysis") {
    return (
      <svg viewBox="0 0 360 220" aria-hidden="true" className="absolute inset-0 h-full w-full opacity-[0.18]">
        <path d="M48 181h270M66 181V72M110 181v-53M154 181V94M198 181v-76M242 181V51M286 181v-94" stroke="currentColor" strokeWidth="20" />
        <path d="M55 57 103 91l47-30 46 41 48-66 48 38" fill="none" stroke="currentColor" strokeWidth="7" />
        <circle cx="103" cy="91" r="8" fill="currentColor" />
        <circle cx="198" cy="102" r="8" fill="currentColor" />
        <circle cx="242" cy="36" r="8" fill="currentColor" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 360 220" aria-hidden="true" className="absolute inset-0 h-full w-full opacity-[0.18]">
      <circle cx="178" cy="108" r="54" fill="none" stroke="currentColor" strokeWidth="12" />
      <circle cx="178" cy="108" r="22" fill="currentColor" />
      <path d="M178 31v39M178 146v39M101 108h39M216 108h39M124 54l28 28M204 134l28 28M124 162l28-28M204 82l28-28" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
      <path d="M58 174c31-28 52-42 78-47M221 127c28-8 49-7 80 6" fill="none" stroke="currentColor" strokeWidth="6" />
    </svg>
  );
}

export function FeaturedServicesSection() {
  return (
    <section
      id="featured-services"
      aria-labelledby="featured-services-title"
      className="scroll-anchor border-y border-border bg-[#f6f0e5]"
    >
      <Container size="wide" className="layout-section-lg">
        <ScrollTransition distance={44}>
          <div className="text-center">
            <p className="type-label text-[#a9150d]">WHAT WE OFFER</p>
            <h2
              id="featured-services-title"
              className="mx-auto mt-3 max-w-[16ch] font-display text-[clamp(2.15rem,4vw,3.5rem)] font-semibold leading-[0.98] tracking-[-0.045em] text-foreground"
            >
              Our <span className="text-[#b3130d]">Services</span>
            </h2>
            <p className="mx-auto mt-4 max-w-[48rem] text-[0.92rem] leading-6 text-muted-foreground sm:text-[1.05rem]">
              Specialist support across every dimension of your research journey.
            </p>
            <div className="mx-auto mt-6 flex items-center justify-center gap-3" aria-hidden="true">
              <span className="h-px w-20 bg-border" />
              <span className="size-2 rotate-45 bg-[#f0c400]" />
              <span className="h-px w-20 bg-border" />
            </div>
          </div>

          <ScrollStagger className="mx-auto mt-8 grid max-w-[1180px] grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4" stagger={0.09} distance={26}>
            {HOME_SERVICE_CARDS.map((card) => {
              const Icon = card.icon;

              return (
                <Link
                  key={card.number}
                  href={card.href}
                  aria-label={`Learn more about ${card.title}`}
                  className="group relative min-h-[20rem] overflow-hidden rounded-[0.5rem] bg-[#173f6b] px-5 py-5 text-white shadow-[0_10px_30px_rgba(20,50,82,.08)] transition-[transform,box-shadow] duration-200 ease-out hover:-translate-y-1 hover:shadow-[0_18px_42px_rgba(20,50,82,.18)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#173f6b]"
                >
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(255,255,255,.08),transparent_30%),linear-gradient(135deg,rgba(255,255,255,.035),transparent_55%)]" />
                  <CardArtwork type={card.art} />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#12375d]/95 via-[#173f6b]/55 to-[#173f6b]/35" />

                  <div className="relative flex h-full min-h-[18rem] flex-col">
                    <div className="flex items-start justify-between">
                      <span className="font-display text-3xl font-semibold tracking-[-0.04em] text-white/20">
                        {card.number}
                      </span>
                      <span className="flex size-10 items-center justify-center rounded-lg border border-[#d7b900]/60 bg-[#234b70]/90 text-[#ffd400]">
                        <Icon aria-hidden="true" className="size-5" />
                      </span>
                    </div>

                    <div className="mt-auto">
                      <h3 className="max-w-[14ch] font-display text-[1.3rem] font-semibold leading-[1.08] tracking-[-0.025em]">
                        {card.title}
                      </h3>
                      <span className="mt-4 block h-[3px] w-9 bg-[#ffd400] transition-[width] duration-200 group-hover:w-14" />
                      <p className="mt-4 max-w-[32ch] text-[0.8rem] leading-5.5 text-white/80">
                        {card.description}
                      </p>

                      <span className="mt-5 inline-flex min-h-9 items-center gap-3 text-[0.72rem] font-bold uppercase tracking-[0.14em] text-[#ffd400]">
                        Learn More
                        <span className="flex size-6 items-center justify-center rounded-full border border-[#ffd400]">
                          <ArrowRight aria-hidden="true" className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
                        </span>
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </ScrollStagger>
        </ScrollTransition>
      </Container>
    </section>
  );
}
