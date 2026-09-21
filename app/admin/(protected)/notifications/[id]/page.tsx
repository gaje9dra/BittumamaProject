import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getNotificationForAdmin } from "@/lib/admin/notifications";
import { NotificationRetryForm } from "@/components/admin/notification-retry-form";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Notification detail | Bittumama", robots: { index: false, follow: false, nocache: true } };

export default async function AdminNotificationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const notification = await getNotificationForAdmin(id);
  if (!notification) notFound();
  return <section><p className="type-label text-muted-foreground">Notification</p><h1 className="type-h2 mt-2">{notification.type}</h1><dl className="mt-7 grid gap-5 border-y border-border py-6 sm:grid-cols-2 lg:grid-cols-3">{[["Recipient",notification.recipient],["Channel",notification.channel],["Status",notification.status],["Provider",notification.provider ?? "—"],["Provider message",notification.providerMessageId ?? "—"],["Related",notification.relatedEntityType ? notification.relatedEntityType+" / "+(notification.relatedEntityId ?? "") : "—"],["Created",notification.createdAt.toISOString()],["Sent",notification.sentAt?.toISOString() ?? "—"],["Failed",notification.failedAt?.toISOString() ?? "—"],["Failure",notification.failureMessage ?? notification.failureCode ?? "—"]].map(([label,value])=><div key={label}><dt className="type-label text-muted-foreground">{label}</dt><dd className="mt-1 type-body-sm break-words">{value}</dd></div>)}</dl><NotificationRetryForm id={notification.id} eligible={notification.status === "FAILED"} /><p className="mt-6 type-caption text-muted-foreground">Notification payload and provider diagnostics are not exposed in the admin interface.</p></section>;
}