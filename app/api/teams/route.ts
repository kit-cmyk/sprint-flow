import { NextResponse } from "next/server"
import { auth } from "@/auth"
import prisma from "@/lib/prisma"

export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { globalRole, orgSlug } = session.user

  if (globalRole === "super_admin") {
    const teams = await prisma.team.findMany({
      include: {
        org: { select: { slug: true, name: true } },
        teamDevelopers: { include: { developer: true } },
        teamPods: { include: { pod: true } },
      },
      orderBy: { name: "asc" },
    })
    return NextResponse.json(teams)
  }

  if (orgSlug) {
    const teams = await prisma.team.findMany({
      where: { org: { slug: orgSlug } },
      include: {
        org: { select: { slug: true, name: true } },
        teamDevelopers: { include: { developer: true } },
        teamPods: { include: { pod: true } },
      },
      orderBy: { name: "asc" },
    })
    return NextResponse.json(teams)
  }

  return NextResponse.json({ error: "Forbidden" }, { status: 403 })
}
