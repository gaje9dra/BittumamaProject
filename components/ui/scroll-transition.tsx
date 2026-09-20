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
    offset: ["start 0%", "end 100%"],
  });

  // One continuous mask state:
  // 0%: hidden from the top
  // 50%: fully revealed
  // 100%: hidden from the bottom
  // Reversing scroll automatically reverses the reveal direction.
  const clipPath = useTransform(scrollYProgress, () => "inset(0 0 0 0)");

  const opacity = useTransform(
    scrollYProgress,
    [0, 0.2, 0.42, 0.6, 0.8, 1],
    [
      1,
      1,
      1,
      0.99,
      config.opacityFloor + 0.02,
      config.opacityFloor,
    ],
  );

  const scale = useTransform(
    scrollYProgress,
    [0, 0.3, 0.55, 0.8, 1],
    [
      config.scaleFrom,
      config.scaleFrom + (1 - config.scaleFrom) * 0.5,
      1,
      1,
      1,
    ]
  );

  const y = useTransform(
    scrollYProgress,
    [0, 0.28, 0.5, 0.72, 1],
    [0, 0, 0, -microShift * 0.25, -microShift],
  );

  const subtleEchoOpacity = useTransform(scrollYProgress, () => 0);

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
