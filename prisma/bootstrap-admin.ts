import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";
import { AuditAction, AuditCategory, AuditResult, PrismaClient } from "../generated/prisma/client";
import { hashPassword, validatePassword } from "../lib/auth/password";
import { isValidEmail, normalizeEmail } from "../lib/auth/normalize-email";

const databaseUrl = process.env.DATABASE_URL;
const emailInput = process.env.BOOTSTRAP_ADMIN_EMAIL;
const password = process.env.BOOTSTRAP_ADMIN_PASSWORD;
const confirmation = process.env.BOOTSTRAP_ADMIN_CONFIRM;

if (!databaseUrl) throw new Error("DATABASE_URL is required.");
if (!emailInput) throw new Error("BOOTSTRAP_ADMIN_EMAIL is required.");
if (!password) throw new Error("BOOTSTRAP_ADMIN_PASSWORD is required.");
if (confirmation !== "YES") throw new Error('Set BOOTSTRAP_ADMIN_CONFIRM="YES" intentionally before running this command.');

const email = normalizeEmail(emailInput);
if (!isValidEmail(email)) throw new Error("BOOTSTRAP_ADMIN_EMAIL must be a valid email address.");
if (!validatePassword(password, 14)) throw new Error("BOOTSTRAP_ADMIN_PASSWORD must be at least 14 characters.");

const adapter = new PrismaPg({ connectionString: databaseUrl });
const prisma = new PrismaClient({ adapter });

try {
  const existing = await prisma.adminAccount.findUnique({ where: { normalizedEmail: email }, select: { id: true } });
  const passwordHash = await hashPassword(password);
  const admin = await prisma.adminAccount.upsert({ where: { normalizedEmail: email }, create: { email, normalizedEmail: email, passwordHash, isActive: true }, update: { email, passwordHash, isActive: true }, select: { id: true, email: true, isActive: true } });
  if (existing) {
    await prisma.adminSession.deleteMany({ where: { adminAccountId: admin.id } });
  }

  await prisma.auditLog.create({
    data: {
      action: AuditAction.SYSTEM_CONFIGURATION_CHANGED,
      category: AuditCategory.SYSTEM,
      result: AuditResult.SUCCESS,
      entityType: "AdminAccount",
      entityId: admin.id,
      summary: "Administrator account provisioned through the secure server-side bootstrap.",
    },
  });
  console.log(JSON.stringify({ ok:true, message:"AdminAccount provisioned securely. No User.role value was changed.", admin:{id:admin.id,email:admin.email,isActive:admin.isActive} },null,2));
} finally { await prisma.$disconnect(); }
