import type { Metadata } from "next";
import { GoogleSignIn } from "@/components/auth/google-sign-in";
import { isGoogleAuthConfigured } from "@/auth";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Administrator Sign In | Bittumama",
  robots: { index: false, follow: false, nocache: true, noarchive: true },
};

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string; error?: string }>;
}) {
  const params = await searchParams;
  const configurationMissing = !isGoogleAuthConfigured;
  const callbackUrl = params.callbackUrl?.startsWith("/admin") && !params.callbackUrl.startsWith("//")
    ? params.callbackUrl
    : "/admin";

  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="mx-auto flex min-h-[70vh] max-w-xl items-center px-[var(--page-gutter)] py-16">
        <div className="w-full border-y border-border py-10">
          <p className="type-label text-muted-foreground">Restricted access</p>
          <h1 className="type-h2 mt-2">Administrator Sign In</h1>
          <p className="type-body-sm mt-3 max-w-[52ch] text-muted-foreground">
            Authorized administrators only.
          </p>
          {params.error && (
            <p role="alert" className="type-caption mt-5 text-error">
              Administrator access could not be authorized. Please try again.
            </p>
          )}
          {configurationMissing ? (
            <p role="alert" className="type-caption mt-6 text-error">
              Google authentication is not configured.
            </p>
          ) : (
            <div className="mt-7">
              <GoogleSignIn admin callbackUrl={`/admin/login/complete?callbackUrl=${encodeURIComponent(callbackUrl)}`} />
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
