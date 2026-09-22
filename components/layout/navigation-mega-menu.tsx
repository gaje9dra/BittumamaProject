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

  return (
    <div
      id={panelId}
      ref={panelRef}
      hidden={!open}
      className="absolute inset-x-0 top-full z-[var(--layer-modal)] border-b border-border bg-surface shadow-[var(--shadow-sm)] motion-fade"
    >
      <div className="mx-auto max-h-[min(70vh,38rem)] w-full max-w-[var(--container-wide)] overflow-y-auto overscroll-contain px-[var(--page-gutter)] py-6 sm:py-7 lg:py-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-x-8 sm:gap-y-8 lg:grid-cols-3 lg:gap-x-10">
          {(item.groups ?? []).map((group) => (
            <section key={group.label} className="min-w-0">
              <p className="type-label border-b border-border pb-3 text-muted-foreground">{group.label}</p>
              {group.description && <p className="type-caption mt-2 max-w-[28ch] text-muted-foreground">{group.description}</p>}
              <ul className="mt-2">
                {group.items.map((child) => {
                  const active = isNavigationItemActive(pathname, child.href);
                  return (
                    <li key={child.href} className="border-b border-border last:border-b-0">
                      <Link
                        href={child.href}
                        aria-current={active ? "page" : undefined}
                        onClick={() => onClose()}
                        className={cn(
                          "group flex min-h-10 items-start justify-between gap-3 py-2.5 text-foreground transition-[background-color,color,transform] duration-[var(--motion-fast)] hover:bg-surface-muted hover:text-primary focus-visible:bg-surface-muted focus-visible:outline-2 focus-visible:outline-offset-2",
                          active && "font-medium text-primary",
                        )}
                      >
                        <span className="min-w-0">
                          <span className="type-body-sm block font-medium">{child.label}</span>
                        </span>
                        <ArrowUpRight aria-hidden="true" size={15} className="mt-0.5 shrink-0 opacity-0 transition-opacity duration-[var(--motion-fast)] group-hover:opacity-100 group-focus-visible:opacity-100" />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
