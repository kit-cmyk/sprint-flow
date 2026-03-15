import { NextResponse } from "next/server"
import { auth } from "@/auth"
import prisma from "@/lib/prisma"

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params

  const ticket = await prisma.supportTicket.findUnique({
    where: { id },
    include: {
      replies: { orderBy: { timestamp: "asc" } },
      org: { select: { slug: true, name: true } },
    },
  })

  if (!ticket) return NextResponse.json({ error: "Not found" }, { status: 404 })

  const { globalRole, orgSlug } = session.user
  if (globalRole !== "super_admin" && ticket.org.slug !== orgSlug) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  return NextResponse.json(ticket)
}
