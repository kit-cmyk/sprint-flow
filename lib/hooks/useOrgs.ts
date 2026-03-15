"use client"

import useSWR from "swr"
import { fetcher } from "@/lib/fetcher"
import type { Organization, OrgMember } from "@/lib/organization-data"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ApiAny = any

function apiOrgToOrganization(o: ApiAny): Organization {
  return {
    id: o.id,
    slug: o.slug,
    name: o.name,
    logoInitials: o.logoInitials ?? o.name?.slice(0, 2).toUpperCase() ?? "??",
    plan: o.plan ?? "Starter",
    status: o.status ?? "active",
    seats: o.seats ?? 0,
    seatsUsed: o.seatsUsed ?? 0,
    mrr: o.mrr ?? 0,
    createdAt: o.createdAt ? String(o.createdAt).split("T")[0] : "",
    adminEmail: o.adminEmail ?? "",
    podSlugs: (o.pods ?? []).map((p: ApiAny) => p.slug),
    teamSlugs: (o.teams ?? []).map((t: ApiAny) => t.slug),
    developerSlugs: [],
    members: (o.memberships ?? []).map((m: ApiAny): OrgMember => ({
      id: m.id,
      name: m.user?.name ?? "",
      email: m.user?.email ?? "",
      role: m.role ?? "developer",
      status: m.status ?? "active",
      lastActive: m.lastActive ?? "—",
      avatar: m.user?.avatar ?? m.user?.name?.slice(0, 2).toUpperCase() ?? "??",
    })),
  }
}

export function useOrgs() {
  const { data, error, isLoading } = useSWR<ApiAny[]>("/api/orgs", fetcher)
  const orgs: Organization[] = data?.map(apiOrgToOrganization) ?? []
  return { orgs, error, isLoading }
}

export function useOrg(slug: string | null) {
  const { data, error, isLoading } = useSWR<ApiAny>(
    slug ? `/api/orgs/${slug}` : null,
    fetcher
  )
  const org: Organization | undefined = data ? apiOrgToOrganization(data) : undefined
  return { org, error, isLoading }
}
