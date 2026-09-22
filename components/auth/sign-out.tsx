"use client";

import { signOut } from "next-auth/react";
import { useState } from "react";

export function SignOutButton({
  className,
  compact = false,
}: {
  className?: string;
  compact?: boolean;
}) {
  const [pending, setPending] = useState(false);

  async function handleSignOut() {
    setPending(true);
    try {
      await fetch("/api/auth/admin/logout", {
        method: "POST",
        credentials: "same-origin",
      });
    } finally {
      await signOut({ callbackUrl: "/login" });
    }
  }

  const defaultClassName =
    "inline-flex min-h-10 items-center justify-center rounded-[var(--radius-md)] border border-border px-4 type-button text-foreground transition-colors duration-[var(--motion-fast)] hover:bg-surface-muted focus-visible:outline-2 focus-visible:outline-offset-3 disabled:cursor-not-allowed disabled:opacity-60";
  const compactClassName = compact
    ? "rounded-none border-0 px-3 justify-start"
    : "";

  return (
    <button
      type="button"
      onClick={handleSignOut}
      disabled={pending}
      className={[defaultClassName, compactClassName, className].filter(Boolean).join(" ")}
    >
      {pending ? "Signing out…" : "Sign out"}
    </button>
  );
}
