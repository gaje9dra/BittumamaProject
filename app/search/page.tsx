import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";

export default function SearchPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="layout-section-lg">
        <Container size="reading">
          <p className="type-label text-muted-foreground">Search</p>
          <Heading level={1} className="mt-3">Search foundation</Heading>
          <Text size="lg" className="mt-5 text-muted-foreground">
            Search is prepared for a future content implementation. There are no production results or search
            indexing connected in this phase.
          </Text>
          <Link
            href="/"
            className="mt-8 inline-flex min-h-11 items-center border border-border px-4 type-button text-foreground transition-colors hover:bg-surface-muted focus-visible:outline-2 focus-visible:outline-offset-3"
          >
            Return home
          </Link>
        </Container>
      </section>
    </main>
  );
}
