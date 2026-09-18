import Link from "next/link";
import { DesktopNav } from "@/components/layout/desktop-nav";
import { HeaderActions } from "@/components/layout/header-actions";
import { MobileNav } from "@/components/layout/mobile-nav";

export function Header() {
  return (
    <header className="layout-layer-navigation border-b border-border bg-background">
      <div className="mx-auto flex min-h-16 w-full max-w-[var(--container-wide)] items-center px-[var(--page-gutter)] lg:min-h-[4.5rem]">
        <Link href="/" aria-label="Bittumama home" className="shrink-0 text-foreground transition-colors duration-[var(--motion-micro)] hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-4">
          <span className="type-h5 font-semibold tracking-[-0.02em]">Bittumama</span>
        </Link>
        <DesktopNav />
        <HeaderActions className="ml-7 hidden lg:flex" />
        <MobileNav className="ml-auto lg:hidden" />
      </div>
    </header>
  );
}
