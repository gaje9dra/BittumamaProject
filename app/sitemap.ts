import type { MetadataRoute } from "next";
import { getPublishedServices } from "@/lib/services/repository";

const FALLBACK_ORIGIN = "https://bittumamaproject.netlify.app";

function siteOrigin() {
  const configured = process.env.NEXT_PUBLIC_APP_URL ?? process.env.AUTH_URL;
  if (!configured) return FALLBACK_ORIGIN;
  try {
    return new URL(configured).origin;
  } catch {
    return FALLBACK_ORIGIN;
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const origin = siteOrigin();
  const services = await getPublishedServices();

  const staticRoutes = ["/", "/services", "/research", "/experts", "/articles", "/workshops", "/about", "/contact"];

  return [
    ...staticRoutes.map((path) => ({ url: origin + path })),
    ...services.map((service) => ({
      url: origin + "/services/" + service.slug,
    })),
  ];
}
