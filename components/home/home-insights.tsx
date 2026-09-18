import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { homepageArticles, homepageContent, type HomepageArticle } from "@/data/homepage";

function ArticleMeta({ article }: { article: HomepageArticle }) {
  return (
    <div className="flex flex-wrap gap-x-4 gap-y-2">
      <span className="type-label text-muted-foreground">{article.category}</span>
      <span className="type-label text-muted-foreground">{article.date}</span>
      {article.author && <span className="type-label text-muted-foreground">{article.author}</span>}
      {article.readingTime && (
        <span className="type-label text-muted-foreground">{article.readingTime}</span>
      )}
    </div>
  );
}

function ArticleAction({ article }: { article: HomepageArticle }) {
  if (!article.href) return null;

  return (
    <Link
      href={article.href}
      className="group inline-flex min-h-11 items-center gap-2 type-button text-primary underline decoration-primary/30 underline-offset-4 transition-[color,text-decoration-color] duration-[var(--motion-fast)] hover:decoration-primary focus-visible:outline-2 focus-visible:outline-offset-3"
    >
      Read Article
      <ArrowUpRight
        aria-hidden="true"
        className="size-4 transition-transform duration-[var(--motion-fast)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
      />
    </Link>
  );
}

export function HomeInsights() {
  const { insights } = homepageContent;
  const featured = homepageArticles.find((article) => article.featured);
  const supporting = homepageArticles.filter((article) => !article.featured);

  return (
    <section
      id="home-insights"
      aria-labelledby="home-insights-title"
      className="scroll-anchor border-t border-border bg-surface-muted"
    >
      <Container size="wide" className="layout-section-lg">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-x-8 xl:gap-x-12">
          <div className="lg:col-span-4">
            <p className="type-label text-muted-foreground">{insights.eyebrow}</p>
            <Heading id="home-insights-title" level={2} className="mt-4 max-w-[18ch]">
              Articles & Insights
            </Heading>
            <p className="type-body-sm mt-5 max-w-[38ch] text-muted-foreground">
              {insights.description}
            </p>
          </div>

          <div className="lg:col-span-8 lg:col-start-5">
            {featured ? (
              <article className="border-y border-border py-7 sm:py-8">
                <ArticleMeta article={featured} />
                <Heading level={3} className="mt-4 max-w-[20ch]">
                  {featured.title}
                </Heading>
                {featured.excerpt && (
                  <p className="type-body-sm mt-3 max-w-[52ch] text-muted-foreground">
                    {featured.excerpt}
                  </p>
                )}
                <div className="mt-5">
                  <ArticleAction article={featured} />
                </div>
              </article>
            ) : (
              <div className="border-y border-border py-7 sm:py-8">
                <p className="type-label text-muted-foreground">Articles & Insights</p>
                <p className="type-body-sm mt-2 max-w-[44ch] text-muted-foreground">
                  Research articles and resources will appear here when verified content is available.
                </p>
              </div>
            )}

            {supporting.length > 0 && (
              <div className="mt-8 border-t border-border">
                {supporting.map((article) => (
                  <article
                    key={article.id}
                    className="grid gap-3 border-b border-border py-5 sm:grid-cols-[8rem_minmax(0,1fr)_auto] sm:items-center sm:gap-6"
                  >
                    <ArticleMeta article={article} />
                    <div>
                      <Heading level={4}>{article.title}</Heading>
                      {article.excerpt && (
                        <p className="type-caption mt-1 text-muted-foreground">{article.excerpt}</p>
                      )}
                    </div>
                    <ArticleAction article={article} />
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
