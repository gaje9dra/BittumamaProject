import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleDetailPage } from "@/components/articles/article-detail-page";
import { getArticleHref } from "@/lib/articles/paths";
import { getPublishedArticleBySlug } from "@/lib/articles/repository";
import { createContentMetadata } from "@/lib/metadata";

export const dynamic = "force-dynamic";

type ArticleDetailRouteProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: ArticleDetailRouteProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getPublishedArticleBySlug(slug);
  if (!article) return { title: "Article not found | Bittumama" };

  return createContentMetadata({
    seo: article.seo,
    title: article.title,
    description: article.excerpt,
    image: article.image,
    canonical: getArticleHref(article),
  });
}

export default async function ArticleDetailRoute({ params }: ArticleDetailRouteProps) {
  const { slug } = await params;
  const article = await getPublishedArticleBySlug(slug);
  if (!article) notFound();
  return <ArticleDetailPage article={article} />;
}
