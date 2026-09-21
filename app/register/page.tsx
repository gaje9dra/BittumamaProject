"use client";

import type { FormEvent } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { GoogleSignIn } from "@/components/auth/google-sign-in";

export const metadata: Metadata = { title: "Create account | Bittumama", robots: { index: false, follow: false } };

export default function RegisterPage() {
  const router = useRouter();
  const [email,setEmail]=useState(""); const [name,setName]=useState(""); const [password,setPassword]=useState(""); const [pending,setPending]=useState(false); const [error,setError]=useState<string|null>(null);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setPending(true); setError(null);
    try {
      const response=await fetch("/api/auth/register",{method:"POST",headers:{"Content-Type":"application/json"},credentials:"same-origin",body:JSON.stringify({email,name,password})});
      const body=await response.json().catch(()=>null);
      if(!response.ok){setError(typeof body?.error==="string"?body.error:"Unable to create the account.");return;}
      router.replace("/auth-test"); router.refresh();
    } catch { setError("Account creation could not be completed. Please try again."); } finally { setPending(false); }
  }
  return <main className="min-h-screen bg-background text-foreground"><section className="mx-auto flex min-h-[70vh] max-w-xl items-center px-[var(--page-gutter)] py-16"><div className="w-full border-y border-border py-10">
    <p className="type-label text-muted-foreground">Authentication</p><h1 className="type-h2 mt-2">Create account</h1><p className="type-body-sm mt-3 text-muted-foreground">Create a normal Bittumama user account.</p>
    <form onSubmit={submit} className="mt-7 space-y-5" noValidate>
      <div><label htmlFor="register-name" className="block type-caption font-medium">Name</label><input id="register-name" name="name" type="text" autoComplete="name" value={name} onChange={e=>setName(e.target.value)} className="mt-2 min-h-11 w-full border border-border bg-background px-3 py-2.5 text-sm" /></div>
      <div><label htmlFor="register-email" className="block type-caption font-medium">Email</label><input id="register-email" name="email" type="email" autoComplete="email" required value={email} onChange={e=>setEmail(e.target.value)} className="mt-2 min-h-11 w-full border border-border bg-background px-3 py-2.5 text-sm" /></div>
      <div><label htmlFor="register-password" className="block type-caption font-medium">Password</label><input id="register-password" name="password" type="password" autoComplete="new-password" minLength={10} required value={password} onChange={e=>setPassword(e.target.value)} className="mt-2 min-h-11 w-full border border-border bg-background px-3 py-2.5 text-sm" /><p className="mt-2 text-xs text-muted-foreground">Use at least 10 characters.</p></div>
      {error && <p role="alert" className="type-caption text-error">{error}</p>}
      <button type="submit" disabled={pending} className="inline-flex min-h-11 items-center justify-center rounded-[var(--radius-md)] bg-primary px-5 type-button text-primary-foreground disabled:cursor-not-allowed disabled:opacity-60">{pending?"Creating account…":"Create account"}</button>
    </form>
    <div className="mt-7 border-t border-border pt-6"><GoogleSignIn callbackUrl="/auth-test" /></div>
    <p className="mt-6 text-sm text-muted-foreground">Already have an account? <Link href="/login" className="underline underline-offset-4 text-foreground">Sign in</Link></p>
  </div></section></main>;
}
