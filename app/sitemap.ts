import type { MetadataRoute } from "next";
import { getPublishedServices } from "@/lib/services/repository";
import { canonicalServices } from "@/data/services";
import { locationPages } from "@/data/locations";

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

  // Sitemap generation must remain build-safe when the production database is
  // unavailable during a static build. Prefer published database records, but
  // fall back to the canonical service dataset so the build can complete.
  let services = canonicalServices;
  try {
    services = await getPublishedServices();
  } catch (error) {
    console.warn("Sitemap service query failed; using canonical service dataset.", error);
  }

  const staticRoutes = ["/", "/services", "/research", "/experts", "/articles", "/workshops", "/about", "/contact"];

  return [
    ...staticRoutes.map((path) => ({ url: origin + path })),
    ...services.map((service) => ({
      url: origin + "/services/" + service.slug,
    })),
  ];
}
