import { NextResponse } from "next/server"
import { auth } from "@/auth"
import prisma from "@/lib/prisma"

export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { globalRole, orgSlug, assignedPodSlugs } = session.user

  let pods

  if (globalRole === "super_admin") {
    pods = await prisma.pod.findMany({
      include: { sprints: { where: { isCurrent: true }, include: { tickets: true } } },
      orderBy: { name: "asc" },
    })
  } else if (globalRole === "org_admin" && orgSlug) {
    pods = await prisma.pod.findMany({
      where: { org: { slug: orgSlug } },
      include: { sprints: { where: { isCurrent: true }, include: { tickets: true } } },
      orderBy: { name: "asc" },
    })
  } else if (globalRole === "product_owner") {
    pods = await prisma.pod.findMany({
      where: { slug: { in: assignedPodSlugs } },
      include: { sprints: { where: { isCurrent: true }, include: { tickets: true } } },
      orderBy: { name: "asc" },
    })
  } else {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  return NextResponse.json(pods)
}
