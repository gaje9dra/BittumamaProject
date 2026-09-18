import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { homepageContent } from "@/data/homepage";

export function HomeTrust() {
  const { trust } = homepageContent;

  return (
    <section
      id="home-trust"
      aria-labelledby="home-trust-title"
      className="scroll-anchor bg-primary text-primary-foreground"
    >
      <Container size="wide" className="layout-section-lg">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-x-8 xl:gap-x-12">
          <div className="lg:col-span-4">
            <p className="type-label text-primary-foreground/65">{trust.eyebrow}</p>
            <Heading id="home-trust-title" level={2} className="mt-4 max-w-[18ch]">
              {trust.title}
            </Heading>
            <p className="type-body-sm mt-5 max-w-[40ch] text-primary-foreground/75">
              {trust.description}
            </p>
          </div>

          <div className="lg:col-span-8 lg:col-start-5">
            <dl className="border-t border-primary-foreground/20">
              {trust.proof.map((item, index) => (
                <div
                  key={item.label}
                  className="grid gap-3 border-b border-primary-foreground/20 py-5 sm:grid-cols-[3rem_minmax(0,1fr)_minmax(16rem,.7fr)] sm:items-start sm:gap-6"
                >
                  <dt className="type-caption text-primary-foreground/55">
                    {String(index + 1).padStart(2, "0")}
                  </dt>
                  <dd className="type-h4 max-w-[24ch]">{item.label}</dd>
                  <p className="type-body-sm max-w-[38ch] text-primary-foreground/70">
                    {item.description}
                  </p>
                </div>
              ))}
            </dl>

            <Link
              href={trust.action.href}
              className="group mt-8 inline-flex min-h-11 items-center gap-2 type-button underline decoration-primary-foreground/30 underline-offset-4 transition-[color,text-decoration-color] duration-[var(--motion-fast)] hover:decoration-primary-foreground focus-visible:outline-2 focus-visible:outline-offset-3"
            >
              {trust.action.label}
              <ArrowUpRight
                aria-hidden="true"
                className="size-4 transition-transform duration-[var(--motion-fast)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
