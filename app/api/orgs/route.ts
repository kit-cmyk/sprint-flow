import { NextResponse } from "next/server"
import { auth } from "@/auth"
import prisma from "@/lib/prisma"

export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  if (session.user.globalRole !== "super_admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const orgs = await prisma.organization.findMany({
    include: {
      memberships: { include: { user: true } },
      pods: { select: { slug: true } },
      teams: { select: { slug: true } },
    },
    orderBy: { createdAt: "asc" },
  })

  return NextResponse.json(orgs)
}
