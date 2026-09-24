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

function getRuntimeConnectionString(databaseUrl: string) {
  try {
    const url = new URL(databaseUrl);

    // Supabase transaction pooling is the correct mode for Netlify/serverless
    // runtime traffic. Prisma must be told to use pooler-compatible behavior.
    if (url.port === "6543" && url.hostname.endsWith(".pooler.supabase.com")) {
      if (!url.searchParams.has("pgbouncer")) {
        url.searchParams.set("pgbouncer", "true");
      }
    }

    return url.toString();
  } catch {
    return databaseUrl;
  }
}

export function getPrismaClient() {
  if (!globalForPrisma.__bittumamaPrisma) {
    const adapter = new PrismaPg({
      connectionString: getRuntimeConnectionString(getDatabaseUrl()),
      max: 1,
      connectionTimeoutMillis: 10_000,
      idleTimeoutMillis: 30_000,
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
