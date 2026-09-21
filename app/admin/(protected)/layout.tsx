import type { Metadata } from "next";
import type { ReactNode } from "react";
import { requireAdminSession } from "@/lib/auth/guards";
import { AdminShell } from "@/components/admin/admin-shell";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Administration | Bittumama", robots: { index:false, follow:false, nocache:true, noarchive:true } };

export default async function AdminLayout({ children }: Readonly<{ children: ReactNode }>) {
  const admin = await requireAdminSession();
  return <AdminShell admin={{ id: admin.id, email: admin.email, role: "ADMIN" }}>{children}</AdminShell>;
}
