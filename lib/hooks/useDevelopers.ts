"use client"

import useSWR from "swr"
import { fetcher } from "@/lib/fetcher"
import type { DeveloperData, DeveloperAllocation, ActiveTicket, PRActivity, CycleTimeSprint } from "@/lib/developer-data"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ApiAny = any

function mapDevTicketStatus(status: string): ActiveTicket["status"] {
  if (status === "in_progress") return "in-progress"
  if (status === "in_review") return "in-review"
  if (status === "qa") return "qa"
  if (status === "blocked") return "blocked"
  return "in-progress"
}

function apiDevToDeveloperData(d: ApiAny): DeveloperData {
  return {
    slug: d.slug,
    name: d.name,
    role: d.role ?? "",
    avatar: d.avatar ?? "",
    currentSprint: d.currentSprint ?? "",
    totalAllocation: d.totalAllocation ?? 0,
    allocations: (d.allocations ?? []).map((a: ApiAny): DeveloperAllocation => ({
      podName: a.pod?.name ?? "",
      client: a.pod?.client ?? "",
      percentage: a.percentage ?? 0,
    })),
    activeTickets: d.activeTickets ?? 0,
    wipLimit: d.wipLimit ?? 3,
    wipStatus: (d.wipStatus ?? "healthy") as "healthy" | "over-limit",
    prsOpen: d.prsOpen ?? 0,
    prsWaitingReview: d.prsWaitingReview ?? 0,
    avgPrReviewTime: d.avgPrReviewTime ?? 0,
    blockersOwned: d.blockersOwned ?? 0,
    longestBlockedDuration: d.longestBlockedHours ? `${d.longestBlockedHours}h` : "0h",
    longestBlockedHours: d.longestBlockedHours ?? 0,
    contextSwitchIndex: d.contextSwitchIndex ?? 0,
    activeProjectsCount: d.activeProjectsCount ?? 0,
    cycleTimeHistory: Array.isArray(d.cycleTimeHistory)
      ? (d.cycleTimeHistory as CycleTimeSprint[])
      : [],
    throughputThisSprint: d.throughputThisSprint ?? 0,
    throughput3SprintAvg: d.throughput3SprintAvg ?? 0,
    ticketAging: Array.isArray(d.ticketAging) ? d.ticketAging : [],
    tickets: (d.sprintTickets ?? []).map((t: ApiAny): ActiveTicket => ({
      ticketId: t.id,
      project: String(t.id).split("-")[0] ?? "",
      storyType: (t.storyType ?? "feature") as ActiveTicket["storyType"],
      status: mapDevTicketStatus(t.status),
      daysInProgress: t.daysInProgress ?? 0,
      blocked: t.blocked ?? false,
      prLinked: t.prLinked ?? false,
      riskLevel: (t.riskLevel ?? "low") as "low" | "medium" | "high",
    })),
    prs: (d.prs ?? []).map((pr: ApiAny): PRActivity => ({
      prId: pr.id,
      title: pr.title ?? "",
      status: (pr.status ?? "open") as PRActivity["status"],
      createdAt: pr.createdAt ? String(pr.createdAt).split("T")[0] : "",
      hoursSinceUpdate: pr.hoursSinceUpdate ?? 0,
    })),
    prsOpenedThisSprint: d.prsOpenedThisSprint ?? 0,
    prsMerged: d.prsMerged ?? 0,
    avgTimeToMerge: d.avgTimeToMerge ?? 0,
    reviewsDone: d.reviewsDone ?? 0,
    riskSignals: Array.isArray(d.riskSignals) ? (d.riskSignals as string[]) : [],
  }
}

export function useDevelopers() {
  const { data, error, isLoading } = useSWR<ApiAny[]>("/api/developers", fetcher)
  const developers: DeveloperData[] = data?.map(apiDevToDeveloperData) ?? []
  return { developers, error, isLoading }
}

export function useDeveloper(slug: string | null) {
  const { data, error, isLoading } = useSWR<ApiAny>(
    slug ? `/api/developers/${slug}` : null,
    fetcher
  )
  const developer: DeveloperData | undefined = data ? apiDevToDeveloperData(data) : undefined
  return { developer, error, isLoading }
}
