import { Container } from "@/components/ui/container";
import { Heading, Text } from "@/components/ui/typography";

export function EventsIntroduction() {
  return (
    <section className="border-b border-border">
      <Container width="standard" className="py-12 sm:py-16">
        <div className="max-w-3xl">
          <p className="type-label text-primary">Workshops &amp; Events</p>
          <Heading as="h1" size="h2" className="mt-3 max-w-[24ch]">
            Learning sessions, workshops and research-focused events.
          </Heading>
          <Text size="large" className="mt-5 max-w-[62ch] text-muted-foreground">
            Discover workshops and events available through Bittumama.
          </Text>
        </div>
      </Container>
    </section>
  );
}
