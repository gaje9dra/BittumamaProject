"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";

export function GoogleSignIn({ callbackUrl = "/auth-test" }: { callbackUrl?: string }) {
  const [pending, setPending] = useState(false);

  async function handleSignIn() {
    setPending(true);
    await signIn("google", { callbackUrl });
  }

  return (
    <button
      type="button"
      onClick={handleSignIn}
      disabled={pending}
      className="inline-flex min-h-11 items-center justify-center rounded-[var(--radius-md)] bg-primary px-5 type-button text-primary-foreground transition-colors duration-[var(--motion-fast)] hover:bg-primary-700 focus-visible:outline-2 focus-visible:outline-offset-3 disabled:cursor-not-allowed disabled:bg-surface-muted disabled:text-muted-foreground"
    >
      {pending ? "Redirecting…" : "Continue with Google"}
    </button>
  );
}
