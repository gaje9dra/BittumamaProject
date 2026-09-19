import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Container } from "@/components/ui/container";

export function ResearchBreadcrumbs({ title }: { title: string }) {
  return (
    <nav aria-label="Breadcrumb" className="type-caption">
      <Container size="wide">
        <ol className="flex min-w-0 items-center gap-2 py-4 text-muted-foreground">
          <li className="shrink-0">
            <Link href="/research" className="underline decoration-transparent underline-offset-4 transition-[color,text-decoration-color] duration-[var(--motion-fast)] hover:text-foreground hover:decoration-border focus-visible:outline-2 focus-visible:outline-offset-3">
              Research
            </Link>
          </li>
          <li aria-hidden="true" className="shrink-0"><ChevronRight className="size-3.5" /></li>
          <li className="min-w-0">
            <span className="block truncate text-foreground" aria-current="page">{title}</span>
          </li>
        </ol>
      </Container>
    </nav>
  );
}
