import type { Metadata } from "next";
import { ArticlesCta } from "@/components/articles/articles-cta";
import { ArticleArchive } from "@/components/articles/article-archive";
import { ArticleCategoryNav } from "@/components/articles/article-category-nav";
import { ArticleFeatured } from "@/components/articles/article-featured";
import { ArticlesIntro } from "@/components/articles/articles-intro";
import { articleCategories, articles } from "@/data/articles";

export const metadata: Metadata = {
  title: "Articles & Insights | Bittumama",
  description: "Research, ideas and practical insight from Bittumama.",
};

export default function ArticlesPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <ArticlesIntro />
      <ArticleCategoryNav />
      <ArticleFeatured articles={articles} />
      <ArticleArchive articles={articles} categories={articleCategories} />
      <ArticlesCta />
    </main>
  );
}
