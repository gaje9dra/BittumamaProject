import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = { client: new PrismaClient({ adapter }) };
import { validateContactInquiryInput } from "../lib/contact/validation";

const synthetic = {
  name: "Phase 8.8 Test User",
  email: "phase-8-8-test@example.invalid",
  phone: "+91 90000 00000",
  service: "other",
  message: "Synthetic development inquiry used only to verify the Phase 8.8 database write path.",
  website: "",
  formStartedAt: new Date(Date.now() - 10_000).toISOString(),
};

const valid = validateContactInquiryInput(synthetic);
if (!valid.success) {
  console.error(JSON.stringify({ ok: false, stage: "valid-input", errors: valid.errors }, null, 2));
  process.exit(1);
}

const invalidCases: unknown[] = [
  { ...synthetic, email: "not-an-email" },
  { ...synthetic, name: "" },
  { ...synthetic, message: "too short" },
  { ...synthetic, message: "x".repeat(5001) },
  { ...synthetic, website: "https://spam.example" },
  { ...synthetic, unexpected: "not-allowed" },
];

for (const [index, candidate] of invalidCases.entries()) {
  const result = validateContactInquiryInput(candidate);
  if (result.success) {
    console.error(JSON.stringify({ ok: false, stage: "invalid-input", case: index }, null, 2));
    process.exit(1);
  }
}

const record = await prisma.client.contactInquiry.create({
  data: {
    name: valid.data.name,
    email: valid.data.email,
    phone: valid.data.phone,
    message: valid.data.message,
    status: "NEW",
  },
});

try {
  const stored = await prisma.client.contactInquiry.findUnique({
    where: { id: record.id },
    select: { id: true, name: true, email: true, phone: true, message: true, status: true, submittedAt: true, createdAt: true, updatedAt: true },
  });

  if (!stored || stored.status !== "NEW" || stored.email !== synthetic.email || stored.name !== synthetic.name) {
    console.error(JSON.stringify({ ok: false, stage: "database-write", stored }, null, 2));
    process.exit(1);
  }

  console.log(JSON.stringify({
    ok: true,
    message: "Phase 8.8 ContactInquiry validation and database write verification passed.",
    checkedId: stored.id,
    status: stored.status,
    timestampsPresent: Boolean(stored.submittedAt && stored.createdAt && stored.updatedAt),
    invalidCasesChecked: invalidCases.length,
  }, null, 2));
} finally {
  await prisma.client.contactInquiry.delete({ where: { id: record.id } });
  await prisma.client.$disconnect();
}
