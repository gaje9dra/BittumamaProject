import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, UserRole } from "../generated/prisma/client";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required.");
}

const adapter = new PrismaPg({ connectionString: databaseUrl });
const prisma = new PrismaClient({ adapter });

const email = "phase-8-9-auth-test@example.invalid";
const provider = "phase-8-9-test-provider";
const providerAccountId = "phase-8-9-test-account";

try {
  const user = await prisma.user.create({
    data: {
      email,
      name: "Phase 8.9 Test User",
    },
    select: { id: true, email: true, role: true },
  });

  if (user.role !== UserRole.USER) {
    throw new Error(`New users must default to USER, received ${user.role}.`);
  }

  const account = await prisma.account.create({
    data: {
      userId: user.id,
      type: "oauth",
      provider,
      providerAccountId,
    },
    select: { id: true, userId: true, provider: true, providerAccountId: true },
  });

  let duplicateRejected = false;
  try {
    await prisma.account.create({
      data: {
        userId: user.id,
        type: "oauth",
        provider,
        providerAccountId,
      },
    });
  } catch {
    duplicateRejected = true;
  }

  if (!duplicateRejected) {
    throw new Error("Provider account uniqueness was not enforced.");
  }

  const session = await prisma.session.create({
    data: {
      sessionToken: "phase-8-9-session-token",
      userId: user.id,
      expires: new Date(Date.now() + 60 * 60 * 1000),
    },
    select: { id: true, userId: true, sessionToken: true },
  });

  const inquiry = await prisma.contactInquiry.create({
    data: {
      name: "Phase 8.9 Auth Contact Test",
      email: "phase-8-9-contact@example.invalid",
      message: "Synthetic inquiry used to verify the optional authenticated user relation.",
      userId: user.id,
      status: "NEW",
    },
    select: { id: true, userId: true, status: true },
  });

  if (inquiry.userId !== user.id || inquiry.status !== "NEW") {
    throw new Error("ContactInquiry user relation verification failed.");
  }

  console.log(JSON.stringify({
    ok: true,
    defaultRole: user.role,
    accountPersisted: account.userId === user.id,
    duplicateProviderIdentityRejected: duplicateRejected,
    sessionPersisted: session.userId === user.id,
    contactUserRelationPersisted: inquiry.userId === user.id,
    googleCredentialsConfigured: Boolean(process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET),
    oauthRealLoginTested: false,
  }, null, 2));

  await prisma.contactInquiry.delete({ where: { id: inquiry.id } });
  await prisma.session.delete({ where: { id: session.id } });
  await prisma.account.delete({ where: { id: account.id } });
  await prisma.user.delete({ where: { id: user.id } });
} finally {
  await prisma.$disconnect();
}
