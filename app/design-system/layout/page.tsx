import { notFound } from "next/navigation";
import { Container } from "@/components/ui/container";

const box = "border border-border bg-surface p-4 sm:p-5";
const labels = {
  grid: "type-label text-muted-foreground",
};

function Sample({ title, detail, children }: { title: string; detail: string; children: React.ReactNode }) {
  return (
    <section className="layout-section-sm border-b border-border">
      <Container>
        <div className="mb-5 flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
          <h2 className="type-h4 font-semibold">{title}</h2>
          <p className="type-caption text-muted-foreground">{detail}</p>
        </div>
        {children}
      </Container>
    </section>
  );
}

export default function LayoutPlaygroundPage() {
  if (process.env.NODE_ENV === "production") notFound();

  return (
    <main className="min-h-screen overflow-x-clip bg-background text-foreground">
      <header className="layout-section-lg">
        <Container size="wide">
          <p className={labels.grid}>Development reference</p>
          <h1 className="type-h1 type-measure-heading mt-3 font-semibold">Layout, grid & spacing</h1>
          <p className="type-body-lg type-reading mt-5 text-muted-foreground">
            A structural playground for validating containers, editorial composition, rhythm,
            density, responsive behavior, and controlled asymmetry before production pages exist.
          </p>
        </Container>
      </header>

      <Sample title="Container system" detail="full / wide / standard / narrow / reading">
        <div className="space-y-3">
          {[
            ["Wide", "var(--container-wide)"],
            ["Standard", "var(--container-content)"],
            ["Narrow", "var(--container-narrow)"],
            ["Reading", "68ch"],
            ["Full", "100%"],
          ].map(([name, width]) => (
            <div key={name} className="border border-border bg-surface">
              <div className="bg-surface-highlight px-4 py-4">
                <span className="type-body-sm font-medium">{name}</span>
                <span className="ml-3 font-mono text-xs text-muted-foreground">{width}</span>
              </div>
            </div>
          ))}
        </div>
      </Sample>

      <Sample title="Grid foundation" detail="1 / 2 / 3 / 4 / 6 / 12 columns">
        <div className="space-y-6">
          {([
            ["2 columns", "layout-grid-2", 2],
            ["3 columns", "layout-grid-3", 3],
            ["4 columns", "layout-grid-4", 4],
            ["6 columns", "layout-grid-6", 6],
            ["12 columns", "layout-grid-12", 12],
          ] as const).map(([name, grid, count]) => (
            <div key={name}>
              <p className="type-caption mb-2 text-muted-foreground">{name}</p>
              <div className={`layout-grid ${grid}`}>
                {Array.from({ length: grid === "layout-grid-12" ? 12 : count }).map((_, index) => (
                  <div key={index} className={`${box} min-h-14`}>
                    <span className="font-mono text-xs text-muted-foreground">{String(index + 1).padStart(2, "0")}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Sample>

      <Sample title="Editorial composition" detail="label + statement + supporting copy">
        <div className="layout-editorial items-start">
          <p className={labels.grid}>01 / Research signal</p>
          <div className="layout-overflow-safe">
            <h3 className="type-h2 type-measure-section font-semibold">A large statement can carry the page without a card grid.</h3>
            <p className="type-body-lg type-reading mt-5 text-muted-foreground">
              Supporting information remains readable while the editorial rail creates hierarchy and rhythm.
            </p>
          </div>
        </div>
      </Sample>

      <Sample title="Controlled asymmetry" detail="40 / 60 and 60 / 40">
        <div className="space-y-6">
          <div className="layout-asym-40-60">
            <div className={box}><p className={labels.grid}>Text / 40%</p><p className="type-body-lg mt-3">Context, methodology, or a concise editorial statement.</p></div>
            <div className="min-h-40 border border-border bg-surface-muted p-5"><p className={labels.grid}>Visual / 60%</p></div>
          </div>
          <div className="layout-asym-60-40">
            <div className="min-h-40 border border-border bg-surface-muted p-5"><p className={labels.grid}>Visual / 60%</p></div>
            <div className={box}><p className={labels.grid}>Text / 40%</p><p className="type-body-lg mt-3">A reversed rhythm for visual variety.</p></div>
          </div>
        </div>
      </Sample>

      <Sample title="Section widths & rhythm" detail="small / standard / large / major">
        <div className="overflow-x-auto border border-border">
          <div className="min-w-[34rem] divide-y divide-border">
            {[
              ["Small", "2rem", "Compact supporting zone"],
              ["Standard", "3rem", "Normal content section"],
              ["Large", "5rem", "Editorial breathing room"],
              ["Major", "6–9rem", "Major visual transition"],
            ].map(([name, space, use]) => (
              <div key={name} className="grid grid-cols-[8rem_8rem_1fr] items-center p-4">
                <span className="type-body-sm font-medium">{name}</span>
                <span className="font-mono text-xs text-muted-foreground">{space}</span>
                <span className="type-body-sm text-muted-foreground">{use}</span>
              </div>
            ))}
          </div>
        </div>
      </Sample>

      <Sample title="Content density" detail="compact / standard / editorial / immersive">
        <div className="grid gap-4 sm:grid-cols-2">
          {[
            ["Compact", "Dense metadata, controls, lists, or utility content."],
            ["Standard", "Balanced information for service and general content."],
            ["Editorial", "More whitespace around significant statements and evidence."],
            ["Immersive", "Large visual compositions with minimal competing information."],
          ].map(([name, copy]) => (
            <div key={name} className={box}>
              <p className={labels.grid}>{name}</p>
              <p className="type-body-sm mt-3 text-muted-foreground">{copy}</p>
            </div>
          ))}
        </div>
      </Sample>

      <Sample title="Open layouts & card strategy" detail="cards are optional, not default">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_.8fr]">
          <div className="border-y border-border">
            {["Editorial list item", "Numbered research finding", "Horizontal metadata row", "Open content block"].map((item, index) => (
              <div key={item} className="flex items-center gap-5 border-b border-border py-5 last:border-b-0">
                <span className="font-mono text-xs text-muted-foreground">{String(index + 1).padStart(2, "0")}</span>
                <span className="type-body-lg">{item}</span>
              </div>
            ))}
          </div>
          <div className={box}>
            <p className={labels.grid}>Card / when useful</p>
            <p className="type-body-sm mt-3 text-muted-foreground">Use for comparison, grouping, selection, interaction, or preview—not simply to wrap every paragraph.</p>
          </div>
        </div>
      </Sample>

      <Sample title="Image composition" detail="full bleed / contained / portrait / landscape / offset">
        <div className="grid gap-4 md:grid-cols-12">
          <div className="min-h-44 border border-border bg-primary md:col-span-7 p-5 text-primary-foreground"><p className={labels.grid}>Full / wide visual</p></div>
          <div className="min-h-44 border border-border bg-surface-muted p-5 md:col-span-5"><p className={labels.grid}>Contained / portrait</p></div>
          <div className="min-h-32 border border-border bg-surface-highlight p-5 md:col-span-4 md:col-start-3"><p className={labels.grid}>Offset image</p></div>
          <div className="min-h-32 border border-border bg-surface p-5 md:col-span-6"><p className={labels.grid}>Landscape / editorial crop</p></div>
        </div>
      </Sample>

      <Sample title="Reading width" detail="66–68ch">
        <article className="layout-reading">
          <p className={labels.grid}>Article measure</p>
          <h3 className="type-h3 mt-3 font-semibold">Long-form content needs a different spatial contract.</h3>
          <p className="type-body-lg mt-5 text-muted-foreground">
            This reading column deliberately avoids the width of a marketing grid. Subheadings,
            lists, figures, references, and quotations can sit within or intentionally extend beyond
            the reading measure when their structure requires it.
          </p>
        </article>
      </Sample>

      <Sample title="Full-width transition" detail="viewport-wide visual zone">
        <div className="-mx-[var(--page-gutter)] bg-dark-background px-[var(--page-gutter)] py-12 text-dark-foreground sm:py-16">
          <Container size="wide" className="px-0">
            <p className="type-label text-[var(--dark-muted-foreground)]">Full bleed zone</p>
            <p className="type-h3 mt-3 max-w-2xl font-semibold text-[var(--dark-foreground)]">Use full width when the visual or evidence genuinely benefits from it.</p>
          </Container>
        </div>
      </Sample>

      <Sample title="Responsive stacking" detail="desktop relationship → mobile priority">
        <div className="layout-editorial items-stretch">
          <div className="border border-border bg-surface p-5"><p className={labels.grid}>Priority content</p><p className="type-body-lg mt-3">Text remains first when comprehension depends on it.</p></div>
          <div className="min-h-48 border border-border bg-surface-muted p-5"><p className={labels.grid}>Secondary visual</p></div>
        </div>
        <p className="type-caption mt-4 text-muted-foreground">Complex layouts may reverse this order when the visual is the primary information source. Mobile order is content-led, not mechanically inherited.</p>
      </Sample>
    </main>
  );
}
