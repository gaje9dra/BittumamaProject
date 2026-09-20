import type { Metadata } from "next";
import { existsSync } from "node:fs";
import path from "node:path";
import { siteConfig } from "@/data/site-config";

export type SeoData = {
  title?: string;
  description?: string;
  image?: string;
  canonical?: string;
  noIndex?: boolean;
};

type PageMetadataInput = SeoData & {
  fallbackTitle?: string;
  fallbackDescription?: string;
};

function validImageReference(image?: string) {
  if (!image) return undefined;
  if (/^https?:\/\//.test(image)) {
    try {
      new URL(image);
      return image;
    } catch {
      return undefined;
    }
  }

  const publicPath = path.join(process.cwd(), "public", image.replace(/^\//, ""));
  return existsSync(publicPath) ? image : undefined;
}

export function createPageMetadata({
  title,
  description,
  image,
  canonical,
  noIndex,
  fallbackTitle = siteConfig.defaultMetadata.title,
  fallbackDescription = siteConfig.defaultMetadata.description,
}: PageMetadataInput): Metadata {
  const resolvedTitle = title?.trim() || fallbackTitle;
  const resolvedDescription = description?.trim() || fallbackDescription;
  const resolvedImage = validImageReference(image);

  return {
    title: resolvedTitle,
    description: resolvedDescription,
    ...(canonical ? { alternates: { canonical } } : {}),
    ...(noIndex ? { robots: { index: false, follow: false } } : {}),
    openGraph: {
      title: resolvedTitle,
      description: resolvedDescription,
      siteName: siteConfig.siteName,
      ...(canonical ? { url: canonical } : {}),
      ...(resolvedImage ? { images: [{ url: resolvedImage }] } : {}),
    },
    ...(resolvedImage
      ? {
          twitter: {
            card: "summary_large_image",
            title: resolvedTitle,
            description: resolvedDescription,
            images: [resolvedImage],
          },
        }
      : {}),
  };
}

export function createContentMetadata({
  seo,
  title,
  description,
  image,
  canonical,
}: {
  seo?: SeoData;
  title: string;
  description?: string;
  image?: string;
  canonical?: string;
}): Metadata {
  return createPageMetadata({
    title: seo?.title || title + " | " + siteConfig.siteName,
    description: seo?.description || description,
    image: seo?.image || image,
    canonical: seo?.canonical || canonical,
    noIndex: seo?.noIndex,
  });
}
