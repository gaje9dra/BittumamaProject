import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { getArticleCategoryAnchor, type Article } from "@/data/articles";

type ArticleArchiveProps = { articles?: Article[]; categories?: string[] };

export function ArticleArchive({ articles = [], categories = [] }: ArticleArchiveProps) {
  return (
    <section id="article-archive" aria-labelledby="article-archive-title" className="scroll-anchor bg-background">
      <Container size="wide" className="layout-section-lg">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-x-8 xl:gap-x-12">
          <div className="lg:col-span-3">
            <p className="type-label text-muted-foreground">Editorial archive</p>
            <Heading id="article-archive-title" level={2} className="mt-3 max-w-[18ch]">
              Articles and insights.
            </Heading>
            {articles.length > 0 && <p className="type-body-sm mt-4 max-w-[30ch] text-muted-foreground">Browse the published editorial archive by topic.</p>}
          </div>

          <div className="lg:col-span-9 lg:col-start-4">
            {!articles.length ? (
              <div className="border-y border-border py-8 sm:py-10">
                <p className="type-h4 max-w-[30ch]">Verified articles will appear here.</p>
                <p className="type-body-sm mt-3 max-w-[56ch] text-muted-foreground">
                  The editorial archive is ready for published articles, insights and research commentary when verified content is available.
                </p>
              </div>
            ) : (
              <div className="border-t border-border">
                {categories.map((category) => {
                  const group = articles.filter((article) => article.category === category);
                  if (!group.length) return null;
                  return (
                    <section key={category} id={getArticleCategoryAnchor(category)} className="scroll-anchor">
                      <div className="grid gap-2 border-b border-border py-4 sm:grid-cols-[minmax(0,1fr)_auto]">
                        <p className="type-label text-muted-foreground">{category}</p>
                        <span className="type-caption text-muted-foreground">{String(group.length).padStart(2, "0")} articles</span>
                      </div>
                      <ol>
                        {group.map((article, index) => (
                          <li key={article.id} className="border-b border-border">
                            <Link href={"/articles/" + article.slug} className="group grid gap-4 py-6 focus-visible:bg-surface-muted/60 focus-visible:outline-2 focus-visible:outline-offset-[-2px] sm:grid-cols-[3rem_minmax(0,1fr)_minmax(11rem,.5fr)_auto] sm:items-start sm:gap-6">
                              <span className="type-caption text-muted-foreground">{String(index + 1).padStart(2, "0")}</span>
                              <div>
                                <Heading level={3} className="max-w-[30ch]">{article.title}</Heading>
                                {article.excerpt && <p className="type-body-sm mt-2 max-w-[54ch] text-muted-foreground">{article.excerpt}</p>}
                              </div>
                              <div className="flex flex-wrap gap-x-4 gap-y-1 sm:block">
                                {article.date && <p className="type-caption text-muted-foreground">{article.date}</p>}
                                {article.author && <p className="type-caption mt-1 text-muted-foreground">{article.author}</p>}
                              </div>
                              <ArrowUpRight aria-hidden="true" className="mt-1 size-5 text-muted-foreground transition-transform duration-[var(--motion-fast)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                            </Link>
                          </li>
                        ))}
                      </ol>
                    </section>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
