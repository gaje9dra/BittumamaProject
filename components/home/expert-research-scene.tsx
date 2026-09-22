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
        <header className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[9px] font-semibold uppercase tracking-[0.17em] text-[var(--dark-muted-foreground)] sm:text-[10px]">Expert research studio</p>
            <h2 className="mt-1 font-[var(--font-display-family)] text-base sm:text-xl">Review · guidance · collaboration</h2>
          </div>
          <span className="shrink-0 rounded-full border border-[var(--dark-border)] bg-[var(--dark-surface)] px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.12em] text-[var(--dark-muted-foreground)]">Expert review</span>
        </header>

        <div className="relative min-h-0 flex-1 overflow-hidden rounded-[var(--radius-lg)] border border-[var(--dark-border)] bg-[var(--primary-950)]/75 p-3 sm:p-5">
          <svg aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full opacity-50" viewBox="0 0 1000 560" preserveAspectRatio="none">
            <path d="M165 125 C300 120 365 190 440 250" fill="none" stroke="var(--data-2)" strokeWidth="2" />
            <path d="M835 125 C700 120 635 190 560 250" fill="none" stroke="var(--data-6)" strokeWidth="2" />
            <path d="M160 420 C300 420 360 355 440 315" fill="none" stroke="var(--data-4)" strokeWidth="2" />
            <path d="M840 420 C700 420 640 355 560 315" fill="none" stroke="var(--data-5)" strokeWidth="2" />
            <circle cx="440" cy="250" r="5" fill="var(--data-2)" /><circle cx="560" cy="250" r="5" fill="var(--data-6)" /><circle cx="440" cy="315" r="5" fill="var(--data-4)" /><circle cx="560" cy="315" r="5" fill="var(--data-5)" />
          </svg>

          <div className="absolute left-0 top-0 w-[31%] sm:w-[29%]"><TopicButton topic={topics[0]} active={activeTopic === "thesis"} onClick={() => setActiveTopic("thesis")} /></div>
          <div className="absolute right-0 top-0 w-[31%] sm:w-[29%]"><TopicButton topic={topics[1]} active={activeTopic === "topic"} onClick={() => setActiveTopic("topic")} /></div>
          <div className="absolute bottom-0 left-0 w-[31%] sm:w-[29%]"><TopicButton topic={topics[3]} active={activeTopic === "literature"} onClick={() => setActiveTopic("literature")} /></div>
          <div className="absolute bottom-0 right-0 w-[31%] sm:w-[29%]"><TopicButton topic={topics[4]} active={activeTopic === "method"} onClick={() => setActiveTopic("method")} /></div>

          <div className="absolute inset-0 grid place-items-center">
            <div className="w-[60%] sm:w-[39%] lg:w-[34%]">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[42%_42%_24%_24%] border border-[var(--dark-border)] bg-[var(--dark-background)] shadow-[var(--shadow-lg)]">
                <div className="absolute inset-x-[14%] top-[13%] aspect-square rounded-full border border-[var(--dark-border)] bg-[var(--dark-surface)]">
                  <svg aria-hidden="true" viewBox="0 0 180 180" className="h-full w-full">
                    <circle cx="90" cy="62" r="30" fill="var(--secondary-300)" opacity=".9" />
                    <path d="M48 160c4-44 26-65 42-65s38 21 42 65" fill="var(--primary-500)" />
                    <path d="M56 132c20-10 38-10 68 0" fill="none" stroke="var(--accent)" strokeWidth="4" opacity=".9" />
                    <path d="M65 55c5-28 50-35 57 4-17-11-38-12-57-4Z" fill="var(--dark-background)" />
                    <path d="M64 101c12 9 40 9 52 0" fill="none" stroke="var(--secondary-600)" strokeWidth="3" />
                    <circle cx="78" cy="67" r="2.5" fill="var(--dark-background)" /><circle cx="103" cy="67" r="2.5" fill="var(--dark-background)" />
                  </svg>
                </div>
                <div className="absolute bottom-[8%] left-[14%] w-[72%] rounded border border-[var(--dark-border)] bg-[var(--dark-surface)]/95 p-2 text-center">
                  <span className="block text-[8px] font-semibold uppercase tracking-[0.14em] text-[var(--dark-muted-foreground)]">Current focus</span>
                  <span className="mt-1 block truncate text-[10px] font-medium sm:text-xs">{topic.label}</span>
                </div>
              </div>
            </div>
          </div>

          <button type="button" aria-pressed={activeTopic === "proposal"} onClick={() => setActiveTopic("proposal")} className={cn(
            "absolute bottom-3 inset-x-0 mx-auto min-h-11 w-[48%] rounded-full border px-3 py-1.5 text-center transition-colors sm:bottom-5 sm:w-auto sm:min-w-[13rem]",
            activeTopic === "proposal" ? "border-[var(--dark-border)] bg-[var(--dark-background)]/95" : "border-[var(--dark-border)]/70 bg-[var(--dark-background)]/85 hover:border-[var(--dark-muted-foreground)]",
          )}>
            <span className="text-[8px] uppercase tracking-[0.12em] text-[var(--dark-muted-foreground)]">{topic.detail}</span>
          </button>
        </div>

        <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--dark-border)] pt-3">
          <div className="flex items-center gap-2 text-[9px] uppercase tracking-[0.12em] text-[var(--dark-muted-foreground)] sm:text-[10px]"><span className="h-1.5 w-1.5 rounded-full bg-[var(--data-6)]" />Select a research topic to focus the board</div>
          <ShowcaseCTA href="/services" label="Explore Services" tone="teal" />
        </footer>
      </div>
    </SceneFrameShell>
  );
}

function TopicButton({ topic, active, onClick }: { topic: (typeof topics)[number]; active: boolean; onClick: () => void }) {
  return (
    <button type="button" aria-pressed={active} onClick={onClick} className={cn(
      "flex min-h-11 w-full items-center rounded-[var(--radius-md)] border p-2 text-left transition-[border-color,background-color,transform] duration-200 sm:p-3",
      active ? "border-[var(--dark-border)] bg-[var(--dark-surface)] -translate-y-0.5" : "border-[var(--dark-border)]/70 bg-[var(--dark-background)]/70 hover:-translate-y-0.5 hover:border-[var(--dark-border)]",
    )} style={{ boxShadow: active ? `inset 3px 0 0 ${topic.accent}` : undefined }}>
      <span className="block text-[8px] font-semibold uppercase tracking-[0.11em] text-[var(--dark-muted-foreground)] sm:text-[9px]">{topic.detail}</span>
      <span className="mt-1 block text-[10px] font-medium sm:text-xs">{topic.label}</span>
    </button>
  );
}
