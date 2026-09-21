import type { Metadata } from "next";
import Link from "next/link";
import { AdminLoginForm } from "@/components/auth/admin-login-form";

export const metadata: Metadata = { title:"Administrator Sign In | Bittumama", robots:{index:false,follow:false,nocache:true,noarchive:true} };

export default function AdminLoginPage(){return <main className="min-h-screen bg-background text-foreground"><section className="mx-auto flex min-h-[70vh] max-w-xl items-center px-[var(--page-gutter)] py-16"><div className="w-full border-y border-border py-10"><p className="type-label text-muted-foreground">Restricted access</p><h1 className="type-h2 mt-2">Administrator Sign In</h1><p className="type-body-sm mt-3 max-w-[52ch] text-muted-foreground">Authorized administrators only.</p><AdminLoginForm/><Link href="/" className="mt-6 inline-block text-sm underline underline-offset-4">Return to site</Link></div></section></main>;}
