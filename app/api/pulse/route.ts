import { NextResponse } from "next/server"
import { auth } from "@/auth"
import prisma from "@/lib/prisma"

export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { globalRole, orgSlug, assignedPodSlugs } = session.user

  if (globalRole === "super_admin") {
    const reports = await prisma.pulseReport.findMany({
      include: { sprint: { include: { pod: true } } },
      orderBy: { date: "desc" },
    })
    return NextResponse.json(reports)
  }

  if (globalRole === "org_admin" && orgSlug) {
    const reports = await prisma.pulseReport.findMany({
      where: { sprint: { pod: { org: { slug: orgSlug } } } },
      include: { sprint: { include: { pod: true } } },
      orderBy: { date: "desc" },
    })
    return NextResponse.json(reports)
  }

  if (globalRole === "product_owner") {
    const reports = await prisma.pulseReport.findMany({
      where: { sprint: { pod: { slug: { in: assignedPodSlugs } } } },
      include: { sprint: { include: { pod: true } } },
      orderBy: { date: "desc" },
    })
    return NextResponse.json(reports)
  }

  return NextResponse.json({ error: "Forbidden" }, { status: 403 })
}
