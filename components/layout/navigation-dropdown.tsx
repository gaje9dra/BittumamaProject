"use client";

import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import type { NavigationItem } from "@/data/navigation";
import { isNavigationItemActive } from "@/lib/navigation";
import { announceHeaderSurface, subscribeToHeaderSurface } from "@/lib/header-surface";
import { cn } from "@/lib/utils";

const CLOSE_DELAY_MS = 140;

export function NavigationDropdown({ item, pathname }: { item: NavigationItem; pathname: string }) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<HTMLAnchorElement[]>([]);
  const closeTimerRef = useRef<number | null>(null);
  const panelId = useId();
  const active = isNavigationItemActive(pathname, item.href);

  const clearCloseTimer = useCallback(() => {
    if (closeTimerRef.current === null) return;
    window.clearTimeout(closeTimerRef.current);
    closeTimerRef.current = null;
  }, []);

  const openMenu = useCallback(() => {
    clearCloseTimer();
    announceHeaderSurface("dropdown");
    setOpen(true);
  }, [clearCloseTimer]);

  const close = useCallback(
    (restoreFocus = false) => {
      clearCloseTimer();
      setOpen(false);
      if (restoreFocus) requestAnimationFrame(() => triggerRef.current?.focus());
    },
    [clearCloseTimer],
  );

  const scheduleClose = useCallback(() => {
    clearCloseTimer();
    closeTimerRef.current = window.setTimeout(() => {
      close();
      closeTimerRef.current = null;
    }, CLOSE_DELAY_MS);
  }, [clearCloseTimer, close]);

  useEffect(() => {
    return () => clearCloseTimer();
  }, [clearCloseTimer]);

  useEffect(() => {
    if (!open) return;
    return subscribeToHeaderSurface((surface) => {
      if (surface !== "dropdown") close();
    });
  }, [close, open]);

  useEffect(() => {
    if (!open) return;

    const outside = (event: PointerEvent) => {
      const target = event.target;
      if (target instanceof Node && !panelRef.current?.contains(target) && !triggerRef.current?.contains(target)) close();
    };

    const keyboard = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        close(true);
        return;
      }

      if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) return;

      const links = linksRef.current.filter(Boolean);
      if (!links.length) return;

      event.preventDefault();
      const current = links.indexOf(document.activeElement as HTMLAnchorElement);

      if (event.key === "Home") links[0]?.focus();
      else if (event.key === "End") links[links.length - 1]?.focus();
      else {
        const direction = event.key === "ArrowDown" ? 1 : -1;
        const next = current < 0 ? (direction > 0 ? 0 : links.length - 1) : (current + direction + links.length) % links.length;
        links[next]?.focus();
      }
    };

    const focusOutside = (event: FocusEvent) => {
      const target = event.target;
      if (target instanceof Node && !panelRef.current?.contains(target) && !triggerRef.current?.contains(target)) close();
    };

    document.addEventListener("pointerdown", outside);
    document.addEventListener("focusin", focusOutside);
    document.addEventListener("keydown", keyboard);

    return () => {
      document.removeEventListener("pointerdown", outside);
      document.removeEventListener("focusin", focusOutside);
      document.removeEventListener("keydown", keyboard);
    };
  }, [close, open]);

  return (
    <div
      ref={panelRef}
      className="relative"
      onPointerEnter={clearCloseTimer}
      onPointerLeave={scheduleClose}
    >
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => {
          if (open) close();
          else openMenu();
        }}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " " || event.key === "ArrowDown" || event.key === "ArrowUp") {
            event.preventDefault();
            openMenu();
            requestAnimationFrame(() => {
              if (event.key === "ArrowUp") linksRef.current[linksRef.current.length - 1]?.focus();
              else linksRef.current[0]?.focus();
            });
          }
        }}
        className={cn(
          "type-nav inline-flex items-center gap-1.5 py-2 text-muted-foreground transition-colors duration-[var(--motion-fast)] ease-[var(--motion-ease-standard)] hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-4",
          (active || open) && "text-foreground",
        )}
      >
        {item.label}
        <ChevronDown
          aria-hidden="true"
          size={16}
          className={cn("transition-transform duration-[var(--motion-fast)]", open && "rotate-180")}
        />
      </button>

      <div
        id={panelId}
        aria-hidden={!open}
        className={cn(
          "absolute right-0 top-full z-[var(--layer-modal)] w-[min(34rem,calc(100vw-2rem))] origin-top-right rounded-[var(--radius-md)] border border-border bg-surface p-2 shadow-[var(--shadow-sm)] transition-[opacity,transform,visibility] duration-[150ms] ease-[var(--motion-ease-standard)]",
          open
            ? "visible translate-y-0 scale-100 opacity-100"
            : "pointer-events-none invisible -translate-y-1 scale-[0.99] opacity-0",
        )}
      >
        {item.description && <p className="type-body-sm border-b border-border px-3 py-3 text-muted-foreground">{item.description}</p>}
        <ul className="m-0 grid list-none grid-cols-1 gap-1 p-0 sm:grid-cols-2">
          {(item.children ?? []).map((child, index) => {
            const childActive = isNavigationItemActive(pathname, child.href);
            const isViewAll = child.href === item.href;

            return (
              <li key={child.href} className={cn(isViewAll && "sm:col-span-2")}>
                <Link
                  ref={(node) => {
                    if (node) linksRef.current[index] = node;
                  }}
                  href={child.href}
                  aria-current={childActive ? "page" : undefined}
                  onClick={() => close()}
                  className={cn(
                    "block rounded-[calc(var(--radius-md)-2px)] px-3 py-3 transition-[background-color,color,transform] duration-[var(--motion-fast)] hover:bg-surface-interactive focus-visible:bg-surface-interactive focus-visible:outline-2 focus-visible:outline-offset-[-2px]",
                    childActive && "text-primary",
                    isViewAll && "border-t border-border font-medium",
                  )}
                >
                  <span className="type-body-sm block font-medium text-foreground">{child.label}</span>
                  {child.description && <span className="type-caption mt-1 block text-muted-foreground">{child.description}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
