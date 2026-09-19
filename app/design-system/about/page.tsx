import { notFound } from "next/navigation";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { AboutCta } from "@/components/about/about-cta";
import { AboutFocus } from "@/components/about/about-focus";
import { AboutIntroduction } from "@/components/about/about-introduction";
import { AboutPeople } from "@/components/about/about-people";
import { AboutPurpose } from "@/components/about/about-purpose";
import { AboutRelationships } from "@/components/about/about-relationships";
import { AboutApproach } from "@/components/about/about-approach";

export default function AboutPlaygroundPage() {
  if (process.env.NODE_ENV === "production") notFound();

  return <main className="min-h-screen bg-background text-foreground">
    <section className="border-b border-border">
      <Container size="wide" className="layout-section-sm">
        <p className="type-label text-muted-foreground">Development reference</p>
        <Heading level={1} className="mt-3">About / Organization</Heading>
        <p className="type-body-sm mt-3 max-w-[60ch] text-muted-foreground">
          Development-only inspection of the organization introduction, focus, purpose, approach, organizational relationships, verified people connection and final action.
        </p>
      </Container>
    </section>
    <AboutIntroduction />
    <AboutFocus />
    <AboutPurpose />
    <AboutApproach />
    <AboutRelationships />
    <AboutPeople />
    <AboutCta />
  </main>;
}
