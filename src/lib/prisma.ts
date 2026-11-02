import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  keepaliveStarted?: boolean;
};

function createPrismaClient(): PrismaClient {
  const connectionString =
    process.env.DATABASE_URL || process.env.DIRECT_URL || "";

  const adapter = new PrismaNeon({
    connectionString,
  });

  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

// Background warmup & keep-alive:
// Neon DB auto-suspends compute after 5 minutes of inactivity, causing 4-5s cold starts.
// Pinging SELECT 1 every 4 minutes keeps the connection hot and eliminates cold starts.
if (!globalForPrisma.keepaliveStarted) {
  globalForPrisma.keepaliveStarted = true;

  // Immediate non-blocking warmup
  prisma
    .$executeRawUnsafe("SELECT 1")
    .catch((err) => console.warn("Prisma warmup ping:", err?.message || err));

  if (typeof setInterval !== "undefined") {
    const timer = setInterval(() => {
      prisma
        .$executeRawUnsafe("SELECT 1")
        .catch(() => {});
    }, 4 * 60 * 1000); // 4 minutes

    if (timer && typeof timer.unref === "function") {
      timer.unref();
    }
  }
}

export default prisma;
