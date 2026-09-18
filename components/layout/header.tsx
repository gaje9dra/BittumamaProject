import Link from "next/link";
import { HeaderActions } from "@/components/layout/header-actions";
import { MobileNav } from "@/components/layout/mobile-nav";
import { primaryNavigation } from "@/data/navigation";

export function Header() {
  return (
    <header className="layout-layer-navigation border-b border-border bg-background">
      <div className="mx-auto flex min-h-16 w-full max-w-[var(--container-wide)] items-center px-[var(--page-gutter)] lg:min-h-[4.5rem]">
        <Link href="/" aria-label="Bittumama home" className="shrink-0 text-foreground transition-colors duration-[var(--motion-micro)] hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-4">
          <span className="type-h5 font-semibold tracking-[-0.02em]">Bittumama</span>
        </Link>
        <nav aria-label="Primary navigation" className="ml-auto hidden items-center gap-7 lg:flex">
          {primaryNavigation.map((item) => (
            <Link key={item.href} href={item.href} className="type-nav relative py-2 text-muted-foreground transition-colors duration-[var(--motion-micro)] hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-4">
              {item.label}
            </Link>
          ))}
        </nav>
        <HeaderActions className="ml-7 hidden lg:flex" />
        <MobileNav className="ml-auto lg:hidden" />
      </div>
    </header>
  );
}
