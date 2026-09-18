"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const SCROLL_THRESHOLD = 12;

export function HeaderScrollShell({ children }: { children: ReactNode }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let ticking = false;

    const update = () => {
      const next = window.scrollY > SCROLL_THRESHOLD;
      setScrolled((current) => (current === next ? current : next));
      ticking = false;
    };

    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      data-scrolled={scrolled ? "true" : "false"}
      className={cn(
        "sticky top-0 z-[var(--layer-navigation)] transition-[box-shadow] duration-[var(--motion-micro)] ease-[var(--motion-ease-standard)]",
        scrolled && "shadow-[var(--shadow-sm)]",
      )}
    >
      {children}
    </div>
  );
}
