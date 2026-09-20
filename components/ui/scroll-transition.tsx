"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

type ScrollDirection = "down" | "up";

type ScrollTransitionProps = {
  children: ReactNode;
  className?: string;
  distance?: number;
  threshold?: number;
};

export function ScrollTransition({
  children,
  className,
  distance = 64,
  threshold = 0.28,
}: ScrollTransitionProps) {
  const reducedMotion = useReducedMotion();
  const [isActive, setIsActive] = useState(true);
  const directionRef = useRef<ScrollDirection>("down");
  const viewportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let frame = 0;
    let previousY = window.scrollY;

    const updateDirection = () => {
      const currentY = window.scrollY;

      if (currentY !== previousY) {
        directionRef.current = currentY > previousY ? "down" : "up";
        previousY = currentY;
      }

      frame = 0;
    };

    const onScroll = () => {
      if (frame === 0) {
        frame = window.requestAnimationFrame(updateDirection);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame !== 0) {
        window.cancelAnimationFrame(frame);
      }
    };
  }, []);

  useEffect(() => {
    const element = viewportRef.current;

    if (!element || reducedMotion) {
      setIsActive(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsActive(entry.isIntersecting);
      },
      {
        threshold,
        rootMargin: "-12% 0px -12% 0px",
      },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [reducedMotion, threshold]);

  const maxDistance = Math.min(distance, 90);
  const offset =
    reducedMotion || isActive
      ? 0
      : directionRef.current === "down"
        ? -maxDistance
        : maxDistance;

  return (
    <div
      ref={viewportRef}
      className={className}
      style={{ overflow: "hidden" }}
    >
      <motion.div
        initial={false}
        animate={{
          opacity: reducedMotion || isActive ? 1 : 0,
          y: offset,
        }}
        transition={{
          duration: reducedMotion ? 0.01 : isActive ? 0.56 : 0.48,
          ease: isActive ? [0.16, 1, 0.3, 1] : [0.7, 0, 0.84, 0],
        }}
        style={{ willChange: reducedMotion ? "auto" : "transform, opacity" }}
      >
        {children}
      </motion.div>
    </div>
  );
}
