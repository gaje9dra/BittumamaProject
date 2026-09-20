import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { about } from "@/data/about";

export function AboutApproach() {
  return <section aria-labelledby="about-approach-title" className="border-b border-border bg-background">
    <Container size="wide" className="layout-section-lg">
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-x-8 xl:gap-x-12">
        <div className="lg:col-span-4">
          <p className="type-label text-muted-foreground">How the organization works</p>
          <Heading id="about-approach-title" level={2} className="mt-3 max-w-[18ch]">A structured approach to research work.</Heading>
        </div>
        <ol className="lg:col-span-7 lg:col-start-6">
          {about.approach.map((item, index) => <li key={item} className="grid grid-cols-[2.5rem_minmax(0,1fr)] gap-4 border-t border-border py-5">
            <span className="type-caption text-muted-foreground">{String(index + 1).padStart(2, "0")}</span>
            <p className="type-body-sm max-w-[55ch]">{item}</p>
          </li>)}
        </ol>
      </div>
    </Container>
  </section>;
}
