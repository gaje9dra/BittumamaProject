"use client";

import Link from "next/link";
import { ArrowUpRight, ChevronDown, Menu, X } from "lucide-react";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import type { NavigationItem } from "@/data/site-config";
import { globalActions } from "@/data/site-config";
import { isNavigationItemActive } from "@/lib/navigation";
import { cn } from "@/lib/utils";
import { SearchPanel, SearchTrigger } from "@/components/layout/search";
import { announceHeaderSurface } from "@/lib/header-surface";
import { SignOutButton } from "@/components/auth/sign-out";


export function MobileNav({
  className,
  navigation,
  user,
}: {
  className?: string;
  navigation: NavigationItem[];
  user: { name: string | null; email: string | null } | null;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [servicesExpanded, setServicesExpanded] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const searchTriggerRef = useRef<HTMLButtonElement>(null);
  const servicesTriggerRef = useRef<HTMLButtonElement>(null);
  const searchPanelId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const previousOverflowRef = useRef("");
  const previousPaddingRef = useRef("");
  const searchOpenRef = useRef(false);

  const closeMenu = useCallback(() => {
    setServicesExpanded(false);
    setSearchOpen(false);
    setPanelOpen(false);
    setClosing(true);
    setOpen(false);
  }, []);

  const closeSearch = useCallback(() => {
    searchOpenRef.current = false;
    setSearchOpen(false);
  }, []);

  useEffect(() => {
    searchOpenRef.current = searchOpen;
  }, [searchOpen]);

  useEffect(() => {
    if (!open) return;

    previousOverflowRef.current = document.body.style.overflow;
    previousPaddingRef.current = document.body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    if (scrollbarWidth > 0) document.body.style.paddingRight = scrollbarWidth + "px";

    requestAnimationFrame(() => {
      const firstFocusable = panelRef.current?.querySelector<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      firstFocusable?.focus();
    });

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        if (searchOpenRef.current) {
          closeSearch();
        } else if (servicesExpanded) {
          setServicesExpanded(false);
          requestAnimationFrame(() => servicesTriggerRef.current?.focus());
        } else {
          closeMenu();
        }
        return;
      }

      if (event.key !== "Tab") return;
      const focusable = panelRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (!focusable?.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflowRef.current;
      document.body.style.paddingRight = previousPaddingRef.current;
    };
  }, [closeMenu, closeSearch, open, servicesExpanded]);

  useEffect(() => {
    const closeOnResize = () => {
      if (window.innerWidth >= 1024) closeMenu();
    };
    window.addEventListener("resize", closeOnResize);
    return () => window.removeEventListener("resize", closeOnResize);
  }, [closeMenu]);

  const renderDestination = (item: NavigationItem) => {
    const active = isNavigationItemActive(pathname, item.href);
    return (
      <Link
        key={item.href}
        href={item.href}
        aria-current={active ? "page" : undefined}
        onClick={closeMenu}
        className={cn(
          "mobile-menu-link type-h4 flex min-h-14 items-center justify-between border-b border-[var(--menu-border)] py-3 text-[var(--menu-text)] transition-[color,transform,opacity] duration-[var(--motion-micro)] ease-[var(--motion-ease-standard)] hover:translate-x-1 hover:text-[var(--menu-text)] focus-visible:outline-2 focus-visible:outline-offset-4",
          active && "font-semibold text-[var(--menu-text)]",
        )}
      >
        <span>
          <span className="block">{item.label}</span>
          {item.description && <span className="type-body-sm mt-1 block text-[var(--menu-text-muted)]">{item.description}</span>}
        </span>
        <ArrowUpRight aria-hidden="true" size={20} className="shrink-0 text-[var(--menu-text-muted)]" />
      </Link>
    );
  };

  return (
    <div className={cn("relative", className)} data-mobile-menu-state={open ? "open" : closing ? "closing" : "closed"}>
      <button
        ref={triggerRef}
        type="button"
        aria-label={open ? "Close navigation menu" : "Open navigation menu"}
        aria-expanded={open}
        aria-controls={mounted ? "mobile-primary-navigation" : undefined}
        className={cn(
          "mobile-menu-trigger relative z-[var(--layer-toast)] inline-flex h-11 w-11 items-center justify-center rounded-full border border-transparent bg-transparent p-0 text-[var(--foreground)] transition-[background-color,border-color,color,transform] duration-[var(--motion-micro)] ease-[var(--motion-ease-standard)] active:scale-[0.98] hover:bg-[var(--surface-muted)] focus-visible:outline-2 focus-visible:outline-offset-3",
        )}
        onClick={() => {
          if (open) closeMenu();
          else {
            announceHeaderSurface("mobile");
            setClosing(false);
            setPanelOpen(false);
            setMounted(true);
            setOpen(true);
          }
        }}
      >
        <Menu
          aria-hidden="true"
          className={cn(
            "transition-[opacity,transform] duration-[var(--motion-micro)]",
            open && "scale-75 opacity-0",
          )}
          size={20}
        />
        <X
          aria-hidden="true"
          className={cn(
            "absolute transition-[opacity,transform] duration-[var(--motion-micro)]",
            !open && "scale-75 opacity-0",
          )}
          size={20}
        />
      </button>

      {mounted && (
        <div
          id="mobile-primary-navigation"
          ref={panelRef}
          className={cn(
            "fixed z-[var(--layer-modal)] overflow-hidden border lg:hidden",
            panelOpen ? "mobile-menu-panel mobile-menu-panel-open" : "mobile-menu-panel mobile-menu-panel-closing",
          )}
        >
          <nav aria-label="Mobile primary navigation" className="mobile-menu-content flex h-full min-h-0 flex-col overflow-y-auto px-[var(--page-gutter)] pb-8 pt-[calc(2.75rem+1.5rem)]">
            <div className="flex-1">
              <div className="mb-7">
                <SearchTrigger
                  ref={searchTriggerRef}
                  controlsId={searchPanelId}
                  open={searchOpen}
                  onClick={() => setSearchOpen((value) => !value)}
                  className="mobile-menu-search-trigger w-full justify-start"
                />
                <SearchPanel
                  id={searchPanelId}
                  open={searchOpen}
                  onClose={closeSearch}
                  variant="inline"
                  className="mobile-menu-search mt-3"
                  restoreFocusRef={searchTriggerRef}
                />
              </div>

              <div className="mb-8 flex items-center gap-2">
                {user ? (
                  <>
                    <Link
                      href="/account"
                      onClick={closeMenu}
                      className="mobile-menu-utility inline-flex min-h-11 items-center rounded-[var(--radius-md)] border border-[var(--menu-border)] bg-[var(--menu-control-surface)] px-4 type-button text-[var(--menu-text)] transition-colors duration-[var(--motion-fast)] hover:bg-[var(--menu-surface-elevated)] focus-visible:outline-2 focus-visible:outline-offset-3"
                    >
                      Account
                    </Link>
                    <SignOutButton
                      compact
                      className="mobile-menu-utility min-h-11 border border-transparent px-2 text-[var(--menu-text)] hover:text-[var(--menu-text)] focus-visible:outline-2 focus-visible:outline-offset-3"
                    />
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      onClick={closeMenu}
                      className="mobile-menu-utility inline-flex min-h-11 items-center border border-transparent px-2 type-button text-[var(--menu-text)] transition-colors duration-[var(--motion-fast)] hover:text-[var(--menu-text)] focus-visible:outline-2 focus-visible:outline-offset-3"
                    >
                      Login
                    </Link>
                    <Link
                      href="/register"
                      onClick={closeMenu}
                      className="mobile-menu-utility inline-flex min-h-11 items-center rounded-[var(--radius-md)] border border-[var(--menu-border)] bg-[var(--menu-control-surface)] px-4 type-button text-[var(--menu-text)] transition-colors duration-[var(--motion-fast)] hover:bg-[var(--menu-surface-elevated)] focus-visible:outline-2 focus-visible:outline-offset-3"
                    >
                      Register
                    </Link>
                  </>
                )}
              </div>

              <div>
                {navigation.map((item, index) => {
                  const isServices = item.href === "/services" && Boolean(item.groups?.length);
                  if (!isServices) {
                    return (
                      <div key={item.href} className={cn(index === 0 && "border-t border-border")}>
                        {renderDestination(item)}
                      </div>
                    );
                  }

                  const servicesActive = isNavigationItemActive(pathname, item.href);

                  return (
                    <div key={item.href} className={cn(index === 0 && "border-t border-border")}>
                      <button
                        ref={servicesTriggerRef}
                        type="button"
                        aria-expanded={servicesExpanded}
                        aria-controls="mobile-services-submenu"
                        onClick={() => setServicesExpanded((value) => !value)}
                        className={cn(
                          "mobile-menu-link type-h4 flex min-h-14 w-full items-center justify-between border-b border-[var(--menu-border)] py-3 text-left text-[var(--menu-text)] transition-[color,transform,opacity] duration-[var(--motion-micro)] hover:text-[var(--menu-text)] focus-visible:outline-2 focus-visible:outline-offset-4",
                          servicesActive && "font-semibold text-[var(--menu-text)]",
                        )}
                      >
                        <span>{item.label}</span>
                        <ChevronDown aria-hidden="true" size={22} className={cn("shrink-0 text-[var(--menu-text-muted)] transition-transform duration-[var(--motion-fast)]", servicesExpanded && "rotate-180")} />
                      </button>

                      <div
                        id="mobile-services-submenu"
                        aria-hidden={!servicesExpanded}
                        className={cn(
                          "mobile-menu-submenu grid transition-[grid-template-rows,opacity] duration-[var(--motion-fast)] ease-[var(--motion-ease-standard)]",
                          servicesExpanded
                            ? "grid-rows-[1fr] opacity-100"
                            : "pointer-events-none grid-rows-[0fr] opacity-0",
                        )}
                      >
                        <div className="min-h-0 overflow-hidden ml-3 border-l border-[var(--menu-border)] pl-4">
                          {(item.groups ?? []).map((group) => (
                            <section
                              key={group.label}
                              className="py-3"
                              aria-labelledby={"mobile-services-" + group.label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}
                            >
                              <p
                                id={"mobile-services-" + group.label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}
                                className="type-label mb-2 text-[var(--menu-text-muted)]"
                              >
                                {group.label}
                              </p>
                              <div>{group.items.map(renderDestination)}</div>
                            </section>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <Link
              href={globalActions.contact.href}
              onClick={closeMenu}
              className="mobile-menu-utility mt-8 inline-flex min-h-11 w-fit items-center rounded-[var(--radius-md)] border px-5 type-button transition-[background-color,border-color,color,transform] duration-[var(--motion-micro)] hover:-translate-y-px focus-visible:outline-2 focus-visible:outline-offset-3"
            >
              {globalActions.contact.label}
            </Link>
          </nav>
        </div>
      )}
    </div>
  );
}
