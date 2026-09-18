import { notFound } from "next/navigation";
import { ArrowRight, ChevronDown, Menu, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";

function Section({ title, detail, children }: { title: string; detail: string; children: React.ReactNode }) {
  return (
    <section className="layout-section-sm border-b border-border">
      <Container>
        <div className="mb-5 flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
          <Heading level={2} className="font-semibold">{title}</Heading>
          <Text size="caption" className="text-muted-foreground">{detail}</Text>
        </div>
        {children}
      </Container>
    </section>
  );
}

const tokenRows = [
  ["Instant", "80ms", "Immediate feedback"],
  ["Fast", "140ms", "Links, hover, compact controls"],
  ["Normal", "220ms", "Most component state changes"],
  ["Slow", "360ms", "Larger state or layout response"],
  ["Reveal", "520ms", "Editorial content arrival / image response"],
];

export default function MotionPlaygroundPage() {
  if (process.env.NODE_ENV === "production") notFound();

  return (
    <main className="min-h-screen overflow-x-clip bg-background text-foreground">
      <header className="layout-section-lg">
        <Container size="wide">
          <p className="type-label text-muted-foreground">Development reference</p>
          <Heading level={1} className="type-measure-heading mt-3 font-semibold">Motion & interaction language</Heading>
          <Text size="lg" className="type-reading mt-5 text-muted-foreground">
            Motion is used to explain hierarchy, state, continuity, and arrival—not to decorate the interface.
            Interactions remain quiet enough that content stays in control.
          </Text>
        </Container>
      </header>

      <Section title="Motion tokens" detail="semantic timing and easing">
        <div className="overflow-x-auto border-y border-border">
          <table className="w-full min-w-[36rem] border-collapse text-left">
            <thead><tr className="border-b border-border">
              <th className="type-label py-3 pr-6 text-muted-foreground">Token</th>
              <th className="type-label px-6 py-3 text-muted-foreground">Value</th>
              <th className="type-label px-6 py-3 text-muted-foreground">Use</th>
            </tr></thead>
            <tbody>{tokenRows.map(([name, value, use]) => (
              <tr key={name} className="border-b border-border last:border-b-0">
                <th scope="row" className="type-body-sm py-4 pr-6 font-medium">{name}</th>
                <td className="px-6 py-4 font-mono text-sm">{value}</td>
                <td className="type-body-sm px-6 py-4 text-muted-foreground">{use}</td>
              </tr>
            ))}</tbody>
          </table>
        </div>
        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          <div className="border-t-2 border-primary pt-3"><p className="type-label text-muted-foreground">Standard</p><p className="mt-2 font-mono text-sm">cubic-bezier(0.2, 0, 0, 1)</p></div>
          <div className="border-t-2 border-primary pt-3"><p className="type-label text-muted-foreground">Emphasis</p><p className="mt-2 font-mono text-sm">cubic-bezier(0.16, 1, 0.3, 1)</p></div>
          <div className="border-t-2 border-primary pt-3"><p className="type-label text-muted-foreground">Distance</p><p className="mt-2 font-mono text-sm">4 / 10 / 20px</p></div>
        </div>
      </Section>

      <Section title="Button interaction" detail="state change without scale">
        <div className="flex flex-wrap gap-3">
          <Button>Primary action</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
        </div>
        <p className="type-caption mt-4 text-muted-foreground">Hover and active states use color, surface, and border transitions. The baseline button does not bounce, grow, glow, or rotate.</p>
      </Section>

      <Section title="Links & directional feedback" detail="small spatial cue">
        <div className="flex flex-wrap gap-8">
          <a href="#links" className="motion-underline text-primary underline decoration-primary/40 underline-offset-4 hover:decoration-primary">Editorial link</a>
          <a href="#links" className="group inline-flex items-center gap-2 text-primary">
            <span className="motion-underline underline decoration-primary/40 underline-offset-4 group-hover:decoration-primary">Explore the evidence</span>
            <ArrowRight size={16} aria-hidden="true" className="transition-transform duration-[var(--motion-fast)] group-hover:translate-x-1" />
          </a>
        </div>
      </Section>

      <Section title="Interactive cards" detail="border / surface response">
        <div className="grid gap-5 md:grid-cols-3">
          {["Research finding","Expert profile","Service pathway"].map((label) => (
            <a key={label} href="#cards" className="motion-interactive motion-lift group block rounded-[var(--radius-md)] border border-border bg-surface p-5 hover:border-primary/50 hover:bg-surface-highlight">
              <p className="type-label text-muted-foreground">{label}</p>
              <Heading level={3} className="mt-3 font-semibold">Quiet interaction</Heading>
              <Text size="sm" className="mt-2 text-muted-foreground">The card moves only enough to acknowledge pointer intent.</Text>
              <ArrowRight size={18} aria-hidden="true" className="mt-5 text-primary transition-transform duration-[var(--motion-fast)] group-hover:translate-x-1" />
            </a>
          ))}
        </div>
      </Section>

      <Section title="Image response" detail="controlled movement">
        <div className="group overflow-hidden rounded-[var(--radius-md)] border border-border bg-surface">
          <div className="motion-image aspect-[16/7] bg-primary p-5 text-primary-foreground">
            <p className="type-label text-primary-100">Editorial visual placeholder</p>
            <p className="type-h3 mt-3 max-w-xl font-semibold">Images may respond more slowly than UI controls.</p>
          </div>
        </div>
      </Section>

      <Section title="Content reveal" detail="progressive arrival">
        <div className="motion-stagger grid gap-4 md:grid-cols-3">
          {["Context","Evidence","Implication"].map((label) => (
            <div key={label} className="border-t-2 border-primary pt-4">
              <p className="type-label text-muted-foreground">{label}</p>
              <p className="type-body-lg mt-3">A restrained arrival can establish reading order without turning the page into a motion demo.</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Accordion / progressive disclosure" detail="native semantics">
        <div className="border-y border-border">
          <details className="group border-b border-border last:border-b-0">
            <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between py-4 font-medium [&::-webkit-details-marker]:hidden">
              <span>What should motion communicate?</span><ChevronDown size={18} aria-hidden="true" className="transition-transform duration-[var(--motion-normal)] group-open:rotate-180" />
            </summary>
            <p className="type-body-sm max-w-2xl pb-5 text-muted-foreground">Hierarchy, state, spatial relationship, continuity, navigation, progressive disclosure, or content arrival.</p>
          </details>
        </div>
      </Section>

      <Section title="Navigation feedback" detail="active state over animation">
        <div className="flex flex-wrap items-center gap-2 border-b border-border">
          <a href="#navigation" className="type-nav border-b-2 border-primary px-3 py-3 font-medium">Current</a>
          <a href="#navigation" className="type-nav px-3 py-3 text-muted-foreground hover:text-foreground transition-colors duration-[var(--motion-fast)]">Research</a>
          <button type="button" aria-label="Open menu" className="ml-2 inline-flex size-11 items-center justify-center border border-border hover:bg-surface-muted transition-colors duration-[var(--motion-fast)]"><Menu size={19} aria-hidden="true" /></button>
          <button type="button" aria-label="Search" className="inline-flex size-11 items-center justify-center hover:bg-surface-muted transition-colors duration-[var(--motion-fast)]"><Search size={19} aria-hidden="true" /></button>
        </div>
      </Section>

      <Section title="Loading / status philosophy" detail="reserved state language">
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="border border-border p-4"><p className="type-label text-muted-foreground">Loading</p><div className="mt-4 h-1 overflow-hidden bg-muted"><div className="h-full w-2/5 bg-primary" /></div></div>
          <div className="border border-success/40 bg-surface-highlight p-4"><p className="type-label text-success">Success</p><p className="type-body-sm mt-3">Confirmed without celebratory animation.</p></div>
          <div className="border border-error/40 bg-surface-muted p-4"><p className="type-label text-error">Error</p><p className="type-body-sm mt-3">Clear textual feedback with no attention-grabbing motion.</p></div>
        </div>
      </Section>

      <Section title="Reduced motion" detail="accessibility requirement">
        <div className="border-l-2 border-primary bg-surface-highlight px-5 py-4">
          <Text size="sm">
            When <code className="font-mono text-xs">prefers-reduced-motion: reduce</code> is active, decorative and transition-based movement is minimized,
            transforms are removed, and content remains immediately understandable.
          </Text>
        </div>
      </Section>

      <Section title="Motion boundaries" detail="what the system deliberately avoids">
        <div className="grid gap-x-8 gap-y-3 sm:grid-cols-2">
          {["Scroll-jacking","Parallax-heavy sections","Animated gradients","Particle fields","Floating blobs","3D transforms","Bouncing cards","Spinning UI","Excessive spring physics","Constant decorative movement"].map((item) => (
            <div key={item} className="flex items-center gap-3 border-b border-border py-3">
              <span className="size-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true" /><span className="type-body-sm">{item}</span>
            </div>
          ))}
        </div>
      </Section>
    </main>
  );
}
