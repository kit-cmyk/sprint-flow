import { NextResponse } from "next/server"
import { auth } from "@/auth"
import prisma from "@/lib/prisma"

export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { globalRole, orgSlug } = session.user

  if (globalRole === "super_admin") {
    const tickets = await prisma.supportTicket.findMany({
      include: {
        replies: { orderBy: { timestamp: "asc" } },
        org: { select: { slug: true, name: true } },
      },
      orderBy: { id: "desc" },
    })
    return NextResponse.json(tickets)
  }

  if (orgSlug) {
    const tickets = await prisma.supportTicket.findMany({
      where: { org: { slug: orgSlug } },
      include: { replies: { orderBy: { timestamp: "asc" } } },
      orderBy: { id: "desc" },
    })
    return NextResponse.json(tickets)
  }

  return NextResponse.json({ error: "Forbidden" }, { status: 403 })
}
