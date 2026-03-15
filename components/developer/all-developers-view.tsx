"use client"

import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { InfoTooltip } from "@/components/ui/info-tooltip"
import {
  AlertTriangle,
  ChevronRight,
  GitPullRequest,
  Layers,
  Shuffle,
} from "lucide-react"
import { developers } from "@/lib/developer-data"
import { AddDeveloperDialog } from "@/components/developer/add-developer-dialog"

export function AllDevelopersView() {
  const overLimitCount = developers.filter(
    (d) => d.wipStatus === "over-limit",
  ).length
  const overAllocCount = developers.filter(
    (d) => d.totalAllocation > 100,
  ).length
  const totalBlockers = developers.reduce(
    (acc, d) => acc + d.blockersOwned,
    0,
  )

  return (
    <div className="flex flex-col gap-6">
      {/* Header with Add button */}
      <div className="flex items-center justify-end">
        <AddDeveloperDialog />
      </div>

      {/* Summary KPI row */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Card className="border-border bg-card">
          <CardContent className="p-4">
            <p className="flex items-center text-xs text-muted-foreground">
              Total Team Members
              <InfoTooltip text="All team members currently assigned across any pod." />
            </p>
            <p className="mt-1 text-2xl font-bold text-foreground">
              {developers.length}
            </p>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="p-4">
            <p className="flex items-center text-xs text-muted-foreground">
              WIP Violations
              <InfoTooltip text="Team members currently exceeding their work-in-progress ticket limit." />
            </p>
            <p className={`mt-1 text-2xl font-bold ${overLimitCount > 0 ? "text-red-400" : "text-foreground"}`}>
              {overLimitCount}
            </p>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="p-4">
            <p className="flex items-center text-xs text-muted-foreground">
              Over-Allocated
              <InfoTooltip text="Team members whose total pod allocation exceeds 100%." />
            </p>
            <p className={`mt-1 text-2xl font-bold ${overAllocCount > 0 ? "text-amber-400" : "text-foreground"}`}>
              {overAllocCount}
            </p>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="p-4">
            <p className="flex items-center text-xs text-muted-foreground">
              Active Blockers
              <InfoTooltip text="Total unresolved blockers owned across all team members." />
            </p>
            <p className={`mt-1 text-2xl font-bold ${totalBlockers > 0 ? "text-red-400" : "text-foreground"}`}>
              {totalBlockers}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Desktop table */}
      <Card className="hidden border-border bg-card md:block">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs text-muted-foreground">
                  <th className="px-4 py-3 font-medium">Developer</th>
                  <th className="px-4 py-3 font-medium">
                    <span className="flex items-center">Pods<InfoTooltip text="Projects this developer is currently assigned to." /></span>
                  </th>
                  <th className="px-4 py-3 font-medium">
                    <span className="flex items-center">Allocation<InfoTooltip text="Combined allocation across all pods. Over 100% means overcommitted." /></span>
                  </th>
                  <th className="px-4 py-3 font-medium text-center">
                    <span className="flex items-center justify-center">WIP<InfoTooltip text="Active tickets vs. WIP limit." /></span>
                  </th>
                  <th className="px-4 py-3 font-medium text-center">
                    <span className="flex items-center justify-center">PRs<InfoTooltip text="Open pull requests / awaiting review." /></span>
                  </th>
                  <th className="px-4 py-3 font-medium text-center">
                    <span className="flex items-center justify-center">Blockers<InfoTooltip text="Unresolved blocker tickets owned by this developer." /></span>
                  </th>
                  <th className="px-4 py-3 font-medium text-center">
                    <span className="flex items-center justify-center">Ctx Switch<InfoTooltip text="Context switch index. Above 2.5 indicates fragmentation risk." /></span>
                  </th>
                  <th className="px-4 py-3 font-medium text-center">Risk Signals</th>
                  <th className="px-4 py-3 font-medium" />
                </tr>
              </thead>
              <tbody>
                {developers.map((dev) => {
                  const overWip = dev.wipStatus === "over-limit"
                  const overAlloc = dev.totalAllocation > 100
                  const highCtx = dev.contextSwitchIndex > 2.5
                  const riskCount = dev.riskSignals.length
                  // Link to the developer via first allocated pod
                  const firstPodSlug = dev.allocations[0]?.podName
                    .toLowerCase()
                    .replace(/ /g, "-") ?? "momentum-pod"

                  return (
                    <tr
                      key={dev.slug}
                      className="group border-b border-border/50 transition-colors last:border-0 hover:bg-muted/30"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/15 text-xs font-bold text-primary">
                            {dev.avatar}
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{dev.name}</p>
                            <p className="text-[10px] text-muted-foreground">{dev.role}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {dev.allocations.map((a) => (
                            <Badge
                              key={a.podName}
                              variant="secondary"
                              className="text-[10px] font-normal"
                            >
                              {a.podName.replace(" Pod", "")}
                            </Badge>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Progress
                            value={Math.min(dev.totalAllocation, 100)}
                            className="h-1.5 w-16"
                          />
                          <span
                            className={`text-xs font-semibold ${overAlloc ? "text-red-400" : "text-foreground"}`}
                          >
                            {dev.totalAllocation}%
                          </span>
                          {overAlloc && (
                            <AlertTriangle className="h-3 w-3 text-red-400" />
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${
                            overWip
                              ? "bg-red-500/15 text-red-400"
                              : "bg-emerald-500/15 text-emerald-400"
                          }`}
                        >
                          <Layers className="h-3 w-3" />
                          {dev.activeTickets}/{dev.wipLimit}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="inline-flex items-center gap-1 text-xs text-foreground">
                          <GitPullRequest className="h-3 w-3 text-muted-foreground" />
                          {dev.prsOpen}
                          {dev.prsWaitingReview > 0 && (
                            <span className="text-amber-400">
                              ({dev.prsWaitingReview} waiting)
                            </span>
                          )}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        {dev.blockersOwned > 0 ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-red-500/15 px-2 py-0.5 text-xs font-semibold text-red-400">
                            {dev.blockersOwned}
                          </span>
                        ) : (
                          <span className="text-xs text-muted-foreground">0</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span
                          className={`inline-flex items-center gap-1 text-xs font-semibold ${
                            highCtx ? "text-amber-400" : "text-foreground"
                          }`}
                        >
                          <Shuffle className="h-3 w-3" />
                          {dev.contextSwitchIndex}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        {riskCount > 2 ? (
                          <Badge variant="destructive" className="text-[10px]">
                            {riskCount} risks
                          </Badge>
                        ) : riskCount > 0 ? (
                          <Badge variant="secondary" className="text-[10px]">
                            {riskCount} risk{riskCount > 1 ? "s" : ""}
                          </Badge>
                        ) : (
                          <span className="text-[10px] text-muted-foreground">None</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Link
                          href={`/pod/${firstPodSlug}/dev/${dev.slug}`}
                          className="inline-flex items-center gap-1 text-xs text-primary transition-colors hover:text-primary/80"
                        >
                          View
                          <ChevronRight className="h-3 w-3" />
                        </Link>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Mobile cards */}
      <div className="flex flex-col gap-3 md:hidden">
        {developers.map((dev) => {
          const overWip = dev.wipStatus === "over-limit"
          const overAlloc = dev.totalAllocation > 100
          const firstPodSlug = dev.allocations[0]?.podName
            .toLowerCase()
            .replace(/ /g, "-") ?? "momentum-pod"

          return (
            <Link key={dev.slug} href={`/pod/${firstPodSlug}/dev/${dev.slug}`}>
              <Card className="border-border bg-card transition-all hover:border-primary/30">
                <CardContent className="flex items-center gap-3 p-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/15 text-sm font-bold text-primary">
                    {dev.avatar}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-foreground">
                        {dev.name}
                      </span>
                      {(overWip || overAlloc) && (
                        <AlertTriangle className="h-3 w-3 text-red-400" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">{dev.role}</p>
                    <div className="mt-1.5 flex flex-wrap gap-1.5 text-[10px]">
                      <span
                        className={`rounded-full px-1.5 py-0.5 font-semibold ${
                          overWip
                            ? "bg-red-500/15 text-red-400"
                            : "bg-emerald-500/15 text-emerald-400"
                        }`}
                      >
                        WIP {dev.activeTickets}/{dev.wipLimit}
                      </span>
                      <span
                        className={`rounded-full px-1.5 py-0.5 font-semibold ${
                          overAlloc
                            ? "bg-red-500/15 text-red-400"
                            : "bg-emerald-500/15 text-emerald-400"
                        }`}
                      >
                        {dev.totalAllocation}% alloc
                      </span>
                      {dev.blockersOwned > 0 && (
                        <span className="rounded-full bg-red-500/15 px-1.5 py-0.5 font-semibold text-red-400">
                          {dev.blockersOwned} blocker{dev.blockersOwned > 1 ? "s" : ""}
                        </span>
                      )}
                      {dev.allocations.map((a) => (
                        <Badge
                          key={a.podName}
                          variant="secondary"
                          className="text-[10px] font-normal"
                        >
                          {a.podName.replace(" Pod", "")}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
