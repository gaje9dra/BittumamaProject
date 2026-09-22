"use client";

import { signOut } from "next-auth/react";
import { useState } from "react";
import { cn } from "@/lib/utils";

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
      await fetch("/api/auth/admin/logout", { method: "POST", credentials: "same-origin" });
    } finally {
      await signOut({ callbackUrl: "/login" });
    }
  }

  return (
    <button
      type="button"
      onClick={handleSignOut}
      disabled={pending}
      className={cn(
        compact
          ? "inline-flex min-h-10 items-center justify-start"
          : "inline-flex min-h-10 items-center justify-center rounded-[var(--radius-md)] border border-border px-4",
        "type-button text-foreground disabled:cursor-not-allowed disabled:opacity-60",
        className,
      )}
    >
      {pending ? "Signing out…" : "Sign out"}
    </button>
  );
}
