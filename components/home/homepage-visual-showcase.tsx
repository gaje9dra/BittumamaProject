"use client";

import { useEffect, useRef, useState } from "react";
import { Container } from "@/components/ui/container";
import { SHOWCASE_DISPLAY_MS, SceneFrame, useShowcaseVisibility } from "./coded-showcase-frame";
import { ResearchWorkflowScene } from "./research-workflow-scene";
import { ExpertResearchScene } from "./expert-research-scene";
import { DataAnalysisScene } from "./data-analysis-scene";

const SCENES = [
  { id: "research", label: "Research and thesis workflow" },
  { id: "expert", label: "Expert research guidance" },
  { id: "analysis", label: "Research data analysis and visualization" },
] as const;

export function HomepageVisualShowcase() {
  const sectionRef = useRef<HTMLElement>(null);
  const visible = useShowcaseVisibility(sectionRef);
  const [activeIndex, setActiveIndex] = useState(0);
  const [previousIndex, setPreviousIndex] = useState(2);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(mediaQuery.matches);
    update();
    mediaQuery.addEventListener("change", update);
    return () => mediaQuery.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!visible || reducedMotion) return;
    const timer = window.setInterval(() => {
      setActiveIndex((current) => {
        setPreviousIndex(current);
        return (current + 1) % SCENES.length;
      });
    }, SHOWCASE_DISPLAY_MS);
    return () => window.clearInterval(timer);
  }, [reducedMotion, visible]);

  return (
    <section ref={sectionRef} aria-label="Bittumama research visual showcase" className="overflow-hidden border-b border-border bg-background">
      <Container size="wide" className="py-4 sm:py-6 lg:py-8">
        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[var(--radius-xl)] border border-border bg-dark-background sm:aspect-[16/10] lg:aspect-[16/8.5]">
          {SCENES.map((scene, index) => (
            <SceneFrame key={scene.id} active={index === activeIndex} index={index} previousIndex={previousIndex} reducedMotion={reducedMotion} label={scene.label}>
              {index === 0 ? <ResearchWorkflowScene active={index === activeIndex} /> : null}
              {index === 1 ? <ExpertResearchScene active={index === activeIndex} /> : null}
              {index === 2 ? <DataAnalysisScene active={index === activeIndex} /> : null}
            </SceneFrame>
          ))}
        </div>
      </Container>
    </section>
  );
}
