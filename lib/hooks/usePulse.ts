"use client"

import useSWR from "swr"
import { fetcher } from "@/lib/fetcher"
import type { PulseReport, PulseBoard } from "@/lib/pulse-data"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ApiAny = any

function apiReportToPulseReport(r: ApiAny): PulseReport {
  return {
    id: r.id,
    sprint: r.sprint?.name ?? "",
    week: r.week,
    date: r.date,
    author: r.author,
    role: r.role,
    summary: r.summary,
    highlights: Array.isArray(r.highlights) ? (r.highlights as string[]) : [],
    board: (r.board as PulseBoard) ?? { todo: [], inProgress: [], done: [] },
  }
}

export function usePulse() {
  const { data, error, isLoading } = useSWR<ApiAny[]>("/api/pulse", fetcher)
  const reports: PulseReport[] = data?.map(apiReportToPulseReport) ?? []
  return { reports, error, isLoading }
}
