import { PrismaClient } from "@prisma/client"

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const db = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db

export async function getUserByUsername(username: string) {
  try {
    return db.user.findUnique({
      where: { username },
    })
  } catch (error) {
    console.error("getUserByUserName", error)
    return null
  }
}

export async function getUserByID(id: string) {
  try {
    return db.user.findUnique({
      where: { id },
    })
  } catch (error) {
    console.error("getUserByID", error)
  }
}
