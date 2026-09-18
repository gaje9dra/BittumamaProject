import { notFound } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";

export default function HeaderPlaygroundPage() {
  if (process.env.NODE_ENV === "production") notFound();

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Header />
      <section className="layout-section-lg">
        <Container size="wide">
          <p className="type-label text-muted-foreground">Development reference</p>
          <Heading level={1} className="type-measure-heading mt-3 font-semibold">Header & primary navigation</Heading>
          <Text size="lg" className="type-reading mt-5 text-muted-foreground">
            Production header validation surface. Resize the viewport to inspect desktop, tablet, mobile,
            keyboard focus, active navigation, menu behavior, and reduced-motion behavior.
          </Text>
          <div className="mt-12 grid gap-8 border-t border-border pt-8 md:grid-cols-2">
            <div>
              <p className="type-label text-muted-foreground">Structure</p>
              <ul className="type-body-sm mt-4 space-y-3">
                <li>Typographic temporary brand treatment</li>
                <li>Five primary navigation destinations</li>
                <li>Single contextual action</li>
                <li>Dedicated mobile navigation</li>
              </ul>
            </div>
            <div>
              <p className="type-label text-muted-foreground">States to test</p>
              <ul className="type-body-sm mt-4 space-y-3">
                <li>Default / hover / active / keyboard focus</li>
                <li>Mobile closed / open / Escape</li>
                <li>Long labels and narrow widths</li>
                <li>Reduced-motion preference</li>
              </ul>
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}
