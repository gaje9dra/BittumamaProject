import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, UserRole } from "../generated/prisma/client";

const databaseUrl = process.env.DATABASE_URL;
const email = process.env.BOOTSTRAP_ADMIN_EMAIL?.trim().toLowerCase();
const confirmation = process.env.BOOTSTRAP_ADMIN_CONFIRM;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required.");
}

if (!email) {
  throw new Error("BOOTSTRAP_ADMIN_EMAIL is required.");
}

if (confirmation !== "YES") {
  throw new Error('Set BOOTSTRAP_ADMIN_CONFIRM="YES" intentionally before running this command.');
}

if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
  throw new Error("BOOTSTRAP_ADMIN_EMAIL must be a valid email address.");
}

const adapter = new PrismaPg({ connectionString: databaseUrl });
const prisma = new PrismaClient({ adapter });

try {
  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true, email: true, role: true },
  });

  if (!user) {
    throw new Error("No matching User exists. Complete a real Google sign-in first, then rerun this bootstrap command.");
  }

  const updated = await prisma.user.update({
    where: { id: user.id },
    data: { role: UserRole.ADMIN },
    select: { id: true, email: true, role: true },
  });

  console.log(JSON.stringify({
    ok: true,
    message: "Existing user promoted to ADMIN by intentional server-side bootstrap.",
    user: updated,
  }, null, 2));
} finally {
  await prisma.$disconnect();
}
