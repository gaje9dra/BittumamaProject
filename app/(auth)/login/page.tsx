import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { GoogleSignIn } from "@/components/auth/google-sign-in";
import { EmailPasswordLogin } from "@/components/auth/email-password-login";
import { AuthShell } from "@/components/auth/auth-shell";
import { getCurrentUser } from "@/lib/auth/guards";
import { isGoogleAuthConfigured } from "@/auth";

export const metadata: Metadata = {
  title: "Sign in | Bittumama",
  robots: { index: false, follow: false, nocache: true, noarchive: true },
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string; error?: string }>;
}) {
  const user = await getCurrentUser();
  if (user) redirect("/auth-test");

  const params = await searchParams;
  const callbackUrl =
    params.callbackUrl &&
    params.callbackUrl.startsWith("/") &&
    !params.callbackUrl.startsWith("//") &&
    !params.callbackUrl.startsWith("/admin")
      ? params.callbackUrl
      : "/auth-test";

  return (
    <AuthShell
      label="USER / SIGN IN"
      title="Sign in"
      description="Access your Bittumama account."
      context="user"
    >
      {params.error && (
        <p role="alert" aria-live="polite" className="mb-6 border-l-2 border-error px-3 py-2 type-caption text-error">
          Authentication could not be completed. Please try again.
        </p>
      )}
      <EmailPasswordLogin callbackUrl={callbackUrl} />
      {isGoogleAuthConfigured && (
        <div className="mt-7 border-t border-border pt-7">
          <div className="mb-4 flex items-center gap-3">
            <span className="h-px flex-1 bg-border" />
            <span className="type-caption text-muted-foreground">OR</span>
            <span className="h-px flex-1 bg-border" />
          </div>
          <GoogleSignIn callbackUrl={callbackUrl} />
        </div>
      )}
      <p className="mt-7 type-body-sm text-muted-foreground">
        Need an account?{" "}
        <Link href="/register" className="font-medium text-foreground underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-3">
          Create one
        </Link>
      </p>
    </AuthShell>
  );
}
