"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { NavigationDropdown } from "@/components/layout/navigation-dropdown";
import { NavigationMegaTrigger } from "@/components/layout/navigation-mega-trigger";
import { primaryNavigation } from "@/data/site-config";
import { isNavigationItemActive } from "@/lib/navigation";
import { announceHeaderSurface } from "@/lib/header-surface";
import { cn } from "@/lib/utils";

export function DesktopNav() {
  const pathname = usePathname();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) announceHeaderSurface("mobile");
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <nav aria-label="Primary navigation" className="ml-auto hidden items-center gap-5 lg:flex xl:gap-7">
      {primaryNavigation.map((item) => {
        if (item.type === "dropdown" && item.children?.length) {
          return <NavigationDropdown key={item.href} item={item} pathname={pathname} />;
        }

        if ((item.type === "grouped" || item.type === "mega") && item.groups?.length) {
          return <NavigationMegaTrigger key={item.href} item={item} pathname={pathname} />;
        }

        const active = isNavigationItemActive(pathname, item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "type-nav relative py-2 transition-colors duration-[var(--motion-micro)] ease-[var(--motion-ease-standard)] focus-visible:outline-2 focus-visible:outline-offset-4",
              active
                ? "font-medium text-foreground after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:bg-primary"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
