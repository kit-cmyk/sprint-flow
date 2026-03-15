"use client"

import useSWR from "swr"
import { fetcher } from "@/lib/fetcher"
import type { PulseReport } from "@/lib/pulse-data"

export function usePulse() {
  const { data, error, isLoading } = useSWR<PulseReport[]>("/api/pulse", fetcher)
  return { reports: data ?? [], error, isLoading }
}
