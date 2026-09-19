import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { about } from "@/data/about";

export function AboutPurpose() {
  return <section aria-labelledby="about-purpose-title" className="border-b border-border bg-background">
    <Container size="reading" className="layout-section-lg">
      <p className="type-label text-muted-foreground">Purpose</p>
      <Heading id="about-purpose-title" level={2} className="mt-3 max-w-[20ch]">Why the organization exists.</Heading>
      <p className="type-body-lg mt-6 max-w-[62ch]">{about.purpose}</p>
    </Container>
  </section>;
}
