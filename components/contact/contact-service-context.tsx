import Link from "next/link";
import { Container } from "@/components/ui/container";

export function ContactServiceContext() {
  return (
    <section className="border-b border-border">
      <Container width="standard" className="py-10 sm:py-12">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="type-label text-muted-foreground">Not sure which service fits?</p>
            <h2 className="type-h3 mt-2 max-w-[24ch]">Explore the service catalogue.</h2>
          </div>
          <Link href="/services" className="inline-flex min-h-11 items-center rounded-[var(--radius-md)] border border-primary bg-primary px-5 type-button text-primary-foreground hover:bg-primary-700 focus-visible:outline-2 focus-visible:outline-offset-3">
            Explore Services
          </Link>
        </div>
      </Container>
    </section>
  );
}
