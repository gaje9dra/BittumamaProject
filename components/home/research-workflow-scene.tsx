"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { SceneFrameShell, ShowcaseCTA } from "./coded-showcase-frame";

const modules = [
  { id: "question", label: "Research Question", short: "QUESTION", accent: "var(--data-6)", pos: "left" },
  { id: "literature", label: "Literature", short: "LITERATURE", accent: "var(--data-2)", pos: "right" },
  { id: "methodology", label: "Methodology", short: "METHOD", accent: "var(--secondary-400)", pos: "left" },
  { id: "analysis", label: "Analysis", short: "ANALYSIS", accent: "var(--accent)", pos: "right" },
  { id: "findings", label: "Findings", short: "FINDINGS", accent: "var(--data-5)", pos: "right" },
] as const;

type ModuleId = (typeof modules)[number]["id"];

export function ResearchWorkflowScene() {
  const [activeModule, setActiveModule] = useState<ModuleId>("methodology");
  const active = modules.find((item) => item.id === activeModule) ?? modules[2];

  return (
    <SceneFrameShell>
      <div className="flex h-full flex-col gap-4 sm:gap-5">
        <header className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-[8px] font-semibold uppercase tracking-[0.18em] text-[var(--secondary-300)] sm:text-[9px]">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--data-5)]" /> Research system · 04
            </div>
            <h2 className="mt-1 font-[var(--font-display-family)] text-lg text-[var(--dark-foreground)] sm:text-2xl lg:text-3xl">Thesis / research workflow</h2>
          </div>
          <div className="hidden items-center gap-2 text-[8px] uppercase tracking-[0.16em] text-[var(--dark-muted-foreground)] sm:flex">
            <span className="rounded border border-[var(--dark-border)] px-2 py-1">Evidence map</span>
            <span className="rounded border border-[var(--dark-border)] px-2 py-1 text-[var(--data-5)]">Active · {active.short}</span>
          </div>
        </header>

        <div className="relative min-h-0 flex-1 overflow-hidden">
          <div aria-hidden="true" className="absolute inset-x-[18%] top-1/2 h-px bg-[var(--dark-border)]/70" />
          <svg aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 1200 620" preserveAspectRatio="none">
            <path d="M35 130 C180 80 260 115 385 235" fill="none" stroke="var(--data-2)" strokeWidth="2" strokeDasharray="6 8" opacity=".8" />
            <path d="M1165 130 C1020 80 940 115 815 235" fill="none" stroke="var(--data-6)" strokeWidth="2" strokeDasharray="6 8" opacity=".8" />
            <path d="M35 485 C180 535 260 500 385 370" fill="none" stroke="var(--secondary-400)" strokeWidth="2" strokeDasharray="6 8" opacity=".8" />
            <path d="M1165 485 C1020 535 940 500 815 370" fill="none" stroke="var(--accent)" strokeWidth="2" strokeDasharray="6 8" opacity=".8" />
            <circle cx="385" cy="235" r="6" fill="var(--data-2)" /><circle cx="815" cy="235" r="6" fill="var(--data-6)" />
            <circle cx="385" cy="370" r="6" fill="var(--secondary-400)" /><circle cx="815" cy="370" r="6" fill="var(--accent)" />
          </svg>

          <div className="absolute left-0 top-0 z-10 w-[29%] sm:w-[24%] lg:w-[20%]">
            <ModuleButton module={modules[0]} active={activeModule === "question"} onClick={() => setActiveModule("question")} />
          </div>
          <div className="absolute right-0 top-[5%] z-10 w-[29%] sm:w-[24%] lg:w-[20%]">
            <ModuleButton module={modules[1]} active={activeModule === "literature"} onClick={() => setActiveModule("literature")} />
          </div>
          <div className="absolute bottom-[7%] left-0 z-10 w-[29%] sm:w-[24%] lg:w-[20%]">
            <ModuleButton module={modules[2]} active={activeModule === "methodology"} onClick={() => setActiveModule("methodology")} />
          </div>
          <div className="absolute bottom-[7%] right-0 z-10 w-[29%] sm:w-[24%] lg:w-[20%]">
            <ModuleButton module={modules[3]} active={activeModule === "analysis"} onClick={() => setActiveModule("analysis")} />
          </div>
          <div className="absolute right-[1%] top-1/2 z-10 hidden w-[18%] -translate-y-1/2 lg:block">
            <ModuleButton module={modules[4]} active={activeModule === "findings"} onClick={() => setActiveModule("findings")} compact />
          </div>

          <div className="absolute inset-0 grid place-items-center">
            <div className="relative w-[72%] sm:w-[55%] lg:w-[48%]">
              <div aria-hidden="true" className="absolute -inset-3 translate-x-2 translate-y-2 border border-[var(--data-6)]/35 bg-[var(--primary-900)]/25" />
              <div aria-hidden="true" className="absolute -inset-2 -translate-x-2 translate-y-1 border border-[var(--secondary-400)]/30 bg-[var(--primary-950)]/40" />
              <div className="relative border border-[var(--secondary-200)] bg-[var(--background)] p-3 text-[var(--foreground)] shadow-[0_18px_45px_rgb(0_0_0_/_0.24)] sm:p-5">
                <div className="flex items-start justify-between gap-4 border-b border-[var(--secondary-200)] pb-3">
                  <div>
                    <p className="text-[7px] font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">Research document</p>
                    <p className="mt-1 font-[var(--font-display-family)] text-sm sm:text-lg">Methodology framework</p>
                  </div>
                  <div className="text-right text-[7px] uppercase tracking-[0.14em] text-[var(--muted-foreground)]">
                    <span className="block">BMT / 04</span><span className="block">Revision 07</span>
                  </div>
                </div>

                <div className="mt-3 grid gap-3 sm:grid-cols-[1.45fr_.8fr]">
                  <div className="rounded-sm border border-[var(--secondary-200)] bg-[var(--surface-muted)] p-2.5">
                    <div className="flex items-center justify-between text-[7px] uppercase tracking-[0.13em] text-[var(--muted-foreground)]"><span>Literature synthesis</span><span>04.2</span></div>
                    <div className="mt-2 space-y-1.5">
                      {[92,76,84,61,88,69].map((width,index)=><div key={index} className="h-1 rounded-full bg-[var(--secondary-200)]"><div className="h-full rounded-full" style={{ width: width + "%", backgroundColor: index === 3 ? "var(--accent)" : index === 5 ? "var(--data-5)" : "var(--primary-400)" }} /></div>)}
                    </div>
                    <div className="mt-3 grid grid-cols-3 gap-1.5">
                      <span className="h-7 border border-[var(--secondary-200)] bg-[var(--surface)]" />
                      <span className="h-7 border border-[var(--secondary-200)] bg-[var(--surface)]" />
                      <span className="h-7 border border-[var(--secondary-200)] bg-[var(--surface)]" />
                    </div>
                  </div>
                  <div className="rounded-sm border border-[var(--secondary-200)] bg-[var(--surface)] p-2.5">
                    <p className="text-[7px] uppercase tracking-[0.13em] text-[var(--muted-foreground)]">Citation trail</p>
                    <svg viewBox="0 0 150 80" className="mt-2 h-16 w-full" aria-hidden="true">
                      <path d="M8 60 C30 18 52 67 75 35 S113 52 142 12" fill="none" stroke="var(--data-2)" strokeWidth="2" />
                      <circle cx="8" cy="60" r="3" fill="var(--data-2)" /><circle cx="75" cy="35" r="3" fill="var(--accent)" /><circle cx="142" cy="12" r="3" fill="var(--data-5)" />
                    </svg>
                    <div className="mt-1 flex justify-between text-[7px] text-[var(--muted-foreground)]"><span>source</span><span>evidence</span></div>
                  </div>
                </div>

                <div className="mt-3 grid grid-cols-5 gap-1 border-y border-[var(--secondary-200)] py-2">
                  {modules.map((module,index)=><button key={module.id} type="button" aria-label={"Focus " + module.label} aria-pressed={activeModule === module.id} onClick={() => setActiveModule(module.id)} className={cn("min-h-11 border-b-2 px-1 text-[7px] font-semibold uppercase tracking-[0.08em] transition-colors", activeModule === module.id ? "text-[var(--foreground)]" : "text-[var(--muted-foreground)]")} style={{ borderColor: activeModule === module.id ? module.accent : "var(--secondary-200)" }}>{String(index + 1).padStart(2, "0")}<span className="mt-1 block truncate">{module.short}</span></button>)}
                </div>

                <div className="mt-3 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-[7px] uppercase tracking-[0.14em] text-[var(--muted-foreground)]"><span className="h-2 w-2 rounded-full" style={{ backgroundColor: active.accent }} /> Active evidence: {active.short}</div>
                  <div className="hidden items-center gap-1 text-[7px] uppercase tracking-[0.13em] text-[var(--muted-foreground)] sm:flex"><span>R</span><span className="text-[var(--secondary-400)]">→</span><span>M</span><span className="text-[var(--secondary-400)]">→</span><span>A</span><span className="text-[var(--secondary-400)]">→</span><span>F</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <footer className="flex items-center justify-between gap-4 border-t border-[var(--dark-border)] pt-3">
          <div className="min-w-0 text-[8px] uppercase tracking-[0.14em] text-[var(--dark-muted-foreground)] sm:text-[9px]"><span className="text-[var(--data-5)]">ACTIVE</span> · {active.label} · evidence mapped</div>
          <ShowcaseCTA href="/contact" label="Request Support" tone="accent" />
        </footer>
      </div>
    </SceneFrameShell>
  );
}

function ModuleButton({ module, active, onClick, compact = false }: { module: (typeof modules)[number]; active: boolean; onClick: () => void; compact?: boolean }) {
  return (
    <button type="button" aria-pressed={active} onClick={onClick} className={cn("w-full min-h-11 border bg-[var(--primary-950)]/80 p-2 text-left transition-[background-color,border-color,transform] duration-200 sm:p-3", active ? "border-[var(--secondary-200)] -translate-y-0.5 bg-[var(--dark-surface)]" : "border-[var(--dark-border)]/80 hover:-translate-y-0.5 hover:bg-[var(--dark-surface)]")}>
      <span className="block text-[7px] font-semibold uppercase tracking-[0.13em] text-[var(--dark-muted-foreground)] sm:text-[8px]">{module.short}</span>
      {!compact ? <span className="mt-1 block truncate text-[9px] font-medium sm:text-[11px]">{module.label}</span> : null}
      <span className="mt-2 block h-0.5 w-7" style={{ backgroundColor: active ? module.accent : "var(--dark-border)" }} />
    </button>
  );
}
