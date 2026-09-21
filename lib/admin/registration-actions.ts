"use server";

import { revalidatePath } from "next/cache";
import { EventRegistrationRecordStatus, Prisma } from "@/generated/prisma/client";
import { requireAdmin } from "@/lib/auth/guards";
import { prisma } from "@/lib/db/prisma";
import { deliverCreatedNotifications, queueRegistrationNotification } from "@/lib/notifications/domain";

export type RegistrationAdminState = { message: string | null; error: string | null };
export const registrationAdminInitialState: RegistrationAdminState = { message: null, error: null };

const allowed = new Set(Object.values(EventRegistrationRecordStatus));

function validId(value: string) {
  return /^[A-Za-z0-9_-]{1,64}$/.test(value);
}

export async function updateEventRegistrationStatus(
  _previous: RegistrationAdminState,
  formData: FormData,
): Promise<RegistrationAdminState> {
  await requireAdmin();

  const eventId = String(formData.get("eventId") ?? "").trim();
  const registrationId = String(formData.get("registrationId") ?? "").trim();
  const requested = String(formData.get("status") ?? "").trim();

  if (!validId(eventId) || !validId(registrationId)) return { message: null, error: "Invalid registration." };
  if (!allowed.has(requested as EventRegistrationRecordStatus)) return { message: null, error: "Select a valid status." };

  const nextStatus = requested as EventRegistrationRecordStatus;

  for (let attempt = 0; attempt < 3; attempt += 1) {
    const notificationIds: string[] = [];
    try {
      await prisma.client.$transaction(async (tx) => {
        const registration = await tx.eventRegistration.findFirst({
          where: { id: registrationId, eventId },
          select: { id: true, status: true, userId: true, email: true, fullName: true, activeIdentityKey: true },
        });
        if (!registration) throw new Error("NOT_FOUND");
        if (registration.status === nextStatus) throw new Error("UNCHANGED");

        const event = await tx.event.findUnique({
          where: { id: eventId },
          select: { registrationCapacity: true, title: true, date: true },
        });
        if (!event) throw new Error("NOT_FOUND");

        const activating = nextStatus === EventRegistrationRecordStatus.PENDING || nextStatus === EventRegistrationRecordStatus.CONFIRMED;
        const activeIdentityKey = activating ? (registration.userId ? `user:${registration.userId}` : `email:${registration.email.trim().toLowerCase()}`) : null;

        if (activating) {
          const count = await tx.eventRegistration.count({
            where: { eventId, status: { in: [EventRegistrationRecordStatus.PENDING, EventRegistrationRecordStatus.CONFIRMED] }, id: { not: registrationId } },
          });
          if (event.registrationCapacity != null && count >= event.registrationCapacity) throw new Error("EVENT_FULL");
        }

        await tx.eventRegistration.update({
          where: { id: registrationId },
          data: { status: nextStatus, activeIdentityKey },
        });
        if (nextStatus === EventRegistrationRecordStatus.CONFIRMED || nextStatus === EventRegistrationRecordStatus.CANCELLED) {
          const notification = await queueRegistrationNotification(tx, {
            registrationId: registration.id,
            userId: registration.userId,
            recipient: registration.email,
            type: nextStatus === EventRegistrationRecordStatus.CONFIRMED ? "REGISTRATION_CONFIRMED" : "REGISTRATION_CANCELLED",
            name: registration.fullName,
            eventTitle: event.title,
            eventDate: event.date.toISOString(),
            status: nextStatus,
          });
          if (notification) notificationIds.push(notification.notificationId);
        }
      }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });

      await deliverCreatedNotifications(notificationIds);
      revalidatePath(`/admin/registrations/${eventId}`);
      revalidatePath(`/admin/registrations/${eventId}/${registrationId}`);
      const event = await prisma.client.event.findUnique({ where: { id: eventId }, select: { slug: true } });
      if (event?.slug) revalidatePath(`/workshops/${event.slug}`);
      return { message: "Registration status updated.", error: null };
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === "NOT_FOUND") return { message: null, error: "Registration not found." };
        if (error.message === "UNCHANGED") return { message: null, error: "That status is already set." };
        if (error.message === "EVENT_FULL") return { message: null, error: "The event is full; this registration cannot be activated." };
      }
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") return { message: null, error: "Another active registration already uses this registration identity." };
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2034") continue;
      if (process.env.NODE_ENV !== "production") console.error("Admin registration status update failed:", error);
      return { message: null, error: "Unable to update the registration status." };
    }
  }

  return { message: null, error: "Registration changed concurrently. Reload and try again." };
}
