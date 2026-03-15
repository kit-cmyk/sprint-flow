"use client"

import useSWR from "swr"
import { fetcher } from "@/lib/fetcher"
import type { SupportTicket } from "@/lib/support-data"

export function useSupport() {
  const { data, error, isLoading } = useSWR<SupportTicket[]>("/api/support", fetcher)
  return { tickets: data ?? [], error, isLoading }
}

export function useSupportTicket(id: string | null) {
  const { data, error, isLoading } = useSWR<SupportTicket>(
    id ? `/api/support/${id}` : null,
    fetcher
  )
  return { ticket: data, error, isLoading }
}
