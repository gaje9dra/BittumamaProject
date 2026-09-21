import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { GoogleSignIn } from "@/components/auth/google-sign-in";
import { EmailPasswordLogin } from "@/components/auth/email-password-login";
import { getCurrentUser } from "@/lib/auth/guards";
import { isGoogleAuthConfigured } from "@/auth";

export const metadata: Metadata = { title: "Sign in | Bittumama", robots: { index:false, follow:false } };

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ callbackUrl?: string; error?: string }> }) {
  const user = await getCurrentUser();
  if (user) redirect("/auth-test");
  const params = await searchParams;
  const callbackUrl = params.callbackUrl && params.callbackUrl.startsWith("/") && !params.callbackUrl.startsWith("//") && !params.callbackUrl.startsWith("/admin") ? params.callbackUrl : "/auth-test";
  return <main className="min-h-screen bg-background text-foreground"><section className="mx-auto flex min-h-[70vh] max-w-xl items-center px-[var(--page-gutter)] py-16"><div className="w-full border-y border-border py-10">
    <p className="type-label text-muted-foreground">Authentication</p><h1 className="type-h2 mt-2">Sign in</h1><p className="type-body-sm mt-3 max-w-[52ch] text-muted-foreground">Sign in to your normal Bittumama account.</p>
    {params.error && <p role="alert" className="type-caption mt-5 text-error">Authentication could not be completed. Please try again.</p>}
    <div className="mt-7"><EmailPasswordLogin callbackUrl={callbackUrl} /></div>
    {isGoogleAuthConfigured && <div className="mt-7 border-t border-border pt-7"><GoogleSignIn callbackUrl={callbackUrl} /></div>}
    <p className="mt-6 text-sm text-muted-foreground">Need an account? <Link href="/register" className="underline underline-offset-4 text-foreground">Create one</Link></p>
  </div></section></main>;
}
