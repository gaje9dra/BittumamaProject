export type NavigationItem = {
  label: string;
  href: string;
  type?: "link" | "group";
};

export const primaryNavigation: NavigationItem[] = [
  { label: "Services", href: "/services" },
  { label: "Research & AI", href: "/research" },
  { label: "Experts", href: "/experts" },
  { label: "Insights", href: "/insights" },
  { label: "About", href: "/about" },
];

export const mobileNavigation: NavigationItem[] = [
  ...primaryNavigation,
  { label: "Contact", href: "/contact" },
];
