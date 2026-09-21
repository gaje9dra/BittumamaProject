import type { Metadata } from "next";
import Link from "next/link";
import { AdminLoginForm } from "@/components/auth/admin-login-form";
import { AuthShell } from "@/components/auth/auth-shell";

export const metadata: Metadata = {
  title: "Administrator Sign In | Bittumama",
  robots: { index: false, follow: false, nocache: true, noarchive: true },
};

export default function AdminLoginPage() {
  return (
    <AuthShell
      label="RESTRICTED / ADMIN"
      title="Administrator Sign In"
      description="Authorized administrators only."
      context="admin"
    >
      <AdminLoginForm />
      <p className="mt-7 type-body-sm text-muted-foreground">
        This is a separate administrative authentication flow.
      </p>
      <Link href="/" className="mt-5 inline-flex type-body-sm font-medium text-foreground underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-3">
        Return to site
      </Link>
    </AuthShell>
  );
}
