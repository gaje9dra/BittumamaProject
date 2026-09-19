import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import type { ResearchEntry } from "@/data/research";

function SectionIntro({ children }: { children?: string }) {
  if (!children) return null;
  return <p className="type-body-lg max-w-[60ch] text-muted-foreground">{children}</p>;
}

export function ResearchDetailOverview({ research }: { research: ResearchEntry }) {
  if (!research.summary) return null;
  return (
    <section id="research-overview" aria-labelledby="research-overview-title" className="bg-background scroll-anchor">
      <Container size="reading" className="layout-section-lg">
        <p className="type-label text-muted-foreground">Quick overview</p>
        <Heading id="research-overview-title" level={2} className="mt-4 max-w-[22ch]">What this research covers.</Heading>
        <p className="type-body-lg mt-6 max-w-[60ch]">{research.summary}</p>
      </Container>
    </section>
  );
}

export function ResearchDetailScope({ research }: { research: ResearchEntry }) {
  if (!research.scope?.length) return null;
  return (
    <section id="research-scope" aria-labelledby="research-scope-title" className="bg-surface-muted scroll-anchor">
      <Container size="wide" className="layout-section-lg">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-x-8 xl:gap-x-12">
          <div className="lg:col-span-4">
            <p className="type-label text-muted-foreground">Scope</p>
            <Heading id="research-scope-title" level={2} className="mt-4 max-w-[18ch]">What it covers.</Heading>
          </div>
          <ol className="border-t border-border lg:col-span-8 lg:col-start-5">
            {research.scope.map((item, index) => (
              <li key={`${item.title}-${index}`} className="grid gap-3 border-b border-border py-6 sm:grid-cols-[3rem_minmax(0,1fr)] sm:gap-6">
                <span className="type-caption text-muted-foreground">{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <Heading level={3} className="max-w-[28ch]">{item.title}</Heading>
                  <p className="type-body-sm mt-2 max-w-[58ch] text-muted-foreground">{item.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </Container>
    </section>
  );
}

export function ResearchDetailTopics({ research }: { research: ResearchEntry }) {
  if (!research.topics?.length) return null;
  return (
    <section id="research-themes" aria-labelledby="research-themes-title" className="bg-background scroll-anchor">
      <Container size="wide" className="layout-section-lg">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-x-8 xl:gap-x-12">
          <div className="lg:col-span-4">
            <p className="type-label text-muted-foreground">Research themes</p>
            <Heading id="research-themes-title" level={2} className="mt-4 max-w-[18ch]">Key areas of the research.</Heading>
          </div>
          <ol className="border-t border-border lg:col-span-8 lg:col-start-5">
            {research.topics.map((item, index) => (
              <li key={`${item.title}-${index}`} className="grid gap-3 border-b border-border py-5 sm:grid-cols-[3rem_minmax(0,1fr)] sm:gap-6">
                <span className="type-caption text-muted-foreground">{String(index + 1).padStart(2, "0")}</span>
                <div className="grid gap-1 sm:grid-cols-[minmax(10rem,0.55fr)_minmax(0,1fr)] sm:gap-6">
                  <Heading level={3} className="max-w-[22ch]">{item.title}</Heading>
                  <p className="type-body-sm text-muted-foreground">{item.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </Container>
    </section>
  );
}

export function ResearchDetailHighlights({ research }: { research: ResearchEntry }) {
  if (!research.highlights?.length) return null;
  return (
    <section id="research-highlights" aria-labelledby="research-highlights-title" className="bg-surface-highlight scroll-anchor">
      <Container size="reading" className="layout-section-lg">
        <p className="type-label text-muted-foreground">Key highlights</p>
        <Heading id="research-highlights-title" level={2} className="mt-4 max-w-[22ch]">Points to keep in view.</Heading>
        <ul className="mt-8 border-t border-border">
          {research.highlights.map((highlight, index) => (
            <li key={`${highlight}-${index}`} className="grid gap-3 border-b border-border py-5 sm:grid-cols-[3rem_minmax(0,1fr)] sm:gap-6">
              <span className="type-caption text-muted-foreground">{String(index + 1).padStart(2, "0")}</span>
              <p className="type-body">{highlight}</p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

export function ResearchDetailMethodology({ research }: { research: ResearchEntry }) {
  if (!research.methodology) return null;
  const { approach, methods, sources, framework } = research.methodology;
  return (
    <section id="research-methodology" aria-labelledby="research-methodology-title" className="bg-surface-muted scroll-anchor">
      <Container size="wide" className="layout-section-lg">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-x-8 xl:gap-x-12">
          <div className="lg:col-span-4">
            <p className="type-label text-muted-foreground">Methodology / approach</p>
            <Heading id="research-methodology-title" level={2} className="mt-4 max-w-[18ch]">How the research is structured.</Heading>
          </div>
          <div className="lg:col-span-8 lg:col-start-5">
            <p className="type-body-lg max-w-[60ch]">{approach}</p>
            {framework && <div className="mt-8 border-t border-border pt-6"><p className="type-label text-muted-foreground">Framework</p><p className="type-body-sm mt-3 max-w-[60ch]">{framework}</p></div>}
            {methods?.length ? <div className="mt-8 border-t border-border pt-6"><p className="type-label text-muted-foreground">Methods</p><ul className="mt-3 space-y-2">{methods.map((method) => <li key={method} className="type-body-sm">{method}</li>)}</ul></div> : null}
            {sources?.length ? <div className="mt-8 border-t border-border pt-6"><p className="type-label text-muted-foreground">Sources</p><ul className="mt-3 space-y-2">{sources.map((source) => <li key={source} className="type-body-sm">{source}</li>)}</ul></div> : null}
          </div>
        </div>
      </Container>
    </section>
  );
}

export function ResearchDetailAudience({ research }: { research: ResearchEntry }) {
  if (!research.audience?.length) return null;
  return (
    <section id="research-relevance" aria-labelledby="research-relevance-title" className="bg-background scroll-anchor">
      <Container size="wide" className="layout-section-lg">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-x-8 xl:gap-x-12">
          <div className="lg:col-span-4">
            <p className="type-label text-muted-foreground">Relevance</p>
            <Heading id="research-relevance-title" level={2} className="mt-4 max-w-[18ch]">Who this research is relevant to.</Heading>
          </div>
          <ul className="border-t border-border lg:col-span-8 lg:col-start-5">
            {research.audience.map((item) => <li key={item} className="type-body-sm border-b border-border py-5">{item}</li>)}
          </ul>
        </div>
      </Container>
    </section>
  );
}

export function ResearchDetailContent({ research }: { research: ResearchEntry }) {
  if (!research.sections?.length) return null;
  return (
    <section id="research-sections" aria-labelledby="research-content-title" className="bg-surface-muted scroll-anchor">
      <Container size="reading" className="layout-section-lg">
        <p className="type-label text-muted-foreground">Research content</p>
        <Heading id="research-content-title" level={2} className="mt-4 max-w-[22ch]">Main research sections.</Heading>
        <div className="mt-10 space-y-14">
          {research.sections.map((item, index) => {
            const headingId = `research-section-${item.id}`;
            return (
              <section key={item.id} id={headingId} aria-labelledby={headingId} className="scroll-anchor">
                <div className="grid gap-5 sm:grid-cols-[3rem_minmax(0,1fr)] sm:gap-6">
                  <span className="type-caption text-muted-foreground">{String(index + 1).padStart(2, "0")}</span>
                  <div>
                    <Heading id={headingId} level={3}>{item.title}</Heading>
                    <SectionIntro>{item.intro}</SectionIntro>
                    <p className={`type-body ${item.intro ? "mt-5" : "mt-4"} whitespace-pre-line`}>{item.content}</p>
                    {item.keyPoints?.length ? (
                      <ul className="mt-6 border-t border-border">
                        {item.keyPoints.map((point) => <li key={point} className="type-body-sm border-b border-border py-4">{point}</li>)}
                      </ul>
                    ) : null}
                  </div>
                </div>
              </section>
            );
          })}
        </div>
      </Container>
    </section>
  );
}

function contentNavigationItems(research: ResearchEntry) {
  const items: Array<{ id: string; label: string }> = [];
  if (research.summary) items.push({ id: "research-overview", label: "Overview" });
  if (research.scope?.length) items.push({ id: "research-scope", label: "Scope" });
  if (research.topics?.length) items.push({ id: "research-themes", label: "Research themes" });
  if (research.sections?.length) items.push({ id: "research-sections", label: "Research sections" });
  if (research.methodology) items.push({ id: "research-methodology", label: "Methodology" });
  if (research.audience?.length) items.push({ id: "research-relevance", label: "Relevance" });
  if (research.highlights?.length) items.push({ id: "research-highlights", label: "Highlights" });
  return items;
}

export function ResearchContents({ research }: { research: ResearchEntry }) {
  const items = contentNavigationItems(research);
  const longEnough = items.length >= 4 || (research.sections?.reduce((total, section) => total + section.content.length, 0) ?? 0) > 1800);
  if (!longEnough) return null;

  return (
    <nav aria-label="On this page" className="border-y border-border bg-background scroll-anchor">
      <Container size="wide" className="py-5">
        <div className="flex gap-5 overflow-x-auto">
          <span className="type-label shrink-0 text-muted-foreground">On this page</span>
          <ol className="flex min-w-max gap-5">
            {items.map((item, index) => (
              <li key={item.id}>
                <a href={`#${item.id}`} className="type-body-sm whitespace-nowrap underline decoration-border underline-offset-4 transition-colors duration-[var(--motion-fast)] hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2">
                  <span className="text-muted-foreground">{String(index + 1).padStart(2, "0")} </span>{item.label}
                </a>
              </li>
            ))}
          </ol>
        </div>
      </Container>
    </nav>
  );
}
