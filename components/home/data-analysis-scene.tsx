"use client";

import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { SceneFrameShell, ShowcaseCTA } from "./coded-showcase-frame";

const views = ["Overview", "Analysis", "Visualization"] as const;
type View = (typeof views)[number];

const points = [[48,220],[110,188],[172,198],[234,144],[296,154],[358,94],[420,108],[496,54]] as const;

export function DataAnalysisScene() {
  const [activeView, setActiveView] = useState<View>("Overview");
  const analysis = activeView === "Analysis";
  const visualization = activeView === "Visualization";

  return (
    <SceneFrameShell>
      <div className="flex h-full flex-col gap-4 sm:gap-5">
        <header className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-[8px] font-semibold uppercase tracking-[0.18em] text-[var(--secondary-300)] sm:text-[9px]"><span className="h-1.5 w-1.5 rounded-full bg-[var(--data-5)]" /> Research analysis lab</div>
            <h2 className="mt-1 font-[var(--font-display-family)] text-lg sm:text-2xl lg:text-3xl">Data · analysis · visualization</h2>
          </div>
          <div className="hidden text-right text-[8px] uppercase tracking-[0.15em] text-[var(--dark-muted-foreground)] sm:block">Evidence system / 07<br /><span className="text-[var(--data-5)]">Illustrative only</span></div>
        </header>

        <div className="flex min-h-0 flex-1 flex-col gap-3">
          <div className="flex items-center justify-between gap-3 border-y border-[var(--dark-border)] py-2">
            <div className="flex items-center gap-2 text-[8px] uppercase tracking-[0.14em] text-[var(--dark-muted-foreground)]"><span className="h-1.5 w-1.5 rounded-full bg-[var(--data-2)]" /> Analytical view</div>
            <div className="flex border border-[var(--dark-border)] bg-[var(--primary-950)] p-1" role="tablist" aria-label="Analysis views">
              {views.map((view) => <button key={view} type="button" role="tab" aria-selected={activeView === view} aria-controls="showcase-analysis-panel" onClick={() => setActiveView(view)} className={cn("min-h-11 px-3 text-[8px] font-semibold uppercase tracking-[0.1em] transition-colors sm:px-4 sm:text-[9px]", activeView === view ? "bg-[var(--secondary-200)] text-[var(--primary-950)]" : "text-[var(--dark-muted-foreground)] hover:text-[var(--dark-foreground)]")}>{view}</button>)}
            </div>
          </div>

          <div id="showcase-analysis-panel" role="tabpanel" aria-label={activeView + " analysis view"} className="min-h-0 flex-1">
            <div className="grid h-full min-h-0 gap-3 lg:grid-cols-[1.7fr_.75fr]">
              <div className="relative min-h-0 overflow-hidden border border-[var(--dark-border)] bg-[var(--primary-950)] p-3 sm:p-5">
                <div aria-hidden="true" className="absolute right-4 top-4 h-24 w-24 rounded-full border border-[var(--data-2)]/20 sm:right-8 sm:top-8 sm:h-36 sm:w-36" />
                <div className="relative flex h-full min-h-0 flex-col">
                  <div className="flex items-end justify-between gap-3">
                    <div><p className="text-[7px] uppercase tracking-[0.15em] text-[var(--dark-muted-foreground)]">Illustrative signal</p><p className="mt-1 text-xs font-medium sm:text-sm">Evidence distribution</p></div>
                    <div className="flex items-center gap-2 text-[7px] uppercase tracking-[0.12em] text-[var(--dark-muted-foreground)]"><span className="h-1.5 w-1.5 rounded-full bg-[var(--data-2)]" /> signal <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" /> emphasis</div>
                  </div>

                  <div className="mt-3 min-h-0 flex-1 border border-[var(--secondary-200)] bg-[var(--background)] p-2 text-[var(--foreground)] sm:p-4">
                    <svg viewBox="0 0 520 280" className="h-full min-h-[145px] w-full" role="img" aria-label="Illustrative research signal line chart">
                      <g stroke="var(--secondary-200)" strokeWidth="1">{[40,90,140,190,240].map((y) => <line key={y} x1="48" y1={y} x2="500" y2={y} />)}{[48,160,272,384,496].map((x) => <line key={x} x1={x} y1="20" x2={x} y2="240" />)}</g>
                      <g style={{ transform: analysis ? "scaleY(1.035)" : visualization ? "scaleY(.98)" : "scaleY(1)", transformOrigin: "50% 50%", transition: "transform 500ms var(--motion-ease-standard)" }}>
                        <path d="M48 220 L110 188 L172 198 L234 144 L296 154 L358 94 L420 108 L496 54" fill="none" stroke={visualization ? "var(--data-5)" : "var(--data-2)"} strokeWidth={visualization ? 4 : 3} />
                        {points.map((point,index) => <circle key={index} cx={point[0]} cy={point[1]} r={analysis ? 6 : 4} fill={analysis ? "var(--accent)" : index % 3 === 0 ? "var(--data-5)" : "var(--data-2)"} />)}
                      </g>
                      <path d="M48 240H500M48 20V240" stroke="var(--primary-700)" strokeWidth="2" />
                    </svg>
                    <div className="mt-1 flex justify-between text-[7px] uppercase tracking-[0.1em] text-[var(--muted-foreground)]"><span>sample sequence</span><span>signal</span></div>
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {[["01","Bar profile","var(--data-6)"],["02","Scatter","var(--accent)"],["03","Evidence","var(--data-2)"],["04","Method","var(--data-5)"]].map(([id,label,color]) => <div key={id} className="border border-[var(--dark-border)] bg-[var(--dark-surface)] p-2"><span className="text-[7px] text-[var(--dark-muted-foreground)]">{id}</span><span className="mt-1 block truncate text-[8px] uppercase tracking-[0.1em]">{label}</span><span className="mt-2 block h-0.5 w-8" style={{ backgroundColor: color }} /></div>)}
                  </div>
                </div>
              </div>

              <aside className="grid grid-cols-3 gap-2 lg:grid-cols-1">
                <DataPanel label="Data table" accent="var(--data-2)">
                  <div className="space-y-2">{[["A","low","ref"],["B","mid","ref"],["C","high","ref"],["D","mid","ref"]].map(([label,level,ref]) => <div key={label} className="grid grid-cols-3 border-b border-[var(--dark-border)] pb-2 text-[8px]"><span>{label}</span><span className="text-[var(--dark-muted-foreground)]">{level}</span><span className="text-right text-[var(--dark-muted-foreground)]">{ref}</span></div>)}</div>
                </DataPanel>
                <DataPanel label="Bar profile" accent="var(--data-5)">
                  <svg viewBox="0 0 150 70" className="h-full min-h-14 w-full" role="img" aria-label="Illustrative bar chart"><path d="M8 62H142" stroke="var(--dark-border)" />{[22,39,28,51,34].map((height,index) => <rect key={index} x={12 + index * 26} y={62-height} width="14" height={height} fill={index === 3 ? "var(--accent)" : "var(--data-6)"} />)}</svg>
                </DataPanel>
                <DataPanel label="Scatter profile" accent="var(--accent)">
                  <svg viewBox="0 0 150 70" className="h-full min-h-14 w-full" role="img" aria-label="Illustrative scatter plot"><path d="M8 62H142M8 62V8" stroke="var(--dark-border)" />{[[20,48],[38,37],[57,43],[76,26],[95,32],[116,17],[132,24]].map(([cx,cy],index) => <circle key={index} cx={cx} cy={cy} r="3.5" fill={index % 2 ? "var(--data-2)" : "var(--accent)"} />)}</svg>
                </DataPanel>
              </aside>
            </div>
          </div>
        </div>

        <footer className="flex items-center justify-between gap-4 border-t border-[var(--dark-border)] pt-3">
          <div className="min-w-0 text-[8px] uppercase tracking-[0.14em] text-[var(--dark-muted-foreground)] sm:text-[9px]"><span className="text-[var(--data-5)]">VIEW</span> · {activeView} · illustrative analytical system</div>
          <ShowcaseCTA href="/#global-presence" label="Explore Global Presence" tone="ochre" />
        </footer>
      </div>
    </SceneFrameShell>
  );
}

function DataPanel({ label, accent, children }: { label: string; accent: string; children: ReactNode }) {
  return (
    <div className="min-h-0 overflow-hidden border border-[var(--dark-border)] bg-[var(--dark-surface)] p-2.5 sm:p-3">
      <div className="mb-2 flex items-center gap-2 text-[7px] font-semibold uppercase tracking-[0.13em] text-[var(--dark-muted-foreground)]"><span className="h-1.5 w-5" style={{ backgroundColor: accent }} />{label}</div>
      <div className="h-[calc(100%-1.25rem)] min-h-0">{children}</div>
    </div>
  );
}
