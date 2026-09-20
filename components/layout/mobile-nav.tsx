"use client";

import Link from "next/link";
import { ArrowLeft, ArrowUpRight, ChevronRight, Menu, X } from "lucide-react";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import type { NavigationItem } from "@/data/site-config";
import { globalActions, primaryNavigation } from "@/data/site-config";
import { isNavigationItemActive } from "@/lib/navigation";
import { cn } from "@/lib/utils";
import { SearchPanel, SearchTrigger } from "@/components/layout/search";
import { announceHeaderSurface } from "@/lib/header-surface";

const MENU_TRANSITION_MS = 420;

export function MobileNav({ className }: { className?: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [closing, setClosing] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState<NavigationItem | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const searchTriggerRef = useRef<HTMLButtonElement>(null);
  const searchPanelId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const submenuBackRef = useRef<HTMLButtonElement>(null);
  const previousOverflowRef = useRef("");
  const previousPaddingRef = useRef("");
  const activeSubmenuRef = useRef<NavigationItem | null>(null);
  const searchOpenRef = useRef(false);

  const closeMenu = useCallback(() => {
    setActiveSubmenu(null);
    setSearchOpen(false);
    setClosing(true);
    setOpen(false);
  }, []);

  const closeSearch = useCallback(() => {
    searchOpenRef.current = false;
    setSearchOpen(false);
  }, []);

  const enterSubmenu = useCallback((item: NavigationItem) => {
    activeSubmenuRef.current = item;
    setActiveSubmenu(item);
  }, []);
  const leaveSubmenu = useCallback(() => {
    activeSubmenuRef.current = null;
    setActiveSubmenu(null);
  }, []);

  useEffect(() => {
    activeSubmenuRef.current = activeSubmenu;
    searchOpenRef.current = searchOpen;
  }, [activeSubmenu, searchOpen]);

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
        } else if (activeSubmenuRef.current) {
          leaveSubmenu();
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
  }, [closeMenu, closeSearch, leaveSubmenu, open]);

  useEffect(() => {
    if (!open || !activeSubmenu) return;
    requestAnimationFrame(() => submenuBackRef.current?.focus());
  }, [activeSubmenu, open]);

  useEffect(() => {
    if (open || !mounted) return;
    const timer = window.setTimeout(() => {
      setMounted(false);
      triggerRef.current?.focus();
    }, MENU_TRANSITION_MS);
    return () => window.clearTimeout(timer);
  }, [open, mounted]);

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
          "type-h4 flex min-h-14 items-center justify-between border-b border-border py-3 text-foreground transition-colors duration-[var(--motion-micro)] ease-[var(--motion-ease-standard)] hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-4",
          active && "font-semibold text-primary",
        )}
      >
        <span>
          <span className="block">{item.label}</span>
          {item.description && <span className="type-body-sm mt-1 block text-muted-foreground">{item.description}</span>}
        </span>
        <ArrowUpRight aria-hidden="true" size={20} className="shrink-0 text-muted-foreground" />
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
        className="relative z-[var(--layer-modal)] inline-flex h-11 min-w-16 items-center justify-center gap-2 rounded-full border border-border bg-background px-3 text-foreground shadow-[0_8px_24px_rgb(0_0_0_/_0.06)] transition-[background-color,border-color,transform] duration-[var(--motion-micro)] ease-[var(--motion-ease-standard)] hover:bg-surface-muted active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-3"
        onClick={() => {
          if (open) closeMenu();
          else {
            announceHeaderSurface("mobile");
            setClosing(false);
            setMounted(true);
            setOpen(true);
          }
        }}
      >
        <span className={cn("type-label transition-[opacity,transform] duration-[var(--motion-micro)]", open && "scale-95 opacity-0")}>Menu</span>
        <Menu aria-hidden="true" className={cn("transition-[opacity,transform] duration-[var(--motion-micro)]", open && "scale-75 opacity-0")} size={17} />
        <X aria-hidden="true" className={cn("absolute right-3 transition-[opacity,transform] duration-[var(--motion-micro)]", !open && "scale-75 opacity-0")} size={18} />
      </button>

      {mounted && (
        <div
          id="mobile-primary-navigation"
          ref={panelRef}
          className={cn(
            "fixed right-0 top-0 z-[var(--layer-modal)] h-[100dvh] overflow-hidden border border-border bg-background lg:hidden",
            open ? "mobile-menu-panel mobile-menu-panel-open" : "mobile-menu-panel mobile-menu-panel-closing",
          )}
        >
          <nav aria-label="Mobile primary navigation" className="mobile-menu-content flex h-full min-h-0 flex-col overflow-y-auto px-[var(--page-gutter)] pb-8 pt-[calc(var(--header-height)+1.5rem)]">
            <div className="flex-1">
              {!activeSubmenu ? (
                <>
                  <div className="mb-7">
                    <SearchTrigger
                      ref={searchTriggerRef}
                      controlsId={searchPanelId}
                      open={searchOpen}
                      onClick={() => setSearchOpen((value) => !value)}
                      className="w-full justify-start border-border bg-surface"
                    />
                    <SearchPanel
                      id={searchPanelId}
                      open={searchOpen}
                      onClose={closeSearch}
                      variant="inline"
                      className="mt-3"
                      restoreFocusRef={searchTriggerRef}
                    />
                  </div>
                  {primaryNavigation.map((item, index) => {
                    const hasNestedNavigation = Boolean(item.children?.length || item.groups?.length);
                    if (!hasNestedNavigation) {
                      return (
                        <div key={item.href} className={cn(index === 0 && "border-t border-border")}>
                          {renderDestination(item)}
                        </div>
                      );
                    }

                    return (
                      <button
                        key={item.href}
                        type="button"
                        onClick={() => enterSubmenu(item)}
                        className={cn(
                          "type-h4 flex min-h-14 w-full items-center justify-between border-b border-border py-3 text-left text-foreground transition-colors duration-[var(--motion-micro)] hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-4",
                          index === 0 && "border-t",
                          isNavigationItemActive(pathname, item.href) && "font-semibold text-primary",
                        )}
                      >
                        <span>{item.label}</span>
                        <ChevronRight aria-hidden="true" size={22} className="shrink-0 text-muted-foreground" />
                      </button>
                    );
                  })}
                </>
              ) : (
                <div className="mobile-menu-submenu">
                  <button
                    ref={submenuBackRef}
                    type="button"
                    onClick={leaveSubmenu}
                    className="type-nav mb-6 inline-flex min-h-11 items-center gap-2 text-muted-foreground transition-colors duration-[var(--motion-fast)] hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-3"
                    aria-label={"Back to " + (activeSubmenu.label === "Services" ? "main menu" : "main navigation")}
                  >
                    <ArrowLeft aria-hidden="true" size={18} />
                    Back
                  </button>

                  <div className="border-b border-border pb-5">
                    <p className="type-h3">{activeSubmenu.label}</p>
                    {activeSubmenu.description && <p className="type-body-sm mt-2 text-muted-foreground">{activeSubmenu.description}</p>}
                  </div>

                  <div className="mt-2">
                    {(activeSubmenu.children ?? []).map(renderDestination)}
                    {(activeSubmenu.groups ?? []).map((group) => (
                      <section key={group.label} className="border-b border-border py-5">
                        <p className="type-label text-muted-foreground">{group.label}</p>
                        {group.description && <p className="type-caption mt-2 text-muted-foreground">{group.description}</p>}
                        <div className="mt-2">{group.items.map(renderDestination)}</div>
                      </section>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Link
              href={globalActions.contact.href}
              onClick={closeMenu}
              className="mt-8 inline-flex min-h-11 w-fit items-center rounded-[var(--radius-md)] border border-primary bg-primary px-5 type-button text-primary-foreground transition-colors duration-[var(--motion-micro)] hover:bg-primary-700 focus-visible:outline-2 focus-visible:outline-offset-3"
            >
              {globalActions.contact.label}
            </Link>
          </nav>
        </div>
      )}
    </div>
  );
}
