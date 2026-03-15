"use client"

import useSWR from "swr"
import { fetcher } from "@/lib/fetcher"
import type { TeamData } from "@/lib/team-data"

export function useTeams() {
  const { data, error, isLoading } = useSWR<TeamData[]>("/api/teams", fetcher)
  return { teams: data ?? [], error, isLoading }
}
