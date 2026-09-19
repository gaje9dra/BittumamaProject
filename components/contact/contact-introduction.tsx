import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";

export function ContactIntroduction() {
  return (
    <section className="border-b border-border">
      <Container size="default" className="py-10 sm:py-14 lg:py-16">
        <div className="max-w-3xl">
          <p className="type-label text-primary">Contact / Enquiry</p>
          <Heading level={1} className="mt-3 max-w-[22ch]">
            Tell us what you are working on.
          </Heading>
          <p className="type-body-lg mt-4 max-w-[58ch] text-muted-foreground">
            Share your research or academic requirement and select the service context that best matches it.
          </p>
        </div>
      </Container>
    </section>
  );
}
