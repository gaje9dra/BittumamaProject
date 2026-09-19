import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import type { Article } from "@/data/articles";

type ArticleFeaturedProps = { articles?: Article[] };

export function ArticleFeatured({ articles = [] }: ArticleFeaturedProps) {
  const article = articles.find((item) => item.featured);
  if (!article) return null;

  return (
    <section aria-labelledby="featured-article-title" className="border-b border-border bg-background">
      <Container size="wide" className="layout-section-lg">
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-x-8 xl:gap-x-12">
          <div className="lg:col-span-3">
            <p className="type-label text-muted-foreground">Featured reading</p>
          </div>
          <article className="lg:col-span-8 lg:col-start-4">
            <p className="type-label text-muted-foreground">{article.category}</p>
            <Heading id="featured-article-title" level={2} className="mt-3 max-w-[24ch]">
              {article.title}
            </Heading>
            {article.excerpt && <p className="type-body mt-4 max-w-[62ch] text-muted-foreground">{article.excerpt}</p>}
            <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2">
              {article.author && <span className="type-caption">{article.author}</span>}
              {article.date && <span className="type-caption text-muted-foreground">{article.date}</span>}
            </div>
            <Link href={"/articles/" + article.slug} className="group mt-6 inline-flex min-h-11 items-center gap-2 type-button text-primary underline decoration-primary/30 underline-offset-4 hover:decoration-primary focus-visible:outline-2 focus-visible:outline-offset-3">
              Read Article
              <ArrowUpRight aria-hidden="true" className="size-4 transition-transform duration-[var(--motion-fast)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </article>
        </div>
      </Container>
    </section>
  );
}
