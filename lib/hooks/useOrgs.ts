"use client"

import useSWR from "swr"
import { fetcher } from "@/lib/fetcher"
import type { Organization } from "@/lib/organization-data"

export function useOrgs() {
  const { data, error, isLoading } = useSWR<Organization[]>("/api/orgs", fetcher)
  return { orgs: data ?? [], error, isLoading }
}

export function useOrg(slug: string | null) {
  const { data, error, isLoading } = useSWR<Organization>(
    slug ? `/api/orgs/${slug}` : null,
    fetcher
  )
  return { org: data, error, isLoading }
}
