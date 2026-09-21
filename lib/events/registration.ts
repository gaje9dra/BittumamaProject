import "server-only";

import { Prisma, EventRegistrationRecordStatus, EventRegistrationMode } from "@/generated/prisma/client";
import { getCurrentUser } from "@/lib/auth/guards";
import { prisma } from "@/lib/db/prisma";
import { deliverCreatedNotifications, queueRegistrationNotification } from "@/lib/notifications/domain";

const CAPACITY_STATUSES: EventRegistrationRecordStatus[] = [
  EventRegistrationRecordStatus.PENDING,
  EventRegistrationRecordStatus.CONFIRMED,
];

export type RegistrationEligibilityReason =
  | "OPEN"
  | "EVENT_NOT_FOUND"
  | "EVENT_NOT_PUBLISHED"
  | "REGISTRATION_DISABLED"
  | "REGISTRATION_DEADLINE_PASSED"
  | "EVENT_FULL"
  | "AUTHENTICATION_REQUIRED";

export type RegistrationAvailability = {
  open: boolean;
  reason: RegistrationEligibilityReason;
  count: number;
  capacity: number | null;
  remaining: number | null;
  mode: EventRegistrationMode;
  currentUserRegistration: {
    id: string;
    status: EventRegistrationRecordStatus;
    createdAt: Date;
  } | null;
};

function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

function validateName(value: string) {
  const normalized = value.trim().replace(/\s+/g, " ");
  return normalized.length >= 2 && normalized.length <= 160 ? normalized : null;
}

function validateEmail(value: string) {
  const normalized = normalizeEmail(value);
  return normalized.length <= 320 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized) ? normalized : null;
}

function validateOptional(value: string, max: number) {
  const normalized = value.trim();
  return normalized ? normalized.slice(0, max) : null;
}

function isPublicEvent(record: { status: string; publishAt: Date | null }) {
  return record.status === "PUBLISHED" && (!record.publishAt || record.publishAt <= new Date());
}

async function getEventForRegistration(eventId: string) {
  return prisma.client.event.findUnique({
    where: { id: eventId },
    select: {
      id: true,
      status: true,
      publishAt: true,
      registrationEnabled: true,
      registrationCapacity: true,
      registrationDeadline: true,
      registrationMode: true,
    },
  });
}

async function getRegistrationCount(eventId: string) {
  return prisma.client.eventRegistration.count({
    where: { eventId, status: { in: CAPACITY_STATUSES } },
  });
}

export async function getRegistrationAvailability(eventId: string, userId?: string | null): Promise<RegistrationAvailability> {
  const event = await getEventForRegistration(eventId);
  if (!event) {
    return { open: false, reason: "EVENT_NOT_FOUND", count: 0, capacity: null, remaining: null, mode: EventRegistrationMode.ANONYMOUS_ALLOWED, currentUserRegistration: null };
  }

  const count = await getRegistrationCount(eventId);
  const currentUserRegistration = userId
    ? await prisma.client.eventRegistration.findFirst({
        where: { eventId, userId, status: { in: CAPACITY_STATUSES } },
        select: { id: true, status: true, createdAt: true },
      })
    : null;

  if (!isPublicEvent(event)) {
    return { open: false, reason: event.status === "PUBLISHED" ? "EVENT_NOT_PUBLISHED" : "EVENT_NOT_PUBLISHED", count, capacity: event.registrationCapacity, remaining: event.registrationCapacity == null ? null : Math.max(event.registrationCapacity - count, 0), mode: event.registrationMode, currentUserRegistration };
  }
  if (!event.registrationEnabled) {
    return { open: false, reason: "REGISTRATION_DISABLED", count, capacity: event.registrationCapacity, remaining: event.registrationCapacity == null ? null : Math.max(event.registrationCapacity - count, 0), mode: event.registrationMode, currentUserRegistration };
  }
  if (event.registrationDeadline && event.registrationDeadline <= new Date()) {
    return { open: false, reason: "REGISTRATION_DEADLINE_PASSED", count, capacity: event.registrationCapacity, remaining: event.registrationCapacity == null ? null : Math.max(event.registrationCapacity - count, 0), mode: event.registrationMode, currentUserRegistration };
  }
  if (event.registrationCapacity != null && count >= event.registrationCapacity) {
    return { open: false, reason: "EVENT_FULL", count, capacity: event.registrationCapacity, remaining: 0, mode: event.registrationMode, currentUserRegistration };
  }
  if (event.registrationMode === EventRegistrationMode.AUTHENTICATED_ONLY && !userId) {
    return { open: false, reason: "AUTHENTICATION_REQUIRED", count, capacity: event.registrationCapacity, remaining: event.registrationCapacity == null ? null : Math.max(event.registrationCapacity - count, 0), mode: event.registrationMode, currentUserRegistration };
  }

  return { open: true, reason: "OPEN", count, capacity: event.registrationCapacity, remaining: event.registrationCapacity == null ? null : Math.max(event.registrationCapacity - count, 0), mode: event.registrationMode, currentUserRegistration };
}

export type RegistrationActionState = {
  ok: boolean;
  message: string | null;
  fieldErrors: Record<string, string>;
};

export const registrationInitialState: RegistrationActionState = {
  ok: false,
  message: null,
  fieldErrors: {},
};

function failure(message: string, fieldErrors: Record<string, string> = {}): RegistrationActionState {
  return { ok: false, message, fieldErrors };
}

function retryable(error: unknown) {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2034";
}

export async function createRegistration(
  _previous: RegistrationActionState,
  formData: FormData,
): Promise<RegistrationActionState> {
  const eventId = String(formData.get("eventId") ?? "").trim();
  if (!/^[A-Za-z0-9_-]{1,64}$/.test(eventId)) return failure("This event is not available for registration.");

  const user = await getCurrentUser();
  const event = await getEventForRegistration(eventId);
  if (!event) return failure("Event not found.");
  if (!isPublicEvent(event)) return failure("Registration is unavailable because this event is not currently public.");
  if (!event.registrationEnabled) return failure("Registration is closed for this event.");
  if (event.registrationMode === EventRegistrationMode.AUTHENTICATED_ONLY && !user) return failure("Please sign in to register for this event.");

  const name = validateName(String(formData.get("fullName") ?? ""));
  const email = validateEmail(String(formData.get("email") ?? ""));
  const phone = validateOptional(String(formData.get("phone") ?? ""), 40);
  const organization = validateOptional(String(formData.get("organization") ?? ""), 160);
  const notes = validateOptional(String(formData.get("notes") ?? ""), 2000);
  const honeypot = String(formData.get("website") ?? "").trim();

  if (honeypot) return failure("Unable to process this registration.");
  const fieldErrors: Record<string, string> = {};
  if (!name) fieldErrors.fullName = "Enter your full name.";
  if (!email) fieldErrors.email = "Enter a valid email address.";
  if (phone && (phone.length < 7 || phone.length > 40)) fieldErrors.phone = "Enter a valid phone number.";
  if (Object.keys(fieldErrors).length) return failure("Please correct the highlighted fields.", fieldErrors);

  const identityKey = user ? `user:${user.id}` : `email:${email}`;

  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      const notificationIds: string[] = [];
      await prisma.client.$transaction(async (tx) => {
        const lockedEvent = await tx.event.findUnique({
          where: { id: eventId },
          select: { status: true, publishAt: true, registrationEnabled: true, registrationCapacity: true, registrationDeadline: true, registrationMode: true, title: true, date: true },
        });
        if (!lockedEvent || !isPublicEvent(lockedEvent)) throw new Error("EVENT_NOT_PUBLIC");
        if (!lockedEvent.registrationEnabled) throw new Error("REGISTRATION_DISABLED");
        if (lockedEvent.registrationDeadline && lockedEvent.registrationDeadline <= new Date()) throw new Error("REGISTRATION_DEADLINE_PASSED");
        if (lockedEvent.registrationMode === EventRegistrationMode.AUTHENTICATED_ONLY && !user) throw new Error("AUTHENTICATION_REQUIRED");

        const count = await tx.eventRegistration.count({
          where: { eventId, status: { in: CAPACITY_STATUSES } },
        });
        if (lockedEvent.registrationCapacity != null && count >= lockedEvent.registrationCapacity) throw new Error("EVENT_FULL");

        const registration = await tx.eventRegistration.create({
          data: {
            eventId,
            userId: user?.id ?? null,
            fullName: name!,
            email: email!,
            phone,
            organization,
            notes,
            status: EventRegistrationRecordStatus.CONFIRMED,
            activeIdentityKey: identityKey,
          },
          select: { id: true, userId: true, fullName: true, email: true, status: true },
        });
        const notification = await queueRegistrationNotification(tx, {
          registrationId: registration.id,
          userId: registration.userId,
          recipient: registration.email,
          type: "REGISTRATION_RECEIVED",
          name: registration.fullName,
          eventTitle: lockedEvent.title,
          eventDate: lockedEvent.date.toISOString(),
          status: registration.status,
        });
        if (notification) notificationIds.push(notification.notificationId);
      }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });

      await deliverCreatedNotifications(notificationIds);
      return { ok: true, message: "Registration confirmed.", fieldErrors: {} };
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === "EVENT_FULL") return failure("This event is full.");
        if (error.message === "REGISTRATION_DEADLINE_PASSED") return failure("Registration has closed for this event.");
        if (error.message === "REGISTRATION_DISABLED" || error.message === "EVENT_NOT_PUBLIC") return failure("Registration is unavailable for this event.");
        if (error.message === "AUTHENTICATION_REQUIRED") return failure("Please sign in to register for this event.");
      }
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") return failure("You are already registered for this event.");
      if (retryable(error)) continue;
      if (process.env.NODE_ENV !== "production") console.error("Event registration failed:", error);
      return failure("We could not complete the registration. Please try again.");
    }
  }

  return failure("Registration changed while you were submitting. Please try again.");
}

export async function getCurrentUserRegistrations() {
  const user = await getCurrentUser();
  if (!user) return [];
  return prisma.client.eventRegistration.findMany({
    where: { userId: user.id },
    select: {
      id: true, status: true, createdAt: true, updatedAt: true,
      event: { select: { id: true, title: true, slug: true, date: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function cancelOwnRegistration(registrationId: string) {
  const user = await getCurrentUser();
  if (!user) return failure("Please sign in to manage your registration.");
  if (!/^[A-Za-z0-9_-]{1,64}$/.test(registrationId)) return failure("Registration not found.");

  try {
    const result = await prisma.client.$transaction(async (tx) => {
      const registration = await tx.eventRegistration.findFirst({
        where: { id: registrationId, userId: user.id },
        select: { id: true, status: true, eventId: true, event: { select: { date: true } } },
      });
      if (!registration) throw new Error("NOT_FOUND");
      if (!CAPACITY_STATUSES.includes(registration.status)) throw new Error("NOT_CANCELLABLE");
      if (registration.event.date <= new Date()) throw new Error("EVENT_STARTED");

      return tx.eventRegistration.update({
        where: { id: registration.id },
        data: { status: EventRegistrationRecordStatus.CANCELLED, activeIdentityKey: null },
        select: { id: true, eventId: true },
      });
    });
    const notificationIds: string[] = [];
    await prisma.client.$transaction(async (tx) => {
      const registration = await tx.eventRegistration.findUnique({
        where: { id: result.id },
        select: { id: true, userId: true, fullName: true, email: true, status: true, event: { select: { title: true, date: true } } },
      });
      if (!registration) return;
      const notification = await queueRegistrationNotification(tx, {
        registrationId: registration.id,
        userId: registration.userId,
        recipient: registration.email,
        type: "REGISTRATION_CANCELLED",
        name: registration.fullName,
        eventTitle: registration.event.title,
        eventDate: registration.event.date.toISOString(),
        status: registration.status,
      });
      if (notification) notificationIds.push(notification.notificationId);
    });
    await deliverCreatedNotifications(notificationIds);
    return { ok: true, message: "Registration cancelled.", fieldErrors: {}, eventId: result.eventId };
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "NOT_FOUND") return failure("Registration not found.");
      if (error.message === "NOT_CANCELLABLE") return failure("This registration cannot be cancelled.");
      if (error.message === "EVENT_STARTED") return failure("Registration can no longer be cancelled for this event.");
    }
    if (process.env.NODE_ENV !== "production") console.error("Registration cancellation failed:", error);
    return failure("Unable to cancel the registration.");
  }
}
