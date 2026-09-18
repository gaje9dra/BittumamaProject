"use client";

import Link from "next/link";
import { Search, X } from "lucide-react";
import type { FormEvent } from "react";
import { forwardRef, useEffect, useId, useRef, useState, type RefObject } from "react";
import { usePathname, useRouter } from "next/navigation";
import { announceHeaderSurface, subscribeToHeaderSurface } from "@/lib/header-surface";
import { cn } from "@/lib/utils";

type SearchTriggerProps = {
  open: boolean;
  onClick: () => void;
  className?: string;
  label?: string;
  controlsId?: string;
};

export const SearchTrigger = forwardRef<HTMLButtonElement, SearchTriggerProps>(function SearchTrigger(
  { open, onClick, className, label = "Search", controlsId },
  ref,
) {
  return (
    <button
      ref={ref}
      type="button"
      aria-label={open ? "Close search" : label}
      aria-expanded={open}
      aria-controls={open ? controlsId : undefined}
      onClick={onClick}
      className={cn(
        "inline-flex min-h-11 items-center justify-center gap-2 rounded-[var(--radius-md)] border border-transparent px-2.5 type-nav text-muted-foreground transition-colors duration-[var(--motion-fast)] ease-[var(--motion-ease-standard)] hover:border-border hover:bg-surface-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-3",
        open && "border-border bg-surface-muted text-foreground",
        className,
      )}
    >
      <Search aria-hidden="true" size={18} />
      <span>{label}</span>
    </button>
  );
});

type SearchPanelProps = {
  open: boolean;
  onClose: (restoreFocus?: boolean) => void;
  variant?: "overlay" | "inline";
  className?: string;
  restoreFocusRef?: RefObject<HTMLElement | null>;
  id?: string;
};

export function SearchPanel({ open, onClose, variant = "overlay", className, restoreFocusRef, id }: SearchPanelProps) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const restoreFocusOnCloseRef = useRef(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const labelId = useId();
  const previousOpenRef = useRef(false);
  const pathname = usePathname();
  const previousPathnameRef = useRef(pathname);
  const router = useRouter();

  useEffect(() => {
    if (!open) return;

    announceHeaderSurface("search");
    requestAnimationFrame(() => inputRef.current?.focus());

    const unsubscribe = subscribeToHeaderSurface((surface) => {
      if (surface !== "search") onClose(false);
    });

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        restoreFocusOnCloseRef.current = true;
        onClose(true);
      }
    };
    const handlePointerDown = (event: PointerEvent) => {
      if (variant !== "overlay") return;
      const target = event.target;
      if (
        target instanceof Node &&
        !panelRef.current?.contains(target) &&
        !restoreFocusRef?.current?.contains(target)
      ) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("pointerdown", handlePointerDown);
    return () => {
      unsubscribe();
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [onClose, open, restoreFocusRef, variant]);

  useEffect(() => {
    if (previousPathnameRef.current !== pathname) {
      previousPathnameRef.current = pathname;
      onClose(false);
    }
  }, [onClose, pathname]);

  useEffect(() => {
    if (previousOpenRef.current && !open && restoreFocusOnCloseRef.current) {
      restoreFocusOnCloseRef.current = false;
      requestAnimationFrame(() => {
        restoreFocusRef?.current?.focus();
      });
    }
    previousOpenRef.current = open;
  }, [open, restoreFocusRef]);

  if (!open) return null;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) {
      inputRef.current?.focus();
      return;
    }
    onClose(false);
    router.push("/search?q=" + encodeURIComponent(trimmed));
  };

  return (
    <div
      ref={panelRef}
      id={id}
      role="search"
      aria-labelledby={labelId}
      className={cn(
        variant === "overlay"
          ? "fixed inset-x-0 top-[var(--header-height)] z-[var(--layer-modal)] border-b border-border bg-surface shadow-[var(--shadow-md)] lg:top-[var(--header-height-lg)]"
          : "border-y border-border bg-surface py-5",
        "motion-fade",
        className,
      )}
    >
      <div className="mx-auto w-full max-w-[var(--container-wide)] px-[var(--page-gutter)]">
        <div className="flex items-center justify-between gap-4">
          <p id={labelId} className="type-label text-muted-foreground">Search</p>
          <button
            type="button"
            onClick={() => {
              restoreFocusOnCloseRef.current = true;
              onClose(true);
            }}
            aria-label="Close search"
            className="inline-flex size-11 shrink-0 items-center justify-center text-muted-foreground transition-colors duration-[var(--motion-fast)] hover:bg-surface-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-3"
          >
            <X aria-hidden="true" size={19} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-3">
          <label htmlFor={labelId + "-input"} className="sr-only">
            Search research, articles, services, experts, and resources
          </label>
          <div className="flex items-stretch border border-input bg-background focus-within:border-ring focus-within:ring-2 focus-within:ring-ring/20">
            <Search aria-hidden="true" size={20} className="ml-4 self-center shrink-0 text-muted-foreground" />
            <input
              ref={inputRef}
              id={labelId + "-input"}
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search research, articles, services..."
              autoComplete="off"
              className="min-h-12 min-w-0 flex-1 bg-transparent px-3 type-body outline-none placeholder:text-muted-foreground"
            />
            {query && (
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  inputRef.current?.focus();
                }}
                aria-label="Clear search"
                className="inline-flex size-12 shrink-0 items-center justify-center text-muted-foreground transition-colors duration-[var(--motion-fast)] hover:bg-surface-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-3"
              >
                <X aria-hidden="true" size={18} />
              </button>
            )}
            <button
              type="submit"
              className="min-h-12 shrink-0 border-l border-input bg-primary px-5 type-button text-primary-foreground transition-colors duration-[var(--motion-fast)] hover:bg-primary-700 focus-visible:outline-2 focus-visible:outline-offset-[-3px]"
            >
              Search
            </button>
          </div>
        </form>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 py-3">
          <p className="type-caption text-muted-foreground">Search foundation — results will connect to real content later.</p>
          <Link
            href="/search"
            onClick={() => onClose(false)}
            className="type-caption text-primary underline decoration-primary/40 underline-offset-4 hover:decoration-primary"
          >
            View search page
          </Link>
        </div>
      </div>
    </div>
  );
}
