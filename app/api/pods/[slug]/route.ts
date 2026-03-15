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
  const { globalRole, orgSlug, assignedPodSlugs } = session.user

  // product_owner can only see their assigned pods
  if (globalRole === "product_owner" && !assignedPodSlugs.includes(slug)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const pod = await prisma.pod.findUnique({
    where: { slug },
    include: {
      org: { select: { slug: true, name: true } },
      sprints: {
        orderBy: { startDate: "desc" },
        include: { tickets: true },
      },
      allocations: { include: { developer: true } },
    },
  })

  if (!pod) return NextResponse.json({ error: "Not found" }, { status: 404 })

  // org_admin can only see pods in their org
  if (globalRole === "org_admin" && pod.org.slug !== orgSlug) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  return NextResponse.json(pod)
}
