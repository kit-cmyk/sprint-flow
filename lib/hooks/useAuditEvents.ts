"use client"

import useSWR from "swr"
import { fetcher } from "@/lib/fetcher"
import type { AuditEvent } from "@/lib/support-data"

export function useAuditEvents(orgSlug?: string) {
  const url = orgSlug ? `/api/audit-events?orgSlug=${orgSlug}` : "/api/audit-events"
  const { data, error, isLoading } = useSWR<AuditEvent[]>(url, fetcher)
  return { events: data ?? [], error, isLoading }
}
