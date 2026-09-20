"use client";

import type { ReactNode } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { useRef } from "react";

type ScrollTransitionProps = {
  children: ReactNode;
  className?: string;
  distance?: number;
  threshold?: number;
  mode?: "content" | "heading" | "visual";
};

const modeConfig = {
  content: { distanceScale: 1, opacityFloor: 0.58 },
  heading: { distanceScale: 1.2, opacityFloor: 0.68 },
  visual: { distanceScale: 0.48, opacityFloor: 0.78 },
} as const;

export function ScrollTransition({
  children,
  className,
  distance = 64,
  threshold: _threshold,
  mode = "content",
}: ScrollTransitionProps) {
  const reducedMotion = useReducedMotion();
  const viewportRef = useRef<HTMLDivElement>(null);
  const config = modeConfig[mode];
  const movement = Math.min(distance * config.distanceScale, 90);

  const { scrollYProgress } = useScroll({
    target: viewportRef,
    offset: ["start 92%", "end 8%"],
  });

  const progress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    mass: 0.35,
  });

  const y = useTransform(progress, [0, 0.5, 1], [movement, 0, -movement]);
  const opacity = useTransform(
    progress,
    [0, 0.22, 0.5, 0.78, 1],
    [config.opacityFloor, 0.94, 1, 0.94, config.opacityFloor],
  );
  const scale = useTransform(
    progress,
    [0, 0.5, 1],
    [mode === "visual" ? 0.992 : 0.998, 1, mode === "visual" ? 0.992 : 0.998],
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
