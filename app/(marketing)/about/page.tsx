import type { Metadata } from "next";
import { AboutCta } from "@/components/about/about-cta";
import { AboutFocus } from "@/components/about/about-focus";
import { AboutIntroduction } from "@/components/about/about-introduction";
import { AboutPeople } from "@/components/about/about-people";
import { AboutPurpose } from "@/components/about/about-purpose";
import { AboutRelationships } from "@/components/about/about-relationships";
import { AboutApproach } from "@/components/about/about-approach";
import { about } from "@/data/about";

export const metadata: Metadata = {
  title: about.seo.title,
  description: about.seo.description,
};

export default function AboutPage() {
  return <main className="min-h-screen bg-background text-foreground">
    <AboutIntroduction />
    <AboutFocus />
    <AboutPurpose />
    <AboutApproach />
    <AboutRelationships />
    <AboutPeople />
    <AboutCta />
  </main>;
}
