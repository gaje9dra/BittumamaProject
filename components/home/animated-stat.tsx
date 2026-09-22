"use client";

import { useEffect, useRef, useState } from "react";
import { BriefcaseBusiness, FileText, Globe2, Network } from "lucide-react";

type AnimatedStatIcon = "file" | "briefcase" | "network" | "globe";

type AnimatedStatProps = {
  targetValue: number;
  display: string;
  icon: AnimatedStatIcon;
  label: string;
  accentClass: string;
  iconClass: string;
};

function formatValue(value: number, display: string) {
  if (display.endsWith("K+")) {
    return value >= 1000
      ? `${(value / 1000).toFixed(value >= 10000 ? 0 : 1).replace(".0", "")}K+`
      : `${Math.round(value).toLocaleString("en-IN")}+`;
  }

  if (display.endsWith("%")) return `${Math.round(value)}%`;
  if (display.endsWith("+")) return `${Math.round(value).toLocaleString("en-IN")}+`;
  return Math.round(value).toLocaleString("en-IN");
}

const ICONS = {
  file: FileText,
  briefcase: BriefcaseBusiness,
  network: Network,
  globe: Globe2,
} as const;

export function AnimatedStat({
  targetValue,
  display,
  icon,
  label,
  accentClass,
  iconClass,
}: AnimatedStatProps) {
  const Icon = ICONS[icon];
  const [value, setValue] = useState(0);
  const hasAnimatedRef = useRef(false);
  const ref = useRef<HTMLElement>(null);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const startAnimation = () => {
      if (hasAnimatedRef.current) return;
      hasAnimatedRef.current = true;

      if (reducedMotion) {
        setValue(targetValue);
        return;
      }

      const duration = Math.min(2200, Math.max(1400, 1400 + targetValue / 12));
      const start = performance.now();

      const tick = (now: number) => {
        const progress = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - progress, 3);
        setValue(progress === 1 ? targetValue : eased * targetValue);

        if (progress < 1) {
          frameRef.current = requestAnimationFrame(tick);
        }
      };

      frameRef.current = requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          startAnimation();
          observer.disconnect();
        }
      },
      { threshold: 0.28 },
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    };
  }, [targetValue]);

  return (
    <article
      ref={ref}
      className={`group relative min-w-0 overflow-hidden border border-[#28577f] bg-[#0a3b6c] p-5 shadow-[0_8px_24px_rgba(0,0,0,.16)] sm:p-6 ${accentClass}`}
    >
      <div className="flex items-start justify-between gap-4">
        <span
          className={`flex size-11 items-center justify-center border ${iconClass}`}
          aria-hidden="true"
        >
          <Icon className="size-5" />
        </span>
        <span aria-hidden="true" className="mt-2 h-px w-10 bg-current opacity-35" />
      </div>

      <p
        className="mt-8 min-h-[3.4rem] tabular-nums font-display text-[clamp(2.7rem,4vw,4.2rem)] font-semibold leading-none tracking-[-0.055em]"
        aria-label={`${display} ${label.toLowerCase()}`}
      >
        {formatValue(value, display)}
      </p>

      <p className="mt-3 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-[#9bb8d3]">
        {label}
      </p>

      <div className="mt-8 h-px w-12 bg-current opacity-50" aria-hidden="true" />
    </article>
  );
}
