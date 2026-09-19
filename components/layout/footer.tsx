import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { about } from "@/data/about";
import { primaryNavigation } from "@/data/navigation";
import { serviceCategories, getServicesByCategory } from "@/data/services";
import { Container } from "@/components/ui/container";

function serviceCategoryId(category: string) {
  return "footer-service-" + category.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

export function Footer() {
  return (
    <footer className="border-t border-border bg-primary text-primary-foreground" aria-labelledby="footer-title">
      <Container size="wide" className="pt-14 pb-7 sm:pt-16 lg:pt-20">
        <div className="grid gap-10 border-b border-primary-foreground/15 pb-12 lg:grid-cols-12 lg:gap-x-10">
          <div className="lg:col-span-7">
            <p className="type-label text-primary-100">Bittumama</p>
            <h2 id="footer-title" className="mt-4 max-w-[22ch] font-display text-2xl font-semibold leading-tight tracking-[-0.025em] sm:text-3xl">
              {about.shortDescription}
            </h2>
            <p className="type-body-sm mt-4 max-w-[52ch] text-primary-100">
              {about.description}
            </p>
          </div>

          <div className="lg:col-span-5 lg:flex lg:justify-end">
            <div className="max-w-md lg:pt-1">
              <p className="type-label text-primary-100">Research enquiry</p>
              <p className="type-body mt-3 max-w-[32ch] text-primary-foreground">
                Have a research or academic requirement?
              </p>
              <Link
                href="/contact"
                className="group mt-5 inline-flex min-h-11 items-center gap-2 border-b border-primary-foreground/50 pb-1 text-sm font-medium text-primary-foreground transition-colors duration-[var(--motion-micro)] hover:border-primary-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-foreground"
              >
                Start an enquiry
                <ArrowUpRight
                  aria-hidden="true"
                  className="size-4 transition-transform duration-[var(--motion-fast)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </Link>
            </div>
          </div>
        </div>

        <div className="grid gap-10 border-b border-primary-foreground/15 py-10 md:grid-cols-12 md:gap-x-8">
          <nav aria-labelledby="footer-navigation-title" className="md:col-span-3">
            <h3 id="footer-navigation-title" className="type-label text-primary-100">Explore</h3>
            <ul className="mt-4 space-y-2.5">
              {primaryNavigation.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="type-body-sm inline-flex min-h-8 items-center text-primary-foreground/90 underline decoration-transparent underline-offset-4 transition-[color,text-decoration-color] duration-[var(--motion-micro)] hover:text-primary-foreground hover:decoration-primary-foreground/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-foreground">
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/contact" className="type-body-sm inline-flex min-h-8 items-center text-primary-foreground/90 underline decoration-transparent underline-offset-4 transition-[color,text-decoration-color] duration-[var(--motion-micro)] hover:text-primary-foreground hover:decoration-primary-foreground/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-foreground">
                  Contact
                </Link>
              </li>
            </ul>
          </nav>

          <div className="md:col-span-9">
            <h3 className="type-label text-primary-100">Services</h3>
            <div className="mt-5 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
              {serviceCategories.map((category) => {
                const categoryServices = getServicesByCategory(category);
                const headingId = serviceCategoryId(category);

                return (
                  <section key={category} aria-labelledby={headingId}>
                    <h4 id={headingId} className="type-caption font-semibold uppercase tracking-[0.06em] text-primary-100">
                      {category}
                    </h4>
                    <ul className="mt-2.5 space-y-1.5">
                      {categoryServices.map((service) => (
                        <li key={service.id}>
                          <Link href={service.href} className="type-body-sm inline-flex min-h-8 items-center text-primary-foreground/90 underline decoration-transparent underline-offset-4 transition-[color,text-decoration-color] duration-[var(--motion-micro)] hover:text-primary-foreground hover:decoration-primary-foreground/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-foreground">
                            {service.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </section>
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 pt-6 text-primary-100 sm:flex-row sm:items-center sm:justify-between">
          <p className="type-caption">Bittumama</p>
          <p className="type-caption">Research, academic support, analysis and research technology.</p>
        </div>
      </Container>
    </footer>
  );
}
