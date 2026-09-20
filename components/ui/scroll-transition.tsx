"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

type ScrollTransitionProps = {
  children: ReactNode;
  className?: string;
  distance?: number;
  mode?: "content" | "heading" | "visual";
};

const modeConfig = {
  content: { distanceScale: 1, opacityFloor: 0.8 },
  heading: { distanceScale: 1.12, opacityFloor: 0.84 },
  visual: { distanceScale: 0.48, opacityFloor: 0.9 },
} as const;

const easeOut = (value: number) => {
  const clamped = Math.max(0, Math.min(1, value));
  return 1 - (1 - clamped) ** 3;
};

const mapMotion = (value: number, distance: number) => {
  if (value <= 0.5) {
    const progress = easeOut(value / 0.5);
    return distance * (1 - progress);
  }

  const progress = easeOut((value - 0.5) / 0.5);
  return -distance * progress;
};

const mapOpacity = (value: number, floor: number) => {
  if (value <= 0.5) {
    const progress = easeOut(value / 0.5);
    return floor + (1 - floor) * progress;
  }

  const progress = easeOut((value - 0.5) / 0.5);
  return 1 - (1 - floor) * progress;
};

export function ScrollTransition({
  children,
  className,
  distance = 52,
  mode = "content",
}: ScrollTransitionProps) {
  const reducedMotion = useReducedMotion();
  const viewportRef = useRef<HTMLDivElement>(null);
  const config = modeConfig[mode];
  const movement = Math.min(distance * config.distanceScale, mode === "heading" ? 70 : 60);

  const { scrollYProgress } = useScroll({
    target: viewportRef,
    offset: ["start 88%", "end 12%"],
  });

  const y = useTransform(scrollYProgress, (value) => mapMotion(value, movement));
  const opacity = useTransform(scrollYProgress, (value) =>
    mapOpacity(value, config.opacityFloor),
  );
  const scale = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [mode === "visual" ? 0.996 : 0.999, 1, mode === "visual" ? 0.996 : 0.999],
  );

  return (
    <div
      ref={viewportRef}
      className={className}
      style={{ overflow: "hidden" }}
      data-scroll-transition={mode}
    >
      <motion.div
        style={
          reducedMotion
            ? undefined
            : { y, opacity, scale, willChange: "transform, opacity" }
        }
      >
        {children}
      </motion.div>
    </div>
  );
}
