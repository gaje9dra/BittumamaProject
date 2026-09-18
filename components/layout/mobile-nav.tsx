"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { mobileNavigation } from "@/data/navigation";
import { cn } from "@/lib/utils";

export function MobileNav({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panelRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
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
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  useEffect(() => {
    if (!open) triggerRef.current?.focus();
  }, [open]);

  useEffect(() => {
    const closeOnResize = () => {
      if (window.innerWidth >= 1024) setOpen(false);
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
        onClick={() => setOpen((value) => !value)}
      >
        <Menu aria-hidden="true" className={cn("absolute transition-[opacity,transform] duration-[var(--motion-micro)]", open && "scale-75 opacity-0")} size={20} />
        <X aria-hidden="true" className={cn("absolute transition-[opacity,transform] duration-[var(--motion-micro)]", !open && "scale-75 opacity-0")} size={20} />
      </button>

      {open && (
        <aside id="mobile-primary-navigation" ref={panelRef} tabIndex={-1} aria-label="Mobile primary navigation" className="fixed inset-x-0 bottom-0 top-16 z-[var(--layer-modal)] overflow-y-auto border-t border-border bg-background px-[var(--page-gutter)] py-8 motion-fade lg:hidden">
          <nav aria-label="Mobile primary navigation" className="mx-auto flex max-w-[var(--container-content)] flex-col">
            {mobileNavigation.map((item, index) => (
              <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className={cn("type-h4 flex min-h-14 items-center justify-between border-b border-border py-3 text-foreground transition-colors duration-[var(--motion-micro)] hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-4", index === 0 && "border-t")}>
                <span>{item.label}</span>
                <span aria-hidden="true" className="text-sm text-muted-foreground">↗</span>
              </Link>
            ))}
            <Link href="/contact" onClick={() => setOpen(false)} className="mt-8 inline-flex min-h-11 w-fit items-center border border-primary bg-primary px-5 type-button text-primary-foreground transition-colors duration-[var(--motion-micro)] hover:bg-primary-700 focus-visible:outline-2 focus-visible:outline-offset-3">
              Get in touch
            </Link>
          </nav>
        </aside>
      )}
    </div>
  );
}
