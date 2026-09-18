"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useEffect, useRef } from "react";
import type { RefObject } from "react";
import type { NavigationItem } from "@/data/navigation";
import { isNavigationItemActive } from "@/lib/navigation";
import { subscribeToHeaderSurface } from "@/lib/header-surface";
import { cn } from "@/lib/utils";

type Props = {
  item: NavigationItem;
  pathname: string;
  open: boolean;
  onClose: (restoreFocus?: boolean) => void;
  triggerRef: RefObject<HTMLButtonElement | null>;
  panelId: string;
};

export function NavigationMegaMenu({ item, pathname, open, onClose, triggerRef, panelId }: Props) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const outside = (event: PointerEvent) => {
      const target = event.target;
      if (target instanceof Node && !panelRef.current?.contains(target) && !triggerRef.current?.contains(target)) onClose();
    };
    const focusOutside = (event: FocusEvent) => {
      const target = event.target;
      if (target instanceof Node && !panelRef.current?.contains(target) && !triggerRef.current?.contains(target)) onClose();
    };
    const keyboard = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose(true);
      }
    };
    const unsubscribe = subscribeToHeaderSurface((surface) => {
      if (surface !== "mega") onClose();
    });
    document.addEventListener("pointerdown", outside);
    document.addEventListener("focusin", focusOutside);
    document.addEventListener("keydown", keyboard);
    return () => {
      unsubscribe();
      document.removeEventListener("pointerdown", outside);
      document.removeEventListener("focusin", focusOutside);
      document.removeEventListener("keydown", keyboard);
    };
  }, [open, onClose, triggerRef]);

  if (!open) return null;

  return (
    <div id={panelId} ref={panelRef} className="absolute inset-x-0 top-full z-[var(--layer-modal)] rounded-b-[var(--radius-md)] border-b border-border bg-surface shadow-[var(--shadow-sm)] motion-fade">
      <div className="mx-auto w-full max-w-[var(--container-wide)] px-[var(--page-gutter)] py-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-12">
          {(item.groups ?? []).map((group) => (
            <section key={group.label} className="min-w-0 lg:col-span-3">
              <p className="type-label text-muted-foreground">{group.label}</p>
              {group.description && <p className="type-caption mt-2 max-w-[28ch] text-muted-foreground">{group.description}</p>}
              <ul className="mt-4 space-y-1">
                {group.items.map((child) => {
                  const active = isNavigationItemActive(pathname, child.href);
                  return (
                    <li key={child.href}>
                      <Link href={child.href} aria-current={active ? "page" : undefined} onClick={() => onClose()} className={cn("group flex items-start justify-between gap-4 py-2 text-foreground transition-colors duration-[var(--motion-fast)] hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2", active && "font-medium text-primary")}>
                        <span className="min-w-0">
                          <span className="type-body-sm block font-medium">{child.label}</span>
                          {child.description && <span className="type-caption mt-1 block text-muted-foreground">{child.description}</span>}
                        </span>
                        <ArrowUpRight aria-hidden="true" size={16} className="mt-0.5 shrink-0 opacity-0 transition-opacity duration-[var(--motion-fast)] group-hover:opacity-100 group-focus-within:opacity-100" />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}
        </div>
        {item.featured && (
          <div className="mt-8 border-t border-border pt-6">
            <Link href={item.featured.href} onClick={() => onClose()} className="group inline-flex items-start gap-3 focus-visible:outline-2 focus-visible:outline-offset-3">
              <span>
                {item.featured.eyebrow && <span className="type-label block text-muted-foreground">{item.featured.eyebrow}</span>}
                <span className="type-body-sm mt-1 block font-medium text-foreground group-hover:text-primary">{item.featured.label}</span>
                {item.featured.description && <span className="type-caption mt-1 block text-muted-foreground">{item.featured.description}</span>}
              </span>
              <ArrowUpRight aria-hidden="true" size={18} className="mt-0.5 shrink-0" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}