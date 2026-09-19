"use client";

import { ArrowUp } from "lucide-react";

export function BackToTop() {
  return (
    <button
      type="button"
      onClick={() => {
        const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" });
      }}
      className="group inline-flex min-h-10 items-center gap-2 type-caption text-primary-100 transition-colors duration-[var(--motion-fast)] hover:text-primary-foreground focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-primary-foreground"
      aria-label="Back to top"
    >
      Back to top
      <ArrowUp
        aria-hidden="true"
        className="size-4 transition-transform duration-[var(--motion-fast)] group-hover:-translate-y-0.5"
      />
    </button>
  );
}
