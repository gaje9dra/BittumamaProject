import type { Metadata } from "next";
import { ExpertiseIndex } from "@/components/experts/expertise-index";
import { ExpertDirectory } from "@/components/experts/expert-directory";
import { ExpertsCta } from "@/components/experts/experts-cta";
import { ExpertsHero } from "@/components/experts/experts-hero";

export const metadata: Metadata = {
  title: "Experts | Bittumama",
  description: "Explore Bittumama experts, disciplines and areas of expertise.",
};

export default function ExpertsPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <ExpertsHero />
      <ExpertiseIndex />
      <ExpertDirectory />
      <ExpertsCta />
    </main>
  );
}
