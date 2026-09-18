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

export const primaryNavigation: NavigationItem[] = [
  { label: "Services", href: "/services" },
  { label: "Research Support", href: "/research" },
  { label: "Experts", href: "/experts" },
  { label: "Articles", href: "/insights" },
  { label: "About", href: "/about" },
];

export const mobileNavigation: NavigationItem[] = [
  ...primaryNavigation,
  { label: "Contact", href: "/contact" },
];