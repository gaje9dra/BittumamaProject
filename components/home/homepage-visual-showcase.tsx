"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Container } from "@/components/ui/container";
import { homepageShowcaseSlides } from "@/data/homepage-showcase";

const DISPLAY_MS = 5200;
const TRANSITION_MS = 750;

export function HomepageVisualShowcase() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [previousIndex, setPreviousIndex] = useState(2);
  const [isVisible, setIsVisible] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotionPreference = () => setReducedMotion(mediaQuery.matches);
    updateMotionPreference();
    mediaQuery.addEventListener("change", updateMotionPreference);
    return () => mediaQuery.removeEventListener("change", updateMotionPreference);
  }, []);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.05 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const timer = window.setInterval(() => {
      setActiveIndex((current) => {
        setPreviousIndex(current);
        return (current + 1) % homepageShowcaseSlides.length;
      });
    }, DISPLAY_MS);

    return () => window.clearInterval(timer);
  }, [isVisible]);

  return (
    <section
      ref={sectionRef}
      aria-label="Bittumama visual showcase"
      className="overflow-hidden border-b border-border bg-background"
    >
      <Container size="wide" className="py-5 sm:py-7 lg:py-8">
        <div className="relative aspect-[16/10] w-full overflow-hidden border border-border bg-surface-muted">
          {homepageShowcaseSlides.map((slide, index) => {
            const isActive = index === activeIndex;
            const isPrevious = index === previousIndex;
            const transform = reducedMotion
              ? isActive ? "translateX(0)" : "translateX(100%)"
              : isActive
                ? "translateX(0)"
                : isPrevious
                  ? "translateX(-100%)"
                  : "translateX(100%)";

            return (
              <div
                key={slide.id}
                aria-hidden={!isActive}
                className="absolute inset-0 will-change-transform"
                style={{
                  transform,
                  transition: reducedMotion
                    ? "none"
                    : `transform ${TRANSITION_MS}ms cubic-bezier(0.2, 0.8, 0.2, 1)`,
                  zIndex: isActive ? 2 : isPrevious ? 1 : 0,
                }}
              >
                <Image
                  src={slide.image}
                  alt={slide.alt}
                  fill
                  sizes="(max-width: 767px) calc(100vw - 2rem), (max-width: 1279px) calc(100vw - 3rem), 1200px"
                  className="object-cover"
                  loading="eager"
                  {...(index === 0 ? { preload: true } : {})}
                />
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
