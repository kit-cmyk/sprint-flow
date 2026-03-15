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

  const developer = await prisma.developer.findUnique({
    where: { slug },
    include: {
      allocations: { include: { pod: { include: { org: true } } } },
      prs: { orderBy: { hoursSinceUpdate: "asc" } },
      sprintTickets: { orderBy: { daysInProgress: "desc" } },
    },
  })

  if (!developer) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json(developer)
}
