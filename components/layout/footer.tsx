import Link from "next/link";
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
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="group inline-flex min-h-9 items-center gap-2 type-body-sm text-primary-foreground/85 transition-[color,transform] duration-[var(--motion-fast)] hover:text-primary-foreground focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-primary-foreground"
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
    <footer className="border-t border-primary-foreground/10 bg-primary text-primary-foreground" aria-labelledby="footer-title">
      <Container size="wide" className="relative overflow-hidden pt-14 pb-6 sm:pt-18 lg:pt-24">
        <div aria-hidden="true" className="pointer-events-none absolute right-[var(--page-gutter)] top-10 hidden select-none font-display text-[clamp(8rem,18vw,16rem)] font-medium leading-none tracking-[-0.08em] text-primary-foreground/[0.035] lg:block">
          B
        </div>

        <div className="relative grid gap-12 lg:grid-cols-12 lg:gap-x-10 xl:gap-x-14">
          <div className="lg:col-span-4">
            <p className="type-label text-primary-100">Bittumama</p>
            <h2 id="footer-title" className="mt-5 max-w-[12ch] font-display text-4xl font-semibold leading-[1.02] tracking-[-0.035em] sm:text-5xl">
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

          <div className="order-3 lg:order-none lg:col-span-4 lg:col-start-5">
            <div className="grid gap-9 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 xl:gap-x-8">
              <FooterLinkGroup title="Research & Insights" links={researchLinks} />
              <FooterLinkGroup title="Company & People" links={companyLinks} />
            </div>

          </div>

          <div className="order-2 lg:order-none lg:col-span-4 lg:col-start-9">
            <div className="relative overflow-hidden border border-primary-foreground/15 bg-primary/70 p-6 sm:p-7 lg:p-8">
              <div aria-hidden="true" className="absolute -right-8 -top-8 size-24 rounded-full border border-accent/35" />
              <div aria-hidden="true" className="absolute right-5 top-5 size-2 rounded-full bg-accent" />

              <p className="type-label text-primary-100">Research enquiry</p>
              <h3 className="mt-5 max-w-[15ch] font-display text-2xl font-semibold leading-tight tracking-[-0.025em] sm:text-3xl">
                Have a research requirement?
              </h3>
              <p className="type-body-sm mt-4 max-w-[34ch] text-primary-100">
                Tell us what you&apos;re working on. We&apos;ll help you find the right support.
              </p>
              <Link
                href="/contact"
                className="group mt-7 inline-flex min-h-11 items-center gap-2 border-b border-primary-foreground/60 pb-1 type-button text-primary-foreground transition-colors duration-[var(--motion-fast)] hover:border-primary-foreground focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-primary-foreground"
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

        <div className="relative mt-14 border-t border-primary-foreground/10 pt-10">
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-x-10">
            <div className="lg:col-span-8">
              <div className="flex flex-wrap gap-x-8 gap-y-2">
                <div>
                  <p className="type-label text-primary-100">Services</p>
                  <ul className="mt-3 grid gap-x-7 gap-y-1 sm:grid-cols-2 xl:grid-cols-3">
                    {services.map((service) => (
                      <li key={service.id}>
                        <FooterLink href={service.href}>{service.title}</FooterLink>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex items-end lg:col-span-4 lg:justify-end">
              <BackToTop />
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-primary-foreground/10 pt-5 text-primary-100 sm:flex-row sm:items-center sm:justify-between">
          <p className="type-caption">© {new Date().getFullYear()} Bittumama. All rights reserved.</p>
          <p className="type-caption">Research, academic support, analysis and research technology.</p>
        </div>
      </Container>
    </footer>
  );
}
