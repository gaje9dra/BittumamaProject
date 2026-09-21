import type { Metadata } from "next";
import Link from "next/link";
import { GoogleSignIn } from "@/components/auth/google-sign-in";
import { RegisterForm } from "@/components/auth/register-form";
import { isGoogleAuthConfigured } from "@/auth";

export const metadata: Metadata = { title:"Create account | Bittumama", robots:{index:false,follow:false} };

export default function RegisterPage(){return <main className="min-h-screen bg-background text-foreground"><section className="mx-auto flex min-h-[70vh] max-w-xl items-center px-[var(--page-gutter)] py-16"><div className="w-full border-y border-border py-10"><p className="type-label text-muted-foreground">Authentication</p><h1 className="type-h2 mt-2">Create account</h1><p className="type-body-sm mt-3 text-muted-foreground">Create a normal Bittumama user account.</p><RegisterForm/>{isGoogleAuthConfigured&&<div className="mt-7 border-t border-border pt-6"><GoogleSignIn callbackUrl="/auth-test"/></div>}<p className="mt-6 text-sm text-muted-foreground">Already have an account? <Link href="/login" className="underline underline-offset-4 text-foreground">Sign in</Link></p></div></section></main>;}
