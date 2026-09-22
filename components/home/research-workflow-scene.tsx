"use client";

import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { SceneFrameShell } from "./coded-showcase-frame";

const modules = [
  { id: "question", label: "Research Question", short: "QUESTION", accent: "var(--data-2)" },
  { id: "literature", label: "Literature", short: "LITERATURE", accent: "var(--data-3)" },
  { id: "methodology", label: "Methodology", short: "METHOD", accent: "var(--data-5)" },
  { id: "analysis", label: "Analysis", short: "ANALYSIS", accent: "var(--data-4)" },
  { id: "findings", label: "Findings", short: "FINDINGS", accent: "var(--data-5)" },
] as const;

type ModuleId = (typeof modules)[number]["id"];

export function ResearchWorkflowScene() {
  const [activeModule, setActiveModule] = useState<ModuleId>("methodology");
  const active = modules.find((item) => item.id === activeModule) ?? modules[2];

  return (
    <SceneFrameShell>
      <div className="flex h-full flex-col gap-4 sm:gap-5">
        <header className="flex items-center justify-between gap-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--dark-border)] bg-[var(--dark-surface)] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--dark-muted-foreground)] sm:text-xs">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--data-5)]" />
            Research workflow
          </div>
          <span className="hidden text-[10px] uppercase tracking-[0.16em] text-[var(--dark-muted-foreground)] sm:block">Research board · methodology</span>
        </header>

        <div className="relative min-h-0 flex-1">
          <svg aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full opacity-55" viewBox="0 0 1000 560" preserveAspectRatio="none">
            <path d="M150 105 C300 125 320 205 410 245" fill="none" stroke="var(--data-2)" strokeWidth="2" strokeDasharray="5 8" />
            <path d="M850 105 C700 125 690 205 590 245" fill="none" stroke="var(--data-3)" strokeWidth="2" strokeDasharray="5 8" />
            <path d="M145 405 C290 385 330 330 410 315" fill="none" stroke="var(--data-4)" strokeWidth="2" strokeDasharray="5 8" />
            <path d="M855 405 C710 385 675 330 590 315" fill="none" stroke="var(--data-5)" strokeWidth="2" strokeDasharray="5 8" />
            <circle cx="410" cy="245" r="5" fill="var(--data-2)" /><circle cx="590" cy="245" r="5" fill="var(--data-3)" />
            <circle cx="410" cy="315" r="5" fill="var(--data-4)" /><circle cx="590" cy="315" r="5" fill="var(--data-5)" />
          </svg>

          <div className="absolute left-0 top-0 w-[31%] sm:w-[30%] lg:w-[23%]">
            <ModuleButton module={modules[0]} active={activeModule === "question"} onClick={() => setActiveModule("question")} />
          </div>
          <div className="absolute right-0 top-0 w-[31%] sm:w-[30%] lg:w-[23%]">
            <ModuleButton module={modules[1]} active={activeModule === "literature"} onClick={() => setActiveModule("literature")} />
          </div>
          <div className="absolute bottom-0 left-0 w-[31%] sm:w-[30%] lg:w-[23%]">
            <ModuleButton module={modules[3]} active={activeModule === "analysis"} onClick={() => setActiveModule("analysis")} />
          </div>
          <div className="absolute bottom-0 right-0 w-[31%] sm:w-[30%] lg:w-[23%]">
            <ModuleButton module={modules[4]} active={activeModule === "findings"} onClick={() => setActiveModule("findings")} />
          </div>

          <div className="absolute inset-0 grid place-items-center">
            <div className="w-[61%] sm:w-[54%] lg:w-[47%]">
              <div className="rounded-[var(--radius-lg)] border border-[var(--dark-border)] bg-[var(--dark-surface)]/95 p-3 shadow-[var(--shadow-lg)] backdrop-blur-sm sm:p-4">
                <div className="flex items-center justify-between border-b border-[var(--dark-border)] pb-2">
                  <div>
                    <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-[var(--dark-muted-foreground)] sm:text-[10px]">Thesis working board</p>
                    <p className="mt-0.5 font-[var(--font-display-family)] text-sm sm:text-base">Research framework</p>
                  </div>
                  <span className="rounded border border-[var(--dark-border)] px-2 py-1 text-[8px] uppercase tracking-[0.14em] text-[var(--dark-muted-foreground)]">method</span>
                </div>

                <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-[1fr_0.7fr] sm:gap-3">
                  <div className="rounded border border-[var(--dark-border)] bg-[var(--dark-background)] p-2.5">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-[8px] uppercase tracking-[0.14em] text-[var(--dark-muted-foreground)]">Document</span>
                      <span className="text-[8px] text-[var(--dark-muted-foreground)]">section 04</span>
                    </div>
                    <div className="space-y-1.5">
                      {[78, 94, 64, 86, 72].map((width, index) => (
                        <div key={width} className="h-1.5 rounded-full bg-[var(--dark-border)]">
                          <div className={cn("h-full rounded-full", index === 2 ? "bg-[var(--data-5)]" : "bg-[var(--primary-400)]")} style={{ width: width + "%" }} />
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 grid grid-cols-3 gap-1.5">
                      <span className="h-9 rounded border border-[var(--dark-border)] bg-[var(--dark-surface)]" />
                      <span className="h-9 rounded border border-[var(--dark-border)] bg-[var(--dark-surface)]" />
                      <span className="h-9 rounded border border-[var(--dark-border)] bg-[var(--dark-surface)]" />
                    </div>
                  </div>

                  <div className="rounded border border-[var(--dark-border)] bg-[var(--dark-background)] p-2.5">
                    <p className="text-[8px] uppercase tracking-[0.14em] text-[var(--dark-muted-foreground)]">Evidence map</p>
                    <svg aria-hidden="true" viewBox="0 0 180 100" className="mt-2 h-20 w-full">
                      <path d="M10 80 C45 50 55 75 82 42 S120 64 170 18" fill="none" stroke="var(--data-2)" strokeWidth="3" />
                      <circle cx="10" cy="80" r="4" fill="var(--data-2)" /><circle cx="82" cy="42" r="4" fill="var(--data-3)" /><circle cx="170" cy="18" r="4" fill="var(--data-5)" />
                      <path d="M10 90H170M10 90V10" stroke="var(--dark-border)" strokeWidth="1" />
                    </svg>
                    <div className="mt-1 flex justify-between text-[8px] text-[var(--dark-muted-foreground)]"><span>evidence</span><span>signal</span></div>
                  </div>
                </div>

                <div className="mt-3 rounded border border-[var(--dark-border)] bg-[var(--dark-background)] p-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[8px] uppercase tracking-[0.14em] text-[var(--dark-muted-foreground)]">Active module</span>
                    <button
                      type="button"
                      aria-pressed={activeModule === "methodology"}
                      onClick={() => setActiveModule("methodology")}
                      className={cn(
                        "min-h-11 rounded border px-2 text-[9px] font-semibold transition-colors",
                        activeModule === "methodology" ? "border-[var(--dark-border)] bg-[var(--dark-surface)]" : "border-[var(--dark-border)] text-[var(--dark-muted-foreground)] hover:text-[var(--dark-foreground)]",
                      )}
                    >
                      Methodology
                    </button>
                  </div>
                  <div className="mt-2 grid grid-cols-5 gap-1">
                    {modules.map((module) => <span key={module.id} className={cn("h-1.5 rounded-full", activeModule === module.id ? "bg-[var(--data-5)]" : "bg-[var(--dark-border)]")} />)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="absolute bottom-[18%] inset-x-0 hidden justify-center lg:flex">
            <Link href="/services/thesis-assistance" className="rounded-full border border-[var(--dark-border)] bg-[var(--dark-surface)] px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.13em] hover:border-[var(--data-5)] hover:text-[var(--data-5)]">Thesis assistance</Link>
          </div>
        </div>

        <footer className="flex items-center justify-between gap-4 border-t border-[var(--dark-border)] pt-3">
          <div className="flex min-w-0 items-center gap-2 text-[9px] uppercase tracking-[0.12em] text-[var(--dark-muted-foreground)] sm:text-[10px]">
            <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: active.accent }} />
            <span className="truncate">Workflow state · {active.short}</span>
          </div>
          <Link href="/research" className="shrink-0 text-[9px] font-semibold uppercase tracking-[0.13em] text-[var(--dark-muted-foreground)] underline decoration-[var(--dark-border)] underline-offset-4 hover:text-[var(--dark-foreground)]">Research</Link>
        </footer>
      </div>
    </SceneFrameShell>
  );
}

function ModuleButton({ module, active, onClick }: { module: (typeof modules)[number]; active: boolean; onClick: () => void }) {
  return (
    <button type="button" aria-pressed={active} onClick={onClick} className={cn(
      "flex min-h-11 w-full items-center rounded-[var(--radius-md)] border p-2 text-left transition-[border-color,background-color,transform] duration-200 sm:p-3",
      active ? "border-[var(--dark-border)] bg-[var(--dark-surface)] -translate-y-0.5" : "border-[var(--dark-border)]/70 bg-[var(--dark-surface)]/70 hover:-translate-y-0.5 hover:border-[var(--dark-border)]",
    )} style={{ boxShadow: active ? "inset 3px 0 0 " + module.accent : undefined }}>
      <span className="block text-[8px] font-semibold uppercase tracking-[0.11em] text-[var(--dark-muted-foreground)] sm:text-[9px]">{module.short}</span>
      <span className="mt-1 block truncate text-[10px] font-medium text-[var(--dark-foreground)] sm:text-xs">{module.label}</span>
    </button>
  );
}
