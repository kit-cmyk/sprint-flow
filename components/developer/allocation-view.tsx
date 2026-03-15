"use client"

import { Card, CardContent } from "@/components/ui/card"
import { AlertTriangle, Shuffle } from "lucide-react"
import type { DeveloperData } from "@/lib/developer-data"

const ALLOCATION_COLORS = [
  "#34d399",
  "#2dd4bf",
  "#38bdf8",
  "#a78bfa",
  "#f59e0b",
]

export function AllocationView({ dev }: { dev: DeveloperData }) {
  const overAllocated = dev.totalAllocation > 100
  const contextHigh = dev.contextSwitchIndex > 2.5

  return (
    <section>
      <div className="mb-4">
        <h2 className="text-base font-semibold text-foreground">
          Allocation & Fragmentation
        </h2>
        <p className="text-xs text-muted-foreground">
          Cross-pod workload distribution and context-switching risk
        </p>
      </div>

      <Card className="border-border bg-card">
        <CardContent className="p-4">
          {/* Header KPIs */}
          <div className="mb-4 flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2 rounded-lg border border-border bg-secondary/50 px-3 py-2">
              <span className="text-xs text-muted-foreground">
                Total Allocation
              </span>
              <span
                className={`text-lg font-bold ${
                  overAllocated ? "text-red-400" : "text-foreground"
                }`}
              >
                {dev.totalAllocation}%
              </span>
              {overAllocated && (
                <AlertTriangle className="h-3.5 w-3.5 text-red-400" />
              )}
            </div>
            <div className="flex items-center gap-2 rounded-lg border border-border bg-secondary/50 px-3 py-2">
              <Shuffle
                className={`h-3.5 w-3.5 ${contextHigh ? "text-amber-400" : "text-muted-foreground"}`}
              />
              <span className="text-xs text-muted-foreground">
                Context Switch Risk
              </span>
              <span
                className={`text-sm font-bold ${
                  contextHigh ? "text-amber-400" : "text-emerald-400"
                }`}
              >
                {contextHigh ? "High" : "Low"}
              </span>
            </div>
          </div>

          {/* Stacked Bar */}
          <div className="mb-3">
            <div className="flex h-10 overflow-hidden rounded-lg">
              {dev.allocations.map((alloc, i) => (
                <div
                  key={alloc.podName}
                  className="flex items-center justify-center transition-all"
                  style={{
                    width: `${(alloc.percentage / Math.max(dev.totalAllocation, 100)) * 100}%`,
                    backgroundColor: ALLOCATION_COLORS[i % ALLOCATION_COLORS.length],
                    opacity: 0.85,
                  }}
                  title={`${alloc.podName} - ${alloc.percentage}%`}
                >
                  <span className="truncate px-2 text-[11px] font-semibold text-background">
                    {alloc.percentage}%
                  </span>
                </div>
              ))}
              {/* If under 100%, show remaining as empty */}
              {dev.totalAllocation < 100 && (
                <div
                  className="flex items-center justify-center bg-secondary"
                  style={{
                    width: `${((100 - dev.totalAllocation) / 100) * 100}%`,
                  }}
                >
                  <span className="text-[10px] text-muted-foreground">
                    Unallocated
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-4">
            {dev.allocations.map((alloc, i) => (
              <div key={alloc.podName} className="flex items-center gap-2">
                <span
                  className="h-2.5 w-2.5 rounded-sm"
                  style={{
                    backgroundColor:
                      ALLOCATION_COLORS[i % ALLOCATION_COLORS.length],
                  }}
                />
                <span className="text-xs text-foreground">
                  {alloc.podName}
                </span>
                <span className="text-xs text-muted-foreground">
                  {alloc.client} &ndash; {alloc.percentage}%
                </span>
              </div>
            ))}
          </div>

          {overAllocated && (
            <div className="mt-4 flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/5 px-3 py-2">
              <AlertTriangle className="h-4 w-4 shrink-0 text-red-400" />
              <p className="text-xs font-medium text-red-400">
                Developer is overcommitted at {dev.totalAllocation}%.
                Allocation exceeds 100% capacity.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  )
}
