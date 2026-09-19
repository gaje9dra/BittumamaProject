import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { about } from "@/data/about";

export function AboutFocus() {
  return <section aria-labelledby="about-focus-title" className="border-b border-border bg-surface-muted">
    <Container size="wide" className="layout-section-lg">
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-x-8 xl:gap-x-12">
        <div className="lg:col-span-3">
          <p className="type-label text-muted-foreground">Organizational focus</p>
          <Heading id="about-focus-title" level={2} className="mt-3 max-w-[18ch]">The areas Bittumama brings together.</Heading>
        </div>
        <ol className="lg:col-span-8 lg:col-start-5">
          {about.focusAreas.map((area, index) => <li key={area.title} className="grid gap-3 border-t border-border py-5 sm:grid-cols-[3rem_minmax(9rem,.35fr)_minmax(0,1fr)] sm:gap-6">
            <span className="type-caption text-muted-foreground">{String(index + 1).padStart(2, "0")}</span>
            <Heading level={3}>{area.title}</Heading>
            <p className="type-body-sm max-w-[52ch] text-muted-foreground">{area.description}</p>
          </li>)}
        </ol>
      </div>
    </Container>
  </section>;
}
