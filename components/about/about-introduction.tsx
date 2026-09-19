import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { about } from "@/data/about";

export function AboutIntroduction() {
  return <section aria-labelledby="about-title" className="border-b border-border bg-background">
    <Container size="wide" className="py-10 sm:py-14 lg:py-16">
      <div className="grid gap-8 lg:grid-cols-12 lg:gap-x-8 xl:gap-x-12">
        <div className="lg:col-span-7 lg:col-start-2">
          <p className="type-label text-muted-foreground">The organization</p>
          <Heading id="about-title" level={1} className="mt-3 max-w-[18ch]">Bittumama</Heading>
          <p className="type-body-lg mt-5 max-w-[58ch]">{about.description}</p>
        </div>
        <div className="lg:col-span-3 lg:col-start-10 lg:self-end">
          <p className="type-label text-muted-foreground">Focus</p>
          <p className="type-body-sm mt-2 text-muted-foreground">{about.shortDescription}</p>
        </div>
      </div>
    </Container>
  </section>;
}
