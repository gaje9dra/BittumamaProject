import type { Metadata } from "next";
import Link from "next/link";
import { listNotificationsForAdmin } from "@/lib/admin/notifications";
import { NotificationStatus, NotificationType } from "@/generated/prisma/client";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Notifications | Bittumama", robots: { index: false, follow: false, nocache: true } };

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };
function one(value: string | string[] | undefined) { return Array.isArray(value) ? value[0] : value; }

export default async function AdminNotificationsPage({ searchParams }: Props) {
  const params = await searchParams;
  const q = one(params.q);
  const statusValue = one(params.status);
  const typeValue = one(params.type);
  const status = Object.values(NotificationStatus).includes(statusValue as NotificationStatus) ? statusValue as NotificationStatus : undefined;
  const type = Object.values(NotificationType).includes(typeValue as NotificationType) ? typeValue as NotificationType : undefined;
  const data = await listNotificationsForAdmin({ q, status, type });
  return <section><p className="type-label text-muted-foreground">Notifications</p><h1 className="type-h2 mt-2">Transactional delivery</h1><p className="type-body-sm mt-3 text-muted-foreground">Operational email delivery state only. No campaign or broadcast tooling is exposed here.</p><form className="mt-7 grid gap-3 border-y border-border py-5 sm:grid-cols-[1fr_auto_auto_auto]"><input name="q" defaultValue={q} placeholder="Recipient, subject or related ID" aria-label="Search notifications" className="min-h-11 border border-border bg-background px-3" /><select name="status" defaultValue={status ?? ""} aria-label="Filter by status" className="min-h-11 border border-border bg-background px-3"><option value="">All statuses</option>{Object.values(NotificationStatus).map((item)=><option key={item}>{item}</option>)}</select><select name="type" defaultValue={type ?? ""} aria-label="Filter by type"><option value="">All types</option>{Object.values(NotificationType).map((item)=><option key={item}>{item}</option>)}</select><button className="min-h-11 border border-primary bg-primary px-4 type-button text-primary-foreground" type="submit">Filter</button></form><div className="mt-6 overflow-x-auto border-y border-border"><table className="w-full min-w-[900px] text-left"><thead><tr className="border-b border-border">{["Type","Recipient","Channel","Status","Provider","Related","Created","Sent"].map((h)=><th key={h} className="px-3 py-3 type-label">{h}</th>)}</tr></thead><tbody>{data.items.map((item)=><tr key={item.id} className="border-b border-border last:border-0"><td className="px-3 py-4"><Link className="underline underline-offset-4" href={"/admin/notifications/"+item.id}>{item.type}</Link></td><td className="px-3 py-4">{item.recipient}</td><td className="px-3 py-4">{item.channel}</td><td className="px-3 py-4">{item.status}</td><td className="px-3 py-4">{item.provider ?? "—"}</td><td className="px-3 py-4">{item.relatedEntityType ? item.relatedEntityType+" / "+item.relatedEntityId : "—"}</td><td className="px-3 py-4">{item.createdAt.toISOString()}</td><td className="px-3 py-4">{item.sentAt?.toISOString() ?? "—"}</td></tr>)}</tbody></table></div><p className="mt-4 type-caption text-muted-foreground">{data.total} notification{data.total === 1 ? "" : "s"} found.</p></section>;
}