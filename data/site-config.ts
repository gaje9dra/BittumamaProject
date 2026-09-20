export type NavigationMetadata = {
  eyebrow?: string;
  badge?: string;
};

export type NavigationItem = {
  label: string;
  href: string;
  type?: "link" | "dropdown" | "grouped" | "mega";
  description?: string;
  children?: NavigationItem[];
  groups?: NavigationGroup[];
  featured?: NavigationFeatured;
  external?: boolean;
  metadata?: NavigationMetadata;
};

export type NavigationGroup = {
  label: string;
  description?: string;
  items: NavigationItem[];
};

export type NavigationFeatured = {
  label: string;
  href: string;
  description?: string;
  eyebrow?: string;
  external?: boolean;
};

export type SiteRoute = {
  label: string;
  href: string;
};

export type SiteConfig = {
  siteName: string;
  siteDescription: string;
  routes: {
    home: SiteRoute;
    services: SiteRoute;
    research: SiteRoute;
    experts: SiteRoute;
    articles: SiteRoute;
    workshops: SiteRoute;
    about: SiteRoute;
    contact: SiteRoute;
  };
  primaryNavigation: NavigationItem[];
  footerNavigation: {
    explore: NavigationItem[];
    organization: NavigationItem[];
  };
  globalActions: {
    contact: SiteRoute;
  };
  defaultMetadata: {
    title: string;
    description: string;
  };
};

const siteDescription = "Research support, academic services, analysis, expertise and knowledge resources from Bittumama.";

const routes = {
  home: { label: "Home", href: "/" },
  services: { label: "Services", href: "/services" },
  research: { label: "Research", href: "/research" },
  experts: { label: "Experts", href: "/experts" },
  articles: { label: "Articles", href: "/articles" },
  workshops: { label: "Workshops & Events", href: "/workshops" },
  about: { label: "About", href: "/about" },
  contact: { label: "Contact", href: "/contact" },
} satisfies SiteConfig["routes"];

const primaryNavigationItems: NavigationItem[] = [
  routes.services,
  routes.research,
  routes.workshops,
  routes.experts,
  routes.articles,
  routes.about,
];

const footerNavigationItems = {
  explore: [
    routes.research,
    routes.articles,
    routes.workshops,
  ],
  organization: [
    routes.about,
    routes.experts,
    routes.contact,
  ],
} satisfies SiteConfig["footerNavigation"];

export const siteConfig: SiteConfig = {
  siteName: "Bittumama",
  siteDescription,
  routes,
  primaryNavigation: primaryNavigationItems,
  footerNavigation: footerNavigationItems,
  globalActions: {
    contact: routes.contact,
  },
  defaultMetadata: {
    title: "Bittumama — Research, Intelligence & Expertise",
    description: siteDescription,
  },
};

export const primaryNavigation = siteConfig.primaryNavigation;
export const footerNavigation = siteConfig.footerNavigation;
export const globalActions = siteConfig.globalActions;
export const siteRoutes = siteConfig.routes;

export function validateSiteConfig(config: SiteConfig = siteConfig) {
  const issues: string[] = [];
  const visit = (items: NavigationItem[], location: string) => {
    const seenRoutes = new Set<string>();
    for (const item of items) {
      const label = item.label.trim();
      const href = item.href.trim();

      if (!label) issues.push(location + ": navigation item has an empty label.");
      if (!href) issues.push(location + ": " + (label || "item") + " has an empty href.");

      if (href) {
        if (seenRoutes.has(href)) {
          issues.push(location + ": duplicate route " + href + ".");
        }
        seenRoutes.add(href);
      }

      if (item.external && !/^https?:\/\//.test(href)) {
        issues.push(location + " > " + label + ": external links must use an absolute URL.");
      }

      if (item.children) visit(item.children, location + " > " + label);
      item.groups?.forEach((group) => {
        if (!group.items.length) {
          issues.push(location + " > " + group.label + ": empty navigation group.");
        }
        visit(group.items, location + " > " + group.label);
      });
    }
  };

  visit(config.primaryNavigation, "primary navigation");
  visit(config.footerNavigation.explore, "footer > Explore");
  visit(config.footerNavigation.organization, "footer > Organization");

  return issues;
}

if (process.env.NODE_ENV !== "production") {
  const issues = validateSiteConfig();
  if (issues.length) console.warn("Site configuration validation found issues:", issues);
}
