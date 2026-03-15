"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { AlertTriangle, ChevronRight, ChevronDown } from "lucide-react"
import { WorkloadSnapshot } from "@/components/developer/workload-snapshot"
import { DevFlowMetrics } from "@/components/developer/dev-flow-metrics"
import { ActiveWorkTable } from "@/components/developer/active-work-table"
import { PrActivity } from "@/components/developer/pr-activity"
import { AllocationView } from "@/components/developer/allocation-view"
import { RiskSignals } from "@/components/developer/risk-signals"
import type { DeveloperData } from "@/lib/developer-data"

export function DevPicker({
  developers,
  podSlug,
}: {
  developers: DeveloperData[]
  podSlug: string
}) {
  const [expandedDevSlug, setExpandedDevSlug] = useState<string | null>(null)

  const toggleDev = (devSlug: string) => {
    setExpandedDevSlug(expandedDevSlug === devSlug ? null : devSlug)
  }

  return (
    <section className="mb-4">
      <div className="mb-4">
        <h2 className="text-base font-semibold text-foreground">
          Pod Team Members
        </h2>
        <p className="text-xs text-muted-foreground">
          Click on a developer to view their workload dashboard
        </p>
      </div>
      <div className="flex flex-col gap-3">
        {developers.map((dev) => {
          const hasRisks = dev.riskSignals.length > 2
          const overWip = dev.wipStatus === "over-limit"
          const isExpanded = expandedDevSlug === dev.slug
          
          return (
            <div key={dev.slug} className="flex flex-col">
              <Card
                className={`group cursor-pointer border-border bg-card transition-all hover:border-primary/30 hover:bg-card/80 ${
                  hasRisks ? "border-red-500/20" : ""
                } ${isExpanded ? "border-primary/50" : ""}`}
                onClick={() => toggleDev(dev.slug)}
              >
                <CardContent className="flex items-center gap-3 p-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/15 text-sm font-bold text-primary">
                    {dev.avatar}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-foreground">
                        {dev.name}
                      </span>
                      {overWip && (
                        <AlertTriangle className="h-3 w-3 text-red-400" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {dev.role}
                    </p>
                    <div className="mt-1 flex flex-wrap items-center gap-2 text-[10px]">
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
                          dev.totalAllocation > 100
                            ? "bg-red-500/15 text-red-400"
                            : dev.totalAllocation > 85
                              ? "bg-amber-500/15 text-amber-400"
                              : "bg-emerald-500/15 text-emerald-400"
                        }`}
                      >
                        {dev.totalAllocation}% alloc
                      </span>
                      {dev.blockersOwned > 0 && (
                        <span className="rounded-full bg-red-500/15 px-1.5 py-0.5 font-semibold text-red-400">
                          {dev.blockersOwned} blocker
                          {dev.blockersOwned > 1 ? "s" : ""}
                        </span>
                      )}
                    </div>
                  </div>
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4 shrink-0 text-primary" />
                  ) : (
                    <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                  )}
                </CardContent>
              </Card>

              {/* Expanded Developer Detail View */}
              {isExpanded && (
                <div className="mt-3 flex flex-col gap-6 rounded-lg border border-border bg-muted/30 p-4 md:p-6">
                  <WorkloadSnapshot dev={dev} />
                  <DevFlowMetrics dev={dev} />
                  <ActiveWorkTable dev={dev} />
                  <PrActivity dev={dev} />
                  <AllocationView dev={dev} />
                  <RiskSignals dev={dev} />
                </div>
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}
