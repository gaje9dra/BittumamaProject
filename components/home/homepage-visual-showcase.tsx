"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
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

  const activeSlide = homepageShowcaseSlides[activeIndex];

  return (
    <section
      ref={sectionRef}
      aria-labelledby="homepage-showcase-title"
      className="overflow-hidden border-b border-border bg-background"
    >
      <Container size="wide" className="py-10 sm:py-14 lg:py-16">
        <div className="grid items-center gap-9 lg:grid-cols-[minmax(18rem,0.72fr)_minmax(0,1.6fr)] lg:gap-12 xl:gap-16">
          <div className="min-w-0">
            <div className="flex items-center gap-2.5">
              <span aria-hidden="true" className="h-px w-7 bg-accent" />
              <p className="type-label text-muted-foreground">Research / Education / Services</p>
            </div>

            <h1
              id="homepage-showcase-title"
              className="type-display mt-4 max-w-[12ch] text-[clamp(2.8rem,5.2vw,5rem)] leading-[0.95] text-foreground"
            >
              Research support, built around the work.
            </h1>

            <p className="type-body-lg mt-5 max-w-[38rem] text-muted-foreground">
              Writing, analysis, editing and research services through one structured workflow.
            </p>

            <Link
              href="/services"
              className="group mt-7 inline-flex min-h-11 items-center gap-2 rounded-[var(--radius-md)] bg-primary px-[1.125rem] type-button font-medium text-primary-foreground shadow-sm transition-[background-color,transform] duration-[var(--motion-fast)] hover:-translate-y-px hover:bg-primary-700 focus-visible:outline-2 focus-visible:outline-offset-3"
            >
              Explore Services
              <ArrowUpRight aria-hidden="true" className="size-4 transition-transform duration-[var(--motion-fast)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>

          <div className="min-w-0">
            <div
              className="relative aspect-[16/10] w-full overflow-hidden border border-border bg-surface-muted"
              aria-live="polite"
              aria-atomic="true"
              aria-label={`Current showcase: ${activeSlide.label}`}
            >
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
                      sizes="(max-width: 1023px) 100vw, 65vw"
                      className="object-cover"
                      loading="eager"
                      {...(index === 0 ? { preload: true } : {})}
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#10231f]/55 via-transparent to-transparent" />
                    <div className="absolute inset-x-5 bottom-5 flex items-end justify-between gap-4 text-white sm:inset-x-7 sm:bottom-7">
                      <div>
                        <p className="font-mono text-[0.68rem] uppercase tracking-[0.14em] text-white/70">
                          {String(index + 1).padStart(2, "0")} / 03
                        </p>
                        <p className="mt-1 font-display text-xl font-semibold tracking-[-0.02em] sm:text-2xl">
                          {slide.label}
                        </p>
                      </div>
                      <span aria-hidden="true" className="h-8 w-px bg-white/70" />
                    </div>
                  </div>
                );
              })}

              <div className="pointer-events-none absolute inset-y-0 left-1/2 z-10 w-px bg-white/35" aria-hidden="true" />
            </div>

            <div className="mt-3 flex items-center justify-between gap-4">
              <p className="type-caption uppercase tracking-[0.12em] text-muted-foreground">
                Bittumama / Research visual system
              </p>
              <div className="flex items-center gap-2" aria-hidden="true">
                {homepageShowcaseSlides.map((slide, index) => (
                  <span
                    key={slide.id}
                    className={`h-1 transition-[width,background-color] duration-[var(--motion-fast)] ${index === activeIndex ? "w-8 bg-accent" : "w-3 bg-border"}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
