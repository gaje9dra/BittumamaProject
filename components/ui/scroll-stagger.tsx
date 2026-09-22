"use client";

import type { ReactNode } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef } from "react";

type ScrollStaggerProps = {
  children: ReactNode;
  className?: string;
  stagger?: number;
  distance?: number;
};

export function ScrollStagger({
  children,
  className,
  stagger = 0.08,
  distance = 24,
}: ScrollStaggerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, {
    once: true,
    amount: 0.16,
    margin: "0px 0px -8% 0px",
  });
  const reducedMotion = useReducedMotion();
  const items = Array.isArray(children) ? children : [children];

  return (
    <div ref={ref} className={className}>
      {items.map((child, index) => (
        <motion.div
          key={index}
          className="min-w-0 w-full h-full"
          initial={
            reducedMotion
              ? false
              : { opacity: 0, y: distance, scale: 0.985 }
          }
          animate={
            reducedMotion || inView
              ? { opacity: 1, y: 0, scale: 1 }
              : { opacity: 0, y: distance, scale: 0.985 }
          }
          transition={
            reducedMotion
              ? { duration: 0 }
              : {
                  duration: 0.52,
                  delay: index * stagger,
                  ease: [0.22, 0.8, 0.24, 1],
                }
          }
          style={{
            willChange:
              inView && !reducedMotion
                ? "transform, opacity"
                : undefined,
          }}
        >
          {child}
        </motion.div>
      ))}
    </div>
  );
}
