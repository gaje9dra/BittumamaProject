"use client";

import { ChevronDown } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { NavigationItem } from "@/data/navigation";
import { NavigationMegaMenu } from "@/components/layout/navigation-mega-menu";
import { isNavigationItemActive } from "@/lib/navigation";
import { announceHeaderSurface, subscribeToHeaderSurface } from "@/lib/header-surface";
import { cn } from "@/lib/utils";

const CLOSE_DELAY_MS = 140;

export function NavigationMegaTrigger({ item, pathname }: { item: NavigationItem; pathname: string }) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeTimerRef = useRef<number | null>(null);

  const clearCloseTimer = useCallback(() => {
    if (closeTimerRef.current === null) return;
    window.clearTimeout(closeTimerRef.current);
    closeTimerRef.current = null;
  }, []);

  const close = useCallback((restoreFocus = false) => {
    clearCloseTimer();
    setOpen(false);
    if (restoreFocus) requestAnimationFrame(() => triggerRef.current?.focus());
  }, [clearCloseTimer]);

  const openMenu = useCallback(() => {
    clearCloseTimer();
    announceHeaderSurface("mega");
    setOpen(true);
  }, [clearCloseTimer]);

  const scheduleClose = useCallback(() => {
    clearCloseTimer();
    closeTimerRef.current = window.setTimeout(() => {
      setOpen(false);
      closeTimerRef.current = null;
    }, CLOSE_DELAY_MS);
  }, [clearCloseTimer]);

  useEffect(() => () => clearCloseTimer(), [clearCloseTimer]);

  useEffect(() => {
    if (!open) return;
    return subscribeToHeaderSurface((surface) => {
      if (surface !== "mega") close();
    });
  }, [close, open]);

  return (
    <div
      className="static"
      onPointerEnter={(event) => {
        if (event.pointerType === "mouse" && item.href === "/services") openMenu();
      }}
      onPointerLeave={(event) => {
        if (event.pointerType === "mouse" && item.href === "/services") scheduleClose();
      }}
    >
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={open}
        aria-haspopup="true"
        aria-controls={item.href === "/services" ? "services-navigation-menu" : undefined}
        onClick={() => {
          if (open) close();
          else openMenu();
        }}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " " || event.key === "ArrowDown" || event.key === "ArrowUp") {
            event.preventDefault();
            openMenu();
          }
        }}
        className={cn(
          "type-nav inline-flex items-center gap-1.5 py-2 text-muted-foreground transition-colors duration-[var(--motion-fast)] hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-4",
          (open || isNavigationItemActive(pathname, item.href)) && "text-foreground",
        )}
      >
        {item.label}
        <ChevronDown aria-hidden="true" size={16} className={cn("transition-transform duration-[var(--motion-fast)]", open && "rotate-180")} />
      </button>
      <NavigationMegaMenu item={item} pathname={pathname} open={open} onClose={close} triggerRef={triggerRef} panelId="services-navigation-menu" />
    </div>
  );
}
