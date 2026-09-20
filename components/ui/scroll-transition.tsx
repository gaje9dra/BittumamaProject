"use client";

import type { ReactNode } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef } from "react";

type ScrollTransitionProps = {
  children: ReactNode;
  className?: string;
  distance?: number;
  mode?: "content" | "heading" | "visual";
};

const modeConfig = {
  content: {
    y: 18,
    opacity: 0.78,
  },
  heading: {
    y: 20,
    opacity: 0.72,
  },
  visual: {
    y: 12,
    opacity: 0.86,
  },
} as const;

export function ScrollTransition({
  children,
  className,
  distance = 18,
  mode = "content",
}: ScrollTransitionProps) {
  const reducedMotion = useReducedMotion();
  const viewportRef = useRef<HTMLDivElement>(null);
  const inView = useInView(viewportRef, {
    once: true,
    amount: 0.12,
    margin: "0px 0px -8% 0px",
  });
  const config = modeConfig[mode];
  const movement = Math.min(Math.max(distance, 8), config.y);

  return (
    <div
      ref={viewportRef}
      className={className}
      data-scroll-transition={mode}
    >
      <motion.div
        initial={
          reducedMotion
            ? false
            : {
                opacity: config.opacity,
                y: movement,
              }
        }
        animate={
          reducedMotion || inView
            ? { opacity: 1, y: 0 }
            : { opacity: config.opacity, y: movement }
        }
        transition={
          reducedMotion
            ? { duration: 0 }
            : {
                duration: mode === "heading" ? 0.34 : 0.3,
                ease: [0.22, 0.8, 0.24, 1],
              }
        }
        style={{ willChange: inView && !reducedMotion ? "transform, opacity" : undefined }}
      >
        {children}
      </motion.div>
    </div>
  );
}
