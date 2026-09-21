import "dotenv/config";

import { NotificationStatus } from "../generated/prisma/client";
import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { buildNotificationTemplate } from "../lib/notifications/templates-core";
import { canTransitionNotification } from "../lib/notifications/state";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) throw new Error("DATABASE_URL is required to verify notifications.");
const adapter = new PrismaPg({ connectionString: databaseUrl });
const prisma = new PrismaClient({ adapter });

async function main() {
  const suffix = Date.now().toString(36);
  const user = await prisma.user.create({ data: { email: `notification-test-${suffix}@example.test`, name: "Notification Test" } });
  try {
    const template = buildNotificationTemplate({ type: "REGISTRATION_RECEIVED", name: "<script>alert(1)</script>", eventTitle: "Workshop & Research", eventDate: "2026-09-21", status: "CONFIRMED" });
    if (template.html.includes("<script>") || !template.html.includes("&lt;script&gt;")) throw new Error("HTML escaping failed.");
    if (!template.subject || !template.text) throw new Error("Template output is incomplete.");
    if (!canTransitionNotification(NotificationStatus.PENDING, NotificationStatus.PROCESSING)) throw new Error("Valid notification transition rejected.");
    if (canTransitionNotification(NotificationStatus.SENT, NotificationStatus.PROCESSING)) throw new Error("Invalid notification transition accepted.");
    const first = await prisma.notification.create({
      data: {
        type: "REGISTRATION_RECEIVED", channel: "EMAIL", recipient: user.email!, dedupeKey: `notification-test:${suffix}`,
        userId: user.id, relatedEntityType: "EventRegistration", relatedEntityId: "test-registration",
        payload: { type: "REGISTRATION_RECEIVED", name: user.name!, eventTitle: "Test Workshop", eventDate: "2026-09-21", status: "CONFIRMED" },
      },
    });
    const existing = await prisma.notification.findUnique({ where: { dedupeKey: first.dedupeKey } });
    if (!existing || existing.id !== first.id) throw new Error("Notification deduplication lookup failed.");
    let duplicateRejected = false;
    try {
      await prisma.notification.create({
        data: { type: "REGISTRATION_RECEIVED", channel: "EMAIL", recipient: user.email!, dedupeKey: first.dedupeKey, payload: { type: "REGISTRATION_RECEIVED", name: user.name!, eventTitle: "Duplicate", eventDate: null, status: "CONFIRMED" } },
      });
    } catch { duplicateRejected = true; }
    if (!duplicateRejected) throw new Error("Duplicate notification key was not rejected.");
    const updated = await prisma.notification.updateMany({ where: { id: first.id, status: "PENDING" }, data: { status: "PROCESSING" } });
    if (updated.count !== 1) throw new Error("Notification processing transition failed.");
    const sent = await prisma.notification.updateMany({ where: { id: first.id, status: "PROCESSING" }, data: { status: "SENT", provider: "fake", providerMessageId: "fake-message", sentAt: new Date() } });
    if (sent.count !== 1) throw new Error("Notification sent transition failed.");
    const final = await prisma.notification.findUnique({ where: { id: first.id } });
    if (!final || final.status !== "SENT" || !final.providerMessageId) throw new Error("Notification delivery state was not persisted.");
    console.log("Notification infrastructure verification passed.");
  } finally {
    await prisma.notification.deleteMany({ where: { userId: user.id } });
    await prisma.user.delete({ where: { id: user.id } });
    await prisma.$disconnect();
  }
}
main().catch(async (error) => { console.error(error); await prisma.$disconnect(); process.exitCode = 1; });