"use client";

import type { ReactNode, RefObject } from "react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export const SHOWCASE_DISPLAY_MS = 5200;
export const SHOWCASE_TRANSITION_MS = 750;

type SceneFrameProps = {
  children: ReactNode;
  active: boolean;
  index: number;
  previousIndex: number;
  reducedMotion: boolean;
  label: string;
};

export function SceneFrame({ children, active, index, previousIndex, reducedMotion, label }: SceneFrameProps) {
  const isPrevious = index === previousIndex;
  return (
    <div
      role="group"
      aria-roledescription="slide"
      aria-label={label}
      aria-hidden={!active}
      className={cn(
        "absolute inset-0 overflow-hidden rounded-[calc(var(--radius-xl)-2px)] border border-border bg-dark-background",
        active ? "pointer-events-auto" : "pointer-events-none",
        reducedMotion ? (active ? "opacity-100" : "opacity-0") : "opacity-100",
      )}
      style={{
        transform: reducedMotion ? undefined : active ? "translateX(0)" : isPrevious ? "translateX(-100%)" : "translateX(100%)",
        transition: reducedMotion ? "opacity 180ms var(--motion-ease-standard)" : "transform 750ms var(--motion-ease-emphasis)",
        zIndex: active ? 2 : isPrevious ? 1 : 0,
      }}
    >
      {children}
    </div>
  );
}

export function useShowcaseVisibility(ref: RefObject<HTMLElement | null>) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.08 });
    observer.observe(node);
    const onVisibilityChange = () => setVisible(document.visibilityState !== "hidden");
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => { observer.disconnect(); document.removeEventListener("visibilitychange", onVisibilityChange); };
  }, [ref]);

  return visible;
}

export function ShowcaseCTA({
  href,
  label,
  tone = "accent",
}: {
  href: string;
  label: string;
  tone?: "accent" | "teal" | "ochre";
}) {
  const toneClass = {
    accent: "border-[var(--accent)] bg-[var(--accent)] text-[var(--accent-foreground)] hover:bg-[var(--primary-700)]",
    teal: "border-[var(--data-2)] bg-[var(--data-2)] text-white hover:bg-[var(--primary-700)]",
    ochre: "border-[var(--data-5)] bg-[var(--data-5)] text-white hover:bg-[var(--secondary-700)]",
  }[tone];

  return (
    <Link
      href={href}
      className={cn(
        "group inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-[var(--radius-md)] border px-4 py-2 text-[9px] font-semibold uppercase tracking-[0.12em] shadow-sm transition-[background-color,border-color,transform] duration-[var(--motion-fast)] hover:-translate-y-px focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[var(--secondary-300)] sm:px-5",
        toneClass,
      )}
    >
      {label}
      <ArrowUpRight aria-hidden="true" className="size-4 transition-transform duration-[var(--motion-fast)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
    </Link>
  );
}

export function SceneGrid() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 opacity-[0.13]"
      style={{
        backgroundImage: "linear-gradient(to right, color-mix(in srgb, var(--dark-muted-foreground) 18%, transparent) 1px, transparent 1px), linear-gradient(to bottom, color-mix(in srgb, var(--dark-muted-foreground) 18%, transparent) 1px, transparent 1px)",
        backgroundSize: "44px 44px",
      }}
    />
  );
}

export function SceneFrameShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative h-full min-h-0 w-full bg-[var(--dark-background)] text-[var(--dark-foreground)]">
      <SceneGrid />
      <div aria-hidden="true" className="pointer-events-none absolute inset-3 rounded-[var(--radius-lg)] border border-[var(--dark-border)]/60 sm:inset-5" />
      <div className="relative h-full min-h-0 w-full p-5 sm:p-7 lg:p-9">{children}</div>
    </div>
  );
}