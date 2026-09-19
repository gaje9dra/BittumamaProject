import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";

export default function ResearchNotFound() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Container size="narrow" className="layout-section-lg">
        <p className="type-label text-muted-foreground">Research</p>
        <Heading level={1} className="mt-4 max-w-[16ch]">
          Research item not found.
        </Heading>
        <p className="type-body-lg mt-5 max-w-[48ch] text-muted-foreground">
          The research item you requested is not available.
        </p>
        <Button asChild className="group mt-7">
          <Link href="/research">
            Return to Research
            <ArrowUpRight aria-hidden="true" className="size-4 transition-transform duration-[var(--motion-fast)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </Button>
      </Container>
    </main>
  );
}
