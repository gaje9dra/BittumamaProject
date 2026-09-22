"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { SceneFrameShell, ShowcaseCTA } from "./coded-showcase-frame";

const views = ["Overview", "Analysis", "Visualization"] as const;
type View = (typeof views)[number];

export function DataAnalysisScene() {
  const [activeView, setActiveView] = useState<View>("Overview");
  const analysis = activeView === "Analysis";
  const visualization = activeView === "Visualization";

  return (
    <SceneFrameShell>
      <div className="flex h-full flex-col gap-4 sm:gap-5">
        <header className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center sm:gap-4">
          <div><p className="text-[9px] font-semibold uppercase tracking-[0.17em] text-[var(--dark-muted-foreground)] sm:text-[10px]">Research analysis lab</p><h2 className="mt-1 font-[var(--font-display-family)] text-base sm:text-xl">Evidence → analysis → visualization</h2></div>
          <div className="flex rounded-full border border-[var(--dark-border)] bg-[var(--dark-surface)] p-1" role="tablist" aria-label="Analysis views">
            {views.map((view) => <button key={view} type="button" role="tab" aria-selected={activeView === view} aria-controls="showcase-analysis-panel" onClick={() => setActiveView(view)} className={cn("rounded-full min-h-11 px-2.5 py-1.5 text-[8px] font-semibold uppercase tracking-[0.08em] sm:px-3 sm:text-[9px]", activeView === view ? "bg-[var(--dark-foreground)] text-[var(--dark-background)]" : "text-[var(--dark-muted-foreground)] hover:text-[var(--dark-foreground)]")}>{view}</button>)}
          </div>
        </header>

        <div id="showcase-analysis-panel" role="tabpanel" aria-label={activeView + " analysis view"} className="min-h-0 flex-1">
          <div className="grid h-full min-h-0 gap-3 lg:grid-cols-[1.65fr_0.8fr]">
            <div className="min-h-0 rounded-[var(--radius-lg)] border border-[var(--dark-border)] bg-[var(--primary-950)]/70 p-3 sm:p-5">
              <div className="flex items-center justify-between gap-3"><div><p className="text-[8px] uppercase tracking-[0.14em] text-[var(--dark-muted-foreground)]">Illustrative signal</p><p className="mt-1 text-xs font-medium sm:text-sm">Evidence distribution</p></div><span className="rounded border border-[var(--dark-border)] px-2 py-1 text-[8px] uppercase tracking-[0.12em] text-[var(--dark-muted-foreground)]">{activeView}</span></div>
              <div className="mt-4 grid min-h-0 grid-cols-1 gap-3 sm:grid-cols-[1fr_0.7fr] sm:mt-5">
                <div className="rounded border border-[var(--secondary-200)] bg-[var(--background)] text-[var(--foreground)] p-2 sm:p-3">
                  <svg viewBox="0 0 520 260" className="h-full min-h-[150px] w-full" role="img" aria-label="Illustrative research signal line chart">
                    <g stroke="var(--secondary-200)" strokeWidth="1">{[40,90,140,190,240].map((y)=><line key={y} x1="48" y1={y} x2="500" y2={y} />)}{[48,160,272,384,496].map((x)=><line key={x} x1={x} y1="20" x2={x} y2="240" />)}</g>
                    <path d="M48 220 L110 186 L172 198 L234 142 L296 154 L358 94 L420 108 L496 55" fill="none" stroke={visualization ? "var(--data-5)" : "var(--data-2)"} strokeWidth={visualization ? 4 : 3} />
                    {[[48,220],[110,186],[172,198],[234,142],[296,154],[358,94],[420,108],[496,55]].map((point,index)=><circle key={index} cx={point[0]} cy={point[1]} r={analysis ? 6 : 4} fill={analysis ? "var(--accent)" : "var(--data-2)"} />)}
                    <path d="M48 240H500M48 20V240" stroke="var(--dark-foreground)" strokeOpacity=".55" />
                  </svg>
                  <div className="mt-1 flex justify-between text-[8px] uppercase tracking-[0.1em] text-[var(--dark-muted-foreground)]"><span>sample sequence</span><span>signal</span></div>
                </div>
                <div className="rounded border border-[var(--secondary-200)] bg-[var(--background)] text-[var(--foreground)] p-2 sm:p-3">
                  <p className="text-[8px] uppercase tracking-[0.13em] text-[var(--dark-muted-foreground)]">Data table</p>
                  <div className="mt-3 space-y-2">{[["A","low","ref"],["B","mid","ref"],["C","high","ref"],["D","mid","ref"]].map(([label,n,score])=><div key={label} className="grid grid-cols-3 items-center gap-2 border-b border-[var(--secondary-200)] pb-2 text-[9px]"><span className="font-semibold">{label}</span><span className="text-[var(--muted-foreground)]">{n}</span><span className="text-right text-[var(--muted-foreground)]">{score}</span></div>)}</div>
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <div className="rounded border border-[var(--secondary-200)] bg-[var(--surface-muted)] p-2">
                      <p className="text-[7px] uppercase tracking-[0.12em] text-[var(--muted-foreground)]">Bar profile</p>
                      <svg viewBox="0 0 120 54" className="mt-1 h-12 w-full" role="img" aria-label="Illustrative bar chart">
                        {[18,31,24,40].map((height,index)=><rect key={index} x={8 + index * 27} y={48-height} width="14" height={height} rx="2" fill={index === 2 ? "var(--accent)" : "var(--data-6)"} />)}
                        <path d="M5 49H116" stroke="var(--secondary-300)" strokeWidth="1" />
                      </svg>
                    </div>
                    <div className="rounded border border-[var(--secondary-200)] bg-[var(--surface-muted)] p-2">
                      <p className="text-[7px] uppercase tracking-[0.12em] text-[var(--muted-foreground)]">Scatter profile</p>
                      <svg viewBox="0 0 120 54" className="mt-1 h-12 w-full" role="img" aria-label="Illustrative scatter plot">
                        <path d="M7 49H116M7 49V5" stroke="var(--secondary-300)" strokeWidth="1" />
                        {[[18,38],[32,30],[47,35],[61,22],[77,27],[92,15],[106,20]].map(([cx,cy],index)=><circle key={index} cx={cx} cy={cy} r="3" fill={index % 2 ? "var(--data-2)" : "var(--accent)"} />)}
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <aside className="grid grid-cols-3 gap-2 lg:grid-cols-1"><MetricCard label="Signal" value="Illustrative" accent="var(--data-2)" /><MetricCard label="Method" value="Structured" accent="var(--data-6)" /><MetricCard label="View" value={activeView} accent="var(--data-5)" /></aside>
          </div>
        </div>

        <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--dark-border)] pt-3"><div className="grid min-w-0 flex-1 grid-cols-3 gap-2 text-[8px] uppercase tracking-[0.12em] text-[var(--dark-muted-foreground)] sm:text-[9px]"><span>Research markers</span><span className="text-center">Methodology</span><span className="text-right">Data visualization</span></div><ShowcaseCTA href="/#global-presence" label="Explore Global Presence" tone="ochre" /></footer>
      </div>
    </SceneFrameShell>
  );
}

function MetricCard({ label, value, accent }: { label: string; value: string; accent: string }) {
  return <div className="rounded-[var(--radius-md)] border border-[var(--dark-border)] bg-[var(--dark-surface)] p-2.5 sm:p-3"><span className="block h-1 w-8 rounded-full" style={{ backgroundColor: accent }} /><span className="mt-3 block text-[8px] uppercase tracking-[0.13em] text-[var(--dark-muted-foreground)]">{label}</span><span className="mt-1 block truncate text-[10px] font-medium sm:text-xs">{value}</span></div>;
}
