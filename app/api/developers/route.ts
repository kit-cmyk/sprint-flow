import { NextResponse } from "next/server"
import { auth } from "@/auth"
import prisma from "@/lib/prisma"

export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { globalRole, orgSlug } = session.user

  if (globalRole === "super_admin") {
    const developers = await prisma.developer.findMany({
      include: { allocations: { include: { pod: true } }, prs: true },
      orderBy: { name: "asc" },
    })
    return NextResponse.json(developers)
  }

  if ((globalRole === "org_admin" || globalRole === "product_owner") && orgSlug) {
    const developers = await prisma.developer.findMany({
      where: {
        allocations: { some: { pod: { org: { slug: orgSlug } } } },
      },
      include: { allocations: { include: { pod: true } }, prs: true },
      orderBy: { name: "asc" },
    })
    return NextResponse.json(developers)
  }

  return NextResponse.json({ error: "Forbidden" }, { status: 403 })
}
