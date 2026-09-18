import { notFound } from "next/navigation";
import { ArrowRight, Check, ChevronDown, Search, Menu, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";

const border = "border border-border";
const field = "min-h-11 w-full rounded-[var(--radius-sm)] border border-input bg-surface px-3.5 text-sm outline-none transition-[border-color,box-shadow] placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/20 disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="layout-section-sm border-b border-border">
      <Container>
        <div className="mb-5">
          <p className="type-label text-muted-foreground">Component language</p>
          <Heading level={2} className="mt-2 font-semibold">{title}</Heading>
        </div>
        {children}
      </Container>
    </section>
  );
}

export default function ComponentPlaygroundPage() {
  if (process.env.NODE_ENV === "production") notFound();

  return (
    <main className="min-h-screen overflow-x-clip bg-background text-foreground">
      <header className="layout-section-lg">
        <Container size="wide">
          <p className="type-label text-muted-foreground">Development reference</p>
          <Heading level={1} className="type-measure-heading mt-3 font-semibold">Component visual language</Heading>
          <Text size="lg" className="type-reading mt-5 text-muted-foreground">
            A restrained component vocabulary for editorial, research, education, and service interfaces.
            Components share tokens and states without forcing every surface into the same shape.
          </Text>
        </Container>
      </header>

      <Section title="Buttons">
        <div className="flex flex-wrap items-center gap-3">
          <Button>Primary action</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="text">Text action <ArrowRight size={16} aria-hidden="true" /></Button>
          <Button disabled>Disabled</Button>
        </div>
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <Button size="sm">Small</Button><Button size="md">Medium</Button><Button size="lg">Large</Button>
          <Button><ArrowRight size={16} aria-hidden="true" /> Icon action</Button>
        </div>
      </Section>

      <Section title="Links">
        <div className="flex flex-wrap gap-x-8 gap-y-4 text-sm">
          <a className="text-primary underline decoration-primary/40 underline-offset-4 hover:decoration-primary focus-visible:outline-2" href="#links">Inline link</a>
          <a className="type-nav text-foreground hover:text-primary" href="#links">Navigation link</a>
          <a className="type-body-lg text-primary underline decoration-primary/30 underline-offset-4 hover:decoration-primary" href="#links">Editorial link</a>
          <a className="inline-flex items-center gap-2 font-medium text-primary hover:gap-3 transition-[gap] duration-200" href="#links">Read the research <ArrowRight size={16} aria-hidden="true" /></a>
          <a className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground" href="#links">External source <ExternalLink size={15} aria-hidden="true" /></a>
        </div>
      </Section>

      <Section title="Cards & open treatments">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          <article className={`${border} rounded-[var(--radius-md)] bg-surface p-5 transition-[border-color,background-color] duration-200 hover:border-primary/50 hover:bg-surface-highlight`}>
            <p className="type-label text-muted-foreground">Bordered card</p><Heading level={3} className="mt-3 font-semibold">A purposeful module</Heading>
            <Text size="sm" className="mt-2 text-muted-foreground">Used when grouping or comparison improves comprehension.</Text>
          </article>
          <article className="rounded-[var(--radius-md)] bg-surface-muted p-5">
            <p className="type-label text-muted-foreground">Surface card</p><Heading level={3} className="mt-3 font-semibold">Quiet elevation</Heading>
            <Text size="sm" className="mt-2 text-muted-foreground">Surface contrast can replace a border or shadow.</Text>
          </article>
          <a href="#cards" className={`${border} group block overflow-hidden rounded-[var(--radius-md)] bg-surface`}>
            <div className="aspect-[4/3] bg-primary p-5 text-primary-foreground"><p className="type-label text-primary-100">Image-led placeholder</p></div>
            <div className="p-5"><Heading level={3} className="font-semibold group-hover:text-primary">Interactive preview</Heading><Text size="sm" className="mt-2 text-muted-foreground">Arrow, underline, border, or image response is enough.</Text></div>
          </a>
        </div>
        <div className="mt-8 border-y border-border">
          {[["01","Open editorial block"],["02","Numbered research finding"],["03","Horizontal list item"]].map(([n,label]) => (
            <div key={n} className="flex items-center gap-5 border-b border-border py-5 last:border-b-0">
              <span className="font-mono text-xs text-muted-foreground">{n}</span><span className="type-body-lg">{label}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Badges & labels">
        <div className="flex flex-wrap items-center gap-3">
          <span className="type-label rounded-[var(--radius-sm)] bg-primary-50 px-2.5 py-1 text-primary-800">Research</span>
          <span className="type-label rounded-[var(--radius-sm)] bg-surface-muted px-2.5 py-1 text-secondary-800">Workshop</span>
          <span className="type-label rounded-[var(--radius-sm)] border border-border px-2.5 py-1 text-muted-foreground">Metadata</span>
          <span className="type-label rounded-[var(--radius-sm)] bg-surface-highlight px-2.5 py-1 text-primary-800">Published</span>
          <span className="type-label text-muted-foreground">Open editorial label</span>
        </div>
      </Section>

      <Section title="Inputs & form language">
        <form className="grid gap-6 lg:grid-cols-2" onSubmit={(event) => event.preventDefault()}>
          <label className="block"><span className="type-label text-muted-foreground">Name</span><input className={`${field} mt-2`} placeholder="Your name" /></label>
          <label className="block"><span className="type-label text-muted-foreground">Topic</span><select className={`${field} mt-2`} defaultValue=""><option value="" disabled>Select a topic</option><option>Research</option><option>Education</option></select></label>
          <label className="block lg:col-span-2"><span className="type-label text-muted-foreground">Message</span><textarea className={`${field} mt-2 min-h-36 py-3`} placeholder="Tell us what you are working on." /></label>
          <div className="space-y-3">
            <label className="flex min-h-11 items-center gap-3 text-sm"><input type="checkbox" className="size-4 accent-[var(--primary)]" /> Subscribe to updates</label>
            <label className="flex min-h-11 items-center gap-3 text-sm"><input type="radio" name="sample" className="size-4 accent-[var(--primary)]" defaultChecked /> Option A</label>
          </div>
          <div className="lg:text-right"><Button type="submit">Submit inquiry</Button></div>
          <div className="lg:col-span-2 grid gap-3 sm:grid-cols-2">
            <p className="type-body-sm border-l-2 border-error bg-surface-muted px-4 py-3 text-error">Error: Please provide a valid email address.</p>
            <p className="type-body-sm border-l-2 border-success bg-surface-muted px-4 py-3 text-success">Success: Your response has been received.</p>
          </div>
        </form>
      </Section>

      <Section title="Accordion / FAQ">
        <div className="border-y border-border">
          {[["What is the research approach?","A concise answer can expand beneath the question without turning each item into a floating card."],["How are services structured?","Service details can remain compact until the visitor requests more context."]].map(([q,a]) => (
            <details key={q} className="group border-b border-border last:border-b-0">
              <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-5 py-4 font-medium [&::-webkit-details-marker]:hidden">
                <span>{q}</span><ChevronDown size={18} aria-hidden="true" className="shrink-0 transition-transform group-open:rotate-180" />
              </summary>
              <p className="type-body-sm max-w-2xl pb-5 pr-8 text-muted-foreground">{a}</p>
            </details>
          ))}
        </div>
      </Section>

      <Section title="Tabs">
        <div role="tablist" aria-label="Sample tabs" className="flex max-w-full gap-6 overflow-x-auto border-b border-border">
          <button type="button" role="tab" aria-selected="true" className="min-h-11 shrink-0 border-b-2 border-primary px-1 type-nav font-medium text-foreground">Research</button>
          <button type="button" role="tab" aria-selected="false" className="min-h-11 shrink-0 border-b-2 border-transparent px-1 type-nav text-muted-foreground hover:text-foreground">Education</button>
          <button type="button" role="tab" aria-selected="false" className="min-h-11 shrink-0 border-b-2 border-transparent px-1 type-nav text-muted-foreground hover:text-foreground">Services</button>
        </div>
      </Section>

      <Section title="Navigation elements">
        <div className="flex flex-wrap items-center gap-3">
          <a href="#navigation" className="type-nav px-3 py-2 text-foreground hover:text-primary">Primary item</a>
          <button type="button" className="inline-flex min-h-10 items-center gap-2 px-3 type-nav text-foreground hover:bg-surface-muted"><span>Dropdown</span><ChevronDown size={16} aria-hidden="true" /></button>
          <a href="#navigation" className="block border border-border bg-surface px-4 py-3 text-sm hover:bg-surface-muted">Dropdown item</a>
          <button type="button" aria-label="Open menu" className="inline-flex size-11 items-center justify-center border border-border bg-surface hover:bg-surface-muted"><Menu size={19} aria-hidden="true" /></button>
          <a href="#navigation" className="type-body-sm text-primary underline underline-offset-4">Breadcrumb / Current</a>
        </div>
      </Section>

      <Section title="Iconography">
        <div className="flex flex-wrap items-center gap-8">
          <div><Search size={16} aria-hidden="true" /><p className="type-caption mt-2 text-muted-foreground">Small / 16</p></div>
          <div><Search size={20} aria-hidden="true" /><p className="type-caption mt-2 text-muted-foreground">Default / 20</p></div>
          <div><Search size={24} aria-hidden="true" /><p className="type-caption mt-2 text-muted-foreground">Large / 24</p></div>
          <div className="flex items-center gap-2"><Check size={20} strokeWidth={1.75} aria-hidden="true" /><span className="type-body-sm">1.75px baseline stroke</span></div>
        </div>
      </Section>

      <Section title="Images & dividers">
        <div className="grid gap-5 md:grid-cols-2">
          <div className="overflow-hidden rounded-[var(--radius-md)] bg-surface-muted">
            <div className="aspect-[4/3] bg-primary p-5 text-primary-foreground"><p className="type-label text-primary-100">Editorial crop</p></div>
          </div>
          <div className="border border-border bg-surface p-5">
            <p className="type-label text-muted-foreground">Framed image</p>
            <div className="mt-4 aspect-video bg-surface-highlight" />
          </div>
        </div>
        <div className="mt-8 space-y-6">
          <div><p className="type-caption mb-2 text-muted-foreground">Horizontal divider</p><div className="h-px bg-border" /></div>
          <div className="flex min-h-20"><div className="w-px bg-border" /><div className="px-5"><p className="type-caption text-muted-foreground">Vertical divider</p></div></div>
        </div>
      </Section>

      <Section title="Tables & research data">
        <div className="overflow-x-auto border-y border-border">
          <table className="w-full min-w-[38rem] border-collapse text-left">
            <caption className="sr-only">Research metrics sample</caption>
            <thead><tr className="border-b border-border"><th scope="col" className="type-label py-3 pr-5 text-muted-foreground">Measure</th><th scope="col" className="type-label px-5 py-3 text-muted-foreground">Value</th><th scope="col" className="type-label px-5 py-3 text-muted-foreground">Context</th></tr></thead>
            <tbody>{[["Participants","1,240","Study cohort"],["Completion","82%","2026 cycle"],["Response time","4.8 min","Median"]].map(([a,b,c]) => <tr key={a} className="border-b border-border last:border-b-0"><th scope="row" className="type-body-sm py-4 pr-5 font-medium">{a}</th><td className="px-5 py-4 font-mono text-sm">{b}</td><td className="type-body-sm px-5 py-4 text-muted-foreground">{c}</td></tr>)}</tbody>
          </table>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {["42.8","1,240","82%"].map((value) => <div key={value} className="border-t-2 border-primary pt-3"><p className="font-display text-4xl font-semibold tracking-tight">{value}</p><p className="type-caption mt-1 text-muted-foreground">Metric with context/source</p></div>)}
        </div>
      </Section>

      <Section title="CTA hierarchy & component states">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_.8fr]">
          <div>
            <p className="type-label text-muted-foreground">Primary CTA</p><div className="mt-3 flex flex-wrap gap-3"><Button>Start a conversation</Button><Button variant="outline">Explore research</Button></div>
            <a href="#cta" className="mt-5 inline-flex items-center gap-2 text-primary underline decoration-primary/40 underline-offset-4">Inline CTA <ArrowRight size={16} aria-hidden="true" /></a>
          </div>
          <div className="space-y-3">
            <div className="border border-border bg-surface p-4"><p className="type-label text-muted-foreground">Default / Hover / Focus / Active</p><p className="type-body-sm mt-2 text-muted-foreground">State changes should be clear through surface, border, underline, and focus treatment.</p></div>
            <div className="border border-border bg-muted p-4 text-muted-foreground"><p className="type-label">Disabled</p><p className="type-body-sm mt-2">Use muted treatment plus non-color cues.</p></div>
          </div>
        </div>
      </Section>
    </main>
  );
}
