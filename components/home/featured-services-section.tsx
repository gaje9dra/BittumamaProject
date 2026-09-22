import Link from "next/link";
import {
  ArrowUpRight,
  BookOpen,
  BarChart3,
  Compass,
  FileText,
  Globe2,
  PenLine,
} from "lucide-react";
import type { Service } from "@/data/services";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { ScrollTransition } from "@/components/ui/scroll-transition";
import { getPublishedServices } from "@/lib/services/repository";
import { getServiceHref } from "@/lib/services/paths";

const FEATURED_SERVICE_SLUGS = [
  "research-paper",
  "thesis-assistance",
  "data-analysis-visualization",
  "thesis-editing-proofreading",
  "research-guidance",
  "international-research-paper",
] as const;

const CARD_THEMES = [
  { surface: "bg-[#163f35]", text: "text-[#fff7e8]", muted: "text-[#d9e6dc]", line: "bg-[#d8b15a]", border: "border-[#3d675a]" },
  { surface: "bg-[#245c61]", text: "text-[#fff7e8]", muted: "text-[#dce9df]", line: "bg-[#d9a28e]", border: "border-[#4a7a7b]" },
  { surface: "bg-[#f1eadb]", text: "text-[#183d35]", muted: "text-[#5e6d65]", line: "bg-[#b65b47]", border: "border-[#d9cdb7]" },
  { surface: "bg-[#24483f]", text: "text-[#fff7e8]", muted: "text-[#d7e3da]", line: "bg-[#c99735]", border: "border-[#46675d]" },
  { surface: "bg-[#e2e9dd]", text: "text-[#183d35]", muted: "text-[#5b6b62]", line: "bg-[#2d6a67]", border: "border-[#c4d2c2]" },
  { surface: "bg-[#6a4037]", text: "text-[#fff7e8]", muted: "text-[#ead8cc]", line: "bg-[#d6b45e]", border: "border-[#815a50]" },
] as const;

type FeaturedSlug = (typeof FEATURED_SERVICE_SLUGS)[number];

function ServiceIcon({ slug }: { slug: FeaturedSlug }) {
  const common = { "aria-hidden": true, className: "size-5" } as const;
  switch (slug) {
    case "research-paper": return <FileText {...common} />;
    case "thesis-assistance": return <BookOpen {...common} />;
    case "data-analysis-visualization": return <BarChart3 {...common} />;
    case "thesis-editing-proofreading": return <PenLine {...common} />;
    case "research-guidance": return <Compass {...common} />;
    case "international-research-paper": return <Globe2 {...common} />;
  }
}

function ServiceArtwork({ slug }: { slug: FeaturedSlug }) {
  const stroke = "currentColor";
  switch (slug) {
    case "research-paper":
      return (
        <svg viewBox="0 0 320 150" className="h-full w-full" role="img" aria-label="Research document structure">
          <g fill="none" stroke={stroke} strokeWidth="1.5">
            <rect x="46" y="22" width="138" height="106" rx="2" opacity=".9" />
            <path d="M64 45h76M64 58h92M64 77h72M64 90h88M64 103h56" opacity=".7" />
            <path d="M206 39h66M206 55h48M206 71h60M206 87h39" opacity=".45" />
            <path d="M184 37l22 0M184 70l22 0M184 103l22 0" strokeDasharray="3 4" opacity=".6" />
            <circle cx="193" cy="37" r="3" fill="currentColor" stroke="none" />
            <circle cx="193" cy="70" r="3" fill="currentColor" stroke="none" />
            <circle cx="193" cy="103" r="3" fill="currentColor" stroke="none" />
          </g>
        </svg>
      );
    case "thesis-assistance":
      return (
        <svg viewBox="0 0 320 150" className="h-full w-full" role="img" aria-label="Thesis chapter structure">
          <g fill="none" stroke={stroke} strokeWidth="1.5">
            <rect x="34" y="27" width="104" height="96" rx="2" />
            <path d="M51 47h70M51 61h53M51 79h68M51 93h58M51 107h74" opacity=".7" />
            <path d="M158 43h116M158 75h83M158 107h102" opacity=".55" />
            <path d="M138 43h20M138 75h20M138 107h20" strokeDasharray="2 4" />
          </g>
          <g fill="currentColor">
            <rect x="39" y="33" width="18" height="3" opacity=".8" />
            <rect x="158" y="36" width="28" height="4" opacity=".9" />
            <rect x="158" y="68" width="20" height="4" opacity=".6" />
            <rect x="158" y="100" width="34" height="4" opacity=".75" />
          </g>
        </svg>
      );
    case "data-analysis-visualization":
      return (
        <svg viewBox="0 0 320 150" className="h-full w-full" role="img" aria-label="Data analysis and visualization">
          <g fill="none" stroke={stroke} strokeWidth="1.25" opacity=".3">
            <path d="M30 118H288M30 24V118M30 88H288M30 58H288" />
            <path d="M80 24v94M130 24v94M180 24v94M230 24v94" />
          </g>
          <path d="M30 101 L74 88 L113 94 L151 60 L191 70 L226 42 L258 51 L288 28" fill="none" stroke={stroke} strokeWidth="3" />
          <g fill="currentColor">
            <circle cx="46" cy="108" r="4" /><circle cx="88" cy="84" r="4" /><circle cx="130" cy="92" r="4" />
            <circle cx="168" cy="58" r="4" /><circle cx="208" cy="68" r="4" /><circle cx="240" cy="40" r="4" /><circle cx="270" cy="49" r="4" />
          </g>
          <g fill="currentColor" opacity=".35">
            <rect x="48" y="116" width="15" height="2" /><rect x="78" y="111" width="26" height="7" />
            <rect x="119" y="103" width="18" height="15" /><rect x="153" y="95" width="26" height="23" />
          </g>
        </svg>
      );
    case "thesis-editing-proofreading":
      return (
        <svg viewBox="0 0 320 150" className="h-full w-full" role="img" aria-label="Annotated thesis editing document">
          <g fill="none" stroke={stroke} strokeWidth="1.5">
            <rect x="39" y="24" width="154" height="105" rx="2" />
            <path d="M58 45h88M58 59h103M58 76h76M58 91h91M58 106h62" opacity=".55" />
            <path d="M212 42h58M212 69h42M212 96h61" opacity=".45" />
            <path d="M193 45h19M193 72h19M193 99h19" strokeDasharray="3 4" />
          </g>
          <g fill="none" stroke={stroke} strokeWidth="2">
            <path d="M65 112l8-8 8 8 13-14" />
            <circle cx="238" cy="42" r="8" opacity=".75" />
            <path d="M234 42l3 3 6-7M229 70h26M229 97h32" opacity=".6" />
          </g>
        </svg>
      );
    case "research-guidance":
      return (
        <svg viewBox="0 0 320 150" className="h-full w-full" role="img" aria-label="Connected research guidance workflow">
          <g fill="none" stroke={stroke} strokeWidth="1.5">
            <path d="M48 96C90 96 91 49 128 49s39 54 76 54 42-37 68-37" opacity=".6" />
            <path d="M48 54C83 54 88 83 124 83s39-28 72-28 39 21 76 21" opacity=".3" />
          </g>
          <g fill="currentColor"><circle cx="48" cy="96" r="7" /><circle cx="128" cy="49" r="7" /><circle cx="204" cy="103" r="7" /><circle cx="272" cy="66" r="7" /></g>
          <g fill="none" stroke={stroke} strokeWidth="1.5" opacity=".65">
            <path d="M76 29h35M76 35h22M150 110h31M150 116h21M235 28h38M235 34h25" />
          </g>
        </svg>
      );
    case "international-research-paper":
      return (
        <svg viewBox="0 0 320 150" className="h-full w-full" role="img" aria-label="International research network">
          <g fill="none" stroke={stroke} strokeWidth="1.25" opacity=".5">
            <ellipse cx="160" cy="76" rx="76" ry="43" /><ellipse cx="160" cy="76" rx="39" ry="43" />
            <path d="M84 76h152M96 54c35 13 93 13 128 0M96 98c35-13 93-13 128 0" />
          </g>
          <g fill="currentColor"><circle cx="92" cy="62" r="4" /><circle cx="229" cy="53" r="4" /><circle cx="112" cy="108" r="4" /><circle cx="205" cy="108" r="4" /><circle cx="160" cy="33" r="4" /></g>
          <g stroke={stroke} strokeWidth="1" opacity=".45"><path d="M92 62L160 33L229 53M112 108L160 76L205 108M92 62L112 108M229 53L205 108" /></g>
        </svg>
      );
  }
}

function FeaturedServiceCard({ service, index }: { service: Service; index: number }) {
  const theme = CARD_THEMES[index % CARD_THEMES.length];
  const slug = service.slug as FeaturedSlug;

  return (
    <Link
      href={getServiceHref(service)}
      aria-label={"View " + service.title + " service"}
      className={[
        "group relative flex min-h-[25rem] min-w-0 flex-col overflow-hidden border",
        theme.surface, theme.text, theme.border,
        "transition-[transform,box-shadow,border-color] duration-[150ms] ease-out motion-reduce:transition-none",
        "hover:-translate-y-1 hover:shadow-[0_16px_36px_rgba(16,35,31,.12)]",
        "focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-accent",
      ].join(" ")}
    >
      <div className="relative h-36 shrink-0 overflow-hidden border-b border-current/10 px-4 py-4 sm:h-40 sm:px-5">
        <div className="absolute right-4 top-3 font-mono text-[0.66rem] tracking-[0.16em] opacity-45">{String(index + 1).padStart(2, "0")}</div>
        <div className="absolute inset-0 p-4 pt-7 opacity-75 transition-transform duration-[150ms] group-hover:translate-x-1 group-hover:-translate-y-0.5 motion-reduce:transition-none sm:p-5 sm:pt-8">
          <ServiceArtwork slug={slug} />
        </div>
        <div className="absolute bottom-4 left-4 flex size-9 items-center justify-center border border-current/20 bg-current/10 sm:left-5">
          <ServiceIcon slug={slug} />
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col p-4 sm:p-5">
        <p className="text-[0.62rem] font-semibold uppercase tracking-[0.14em] opacity-70">{service.category}</p>
        <h3 className="mt-2 max-w-[18ch] font-display text-[1.1rem] font-semibold leading-[1.08] tracking-[-0.02em] sm:text-[1.25rem]">{service.title}</h3>
        <p className={"mt-3 max-w-[34ch] text-[0.76rem] leading-5 " + theme.muted}>{service.shortDescription}</p>
        <div className="mt-auto flex items-center justify-between gap-3 pt-5">
          <span className={"h-px w-9 transition-[width] duration-[150ms] group-hover:w-14 motion-reduce:transition-none " + theme.line} />
          <span className="inline-flex min-h-10 items-center gap-2 text-[0.68rem] font-semibold uppercase tracking-[0.13em]">
            Explore
            <ArrowUpRight aria-hidden="true" className="size-4 transition-transform duration-[150ms] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 motion-reduce:transition-none" />
          </span>
        </div>
      </div>
    </Link>
  );
}

export async function FeaturedServicesSection() {
  const services = await getPublishedServices();
  const servicesBySlug = new Map(services.map((service) => [service.slug, service]));
  const featuredServices = FEATURED_SERVICE_SLUGS
    .map((slug) => servicesBySlug.get(slug))
    .filter((service): service is Service => Boolean(service));

  return (
    <section id="featured-services" aria-labelledby="featured-services-title" className="scroll-anchor border-y border-border bg-[#f6f0e5]">
      <Container size="wide" className="layout-section-lg">
        <ScrollTransition distance={44}>
          <div className="grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-x-8 xl:gap-x-12">
            <div className="lg:col-span-7">
              <p className="type-label text-primary">Featured services</p>
              <Heading id="featured-services-title" level={2} className="mt-3 max-w-[18ch]">Services Built Around Your Research</Heading>
            </div>
            <p className="type-body-sm max-w-[48ch] text-muted-foreground lg:col-span-4 lg:col-start-9 lg:pb-1">
              Explore selected writing, research, analysis and editing services across the stages of your work.
            </p>
          </div>

          <div className="mt-9 grid grid-cols-2 gap-2.5 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
            {featuredServices.map((service, index) => <FeaturedServiceCard key={service.id} service={service} index={index} />)}
          </div>

          <div className="mt-8 flex items-center justify-between gap-4 border-t border-border pt-5">
            <p className="type-caption text-muted-foreground">Selected from the published Services catalogue.</p>
            <Link
              href="/services"
              className="group inline-flex min-h-11 shrink-0 items-center gap-2 type-button text-primary underline decoration-primary/30 underline-offset-4 transition-[color,text-decoration-color] duration-[var(--motion-fast)] hover:decoration-primary focus-visible:outline-2 focus-visible:outline-offset-3"
            >
              View All Services
              <ArrowUpRight aria-hidden="true" className="size-4 transition-transform duration-[var(--motion-fast)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </div>
        </ScrollTransition>
      </Container>
    </section>
  );
}
