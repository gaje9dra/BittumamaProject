"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { SceneFrameShell } from "./coded-showcase-frame";

const topics = [
  { id: "thesis", label: "Thesis Writing", detail: "Structure & argument" },
  { id: "topic", label: "Topic Selection", detail: "Scope & research gap" },
  { id: "proposal", label: "Research Proposal", detail: "Question & method" },
  { id: "literature", label: "Literature Review", detail: "Evidence synthesis" },
  { id: "method", label: "Research Methodology", detail: "Design & analysis" },
] as const;

type TopicId = (typeof topics)[number]["id"];

export function ExpertResearchScene({ active }: { active: boolean }) {
  const [activeTopic, setActiveTopic] = useState<TopicId>("proposal");
  useEffect(() => { if (active) setActiveTopic("proposal"); }, [active]);
  const topic = topics.find((item) => item.id === activeTopic) ?? topics[2];

  return (
    <SceneFrameShell>
      <div className="flex h-full flex-col gap-4 sm:gap-5">
        <header className="flex items-center justify-between gap-3">
          <div><p className="text-[9px] font-semibold uppercase tracking-[0.17em] text-[var(--dark-muted-foreground)] sm:text-[10px]">Expert research studio</p><h2 className="mt-1 font-[var(--font-display-family)] text-base sm:text-xl">Review · guidance · collaboration</h2></div>
          <Link href="/experts" className="shrink-0 rounded-full border border-[var(--dark-border)] px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.12em] text-[var(--dark-muted-foreground)] hover:border-[var(--dark-muted-foreground)] hover:text-[var(--dark-foreground)]">Experts</Link>
        </header>

        <div className="relative min-h-0 flex-1 overflow-hidden rounded-[var(--radius-lg)] border border-[var(--dark-border)] bg-[var(--dark-surface)]/45 p-3 sm:p-5">
          <svg aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full opacity-50" viewBox="0 0 1000 560" preserveAspectRatio="none">
            <path d="M165 125 C300 120 365 190 440 250" fill="none" stroke="var(--data-2)" strokeWidth="2" /><path d="M835 125 C700 120 635 190 560 250" fill="none" stroke="var(--data-3)" strokeWidth="2" /><path d="M160 420 C300 420 360 355 440 315" fill="none" stroke="var(--data-4)" strokeWidth="2" /><path d="M840 420 C700 420 640 355 560 315" fill="none" stroke="var(--data-5)" strokeWidth="2" />
            <circle cx="440" cy="250" r="5" fill="var(--data-2)" /><circle cx="560" cy="250" r="5" fill="var(--data-3)" /><circle cx="440" cy="315" r="5" fill="var(--data-4)" /><circle cx="560" cy="315" r="5" fill="var(--data-5)" />
          </svg>

          <div className="absolute left-0 top-0 w-[31%] sm:w-[29%]"><TopicButton topic={topics[0]} active={activeTopic === "thesis"} onClick={() => setActiveTopic("thesis")} /></div>
          <div className="absolute right-0 top-0 w-[43%] sm:w-[29%]"><TopicButton topic={topics[1]} active={activeTopic === "topic"} onClick={() => setActiveTopic("topic")} /></div>
          <div className="absolute bottom-0 left-0 w-[43%] sm:w-[29%]"><TopicButton topic={topics[3]} active={activeTopic === "literature"} onClick={() => setActiveTopic("literature")} /></div>
          <div className="absolute bottom-0 right-0 w-[43%] sm:w-[29%]"><TopicButton topic={topics[4]} active={activeTopic === "method"} onClick={() => setActiveTopic("method")} /></div>

          <div className="absolute left-1/2 top-1/2 w-[60%] -translate-x-1/2 -translate-y-1/2 sm:w-[39%] lg:w-[34%]">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[42%_42%_24%_24%] border border-[var(--dark-border)] bg-[var(--dark-background)] shadow-[var(--shadow-lg)]">
              <div className="absolute inset-x-[14%] top-[13%] aspect-square rounded-full border border-[var(--dark-border)] bg-[var(--dark-surface)]">
                <svg aria-hidden="true" viewBox="0 0 180 180" className="h-full w-full">
                  <circle cx="90" cy="62" r="30" fill="var(--secondary-400)" opacity=".78" /><path d="M48 160c4-44 26-65 42-65s38 21 42 65" fill="var(--primary-500)" /><path d="M65 55c5-28 50-35 57 4-17-11-38-12-57-4Z" fill="var(--dark-background)" /><path d="M64 101c12 9 40 9 52 0" fill="none" stroke="var(--secondary-600)" strokeWidth="3" /><circle cx="78" cy="67" r="2.5" fill="var(--dark-background)" /><circle cx="103" cy="67" r="2.5" fill="var(--dark-background)" />
                </svg>
              </div>
              <div className="absolute bottom-[8%] left-1/2 w-[72%] -translate-x-1/2 rounded border border-[var(--dark-border)] bg-[var(--dark-surface)]/95 p-2 text-center">
                <span className="block text-[8px] font-semibold uppercase tracking-[0.14em] text-[var(--dark-muted-foreground)]">Current focus</span><span className="mt-1 block truncate text-[10px] font-medium sm:text-xs">{topic.label}</span>
              </div>
            </div>
          </div>

          <button type="button" aria-pressed={activeTopic === "proposal"} onClick={() => setActiveTopic("proposal")} className={cn("absolute bottom-3 left-1/2 min-h-11 w-[48%] -translate-x-1/2 rounded-full border px-3 py-1.5 text-center transition-colors sm:bottom-5 sm:w-auto sm:min-w-[13rem]", activeTopic === "proposal" ? "border-[var(--dark-border)] bg-[var(--dark-background)]/95" : "border-[var(--dark-border)]/70 bg-[var(--dark-background)]/85 hover:border-[var(--dark-muted-foreground)]")}><span className="text-[8px] uppercase tracking-[0.12em] text-[var(--dark-muted-foreground)]">{topic.detail}</span></button>
        </div>

        <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--dark-border)] pt-3">
          <div className="flex items-center gap-2 text-[9px] uppercase tracking-[0.12em] text-[var(--dark-muted-foreground)] sm:text-[10px]"><span className="h-1.5 w-1.5 rounded-full bg-[var(--data-3)]" />Select a research topic to focus the board</div>
          <Link href="/services/research-guidance" className="text-[9px] font-semibold uppercase tracking-[0.13em] underline decoration-[var(--dark-border)] underline-offset-4 hover:text-[var(--data-5)]">Research guidance</Link>
        </footer>
      </div>
    </SceneFrameShell>
  );
}

function TopicButton({ topic, active, onClick }: { topic: (typeof topics)[number]; active: boolean; onClick: () => void }) {
  return <button type="button" aria-pressed={active} onClick={onClick} className={cn("flex min-h-11 w-full items-center rounded-[var(--radius-md)] border p-2 text-left transition-[border-color,background-color,transform] duration-200 sm:p-3", active ? "border-[var(--dark-border)] bg-[var(--dark-surface)] -translate-y-0.5" : "border-[var(--dark-border)]/70 bg-[var(--dark-background)]/70 hover:-translate-y-0.5 hover:border-[var(--dark-border)]")}>
    <span className="block text-[8px] font-semibold uppercase tracking-[0.11em] text-[var(--dark-muted-foreground)] sm:text-[9px]">{topic.detail}</span><span className="mt-1 block text-[10px] font-medium sm:text-xs">{topic.label}</span>
  </button>;
}
