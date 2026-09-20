"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Heading } from "@/components/ui/heading";
import { bittumamaHeroImages } from "@/data/hero";
import { homepageContent } from "@/data/homepage";

const HERO_STATES = [
  { active: 0, x: 0, y: 0, scale: 1, rotate: -2 },
  { active: 1, x: 8, y: -8, scale: 0.985, rotate: 1.5 },
  { active: 2, x: -7, y: 7, scale: 0.99, rotate: -1 },
  { active: 3, x: 5, y: 2, scale: 1, rotate: 2 },
] as const;

export function BittumamaHero() {
  const { hero } = homepageContent;
  const [state, setState] = useState(0);
  const [entered, setEntered] = useState(false);
  const [pointer, setPointer] = useState({ x: 0, y: 0 });
  const heroRef = useRef<HTMLElement>(null);
  const lastStep = useRef(0);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setEntered(true));
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    const element = heroRef.current;
    if (!element) return;

    const onPointerMove = (event: PointerEvent) => {
      const rect = element.getBoundingClientRect();
      setPointer({
        x: Math.max(-1, Math.min(1, (event.clientX - rect.left) / rect.width * 2 - 1)),
        y: Math.max(-1, Math.min(1, (event.clientY - rect.top) / rect.height * 2 - 1)),
      });
    };
    const onPointerLeave = () => setPointer({ x: 0, y: 0 });

    element.addEventListener("pointermove", onPointerMove, { passive: true });
    element.addEventListener("pointerleave", onPointerLeave);
    return () => {
      element.removeEventListener("pointermove", onPointerMove);
      element.removeEventListener("pointerleave", onPointerLeave);
    };
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const element = heroRef.current;
      if (!element) return;
      const rect = element.getBoundingClientRect();
      const pageTop = window.scrollY + rect.top;
      const progress = Math.max(
        0,
        Math.min(1, (window.scrollY - pageTop) / Math.max(element.offsetHeight * 0.9, 1)),
      );
      const next = Math.min(HERO_STATES.length - 1, Math.floor(progress * HERO_STATES.length));
      if (next !== lastStep.current) {
        lastStep.current = next;
        setState(next);
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const activeState = HERO_STATES[state];

  return (
    <section ref={heroRef} aria-labelledby="home-hero-title" className="relative overflow-hidden">
      <div className="mx-auto w-full max-w-[88rem] px-[var(--page-gutter)]">
        <div className={entered ? "bittumama-hero-shell is-entered" : "bittumama-hero-shell"}>
          <div className="bittumama-hero-word bittumama-hero-word-left">
            <p className="type-label mb-5 text-muted-foreground">Knowledge-led research</p>
            <Heading id="home-hero-title" level={1} className="type-display max-w-[7ch] text-foreground">
              RESEARCH
            </Heading>
          </div>

          <div
            className="bittumama-hero-stack"
            style={{
              "--hero-pointer-x": `${pointer.x * 4}px`,
              "--hero-pointer-y": `${pointer.y * 3}px`,
            } as CSSProperties}
            aria-label="Bittumama research, intelligence and expertise visual archive"
          >
            {bittumamaHeroImages.map((image, index) => {
              const distance = (index - activeState.active + bittumamaHeroImages.length) % bittumamaHeroImages.length;
              const visible = distance < 4;
              return (
                <div
                  key={image.src}
                  className={visible ? "bittumama-hero-card is-visible" : "bittumama-hero-card"}
                  style={{
                    "--hero-depth": distance,
                    "--hero-x": `${activeState.x + distance * 10}px`,
                    "--hero-y": `${activeState.y + distance * 12}px`,
                    "--hero-scale": `${activeState.scale - distance * 0.035}`,
                    "--hero-rotate": `${activeState.rotate - distance * 1.2}deg`,
                    "--hero-delay": `${distance * 55}ms`,
                  } as CSSProperties}
                >
                  <Image src={image.src} alt={image.alt} fill sizes="(max-width: 767px) 68vw, 32vw" priority={index === 0} />
                  <span className="bittumama-hero-card-label">{image.label}</span>
                </div>
              );
            })}
          </div>

          <div className="bittumama-hero-word bittumama-hero-word-right">
            <Heading level={1} className="type-display max-w-[7ch] text-foreground">
              INTELLIGENCE
            </Heading>
            <p className="type-body-sm mt-6 max-w-[30ch] text-muted-foreground">
              EXPERTISE THAT TURNS COMPLEX QUESTIONS INTO CLEARER DECISIONS
            </p>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-5 border-t border-border py-5">
          <p className="type-caption uppercase tracking-[0.12em] text-muted-foreground">
            Research · Intelligence · Expertise
          </p>
          <div className="flex flex-wrap items-center gap-6">
            <Link href={hero.primaryAction.href} className="group inline-flex min-h-11 items-center gap-2 type-button text-primary underline decoration-primary/30 underline-offset-4 hover:decoration-primary focus-visible:outline-2 focus-visible:outline-offset-3">
              {hero.primaryAction.label}
              <ArrowUpRight aria-hidden="true" className="size-4 transition-transform duration-[var(--motion-fast)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
            <Link href={hero.secondaryAction.href} className="group inline-flex min-h-11 items-center gap-2 type-button text-foreground underline decoration-border underline-offset-4 hover:text-primary hover:decoration-primary focus-visible:outline-2 focus-visible:outline-offset-3">
              {hero.secondaryAction.label}
              <ArrowUpRight aria-hidden="true" className="size-4 transition-transform duration-[var(--motion-fast)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
