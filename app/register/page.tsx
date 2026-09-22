import type { Metadata } from "next";
import Link from "next/link";
import { GoogleSignIn } from "@/components/auth/google-sign-in";
import { RegisterForm } from "@/components/auth/register-form";
import { AuthShell } from "@/components/auth/auth-shell";
import { isGoogleAuthConfigured } from "@/auth";
import { getCurrentUser } from "@/lib/auth/guards";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Create account | Bittumama",
  robots: { index: false, follow: false, nocache: true, noarchive: true },
};

export default async function RegisterPage() {
  if (await getCurrentUser()) redirect("/account");
  return (
    <AuthShell
      label="USER / CREATE ACCOUNT"
      title="Create an account"
      description="Create a normal Bittumama account with the credentials you choose."
      context="user"
    >
      <RegisterForm />
      {isGoogleAuthConfigured && (
        <div className="mt-7 border-t border-border pt-7">
          <div className="mb-4 flex items-center gap-3">
            <span className="h-px flex-1 bg-border" />
            <span className="type-caption text-muted-foreground">OR</span>
            <span className="h-px flex-1 bg-border" />
          </div>
          <GoogleSignIn callbackUrl="/account" />
        </div>
      )}
      <p className="mt-7 type-body-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-foreground underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-3">
          Sign in
        </Link>
      </p>
    </AuthShell>
  );
}
