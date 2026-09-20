import type { NavigationItem } from "@/data/site-config";

export function isNavigationItemActive(pathname: string, href: string) {
  const normalize = (value: string) => {
    if (value.length > 1 && value.endsWith("/")) return value.slice(0, -1);
    return value;
  };

  const current = normalize(pathname.split("?")[0].split("#")[0]);
  const target = normalize(href.split("?")[0].split("#")[0]);

  if (target === "/") return current === "/";
  return current === target || current.startsWith(target + "/");
}

export function validateNavigation(items: NavigationItem[]) {
  const issues: string[] = [];
  const seenRoutes = new Set<string>();

  const visit = (entries: NavigationItem[], location: string) => {
    for (const item of entries) {
      const route = item.href.trim();

      if (!item.label.trim()) issues.push(location + ": navigation item has an empty label.");
      if (!route) issues.push(location + ": " + item.label + " has an empty href.");

      if (route) {
        if (seenRoutes.has(route)) issues.push(location + ": duplicate route " + route + ".");
        seenRoutes.add(route);
      }

      if (item.type === "dropdown" && !item.children?.length) {
        issues.push(location + ": " + item.label + " is a dropdown without children.");
      }

      if ((item.type === "grouped" || item.type === "mega") && !item.groups?.length) {
        issues.push(location + ": " + item.label + " has no navigation groups.");
      }

      item.children && visit(item.children, location + " > " + item.label);
      item.groups?.forEach((group) => {
        if (!group.items.length) issues.push(location + " > " + group.label + ": empty navigation group.");
        visit(group.items, location + " > " + group.label);
      });
    }
  };

  visit(items, "primary navigation");
  return issues;
}