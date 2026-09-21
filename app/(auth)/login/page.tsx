import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { GoogleSignIn } from "@/components/auth/google-sign-in";
import { getCurrentUser } from "@/lib/auth/guards";
import { isGoogleAuthConfigured } from "@/auth";

export const metadata: Metadata = {
  title: "Sign in | Bittumama",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string; error?: string }>;
}) {
  const user = await getCurrentUser();
  if (user) redirect("/auth-test");

  const params = await searchParams;
  const configurationMissing = !isGoogleAuthConfigured;

  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="mx-auto flex min-h-[70vh] max-w-xl items-center px-[var(--page-gutter)] py-16">
        <div className="w-full border-y border-border py-10">
          <p className="type-label text-muted-foreground">Authentication</p>
          <h1 className="type-h2 mt-2">Sign in</h1>
          <p className="type-body-sm mt-3 max-w-[52ch] text-muted-foreground">
            Use the configured Google account to continue to the authentication test area.
          </p>
          {params.error && (
            <p role="alert" className="type-caption mt-5 text-error">
              Authentication could not be completed. Please try again.
            </p>
          )}
          {configurationMissing ? (
            <p role="alert" className="type-caption mt-6 text-error">
              Google authentication is not configured. Add AUTH_SECRET, AUTH_GOOGLE_ID, and AUTH_GOOGLE_SECRET to the local environment first.
            </p>
          ) : (
            <div className="mt-7">
              <GoogleSignIn callbackUrl={params.callbackUrl && params.callbackUrl.startsWith("/") && !params.callbackUrl.startsWith("//") && !params.callbackUrl.startsWith("/admin") ? params.callbackUrl : "/auth-test"} />
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
