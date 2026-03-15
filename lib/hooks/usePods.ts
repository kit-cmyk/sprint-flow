"use client"

import useSWR from "swr"
import { fetcher } from "@/lib/fetcher"
import type { PodData } from "@/lib/pod-data"

export function usePods() {
  const { data, error, isLoading } = useSWR<PodData[]>("/api/pods", fetcher)
  return { pods: data ?? [], error, isLoading }
}

export function usePod(slug: string | null) {
  const { data, error, isLoading } = useSWR<PodData>(
    slug ? `/api/pods/${slug}` : null,
    fetcher
  )
  return { pod: data, error, isLoading }
}
