import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { getServiceHref } from "@/data/services";
import { getResearchHref } from "@/data/research";
import { getServicesForExpert, getResearchForExpert, getArticlesForExpert } from "@/lib/content/relationships";
import type { Expert } from "@/data/expertise";

function LinkedRows({ title, items }: { title: string; items: { title: string; href: string }[] }) {
  const resolved = items;
  if (!resolved.length) return null;
  return (
    <section className="border-t border-border">
      <div className="grid gap-6 py-7 sm:grid-cols-[12rem_minmax(0,1fr)] sm:gap-10">
        <p className="type-label text-muted-foreground">{title}</p>
        <ol>
          {resolved.map((item, index) => (
            <li key={item.href} className="border-b border-border py-4 first:border-t">
              <Link href={item.href} className="group flex min-h-11 items-center justify-between gap-5 focus-visible:outline-2 focus-visible:outline-offset-2">
                <span className="type-body-sm">{String(index + 1).padStart(2, "0")} {item.title}</span>
                <ArrowUpRight aria-hidden="true" className="size-4 text-muted-foreground transition-transform duration-[var(--motion-fast)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function ExpertDetailContent({ expert }: { expert: Expert }) {
  const hasContent =
    Boolean(expert.expertise?.length) ||
    Boolean(expert.qualifications?.length) ||
    Boolean(expert.researchInterests?.length) ||
    Boolean(expert.bio) ||
    Boolean(expert.serviceIds?.length) ||
    Boolean(expert.researchIds?.length) ||
    Boolean(expert.articleIds?.length);

  if (!hasContent) return null;

  return (
    <Container size="wide" className="layout-section-lg">
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-x-8 xl:gap-x-12">
        <div className="lg:col-span-3">
          <p className="type-label text-muted-foreground">Expertise</p>
          <Heading level={2} className="mt-3 max-w-[18ch]">Areas of expertise.</Heading>
        </div>
        <div className="lg:col-span-8 lg:col-start-4">
          {expert.expertise?.length ? (
            <ul className="border-t border-border">
              {expert.expertise.map((item, index) => (
                <li key={item} className="grid gap-3 border-b border-border py-5 sm:grid-cols-[3rem_minmax(0,1fr)] sm:gap-6">
                  <span className="type-caption text-muted-foreground">{String(index + 1).padStart(2, "0")}</span>
                  <span className="type-body">{item}</span>
                </li>
              ))}
            </ul>
          ) : null}
          {expert.qualifications?.length ? (
            <section className="mt-10 border-t border-border pt-7">
              <p className="type-label text-muted-foreground">Qualifications</p>
              <ul className="mt-4 space-y-2">{expert.qualifications.map((item) => <li key={item} className="type-body-sm">{item}</li>)}</ul>
            </section>
          ) : null}
          {expert.researchInterests?.length ? (
            <section className="mt-10 border-t border-border pt-7">
              <p className="type-label text-muted-foreground">Research interests</p>
              <ul className="mt-4 space-y-2">{expert.researchInterests.map((item) => <li key={item} className="type-body-sm">{item}</li>)}</ul>
            </section>
          ) : null}
          {expert.bio ? <section className="mt-10 border-t border-border pt-7"><p className="type-label text-muted-foreground">Professional background</p><p className="type-body mt-4 max-w-[66ch] whitespace-pre-line">{expert.bio}</p></section> : null}
          <div className="mt-10">
            <LinkedRows title="Related services" items={getServicesForExpert(expert.id).map((item) => ({ title: item.title, href: getServiceHref(item) }))} />
            <LinkedRows title="Related research" items={getResearchForExpert(expert.id).map((item) => ({ title: item.title, href: getResearchHref(item) }))} />
            <LinkedRows title="Related articles" items={getArticlesForExpert(expert.id).map((item) => ({ title: item.title, href: "/articles/" + item.slug }))} />
          </div>
        </div>
      </div>
    </Container>
  );
}
