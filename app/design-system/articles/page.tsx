import { notFound } from "next/navigation";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { ArticleArchive } from "@/components/articles/article-archive";
import { ArticleCategoryNav } from "@/components/articles/article-category-nav";
import { ArticleFeatured } from "@/components/articles/article-featured";
import { ArticlesIntro } from "@/components/articles/articles-intro";
import { ArticleDetailPage } from "@/components/articles/article-detail-page";
import type { Article } from "@/data/articles";

const previewArticles: Article[] = [
  {
    id: "preview-methodology",
    title: "Development Article Preview: Research Methodology",
    slug: "development-article-methodology",
    category: "Research",
    date: "Development reference",
    author: "Development Author Preview",
    authorRole: "Development fixture",
    excerpt: "Development-only article content used to inspect the publication archive and reading experience.",
    content: "This is development-only content. Production articles are rendered only from verified canonical records.",
    featured: true,
    tags: ["Research", "Methodology"],
    relatedResearch: [],
    relatedServices: ["research-methodology"],
  },
  {
    id: "preview-analysis",
    title: "Development Article Preview: Data Analysis",
    slug: "development-article-analysis",
    category: "Analysis",
    date: "Development reference",
    excerpt: "A second development fixture used to inspect category grouping and archive rhythm.",
    sections: [
      {
        id: "section-one",
        heading: "Development section",
        content: "This section exists only for development inspection and is never part of the production article dataset.",
      },
    ],
    tags: ["Analysis"],
  },
];

export default function ArticlesPlaygroundPage() {
  if (process.env.NODE_ENV === "production") notFound();

  const categories = Array.from(new Set(previewArticles.map((article) => article.category)));

  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="layout-section-sm border-b border-border">
        <Container size="wide">
          <p className="type-label text-muted-foreground">Development reference</p>
          <Heading level={1} className="mt-3">Articles &amp; Insights</Heading>
          <p className="type-body-sm mt-3 max-w-[58ch] text-muted-foreground">
            Development-only preview for editorial introduction, topic navigation, featured reading, archive structure and an individual article reading experience. Preview content never enters the production article dataset.
          </p>
        </Container>
      </section>
      <ArticlesIntro />
      <ArticleCategoryNav categories={categories} />
      <ArticleFeatured articles={previewArticles} />
      <ArticleArchive articles={previewArticles} categories={categories} />
      <section className="border-t border-border bg-surface-muted">
        <Container size="wide" className="layout-section-sm">
          <p className="type-label text-muted-foreground">Article detail preview</p>
        </Container>
      </section>
      <ArticleDetailPage article={previewArticles[0]} />
    </main>
  );
}
