import type { Service } from "@/data/services";
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

export {
  siteConfig,
  primaryNavigation,
  footerNavigation,
  globalActions,
  siteRoutes,
  validateSiteConfig,
};

export function getPrimaryNavigationWithServices(
  services: readonly Pick<Service, "title" | "slug">[],
) {
  return primaryNavigation.map((item) => {
    if (item.href !== siteRoutes.services.href) return item;

    return {
      ...item,
      type: "dropdown" as const,
      children: [
        ...services.map((service) => ({
          label: service.title,
          href: "/services/" + service.slug,
        })),
        {
          label: "View all services",
          href: siteRoutes.services.href,
        },
      ],
    };
  });
}
