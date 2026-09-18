"use client";

import Link from "next/link";
import { useCallback, useRef, useState } from "react";
import { SearchPanel, SearchTrigger } from "@/components/layout/search";
import { cn } from "@/lib/utils";

export function HeaderActions({ className }: { className?: string }) {
  const [searchOpen, setSearchOpen] = useState(false);
  const searchTriggerRef = useRef<HTMLButtonElement>(null);
  const closeSearch = useCallback(() => setSearchOpen(false), []);

  return (
    <div className={cn("items-center gap-2", className)}>
      <SearchTrigger ref={searchTriggerRef} open={searchOpen} onClick={() => setSearchOpen((value) => !value)} />
      <Link
        href="/contact"
        className="inline-flex min-h-10 items-center border border-primary bg-primary px-4 type-button text-primary-foreground transition-colors duration-[var(--motion-fast)] hover:bg-primary-700 active:bg-primary-800 focus-visible:outline-2 focus-visible:outline-offset-3"
      >
        Get in touch
      </Link>
      <SearchPanel open={searchOpen} onClose={closeSearch} restoreFocusRef={searchTriggerRef} />
    </div>
  );
}
