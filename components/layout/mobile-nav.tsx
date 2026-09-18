"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { mobileNavigation } from "@/data/navigation";
import { isNavigationItemActive } from "@/lib/navigation";
import { cn } from "@/lib/utils";

const MENU_TRANSITION_MS = 150;

export function MobileNav({ className }: { className?: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLElement>(null);
  const previousOverflowRef = useRef("");
  const previousPaddingRef = useRef("");

  const closeMenu = () => setOpen(false);

  useEffect(() => {
    if (!open) return;

    previousOverflowRef.current = document.body.style.overflow;
    previousPaddingRef.current = document.body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    if (scrollbarWidth > 0) document.body.style.paddingRight = `${scrollbarWidth}px`;

    requestAnimationFrame(() => {
      const firstFocusable = panelRef.current?.querySelector<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      firstFocusable?.focus();
    });

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeMenu();
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
  }, [open]);

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
  }, []);

  return (
    <div className={cn("relative", className)}>
      <button
        ref={triggerRef}
        type="button"
        aria-label={open ? "Close navigation menu" : "Open navigation menu"}
        aria-expanded={open}
        aria-controls="mobile-primary-navigation"
        className="inline-flex size-11 items-center justify-center border border-border bg-transparent text-foreground transition-colors duration-[var(--motion-micro)] hover:bg-surface-muted focus-visible:outline-2 focus-visible:outline-offset-3"
        onClick={() => {
          if (open) closeMenu();
          else {
            setMounted(true);
            setOpen(true);
          }
        }}
      >
        <Menu aria-hidden="true" className={cn("absolute transition-[opacity,transform] duration-[var(--motion-micro)] ease-[var(--motion-ease-standard)]", open && "scale-75 opacity-0")} size={20} />
        <X aria-hidden="true" className={cn("absolute transition-[opacity,transform] duration-[var(--motion-micro)] ease-[var(--motion-ease-standard)]", !open && "scale-75 opacity-0")} size={20} />
      </button>

      {mounted && (
        <aside
          id="mobile-primary-navigation"
          ref={panelRef}
          aria-label="Mobile primary navigation"
          className={cn(
            "fixed inset-x-0 bottom-0 top-16 z-[var(--layer-modal)] overflow-y-auto border-t border-border bg-background px-[var(--page-gutter)] py-8 lg:hidden",
            open ? "animate-[mobile-menu-enter_var(--motion-micro)_var(--motion-ease-standard)_both]" : "animate-[mobile-menu-exit_var(--motion-micro)_var(--motion-ease-exit)_both]",
          )}
        >
          <nav aria-label="Mobile primary navigation" className="mx-auto flex min-h-full max-w-[var(--container-content)] flex-col">
            <div className="flex-1">
              {mobileNavigation.map((item, index) => {
                const active = isNavigationItemActive(pathname, item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    onClick={closeMenu}
                    className={cn(
                      "type-h4 flex min-h-14 items-center justify-between border-b border-border py-3 text-foreground transition-colors duration-[var(--motion-micro)] ease-[var(--motion-ease-standard)] hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-4",
                      index === 0 && "border-t",
                      active && "font-semibold text-primary",
                    )}
                  >
                    <span>{item.label}</span>
                    <ArrowUpRight aria-hidden="true" size={20} className="shrink-0 text-muted-foreground" />
                  </Link>
                );
              })}
            </div>
            <Link
              href="/contact"
              onClick={closeMenu}
              className="mt-8 inline-flex min-h-11 w-fit items-center border border-primary bg-primary px-5 type-button text-primary-foreground transition-colors duration-[var(--motion-micro)] hover:bg-primary-700 focus-visible:outline-2 focus-visible:outline-offset-3"
            >
              Get in touch
            </Link>
          </nav>
        </aside>
      )}
    </div>
  );
}
