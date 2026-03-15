"use client"

import { Card, CardContent } from "@/components/ui/card"
import {
  GitPullRequest,
  GitMerge,
  Clock,
  Eye,
  AlertTriangle,
} from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts"
import type { DeveloperData } from "@/lib/developer-data"

function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean
  payload?: Array<{ value: number; name: string; color: string }>
  label?: string
}) {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-border bg-popover px-3 py-2 text-xs text-popover-foreground shadow-lg">
        <p className="mb-1 font-medium">{label}</p>
        {payload.map((entry) => (
          <p key={entry.name} className="text-muted-foreground">
            <span style={{ color: entry.color }}>{entry.name}:</span>{" "}
            {entry.value}h
          </p>
        ))}
      </div>
    )
  }
  return null
}

function getPrStatusStyle(status: string) {
  switch (status) {
    case "open":
      return { bg: "bg-emerald-500/15", text: "text-emerald-400", label: "Open" }
    case "merged":
      return { bg: "bg-purple-500/15", text: "text-purple-400", label: "Merged" }
    case "waiting-review":
      return { bg: "bg-amber-500/15", text: "text-amber-400", label: "Waiting Review" }
    default:
      return { bg: "bg-muted", text: "text-muted-foreground", label: status }
  }
}

export function PrActivity({ dev }: { dev: DeveloperData }) {
  const idlePrs = dev.prs.filter(
    (pr) => pr.status !== "merged" && pr.hoursSinceUpdate > 36
  )

  const prTimelineData = dev.prs.map((pr) => ({
    name: pr.prId,
    hours: pr.hoursSinceUpdate,
    idle: pr.hoursSinceUpdate > 36,
  }))

  return (
    <section>
      <div className="mb-4">
        <h2 className="text-base font-semibold text-foreground">
          PR Activity Panel
        </h2>
        <p className="text-xs text-muted-foreground">
          Pull request lifecycle and review participation
        </p>
      </div>

      {/* KPI row */}
      <div className="mb-3 grid grid-cols-2 gap-3 sm:grid-cols-5">
        <Card className="border-border bg-card">
          <CardContent className="flex items-center gap-2.5 p-3">
            <GitPullRequest className="h-4 w-4 text-emerald-400" />
            <div>
              <p className="text-[10px] text-muted-foreground">
                Opened
              </p>
              <p className="text-lg font-bold text-foreground">
                {dev.prsOpenedThisSprint}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="flex items-center gap-2.5 p-3">
            <GitMerge className="h-4 w-4 text-purple-400" />
            <div>
              <p className="text-[10px] text-muted-foreground">
                Merged
              </p>
              <p className="text-lg font-bold text-foreground">
                {dev.prsMerged}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="flex items-center gap-2.5 p-3">
            <Clock className="h-4 w-4 text-amber-400" />
            <div>
              <p className="text-[10px] text-muted-foreground">
                Waiting
              </p>
              <p className="text-lg font-bold text-foreground">
                {dev.prsWaitingReview}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="flex items-center gap-2.5 p-3">
            <GitMerge className="h-4 w-4 text-teal-400" />
            <div>
              <p className="text-[10px] text-muted-foreground">
                Avg Merge
              </p>
              <p className="text-lg font-bold text-foreground">
                {dev.avgTimeToMerge}h
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="flex items-center gap-2.5 p-3">
            <Eye className="h-4 w-4 text-sky-400" />
            <div>
              <p className="text-[10px] text-muted-foreground">
                Reviews Done
              </p>
              <p className="text-lg font-bold text-foreground">
                {dev.reviewsDone}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* PR List + Timeline */}
      <div className="grid min-w-0 grid-cols-1 gap-3 lg:grid-cols-2">
        {/* PR List */}
        <Card className="border-border bg-card">
          <CardContent className="p-0">
            <div className="border-b border-border px-4 py-2.5">
              <p className="text-xs font-medium text-muted-foreground">
                Recent PRs
              </p>
            </div>
            <div className="flex flex-col divide-y divide-border/50">
              {dev.prs.map((pr) => {
                const style = getPrStatusStyle(pr.status)
                const isIdle =
                  pr.status !== "merged" && pr.hoursSinceUpdate > 36
                return (
                  <div
                    key={pr.prId}
                    className={`flex items-center gap-3 px-4 py-3 transition-colors hover:bg-secondary/30 ${
                      isIdle ? "bg-red-500/5" : ""
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-medium text-foreground">
                          {pr.prId}
                        </span>
                        <span
                          className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold ${style.bg} ${style.text}`}
                        >
                          {style.label}
                        </span>
                        {isIdle && (
                          <AlertTriangle className="h-3 w-3 text-amber-400" />
                        )}
                      </div>
                      <p className="mt-0.5 truncate text-xs text-muted-foreground">
                        {pr.title}
                      </p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="text-[10px] text-muted-foreground">
                        {pr.createdAt}
                      </p>
                      {pr.status !== "merged" && (
                        <p
                          className={`text-[10px] font-medium ${
                            pr.hoursSinceUpdate > 36
                              ? "text-red-400"
                              : pr.hoursSinceUpdate > 24
                                ? "text-amber-400"
                                : "text-muted-foreground"
                          }`}
                        >
                          {pr.hoursSinceUpdate}h idle
                        </p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Activity Timeline Chart */}
        <Card className="border-border bg-card">
          <CardContent className="p-4">
            <p className="mb-3 text-xs font-medium text-muted-foreground">
              PR Idle Time (hours since last update)
            </p>
            <div className="h-[200px] min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={prTimelineData} layout="vertical">
                  <XAxis
                    type="number"
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => `${v}h`}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
                    axisLine={false}
                    tickLine={false}
                    width={55}
                  />
                  <Tooltip content={<ChartTooltip />} />
                  <Bar
                    dataKey="hours"
                    name="Idle Time"
                    radius={[0, 4, 4, 0]}
                    barSize={16}
                  >
                    {prTimelineData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          entry.idle
                            ? "#ef4444"
                            : entry.hours > 24
                              ? "#f59e0b"
                              : "#34d399"
                        }
                        fillOpacity={0.8}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            {idlePrs.length > 0 && (
              <p className="mt-2 flex items-center gap-1.5 text-xs text-red-400">
                <AlertTriangle className="h-3 w-3" />
                {idlePrs.length} PR{idlePrs.length > 1 ? "s" : ""} idle{" "}
                {">"} 36h
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
