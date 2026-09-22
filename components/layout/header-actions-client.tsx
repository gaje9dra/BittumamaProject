"use client";

import Link from "next/link";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { UserRound } from "lucide-react";
import { SearchPanel, SearchTrigger } from "@/components/layout/search";
import { SignOutButton } from "@/components/auth/sign-out";
import { cn } from "@/lib/utils";

type HeaderUser = {
  name: string | null;
  email: string | null;
  image: string | null;
};

function initials(user: HeaderUser) {
  const source = user.name?.trim() || user.email?.split("@")[0] || "";
  const parts = source.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return source.slice(0, 2).toUpperCase() || "U";
}

export function HeaderActionsClient({
  className,
  user,
}: {
  className?: string;
  user: HeaderUser | null;
}) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const searchPanelId = useId();
  const menuId = useId();
  const searchTriggerRef = useRef<HTMLButtonElement>(null);
  const profileTriggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const closeSearch = useCallback(() => setSearchOpen(false), []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        closeSearch();
        setMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [closeSearch]);

  useEffect(() => {
    if (!menuOpen) return;
    const handlePointerDown = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node) && !profileTriggerRef.current?.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setMenuOpen(false);
        profileTriggerRef.current?.focus();
      }
    };
    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!user) setMenuOpen(false);
  }, [user]);

  return (
    <div className={cn("items-center gap-2", className)}>
      <SearchTrigger ref={searchTriggerRef} controlsId={searchPanelId} open={searchOpen} onClick={() => setSearchOpen((value) => !value)} />

      {user ? (
        <div className="relative">
          <button
            ref={profileTriggerRef}
            type="button"
            aria-label="Open account menu"
            aria-expanded={menuOpen}
            aria-controls={menuId}
            onClick={() => setMenuOpen((value) => !value)}
            className="inline-flex min-h-10 items-center gap-2 border border-transparent px-2 text-foreground transition-colors duration-[var(--motion-fast)] hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-3"
          >
            {user.image ? (
              <img src={user.image} alt="" className="size-8 rounded-full object-cover" />
            ) : (
              <span aria-hidden="true" className="inline-flex size-8 items-center justify-center rounded-full border border-border text-[11px] font-semibold tracking-wide">
                {initials(user)}
              </span>
            )}
            <span className="sr-only">Account</span>
          </button>

          {menuOpen && (
            <div
              ref={menuRef}
              id={menuId}
              role="menu"
              aria-label="Account menu"
              className="absolute right-0 top-[calc(100%+0.65rem)] z-[var(--layer-popover)] w-64 border border-border bg-background p-2 shadow-[var(--shadow-soft)]"
            >
              <div className="border-b border-border px-3 pb-3 pt-2">
                <p className="truncate type-button text-foreground">{user.name || "Your account"}</p>
                {user.email && <p className="mt-1 truncate type-caption text-muted-foreground">{user.email}</p>}
              </div>
              <div className="pt-2">
                <Link
                  role="menuitem"
                  href="/account"
                  onClick={() => setMenuOpen(false)}
                  className="flex min-h-10 items-center px-3 type-button text-foreground transition-colors duration-[var(--motion-fast)] hover:bg-surface-muted focus-visible:outline-2 focus-visible:outline-offset-[-2px]"
                >
                  My Account
                </Link>
                <SignOutButton
                  className="flex min-h-10 w-full items-center px-3 type-button text-foreground transition-colors duration-[var(--motion-fast)] hover:bg-surface-muted focus-visible:outline-2 focus-visible:outline-offset-[-2px]"
                  compact
                />
              </div>
            </div>
          )}
        </div>
      ) : (
        <>
          <Link
            href="/login"
            className="inline-flex min-h-10 items-center px-2 type-button text-foreground transition-colors duration-[var(--motion-fast)] hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-3"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="inline-flex min-h-10 items-center rounded-[var(--radius-md)] border border-primary bg-primary px-4 type-button text-primary-foreground transition-colors duration-[var(--motion-fast)] hover:bg-primary-700 active:bg-primary-800 focus-visible:outline-2 focus-visible:outline-offset-3"
          >
            Register
          </Link>
        </>
      )}

      <SearchPanel id={searchPanelId} open={searchOpen} onClose={closeSearch} restoreFocusRef={searchTriggerRef} />
    </div>
  );
}
