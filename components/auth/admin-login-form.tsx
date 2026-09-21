"use client";

import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function AdminLoginForm(){
 const router=useRouter();const[email,setEmail]=useState("");const[password,setPassword]=useState("");const[pending,setPending]=useState(false);const[error,setError]=useState<string|null>(null);
 async function submit(event:FormEvent<HTMLFormElement>){event.preventDefault();setPending(true);setError(null);try{const response=await fetch("/api/auth/admin/login",{method:"POST",headers:{"Content-Type":"application/json"},credentials:"same-origin",body:JSON.stringify({email,password})});const body=await response.json().catch(()=>null);if(!response.ok){setError(typeof body?.error==="string"?body.error:"Invalid administrator credentials.");return;}router.replace("/admin");router.refresh();}catch{setError("Administrator sign-in could not be completed. Please try again.");}finally{setPending(false);}}
 return <form onSubmit={submit} className="mt-7 space-y-5" noValidate><div><label htmlFor="admin-email" className="block type-caption font-medium">Email</label><input id="admin-email" name="email" type="email" autoComplete="username" required value={email} onChange={e=>setEmail(e.target.value)} className="mt-2 min-h-11 w-full border border-border bg-background px-3 py-2.5 text-sm"/></div><div><label htmlFor="admin-password" className="block type-caption font-medium">Password</label><input id="admin-password" name="password" type="password" autoComplete="current-password" required value={password} onChange={e=>setPassword(e.target.value)} className="mt-2 min-h-11 w-full border border-border bg-background px-3 py-2.5 text-sm"/></div>{error&&<p role="alert" className="type-caption text-error">{error}</p>}<button type="submit" disabled={pending} className="inline-flex min-h-11 items-center justify-center rounded-[var(--radius-md)] bg-primary px-5 type-button text-primary-foreground disabled:cursor-not-allowed disabled:opacity-60">{pending?"Signing in…":"Sign In"}</button></form>;
}
