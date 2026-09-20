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
    distanceScale: 0.72,
    opacityFloor: 0.72,
    scaleFrom: 0.985,
    skew: 0.18,
  },
  heading: {
    distanceScale: 1,
    opacityFloor: 0.5,
    scaleFrom: 0.97,
    skew: 0.28,
  },
  visual: {
    distanceScale: 0.38,
    opacityFloor: 0.84,
    scaleFrom: 0.985,
    skew: 0,
  },
} as const;

const easeOut = (value: number) => {
  const t = Math.max(0, Math.min(1, value));
  return 1 - (1 - t) ** 3;
};

const motionValue = (value: number, distance: number) => {
  if (value <= 0.5) {
    return distance * (1 - easeOut(value / 0.5));
  }

  return -distance * easeOut((value - 0.5) / 0.5);
};

const opacityValue = (value: number, floor: number) => {
  if (value <= 0.5) {
    return floor + (1 - floor) * easeOut(value / 0.5);
  }

  return 1 - (1 - floor) * easeOut((value - 0.5) / 0.5);
};

export function ScrollTransition({
  children,
  className,
  distance = 96,
  mode = "content",
}: ScrollTransitionProps) {
  const reducedMotion = useReducedMotion();
  const viewportRef = useRef<HTMLDivElement>(null);
  const config = modeConfig[mode];
  const movement = Math.min(
    distance * config.distanceScale,
    mode === "heading" ? 120 : mode === "visual" ? 50 : 80,
  );

  const { scrollYProgress } = useScroll({
    target: viewportRef,
    offset: ["start 92%", "end 8%"],
  });

  const y = useTransform(scrollYProgress, (value) =>
    motionValue(value, movement),
  );
  const opacity = useTransform(scrollYProgress, (value) =>
    opacityValue(value, config.opacityFloor),
  );
  const scale = useTransform(
    scrollYProgress,
    [0, 0.28, 0.5, 0.72, 1],
    [config.scaleFrom, 0.985, 1, 0.985, config.scaleFrom],
  );
  const skew = useTransform(
    scrollYProgress,
    [0, 0.28, 0.5, 0.72, 1],
    [config.skew, config.skew * 0.45, 0, -config.skew * 0.45, -config.skew],
  );
  const trailY = useTransform(y, (value) => value * 0.88 + (value >= 0 ? 10 : -10));
  const trailOpacity = useTransform(opacity, (value) => Math.max(0, (value - 0.72) * 0.45));

  return (
    <div
      ref={viewportRef}
      className={className}
      style={{ overflow: "hidden" }}
      data-scroll-transition={mode}
    >
      {!reducedMotion && mode === "heading" ? (
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 select-none"
          style={{
            y: trailY,
            opacity: trailOpacity,
            scale,
            skewY: skew,
            willChange: "transform, opacity",
          }}
        >
          {children}
        </motion.div>
      ) : null}

      <motion.div
        style={
          reducedMotion
            ? undefined
            : {
                y,
                opacity,
                scale,
                skewY: skew,
                willChange: "transform, opacity",
              }
        }
      >
        {children}
      </motion.div>
    </div>
  );
}
