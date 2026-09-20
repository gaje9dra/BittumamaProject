import "server-only";

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

type PrismaGlobal = typeof globalThis & {
  __bittumamaPrisma?: PrismaClient;
};

const globalForPrisma = globalThis as PrismaGlobal;

function getDatabaseUrl() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error(
      "DATABASE_URL is required to use the Bittumama database. Add it to .env.local.",
    );
  }

  return databaseUrl;
}

export function getPrismaClient() {
  if (!globalForPrisma.__bittumamaPrisma) {
    const adapter = new PrismaPg({
      connectionString: getDatabaseUrl(),
    });

    globalForPrisma.__bittumamaPrisma = new PrismaClient({ adapter });
  }

  return globalForPrisma.__bittumamaPrisma;
}

export const prisma = {
  get client() {
    return getPrismaClient();
  },
};
