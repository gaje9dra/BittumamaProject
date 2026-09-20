"use client";

import type { ReactNode } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { useRef } from "react";

type ScrollTransitionProps = {
  children: ReactNode;
  className?: string;
  distance?: number;
  mode?: "content" | "heading" | "visual";
};

const modeConfig = {
  content: {
    opacityFloor: 0.956,
    scaleFrom: 0.9988,
    clipInset: 6,
  },
  heading: {
    opacityFloor: 0.9,
    scaleFrom: 0.99,
    clipInset: 0,
  },
  visual: {
    opacityFloor: 0.975,
    scaleFrom: 0.999,
    clipInset: 4,
  },
} as const;

const easeOut = (value: number) => {
  const t = Math.max(0, Math.min(1, value));
  return 1 - (1 - t) ** 3;
};

export function ScrollTransition({
  children,
  className,
  distance = 2,
  mode = "content",
}: ScrollTransitionProps) {
  const reducedMotion = useReducedMotion();
  const viewportRef = useRef<HTMLDivElement>(null);
  const config = modeConfig[mode];
  const microShift = Math.min(
    Math.max(distance, 0),
    mode === "heading" ? 3 : mode === "visual" ? 2 : 2,
  );

  const { scrollYProgress } = useScroll({
    target: viewportRef,
    offset: ["start 78%", "end 22%"],
  });

  // One continuous mask state:
  // 0%: hidden from the top
  // 50%: fully revealed
  // 100%: hidden from the bottom
  // Reversing scroll automatically reverses the reveal direction.
  const clipPath = useTransform(scrollYProgress, (value) => {
    if (value <= 0.5) {
      const progress = easeOut(value / 0.5);
      const topInset = 100 - progress * 100;
      return `inset(${topInset}% 0 0 0)`;
    }

    const progress = easeOut((value - 0.5) / 0.5);
    const bottomInset = progress * 100;
    return `inset(0 0 ${bottomInset}% 0)`;
  });

  const opacity = useTransform(
    scrollYProgress,
    [0, 0.16, 0.38, 0.5, 0.62, 0.84, 1],
    [
      config.opacityFloor,
      config.opacityFloor + 0.08,
      0.99,
      1,
      0.99,
      config.opacityFloor + 0.08,
      config.opacityFloor,
    ],
  );

  const scale = useTransform(
    scrollYProgress,
    [0, 0.28, 0.5, 0.72, 1],
    [
      config.scaleFrom,
      config.scaleFrom + (1 - config.scaleFrom) * 0.65,
      1,
      config.scaleFrom + (1 - config.scaleFrom) * 0.65,
      config.scaleFrom,
    ],
  );

  const y = useTransform(
    scrollYProgress,
    [0, 0.28, 0.5, 0.72, 1],
    [microShift, microShift * 0.25, 0, -microShift * 0.25, -microShift],
  );

  const subtleEchoOpacity = useTransform(
    scrollYProgress,
    [0, 0.2, 0.42, 0.5, 0.58, 0.8, 1],
    [0, 0.015, 0.02, 0, 0.02, 0.015, 0],
  );

  return (
    <div
      ref={viewportRef}
      className={className ? `relative ${className}` : "relative"}
      style={{ overflow: "hidden" }}
      data-scroll-transition={mode}
    >
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 select-none"
        style={
          reducedMotion
            ? { opacity: 0 }
            : {
                clipPath,
                opacity: subtleEchoOpacity,
                y,
                scale,
                willChange: "clip-path, transform, opacity",
              }
        }
      >
        {children}
      </motion.div>

      <motion.div
        style={
          reducedMotion
            ? undefined
            : {
                clipPath,
                opacity,
                y,
                scale,
                willChange: "clip-path, transform, opacity",
              }
        }
      >
        {children}
      </motion.div>
    </div>
  );
}
