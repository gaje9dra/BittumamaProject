"use client";

import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import type { NavigationItem } from "@/data/navigation";
import { isNavigationItemActive } from "@/lib/navigation";
import { announceHeaderSurface, subscribeToHeaderSurface } from "@/lib/header-surface";
import { cn } from "@/lib/utils";

export function NavigationDropdown({ item, pathname }: { item: NavigationItem; pathname: string }) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<HTMLAnchorElement[]>([]);
  const panelId = useId();
  const active = isNavigationItemActive(pathname, item.href);

  const openMenu = useCallback(() => {
    announceHeaderSurface("dropdown");
    setOpen(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    return subscribeToHeaderSurface((surface) => {
      if (surface !== "dropdown") setOpen(false);
    });
  }, [open]);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const close = useCallback((restoreFocus = false) => {
    setOpen(false);
    if (restoreFocus) requestAnimationFrame(() => triggerRef.current?.focus());
  }, []);

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
    <div ref={panelRef} className="relative">
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
        <ChevronDown aria-hidden="true" size={16} className={cn("transition-transform duration-[var(--motion-fast)]", open && "rotate-180")} />
      </button>
      <div id={panelId} hidden={!open} className="absolute left-0 top-full z-[var(--layer-modal)] w-[min(22rem,calc(100vw-2rem))] rounded-[var(--radius-md)] border border-border bg-surface py-2 shadow-[var(--shadow-sm)] motion-fade">
        {item.description && <p className="type-body-sm border-b border-border px-5 py-3 text-muted-foreground">{item.description}</p>}
        <ul className="m-0 list-none p-0">
            {(item.children ?? []).map((child, index) => {
              const childActive = isNavigationItemActive(pathname, child.href);
              return (
                <li key={child.href}>
                  <Link
                    ref={(node) => { if (node) linksRef.current[index] = node; }}
                    href={child.href}
                    aria-current={childActive ? "page" : undefined}
                    onClick={() => close()}
                    className={cn("block px-5 py-3 transition-colors duration-[var(--motion-fast)] hover:bg-surface-interactive focus-visible:bg-surface-interactive focus-visible:outline-none", childActive && "text-primary")}
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