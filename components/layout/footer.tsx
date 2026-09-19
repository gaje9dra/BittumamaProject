import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";
import { about } from "@/data/about";
import { services } from "@/data/services";
import { BackToTop } from "@/components/layout/back-to-top";
import { Container } from "@/components/ui/container";

const researchLinks = [
  { label: "Research", href: "/research" },
  { label: "Articles", href: "/articles" },
  { label: "Workshops & Events", href: "/workshops" },
];

const companyLinks = [
  { label: "About", href: "/about" },
  { label: "Experts", href: "/experts" },
  { label: "Contact", href: "/contact" },
];

function FooterLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className="group inline-flex min-h-9 items-center gap-2 type-body-sm text-primary-foreground/85 transition-[color,transform] duration-[var(--motion-fast)] hover:-translate-x-0.5 hover:text-primary-foreground focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-primary-foreground"
    >
      <span>{children}</span>
      <ArrowUpRight
        aria-hidden="true"
        className="size-3.5 opacity-0 transition-[opacity,transform] duration-[var(--motion-fast)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100"
      />
    </Link>
  );
}

function FooterLinkGroup({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  const headingId = "footer-" + title.toLowerCase().replace(/[^a-z0-9]+/g, "-");

  return (
    <section aria-labelledby={headingId}>
      <h3 id={headingId} className="type-label text-primary-100">
        {title}
      </h3>
      <ul className="mt-4 space-y-1">
        {links.map((link) => (
          <li key={link.href}>
            <FooterLink href={link.href}>{link.label}</FooterLink>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function Footer() {
  return (
    <footer
      className="border-t border-primary-foreground/10 bg-primary text-primary-foreground"
      aria-labelledby="footer-title"
    >
      <Container size="wide" className="relative overflow-hidden pt-14 pb-6 sm:pt-16 lg:pt-20">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-[var(--page-gutter)] top-4 hidden select-none font-display text-[clamp(10rem,20vw,18rem)] font-medium leading-none tracking-[-0.1em] text-primary-foreground/[0.035] lg:block"
        >
          B
        </div>

        <div className="relative grid gap-12 lg:grid-cols-12 lg:items-end lg:gap-x-12">
          <div className="lg:col-span-5">
            <p className="type-label text-primary-100">Bittumama</p>
            <h2
              id="footer-title"
              className="mt-5 max-w-[11ch] font-display text-4xl font-semibold leading-[1.02] tracking-[-0.035em] sm:text-5xl lg:text-[clamp(3rem,4.2vw,4.5rem)]"
            >
              Research.
              <br />
              Knowledge.
              <br />
              Support.
            </h2>
            <p className="type-body-sm mt-6 max-w-[30ch] text-primary-100">
              {about.shortDescription}
            </p>
          </div>

          <div className="lg:col-span-7">
            <div className="border-y border-primary-foreground/15 py-7 sm:py-8 lg:ml-auto lg:max-w-[46rem]">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between sm:gap-10">
                <div>
                  <p className="type-label text-primary-100">Research enquiry</p>
                  <h3 className="mt-4 max-w-[17ch] font-display text-3xl font-semibold leading-[1.04] tracking-[-0.03em] sm:text-4xl">
                    Have a research requirement?
                  </h3>
                  <p className="type-body-sm mt-4 max-w-[36ch] text-primary-100">
                    Tell us what you&apos;re working on. We&apos;ll help you find the right support.
                  </p>
                </div>

                <Link
                  href="/contact"
                  className="group inline-flex min-h-12 shrink-0 items-center gap-3 border-b border-primary-foreground/60 pb-2 type-button text-primary-foreground transition-[border-color,transform] duration-[var(--motion-fast)] hover:-translate-x-0.5 hover:border-primary-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-foreground"
                >
                  Start an Enquiry
                  <ArrowUpRight
                    aria-hidden="true"
                    className="size-4 transition-transform duration-[var(--motion-fast)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="relative mt-12 border-t border-primary-foreground/10 pt-9 sm:mt-14 sm:pt-10">
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-x-12">
            <section className="lg:col-span-8" aria-labelledby="footer-services">
              <div className="flex items-baseline justify-between gap-4">
                <h3 id="footer-services" className="type-label text-primary-100">
                  Services
                </h3>
                <span aria-hidden="true" className="hidden type-caption text-primary-100/60 sm:block">
                  Bittumama / Index
                </span>
              </div>

              <ul className="mt-4 grid gap-x-8 gap-y-0 sm:grid-cols-2 xl:grid-cols-3">
                {services.map((service, index) => (
                  <li key={service.id} className="border-b border-primary-foreground/10">
                    <FooterLink href={service.href}>
                      <span className="mr-2 tabular-nums text-primary-100/55">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      {service.title}
                    </FooterLink>
                  </li>
                ))}
              </ul>
            </section>

            <div className="grid gap-9 sm:grid-cols-2 lg:col-span-4 lg:grid-cols-1 xl:grid-cols-2">
              <FooterLinkGroup title="Research & Insights" links={researchLinks} />
              <FooterLinkGroup title="Company & People" links={companyLinks} />
            </div>
          </div>
        </div>

        <div className="relative mt-10 flex flex-col gap-3 border-t border-primary-foreground/10 pt-5 text-primary-100 sm:flex-row sm:items-center sm:justify-between">
          <p className="type-caption">© {new Date().getFullYear()} Bittumama. All rights reserved.</p>
          <BackToTop />
        </div>
      </Container>
    </footer>
  );
}
