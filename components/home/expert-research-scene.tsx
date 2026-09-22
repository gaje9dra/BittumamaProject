"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { SceneFrameShell, ShowcaseCTA } from "./coded-showcase-frame";

const topics = [
  { id: "thesis", label: "Thesis Writing", detail: "Structure & argument", accent: "var(--accent)" },
  { id: "topic", label: "Topic Selection", detail: "Scope & research gap", accent: "var(--data-6)" },
  { id: "proposal", label: "Research Proposal", detail: "Question & method", accent: "var(--secondary-400)" },
  { id: "literature", label: "Literature Review", detail: "Evidence synthesis", accent: "var(--data-2)" },
  { id: "method", label: "Research Methodology", detail: "Design & analysis", accent: "var(--data-5)" },
] as const;

type TopicId = (typeof topics)[number]["id"];

export function ExpertResearchScene() {
  const [activeTopic, setActiveTopic] = useState<TopicId>("proposal");
  const topic = topics.find((item) => item.id === activeTopic) ?? topics[2];

  return (
    <SceneFrameShell>
      <div className="flex h-full flex-col gap-4 sm:gap-5">
        <header className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-[8px] font-semibold uppercase tracking-[0.18em] text-[var(--secondary-300)] sm:text-[9px]"><span className="h-1.5 w-1.5 rounded-full bg-[var(--data-2)]" /> Expert research studio</div>
            <h2 className="mt-1 font-[var(--font-display-family)] text-lg sm:text-2xl lg:text-3xl">Review · guidance · collaboration</h2>
          </div>
          <div className="hidden rounded border border-[var(--dark-border)] bg-[var(--dark-surface)] px-3 py-2 text-[8px] uppercase tracking-[0.14em] text-[var(--dark-muted-foreground)] sm:block">Expert review · {topic.id}</div>
        </header>

        <div className="relative min-h-0 flex-1 overflow-hidden border border-[var(--dark-border)] bg-[var(--primary-950)]">
          <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgba(56,103,121,.24),transparent_28%),radial-gradient(circle_at_20%_80%,rgba(163,79,63,.14),transparent_24%)]" />
          <svg aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 1200 620" preserveAspectRatio="none">
            <path d="M0 125 C240 45 300 165 460 250" fill="none" stroke="var(--data-2)" strokeWidth="2" opacity=".75" />
            <path d="M1200 125 C960 45 900 165 740 250" fill="none" stroke="var(--data-6)" strokeWidth="2" opacity=".75" />
            <path d="M0 490 C250 565 325 455 470 360" fill="none" stroke="var(--accent)" strokeWidth="2" opacity=".7" />
            <path d="M1200 490 C950 565 875 455 730 360" fill="none" stroke="var(--data-5)" strokeWidth="2" opacity=".7" />
            <circle cx="460" cy="250" r="6" fill="var(--data-2)" /><circle cx="740" cy="250" r="6" fill="var(--data-6)" /><circle cx="470" cy="360" r="6" fill="var(--accent)" /><circle cx="730" cy="360" r="6" fill="var(--data-5)" />
          </svg>

          <div className="absolute left-3 top-3 z-10 w-[29%] sm:left-5 sm:top-5 sm:w-[23%]"><TopicButton topic={topics[0]} active={activeTopic === "thesis"} onClick={() => setActiveTopic("thesis")} /></div>
          <div className="absolute right-3 top-3 z-10 w-[29%] sm:right-5 sm:top-5 sm:w-[23%]"><TopicButton topic={topics[1]} active={activeTopic === "topic"} onClick={() => setActiveTopic("topic")} /></div>
          <div className="absolute bottom-3 left-3 z-10 w-[29%] sm:bottom-5 sm:left-5 sm:w-[23%]"><TopicButton topic={topics[3]} active={activeTopic === "literature"} onClick={() => setActiveTopic("literature")} /></div>
          <div className="absolute bottom-3 right-3 z-10 w-[29%] sm:bottom-5 sm:right-5 sm:w-[23%]"><TopicButton topic={topics[4]} active={activeTopic === "method"} onClick={() => setActiveTopic("method")} /></div>

          <div className="absolute inset-0 grid place-items-center px-10 sm:px-20">
            <div className="relative w-[48%] max-w-[25rem] sm:w-[31%] lg:w-[28%]">
              <div aria-hidden="true" className="absolute -inset-6 rounded-full border border-[var(--data-2)]/25" />
              <div aria-hidden="true" className="absolute -inset-3 rounded-full border border-[var(--secondary-400)]/30" />
              <div className="relative overflow-hidden border border-[var(--dark-border)] bg-[var(--dark-surface)] shadow-[0_22px_55px_rgb(0_0_0_/_0.3)]">
                <div className="border-b border-[var(--dark-border)] px-3 py-2 text-center text-[7px] uppercase tracking-[0.16em] text-[var(--dark-muted-foreground)]">Research board / live focus</div>
                <div className="relative aspect-[4/4.5]">
                  <svg viewBox="0 0 260 290" className="h-full w-full" aria-hidden="true">
                    <defs><linearGradient id="expertAura" x1="0" x2="1"><stop offset="0" stopColor="var(--data-6)" /><stop offset=".55" stopColor="var(--data-2)" /><stop offset="1" stopColor="var(--accent)" /></linearGradient></defs>
                    <circle cx="130" cy="118" r="86" fill="url(#expertAura)" opacity=".08" />
                    <circle cx="130" cy="92" r="34" fill="var(--secondary-300)" />
                    <path d="M74 245c8-70 30-105 56-105s48 35 56 105" fill="var(--primary-500)" />
                    <path d="M92 168c22 13 54 13 76 0" fill="none" stroke="var(--accent)" strokeWidth="6" />
                    <path d="M94 82c8-35 66-44 75 7-23-16-50-17-75-7Z" fill="var(--primary-950)" />
                    <circle cx="118" cy="97" r="3" fill="var(--primary-950)" /><circle cx="144" cy="97" r="3" fill="var(--primary-950)" />
                    <path d="M110 121c12 8 28 8 40 0" fill="none" stroke="var(--secondary-600)" strokeWidth="3" />
                    <rect x="55" y="215" width="150" height="48" rx="2" fill="var(--primary-950)" stroke="var(--dark-border)" />
                    <path d="M70 230H185M70 240H164M70 250H176" stroke="var(--dark-muted-foreground)" strokeWidth="2" opacity=".65" />
                    <circle cx="188" cy="230" r="5" fill={topic.accent} />
                  </svg>
                </div>
                <div className="border-t border-[var(--dark-border)] bg-[var(--primary-950)] px-3 py-2">
                  <span className="block text-[7px] uppercase tracking-[0.14em] text-[var(--dark-muted-foreground)]">Current focus</span>
                  <span className="mt-1 block truncate text-[10px] font-medium">{topic.label}</span>
                </div>
              </div>
            </div>
          </div>

          <button type="button" aria-pressed={activeTopic === "proposal"} onClick={() => setActiveTopic("proposal")} className={cn("absolute bottom-3 left-1/2 z-20 min-h-11 -translate-x-1/2 border px-3 py-2 text-[8px] font-semibold uppercase tracking-[0.13em] sm:bottom-5", activeTopic === "proposal" ? "border-[var(--secondary-300)] bg-[var(--dark-surface)] text-[var(--dark-foreground)]" : "border-[var(--dark-border)] bg-[var(--primary-950)] text-[var(--dark-muted-foreground)]")}>
            Proposal · {topic.detail}
          </button>
        </div>

        <footer className="flex items-center justify-between gap-4 border-t border-[var(--dark-border)] pt-3">
          <div className="min-w-0 text-[8px] uppercase tracking-[0.14em] text-[var(--dark-muted-foreground)] sm:text-[9px]"><span className="text-[var(--data-2)]">FOCUS</span> · {topic.label}</div>
          <ShowcaseCTA href="/services" label="Explore Services" tone="teal" />
        </footer>
      </div>
    </SceneFrameShell>
  );
}

function TopicButton({ topic, active, onClick }: { topic: (typeof topics)[number]; active: boolean; onClick: () => void }) {
  return (
    <button type="button" aria-pressed={active} onClick={onClick} className={cn("w-full min-h-11 border bg-[var(--primary-950)]/85 p-2 text-left transition-[background-color,border-color,transform] duration-200 sm:p-3", active ? "border-[var(--secondary-300)] -translate-y-0.5 bg-[var(--dark-surface)]" : "border-[var(--dark-border)] hover:-translate-y-0.5 hover:bg-[var(--dark-surface)]")}>
      <span className="block text-[7px] font-semibold uppercase tracking-[0.11em] text-[var(--dark-muted-foreground)] sm:text-[8px]">{topic.detail}</span>
      <span className="mt-1 block truncate text-[9px] font-medium sm:text-[11px]">{topic.label}</span>
      <span className="mt-2 block h-0.5 w-8" style={{ backgroundColor: active ? topic.accent : "var(--dark-border)" }} />
    </button>
  );
}
