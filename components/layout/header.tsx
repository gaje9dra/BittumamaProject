import Link from "next/link";
import { DesktopNav } from "@/components/layout/desktop-nav";
import { HeaderActions } from "@/components/layout/header-actions";
import { MobileNav } from "@/components/layout/mobile-nav";
import { HeaderScrollShell } from "@/components/layout/header-scroll-shell";
import { siteConfig } from "@/data/site-config";
import { getPrimaryNavigationWithServices } from "@/data/navigation";
import { getCurrentUser } from "@/lib/auth/guards";
import { getRequestedPublishedServices } from "@/lib/services/repository";

export async function Header() {
  const [user, services] = await Promise.all([getCurrentUser(), getRequestedPublishedServices()]);
  const navigation = getPrimaryNavigationWithServices(services);

  return (
    <HeaderScrollShell>
      <header className="border-b border-border bg-background transition-[background-color,border-color] duration-[var(--motion-micro)] ease-[var(--motion-ease-standard)]">
        <div className="mx-auto flex min-h-[var(--header-height)] w-full max-w-[var(--container-wide)] items-center px-[var(--page-gutter)] lg:min-h-[var(--header-height-lg)]">
          <Link
            href="/"
            aria-label={siteConfig.siteName + " home"}
            className="shrink-0 text-foreground transition-colors duration-[var(--motion-micro)] hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-4"
          >
            <span className="type-h5 font-semibold tracking-[-0.02em]">{siteConfig.siteName}</span>
          </Link>
          <DesktopNav navigation={navigation} />
          <HeaderActions className="ml-5 hidden lg:flex xl:ml-7" user={user ? { name: user.name ?? null, email: user.email ?? null, image: user.image ?? null } : null} />
          <MobileNav
            className="ml-auto lg:hidden"
            navigation={navigation}
            user={user ? { name: user.name ?? null, email: user.email ?? null } : null}
          />
        </div>
      </header>
    </HeaderScrollShell>
  );
}
