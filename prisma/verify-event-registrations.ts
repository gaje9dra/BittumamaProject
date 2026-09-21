import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";
import { EventRegistrationRecordStatus, Prisma, PrismaClient } from "../generated/prisma/client";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) throw new Error("DATABASE_URL is required.");

const adapter = new PrismaPg({ connectionString: databaseUrl });
const prisma = new PrismaClient({ adapter });
const suffix = Date.now().toString();
const slug = `phase-8-16-registration-test-${suffix}`;

async function registerWithSerializable(eventId: string, email: string) {
  return prisma.$transaction(async (tx) => {
    const event = await tx.event.findUnique({ where: { id: eventId }, select: { registrationCapacity: true } });
    if (!event) throw new Error("Test event missing.");
    const count = await tx.eventRegistration.count({ where: { eventId, status: { in: [EventRegistrationRecordStatus.PENDING, EventRegistrationRecordStatus.CONFIRMED] } } });
    if (event.registrationCapacity != null && count >= event.registrationCapacity) throw new Error("EVENT_FULL");
    return tx.eventRegistration.create({
      data: {
        eventId,
        fullName: "Phase 8.16 Test Registrant",
        email,
        status: EventRegistrationRecordStatus.CONFIRMED,
        activeIdentityKey: `email:${email}`,
      },
      select: { id: true },
    });
  }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
}

try {
  const event = await prisma.event.create({
    data: {
      slug,
      title: "Phase 8.16 Registration Test Event",
      category: "Test",
      shortDescription: "Synthetic development verification event.",
      date: new Date(Date.now() + 7 * 86400000),
      status: "PUBLISHED",
      registrationEnabled: true,
      registrationCapacity: 2,
      registrationMode: "ANONYMOUS_ALLOWED",
    },
    select: { id: true },
  });

  const first = await registerWithSerializable(event.id, "phase-8-16@example.invalid");
  let duplicateRejected = false;
  try {
    await registerWithSerializable(event.id, "phase-8-16@example.invalid");
  } catch (error) {
    duplicateRejected = error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002";
  }
  if (!duplicateRejected) throw new Error("Duplicate registration was not rejected.");

  await prisma.eventRegistration.update({
    where: { id: first.id },
    data: { status: EventRegistrationRecordStatus.CANCELLED, activeIdentityKey: null },
  });

  const reactivated = await registerWithSerializable(event.id, "phase-8-16@example.invalid");
  if (!reactivated.id) throw new Error("Cancelled registration could not be re-created.");

  await prisma.eventRegistration.deleteMany({ where: { eventId: event.id } });
  await prisma.event.update({ where: { id: event.id }, data: { registrationCapacity: 1 } });

  const attempts = await Promise.allSettled([
    registerWithSerializable(event.id, "phase-8-16-concurrent-a@example.invalid"),
    registerWithSerializable(event.id, "phase-8-16-concurrent-b@example.invalid"),
  ]);
  const successful = attempts.filter((result) => result.status === "fulfilled").length;
  if (successful !== 1) throw new Error(`Serializable capacity test expected exactly one success, received ${successful}.`);

  console.log(JSON.stringify({
    ok: true,
    duplicateProtection: duplicateRejected,
    cancellationReleasesCapacity: true,
    concurrentCapacityLimit: successful === 1,
  }, null, 2));
} finally {
  await prisma.event.deleteMany({ where: { slug } });
  await prisma.$disconnect();
}
