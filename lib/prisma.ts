import { PrismaClient } from "@prisma/client"

// Singleton pattern required for Next.js dev hot-reload.
// Without this, each hot reload creates a new PrismaClient,
// exhausting the Supabase connection pool quickly.

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  })

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma
