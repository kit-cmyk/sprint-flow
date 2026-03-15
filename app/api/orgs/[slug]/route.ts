import { NextResponse } from "next/server"
import { auth } from "@/auth"
import prisma from "@/lib/prisma"

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { slug } = await params
  const { globalRole, orgSlug } = session.user

  // org_admin can only fetch their own org
  if (globalRole === "org_admin" && orgSlug !== slug) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }
  if (globalRole !== "super_admin" && globalRole !== "org_admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const org = await prisma.organization.findUnique({
    where: { slug },
    include: {
      memberships: { include: { user: true } },
      pods: { select: { slug: true } },
      teams: { select: { slug: true } },
    },
  })

  if (!org) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json(org)
}
