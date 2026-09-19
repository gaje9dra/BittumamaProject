import type { Metadata } from "next";
import { ArticlesCta } from "@/components/articles/articles-cta";
import { ArticleArchive } from "@/components/articles/article-archive";
import { ArticleCategoryNav } from "@/components/articles/article-category-nav";
import { ArticleFeatured } from "@/components/articles/article-featured";
import { ArticlesIntro } from "@/components/articles/articles-intro";
import { articleCategories } from "@/data/articles";
import { getAllArticles, getLatestArticles } from "@/lib/content";

export const metadata: Metadata = {
  title: "Articles & Insights | Bittumama",
  description: "Research, ideas and practical insight from Bittumama.",
};

export default function ArticlesPage() {
  const articles = getAllArticles();
  const latestArticles = getLatestArticles();

  return (
    <main className="min-h-screen bg-background text-foreground">
      <ArticlesIntro />
      <ArticleCategoryNav />
      <ArticleFeatured articles={articles} />
      <ArticleArchive articles={latestArticles} categories={articleCategories} />
      <ArticlesCta />
    </main>
  );
}
