import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";

export function ContactIntroduction() {
  return (
    <section className="border-b border-border">
      <Container width="standard" className="py-10 sm:py-14">
        <div className="max-w-3xl">
          <p className="type-label text-primary">Contact / Enquiry</p>
          <Heading as="h1" size="h2" className="mt-3 max-w-[22ch]">
            Tell us what you are working on.
          </Heading>
          <p className="type-body-large mt-4 max-w-[58ch] text-muted-foreground">
            Share your research or academic requirement and select the service context that best matches it.
          </p>
        </div>
      </Container>
    </section>
  );
}
