"use client";

import { ChevronDown } from "lucide-react";
import { useId, useRef, useState } from "react";
import type { NavigationItem } from "@/data/navigation";
import { NavigationMegaMenu } from "@/components/layout/navigation-mega-menu";
import { isNavigationItemActive } from "@/lib/navigation";
import { cn } from "@/lib/utils";

export function NavigationMegaTrigger({ item, pathname }: { item: NavigationItem; pathname: string }) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelId = useId();

  const close = (restoreFocus = false) => {
    setOpen(false);
    if (restoreFocus) requestAnimationFrame(() => triggerRef.current?.focus());
  };

  return (
    <div className="relative">
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={open}
        aria-haspopup="menu"
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " " || event.key === "ArrowDown") {
            event.preventDefault();
            setOpen(true);
          }
        }}
        className={cn("type-nav inline-flex items-center gap-1.5 py-2 text-muted-foreground transition-colors duration-[var(--motion-fast)] hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-4", (open || isNavigationItemActive(pathname, item.href)) && "text-foreground")}
      >
        {item.label}
        <ChevronDown aria-hidden="true" size={16} className={cn("transition-transform duration-[var(--motion-fast)]", open && "rotate-180")} />
      </button>
      <NavigationMegaMenu item={item} pathname={pathname} open={open} onClose={close} triggerRef={triggerRef} panelId={panelId} />
    </div>
  );
}