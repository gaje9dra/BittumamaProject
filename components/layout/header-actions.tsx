import Link from "next/link";
import { cn } from "@/lib/utils";

export function HeaderActions({ className }: { className?: string }) {
  return (
    <div className={cn("items-center", className)}>
      <Link href="/contact" className="inline-flex min-h-11 items-center border border-primary bg-primary px-4 type-button text-primary-foreground transition-colors duration-[var(--motion-micro)] hover:bg-primary-700 active:bg-primary-800 focus-visible:outline-2 focus-visible:outline-offset-3">
        Get in touch
      </Link>
    </div>
  );
}
