"use client"

import useSWR from "swr"
import { fetcher } from "@/lib/fetcher"
import type { PodData, HealthStatus, VelocityEntry } from "@/lib/pod-data"
import type { DeveloperData } from "@/lib/developer-data"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ApiAny = any

function mapTicketStatus(status: string): "done" | "in-progress" | "remaining" {
  if (status === "done") return "done"
  if (status === "in_progress") return "in-progress"
  return "remaining"
}

function apiPodToPodData(p: ApiAny): PodData {
  const s = p.sprints?.find((sp: ApiAny) => sp.isCurrent) ?? p.sprints?.[0] ?? {}
  return {
    slug: p.slug,
    name: p.name,
    client: p.client,
    healthScore: p.healthScore ?? 0,
    healthStatus: (p.healthStatus ?? "healthy") as HealthStatus,
    sprint: s.name ?? "",
    sprintStartDate: s.startDate ? String(s.startDate).split("T")[0] : "",
    sprintEndDate: s.endDate ? String(s.endDate).split("T")[0] : "",
    sprintDay: s.sprintDay ?? 0,
    totalDays: s.totalDays ?? 0,
    completion: s.completion ?? 0,
    expectedCompletion: s.expectedCompletion ?? 0,
    blockers: s.blockers ?? 0,
    carryoverRisk: s.carryoverRisk ?? 0,
    velocityDirection: (s.velocityDirection ?? "stable") as "up" | "down" | "stable",
    committedSP: s.committedSP ?? 0,
    committedTasks: s.committedTasks ?? 0,
    inProgressSP: s.inProgressSP ?? 0,
    inProgressTasks: s.inProgressTasks ?? 0,
    remainingSP: s.remainingSP ?? 0,
    remainingTasks: s.remainingTasks ?? 0,
    doneSP: s.doneSP ?? 0,
    doneTasks: s.doneTasks ?? 0,
    remainingCapacitySP: s.remainingCapacitySP ?? 0,
    storiesRemaining: s.storiesRemaining ?? 0,
    qaQueueCount: s.qaQueueCount ?? 0,
    sprintTickets: (s.tickets ?? []).map((t: ApiAny) => ({
      id: t.id,
      title: t.title,
      assignee: t.assigneeName,
      sp: t.storyPoints,
      status: mapTicketStatus(t.status),
    })),
    velocityHistory: Array.isArray(s.velocityHistory)
      ? (s.velocityHistory as VelocityEntry[])
      : [],
    carryoverHistory: Array.isArray(s.carryoverHistory)
      ? (s.carryoverHistory as { sprint: string; pct: number }[])
      : [],
  }
}

function allocationDevToDevData(dev: ApiAny): DeveloperData {
  return {
    slug: dev.slug,
    name: dev.name,
    role: dev.role ?? "",
    avatar: dev.avatar ?? "",
    currentSprint: dev.currentSprint ?? "",
    totalAllocation: dev.totalAllocation ?? 0,
    allocations: [],
    activeTickets: dev.activeTickets ?? 0,
    wipLimit: dev.wipLimit ?? 3,
    wipStatus: (dev.wipStatus ?? "healthy") as "healthy" | "over-limit",
    prsOpen: dev.prsOpen ?? 0,
    prsWaitingReview: dev.prsWaitingReview ?? 0,
    avgPrReviewTime: dev.avgPrReviewTime ?? 0,
    blockersOwned: dev.blockersOwned ?? 0,
    longestBlockedDuration: dev.longestBlockedHours ? `${dev.longestBlockedHours}h` : "0h",
    longestBlockedHours: dev.longestBlockedHours ?? 0,
    contextSwitchIndex: dev.contextSwitchIndex ?? 0,
    activeProjectsCount: dev.activeProjectsCount ?? 0,
    cycleTimeHistory: Array.isArray(dev.cycleTimeHistory) ? dev.cycleTimeHistory : [],
    throughputThisSprint: dev.throughputThisSprint ?? 0,
    throughput3SprintAvg: dev.throughput3SprintAvg ?? 0,
    ticketAging: Array.isArray(dev.ticketAging) ? dev.ticketAging : [],
    tickets: [],
    prs: [],
    prsOpenedThisSprint: dev.prsOpenedThisSprint ?? 0,
    prsMerged: dev.prsMerged ?? 0,
    avgTimeToMerge: dev.avgTimeToMerge ?? 0,
    reviewsDone: dev.reviewsDone ?? 0,
    riskSignals: Array.isArray(dev.riskSignals) ? dev.riskSignals : [],
  }
}

export function usePods() {
  const { data, error, isLoading } = useSWR<ApiAny[]>("/api/pods", fetcher)
  const pods: PodData[] = data?.map(apiPodToPodData) ?? []
  return { pods, error, isLoading }
}

export function usePod(slug: string | null) {
  const { data, error, isLoading } = useSWR<ApiAny>(
    slug ? `/api/pods/${slug}` : null,
    fetcher
  )
  const pod: PodData | undefined = data ? apiPodToPodData(data) : undefined
  const developers: DeveloperData[] = (data?.allocations ?? [])
    .map((a: ApiAny) => a.developer)
    .filter(Boolean)
    .map(allocationDevToDevData)
  return { pod, developers, error, isLoading }
}
