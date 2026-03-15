"use client"

import useSWR from "swr"
import { fetcher } from "@/lib/fetcher"
import type { DeveloperData } from "@/lib/developer-data"

export function useDevelopers() {
  const { data, error, isLoading } = useSWR<DeveloperData[]>("/api/developers", fetcher)
  return { developers: data ?? [], error, isLoading }
}

export function useDeveloper(slug: string | null) {
  const { data, error, isLoading } = useSWR<DeveloperData>(
    slug ? `/api/developers/${slug}` : null,
    fetcher
  )
  return { developer: data, error, isLoading }
}
