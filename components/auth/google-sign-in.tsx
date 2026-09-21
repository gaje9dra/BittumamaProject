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
    <button type="button" onClick={handleSignIn} disabled={pending}
      className="inline-flex min-h-12 w-full items-center justify-center gap-3 rounded-[var(--radius-md)] border border-border bg-background px-5 type-button text-foreground transition-colors duration-[var(--motion-fast)] hover:bg-surface-muted focus-visible:outline-2 focus-visible:outline-offset-3 disabled:cursor-not-allowed disabled:opacity-60">
      <svg aria-hidden="true" viewBox="0 0 24 24" className="size-4" focusable="false">
        <path fill="#4285F4" d="M21.35 12.2c0-.74-.07-1.45-.2-2.13H12v4.03h5.22a4.46 4.46 0 0 1-1.94 2.93v2.43h3.14c1.84-1.69 2.93-4.18 2.93-7.26Z"/>
        <path fill="#34A853" d="M12 21.99c2.63 0 4.84-.87 6.45-2.36l-3.14-2.43c-.87.58-1.98.92-3.31.92-2.54 0-4.69-1.72-5.46-4.03H3.3v2.5A9.74 9.74 0 0 0 12 21.99Z"/>
        <path fill="#FBBC05" d="M6.54 14.09A5.85 5.85 0 0 1 6.24 12c0-.72.13-1.42.3-2.09V7.4H3.3A9.99 9.99 0 0 0 2 12c0 1.65.4 3.2 1.1 4.6l3.44-2.51Z"/>
        <path fill="#EA4335" d="M12 5.88c1.43 0 2.71.49 3.72 1.45l2.79-2.79C16.83 2.94 14.62 2 12 2a9.74 9.74 0 0 0-8.7 5.4l3.44 2.51C7.31 7.6 9.46 5.88 12 5.88Z"/>
      </svg>
      <span>{pending ? "Redirecting…" : "Continue with Google"}</span>
    </button>
  );
}
