"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { primaryNavigation } from "@/data/navigation";
import { isNavigationItemActive } from "@/lib/navigation";

export function DesktopNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Primary navigation" className="ml-auto hidden items-center gap-7 lg:flex">
      {primaryNavigation.map((item) => {
        const active = isNavigationItemActive(pathname, item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={`type-nav relative py-2 transition-colors duration-[var(--motion-micro)] ease-[var(--motion-ease-standard)] focus-visible:outline-2 focus-visible:outline-offset-4 ${
              active
                ? "font-medium text-foreground after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:bg-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
