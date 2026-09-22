import type { Service } from "@/data/services";
import { canonicalServiceCategories } from "@/data/services";
import {
  siteConfig,
  primaryNavigation,
  footerNavigation,
  globalActions,
  siteRoutes,
  validateSiteConfig,
} from "@/data/site-config";

export type {
  NavigationMetadata,
  NavigationItem,
  NavigationGroup,
  NavigationFeatured,
  SiteRoute,
  SiteConfig,
} from "@/data/site-config";

export { siteConfig, primaryNavigation, footerNavigation, globalActions, siteRoutes, validateSiteConfig };

export function getPrimaryNavigationWithServices(
  services: readonly Pick<Service, "title" | "slug" | "category">[],
) {
  const byCategory = new Map<string, readonly Pick<Service, "title" | "slug" | "category">[]>();
  for (const category of canonicalServiceCategories) byCategory.set(category, []);

  for (const service of services) {
    if (!byCategory.has(service.category)) continue;
    byCategory.set(service.category, [...(byCategory.get(service.category) ?? []), service]);
  }

  return primaryNavigation.map((item) => {
    if (item.href !== siteRoutes.services.href) return item;

    return {
      ...item,
      type: "grouped" as const,
      groups: canonicalServiceCategories.map((category) => ({
        label: category,
        items: (byCategory.get(category) ?? []).map((service) => ({
          label: service.title,
          href: "/services/" + service.slug,
        })),
      })),
    };
  });
}
