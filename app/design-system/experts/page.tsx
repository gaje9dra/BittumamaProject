import { notFound } from "next/navigation";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { ExpertDirectory } from "@/components/experts/expert-directory";
import { ExpertiseIndex } from "@/components/experts/expertise-index";
import { ExpertsHero } from "@/components/experts/experts-hero";
import { ExpertDetailPage } from "@/components/experts/expert-detail-page";
import type { Expert } from "@/data/expertise";

const previewExperts: Expert[] = [
  {
    id: "preview-methodology",
    name: "Development Expert Preview",
    slug: "development-expert-preview",
    role: "Research Methodology",
    discipline: "Research",
    shortBio: "Development-only profile used to inspect people discovery and the profile hierarchy.",
    bio: "This profile is a development fixture. Production expert information is rendered only from verified canonical records.",
    expertise: ["Research methodology", "Study design"],
    qualifications: ["Development reference qualification"],
    researchInterests: ["Research methods"],
    serviceIds: ["research-methodology"],
    featured: true,
  },
  {
    id: "preview-analysis",
    name: "Analysis Expert Preview",
    slug: "analysis-expert-preview",
    role: "Data Analysis",
    discipline: "Analysis",
    shortBio: "Development-only profile for inspecting a second discipline and directory grouping.",
    expertise: ["Statistical analysis", "Data interpretation"],
    serviceIds: ["data-analysis"],
  },
];

export default function ExpertsPlaygroundPage() {
  if (process.env.NODE_ENV === "production") notFound();

  const disciplines = Array.from(
    new Set(previewExperts.map((expert) => expert.discipline).filter((value): value is string => Boolean(value))),
  );

  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="layout-section-sm border-b border-border">
        <Container size="wide">
          <p className="type-label text-muted-foreground">Development reference</p>
          <Heading level={1} className="mt-3">Experts</Heading>
          <p className="type-body-sm mt-3 max-w-[58ch] text-muted-foreground">
            Development-only preview for people discovery, discipline navigation, directory rows and an individual expertise profile. Preview people never enter the production dataset.
          </p>
        </Container>
      </section>
      <ExpertsHero />
      <ExpertiseIndex disciplines={disciplines} />
      <ExpertDirectory experts={previewExperts} disciplines={disciplines} />
      <section className="border-t border-border bg-surface-muted">
        <Container size="wide" className="layout-section-sm">
          <p className="type-label text-muted-foreground">Profile preview</p>
        </Container>
      </section>
      <ExpertDetailPage expert={previewExperts[0]} />
    </main>
  );
}
