import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { getResearchHref } from "@/data/research";
import { getServiceHref } from "@/data/services";
import { getRelatedArticles, type Article } from "@/data/articles";
import { getExpertForArticle, getResearchForArticle, getServicesForArticle } from "@/lib/content/relationships";

function RelatedList({ title, items }: { title: string; items: { title: string; href: string; description?: string }[] }) {
  if (!items.length) return null;
  return (
    <section className="border-t border-border pt-7">
      <p className="type-label text-muted-foreground">{title}</p>
      <ol className="mt-4 border-t border-border">
        {items.map((item, index) => (
          <li key={item.href} className="border-b border-border">
            <Link href={item.href} className="group grid gap-2 py-4 sm:grid-cols-[2rem_minmax(0,1fr)_auto] sm:items-start sm:gap-4 focus-visible:outline-2 focus-visible:outline-offset-2">
              <span className="type-caption text-muted-foreground">{String(index + 1).padStart(2, "0")}</span>
              <span>
                <span className="type-body-sm">{item.title}</span>
                {item.description && <span className="type-caption mt-1 block text-muted-foreground">{item.description}</span>}
              </span>
              <ArrowUpRight aria-hidden="true" className="size-4 text-muted-foreground transition-transform duration-[var(--motion-fast)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </li>
        ))}
      </ol>
    </section>
  );
}

export function ArticleDetailPage({ article }: { article: Article }) {
  const relatedArticles = getRelatedArticles(article);
  const relatedResearch = getResearchForArticle(article);
  const relatedServices = getServicesForArticle(article);
  const author = article.author;
  const expertAuthor = getExpertForArticle(article);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <article>
        <header className="border-b border-border">
          <Container size="wide" className="py-8 sm:py-10 lg:py-14">
            <Link href="/articles" className="type-caption text-muted-foreground underline decoration-border underline-offset-4 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2">
              ← Back to Articles
            </Link>
            <div className="mt-8 grid gap-8 lg:grid-cols-12 lg:gap-x-8 xl:gap-x-12">
              <div className="lg:col-span-8 lg:col-start-2">
                <p className="type-label text-muted-foreground">{article.category}</p>
                <Heading level={1} className="mt-3 max-w-[20ch]">{article.title}</Heading>
                {article.excerpt && <p className="type-body-lg mt-5 max-w-[62ch] text-muted-foreground">{article.excerpt}</p>}
                <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2">
                  {author && <span className="type-caption">{author}</span>}
                  {article.authorRole && <span className="type-caption text-muted-foreground">{article.authorRole}</span>}
                  {article.date && <span className="type-caption text-muted-foreground">{article.date}</span>}
                </div>
              </div>
              {article.image ? (
                <figure className="lg:col-span-10 lg:col-start-2">
                  <div className="relative aspect-[16/8] overflow-hidden border border-border bg-surface-muted">
                    <Image src={article.image} alt={article.title} fill sizes="(min-width: 1024px) 83vw, 100vw" className="object-cover" />
                  </div>
                </figure>
              ) : null}
            </div>
          </Container>
        </header>

        <div className="grid gap-12 px-[var(--page-gutter)] py-12 sm:py-16 lg:grid-cols-[minmax(0,66ch)_minmax(14rem,20rem)] lg:items-start lg:justify-center lg:gap-16">
          <div className="min-w-0">
            {article.content && <p className="type-reading whitespace-pre-line">{article.content}</p>}
            {article.sections?.map((section) => (
              <section key={section.id} className="mt-10 first:mt-0">
                {section.heading && <Heading level={2} className="mb-4">{section.heading}</Heading>}
                {section.type === "list" ? (
                  <ul className="space-y-2 pl-5">{section.content.split("\n").filter(Boolean).map((item) => <li key={item} className="type-body list-disc">{item}</li>)}</ul>
                ) : (
                  <p className="type-reading whitespace-pre-line">{section.content}</p>
                )}
              </section>
            ))}
          </div>

          <aside className="space-y-8 lg:sticky lg:top-[var(--header-scroll-offset)]">
            {article.tags?.length ? (
              <section>
                <p className="type-label text-muted-foreground">Topics</p>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {article.tags.map((tag) => <li key={tag} className="type-caption border border-border px-2 py-1">{tag}</li>)}
                </ul>
              </section>
            ) : null}
            {article.author ? (
              <section className="border-t border-border pt-7">
                <p className="type-label text-muted-foreground">Author</p>
                <p className="type-body-sm mt-3">{article.author}</p>
                {article.authorRole && <p className="type-caption mt-1 text-muted-foreground">{article.authorRole}</p>}
                {expertAuthor && <Link href={"/experts/" + expertAuthor.slug} className="mt-3 inline-flex min-h-11 items-center gap-2 type-button text-primary underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-3">View expert profile <ArrowUpRight aria-hidden="true" className="size-4" /></Link>}
              </section>
            ) : null}
          </aside>
        </div>

        <div className="border-t border-border">
          <Container size="wide" className="layout-section-lg">
            <div className="grid gap-10 lg:grid-cols-12 lg:gap-x-8 xl:gap-x-12">
              <div className="lg:col-span-8 lg:col-start-3 space-y-10">
                <RelatedList title="Related articles" items={relatedArticles.map((item) => ({ title: item.title, href: "/articles/" + item.slug, description: item.excerpt }))} />
                <RelatedList title="Related research" items={relatedResearch.map((item) => ({ title: item.title, href: getResearchHref(item), description: item.summary ?? item.shortDescription }))} />
                <RelatedList title="Related services" items={relatedServices.map((item) => ({ title: item.title, href: getServiceHref(item), description: item.shortDescription }))} />
              </div>
            </div>
          </Container>
        </div>
      </article>

      <section className="border-t border-border bg-surface-muted">
        <Container size="wide" className="layout-section-sm">
          <Link href="/articles" className="group inline-flex min-h-11 items-center gap-2 type-button text-primary underline decoration-primary/30 underline-offset-4 hover:decoration-primary focus-visible:outline-2 focus-visible:outline-offset-3">
            Explore More Articles
            <ArrowUpRight aria-hidden="true" className="size-4 transition-transform duration-[var(--motion-fast)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </Container>
      </section>
    </main>
  );
}
