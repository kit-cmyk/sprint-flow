"use client"

import { Card, CardContent } from "@/components/ui/card"
import { InfoTooltip } from "@/components/ui/info-tooltip"
import {
  Ticket,
  GitPullRequest,
  ShieldAlert,
  Shuffle,
} from "lucide-react"
import type { DeveloperData } from "@/lib/developer-data"

function KpiCard({
  icon: Icon,
  iconBg,
  iconColor,
  children,
}: {
  icon: React.ElementType
  iconBg: string
  iconColor: string
  children: React.ReactNode
}) {
  return (
    <Card className="border-border bg-card">
      <CardContent className="flex items-start gap-3 p-4">
        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${iconBg}`}
        >
          <Icon className={`h-4 w-4 ${iconColor}`} />
        </div>
        <div className="min-w-0 flex-1">{children}</div>
      </CardContent>
    </Card>
  )
}

export function WorkloadSnapshot({ dev }: { dev: DeveloperData }) {
  const wipOver = dev.activeTickets > dev.wipLimit
  const prReviewSlow = dev.avgPrReviewTime > 36
  const contextHigh = dev.contextSwitchIndex > 2.5

  return (
    <section>
      <div className="mb-4">
        <h2 className="text-base font-semibold text-foreground">
          Workload Snapshot
        </h2>
        <p className="text-xs text-muted-foreground">
          Current sprint workload indicators
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {/* Card 1: Active Tickets / WIP */}
        <KpiCard
          icon={Ticket}
          iconBg={wipOver ? "bg-red-500/10" : "bg-emerald-500/10"}
          iconColor={wipOver ? "text-red-400" : "text-emerald-400"}
        >
          <p className="flex items-center text-xs text-muted-foreground">Active Tickets<InfoTooltip text="Number of tickets currently in progress for this developer vs. their WIP limit." /></p>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span
              className={`text-2xl font-bold ${wipOver ? "text-red-400" : "text-foreground"}`}
            >
              {dev.activeTickets}
            </span>
            <span className="text-xs text-muted-foreground">
              / {dev.wipLimit} limit
            </span>
          </div>
          <div className="mt-1.5">
            {wipOver ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-red-500/15 px-2 py-0.5 text-[11px] font-semibold text-red-400">
                <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
                Over Limit
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[11px] font-semibold text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Healthy
              </span>
            )}
          </div>
        </KpiCard>

        {/* Card 2: PR Status */}
        <KpiCard
          icon={GitPullRequest}
          iconBg={prReviewSlow ? "bg-amber-500/10" : "bg-emerald-500/10"}
          iconColor={prReviewSlow ? "text-amber-400" : "text-emerald-400"}
        >
          <p className="flex items-center text-xs text-muted-foreground">Pull Requests<InfoTooltip text="Open PRs authored by this developer. Includes waiting review count and average review turnaround." /></p>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-2xl font-bold text-foreground">
              {dev.prsOpen}
            </span>
            <span className="text-xs text-muted-foreground">open</span>
          </div>
          <div className="mt-1.5 flex flex-col gap-0.5 text-xs text-muted-foreground">
            <span>
              {dev.prsWaitingReview} waiting review
            </span>
            <span className={prReviewSlow ? "text-red-400 font-medium" : ""}>
              Avg review: {dev.avgPrReviewTime}h
              {prReviewSlow && " (slow)"}
            </span>
          </div>
        </KpiCard>

        {/* Card 3: Blockers */}
        <KpiCard
          icon={ShieldAlert}
          iconBg={
            dev.blockersOwned > 0 ? "bg-red-500/10" : "bg-emerald-500/10"
          }
          iconColor={
            dev.blockersOwned > 0 ? "text-red-400" : "text-emerald-400"
          }
        >
          <p className="flex items-center text-xs text-muted-foreground">Blockers Owned<InfoTooltip text="Active blocker tickets assigned to this developer. Shows longest unresolved duration." /></p>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span
              className={`text-2xl font-bold ${dev.blockersOwned > 0 ? "text-red-400" : "text-foreground"}`}
            >
              {dev.blockersOwned}
            </span>
          </div>
          <div className="mt-1.5 text-xs text-muted-foreground">
            {dev.blockersOwned > 0 ? (
              <span
                className={
                  dev.longestBlockedHours > 24
                    ? "text-red-400 font-medium"
                    : ""
                }
              >
                Longest: {dev.longestBlockedDuration}
              </span>
            ) : (
              <span className="text-emerald-400">No active blockers</span>
            )}
          </div>
        </KpiCard>

        {/* Card 4: Context Switching */}
        <KpiCard
          icon={Shuffle}
          iconBg={contextHigh ? "bg-amber-500/10" : "bg-emerald-500/10"}
          iconColor={contextHigh ? "text-amber-400" : "text-emerald-400"}
        >
          <p className="flex items-center text-xs text-muted-foreground">Context Switching<InfoTooltip text="Index measuring how often this developer switches between different projects. Above 2.5 indicates fragmentation risk." /></p>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span
              className={`text-2xl font-bold ${contextHigh ? "text-amber-400" : "text-foreground"}`}
            >
              {dev.contextSwitchIndex.toFixed(1)}
            </span>
            <span className="text-xs text-muted-foreground">index</span>
          </div>
          <div className="mt-1.5 text-xs text-muted-foreground">
            {dev.activeProjectsCount} active projects
            {contextHigh && (
              <span className="ml-1 text-amber-400">(high)</span>
            )}
          </div>
        </KpiCard>
      </div>
    </section>
  )
}
