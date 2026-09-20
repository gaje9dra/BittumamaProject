import type { ReactNode } from "react";
import { requireAdmin } from "@/lib/auth/guards";
import { AdminShell } from "@/components/admin/admin-shell";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: Readonly<{ children: ReactNode }>) {
  const admin = await requireAdmin();

  return <AdminShell admin={admin}>{children}</AdminShell>;
}
