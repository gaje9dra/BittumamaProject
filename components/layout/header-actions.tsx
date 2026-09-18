"use client";

import Link from "next/link";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { SearchPanel, SearchTrigger } from "@/components/layout/search";
import { cn } from "@/lib/utils";

export function HeaderActions({ className }: { className?: string }) {
  const [searchOpen, setSearchOpen] = useState(false);
  const searchPanelId = useId();
  const searchTriggerRef = useRef<HTMLButtonElement>(null);
  const closeSearch = useCallback(() => setSearchOpen(false), []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) closeSearch();
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [closeSearch]);

  return (
    <div className={cn("items-center gap-2", className)}>
      <SearchTrigger ref={searchTriggerRef} controlsId={searchPanelId} open={searchOpen} onClick={() => setSearchOpen((value) => !value)} />
      <Link
        href="/contact"
        className="inline-flex min-h-10 items-center rounded-[var(--radius-md)] border border-primary bg-primary px-4 type-button text-primary-foreground transition-colors duration-[var(--motion-fast)] hover:bg-primary-700 active:bg-primary-800 focus-visible:outline-2 focus-visible:outline-offset-3"
      >
        Get in touch
      </Link>
      <SearchPanel id={searchPanelId} open={searchOpen} onClose={closeSearch} restoreFocusRef={searchTriggerRef} />
    </div>
  );
}
