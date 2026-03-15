"use client"

import useSWR from "swr"
import { fetcher } from "@/lib/fetcher"
import type { SupportTicket, TicketStatus, TicketCategory, TicketReply } from "@/lib/support-data"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ApiAny = any

function mapStatus(s: string): TicketStatus {
  if (s === "in_progress") return "in-progress"
  return s as TicketStatus
}

function mapCategory(c: string): TicketCategory {
  if (c === "feature_request") return "feature-request"
  return c as TicketCategory
}

function apiTicketToSupportTicket(t: ApiAny): SupportTicket {
  return {
    id: t.id,
    subject: t.subject,
    description: t.description,
    submittedBy: t.submittedBy,
    submittedByName: t.submittedByName,
    submittedByAvatar: t.submittedByAvatar,
    category: mapCategory(t.category),
    status: mapStatus(t.status),
    priority: t.priority,
    created: t.createdLabel ?? "",
    lastUpdate: t.lastUpdateLabel ?? "",
    orgSlug: t.org?.slug ?? "",
    replies: (t.replies ?? []).map((r: ApiAny): TicketReply => ({
      id: r.id,
      author: r.author,
      authorAvatar: r.authorAvatar,
      role: r.role?.replace("_", "-") as TicketReply["role"],
      body: r.body,
      timestamp: r.timestamp,
    })),
  }
}

export function useSupport() {
  const { data, error, isLoading } = useSWR<ApiAny[]>("/api/support", fetcher)
  const tickets: SupportTicket[] = data?.map(apiTicketToSupportTicket) ?? []
  return { tickets, error, isLoading }
}

export function useSupportTicket(id: string | null) {
  const { data, error, isLoading } = useSWR<ApiAny>(
    id ? `/api/support/${id}` : null,
    fetcher
  )
  const ticket: SupportTicket | undefined = data ? apiTicketToSupportTicket(data) : undefined
  return { ticket, error, isLoading }
}
