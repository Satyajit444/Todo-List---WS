import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

// Ensure we reuse Prisma in development to avoid multiple instances
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({ log: ["query", "info", "warn", "error"] });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
