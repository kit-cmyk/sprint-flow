import { NextResponse } from "next/server"
import { auth } from "@/auth"
import prisma from "@/lib/prisma"

export async function GET(req: Request) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { globalRole, orgSlug } = session.user
  const { searchParams } = new URL(req.url)
  const filterSlug = searchParams.get("orgSlug")

  if (globalRole === "super_admin") {
    const events = await prisma.auditEvent.findMany({
      where: filterSlug ? { org: { slug: filterSlug } } : undefined,
      include: { org: { select: { slug: true, name: true } } },
      orderBy: { timestamp: "desc" },
      take: 100,
    })
    return NextResponse.json(events)
  }

  if (orgSlug) {
    const events = await prisma.auditEvent.findMany({
      where: { org: { slug: orgSlug } },
      orderBy: { timestamp: "desc" },
      take: 100,
    })
    return NextResponse.json(events)
  }

  return NextResponse.json({ error: "Forbidden" }, { status: 403 })
}
