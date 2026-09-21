import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAuditLog } from "@/lib/admin/audit";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Audit log detail | Bittumama", robots: { index: false, follow: false, nocache: true } };

export default async function AuditLogDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const row = await getAuditLog(id);
  if (!row) notFound();
  return <section aria-labelledby="audit-detail-title">
    <Link href="/admin/audit-logs" className="type-body-sm underline underline-offset-4">← Back to audit logs</Link>
    <h1 id="audit-detail-title" className="type-h2 mt-4">Audit entry</h1>
    <dl className="mt-8 grid gap-x-8 gap-y-5 border-y border-border py-6 sm:grid-cols-2">
      {[
        ["Timestamp", row.createdAt.toISOString()], ["Actor", row.actorUser?.name || row.actorUser?.email || "System"],
        ["Action", row.action], ["Category", row.category],
        ["Entity", row.entityType ? row.entityType + (row.entityId ? ":" + row.entityId : "") : "—"],
        ["Result", row.result], ["Severity", row.severity], ["Request ID", row.requestId || "—"],
        ["IP address", row.ipAddress || "—"], ["User agent", row.userAgent || "—"], ["Summary", row.summary],
      ].map(([key, value]) => <div key={key}><dt className="type-caption text-muted-foreground">{key}</dt><dd className="mt-1 break-words text-sm">{value}</dd></div>)}
    </dl>
    <div className="mt-6"><h2 className="type-h5">Safe metadata</h2><pre className="mt-3 overflow-x-auto border border-border bg-surface p-4 text-sm whitespace-pre-wrap">{JSON.stringify(row.metadata, null, 2)}</pre></div>
  </section>;
}
