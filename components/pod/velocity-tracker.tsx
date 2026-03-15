"use client"

import { Card, CardContent } from "@/components/ui/card"
import { InfoTooltip } from "@/components/ui/info-tooltip"
import { TrendingUp, TrendingDown, Minus, Zap } from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
  Cell,
} from "recharts"
import type { PodData } from "@/lib/pod-data"
import { getAverageVelocity, getCurrentVelocity } from "@/lib/pod-data"

function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean
  payload?: Array<{ value: number; name: string }>
  label?: string
}) {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-border bg-popover px-3 py-2 text-xs text-popover-foreground shadow-lg">
        <p className="mb-1 font-medium">{label}</p>
        <p className="text-muted-foreground">
          Velocity: <span className="font-semibold text-foreground">{payload[0].value} SP</span>
        </p>
      </div>
    )
  }
  return null
}

function TrendBadge({ direction, delta }: { direction: "up" | "down" | "stable"; delta: number }) {
  if (direction === "up") {
    return (
      <div className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-400">
        <TrendingUp className="h-3 w-3" />
        +{delta} SP
      </div>
    )
  }
  if (direction === "down") {
    return (
      <div className="flex items-center gap-1 rounded-full bg-red-500/10 px-2.5 py-1 text-xs font-medium text-red-400">
        <TrendingDown className="h-3 w-3" />
        {delta} SP
      </div>
    )
  }
  return (
    <div className="flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
      <Minus className="h-3 w-3" />
      Stable
    </div>
  )
}

export function VelocityTracker({ pod }: { pod: PodData }) {
  const history = pod.velocityHistory
  const avg = getAverageVelocity(pod)
  const current = getCurrentVelocity(pod)
  const prev = history.length >= 2 ? history[history.length - 2].sp : current
  const delta = current - prev
  const maxSP = Math.max(...history.map((v) => v.sp))

  // 3-sprint rolling average for the last entry
  const last3 =
    history.length >= 3
      ? Math.round(history.slice(-3).reduce((s, v) => s + v.sp, 0) / 3)
      : avg

  // Variance (std dev)
  const variance = Math.round(
    Math.sqrt(history.reduce((sum, v) => sum + Math.pow(v.sp - avg, 2), 0) / history.length)
  )

  return (
    <section>
      <div className="mb-4">
        <h2 className="text-base font-semibold text-foreground">
          Velocity Tracker
        </h2>
        <p className="text-xs text-muted-foreground">
          Story points delivered per sprint with trend analysis
        </p>
      </div>

      <div className="grid min-w-0 grid-cols-1 gap-3 lg:grid-cols-4">
        {/* Main Velocity Chart */}
        <Card className="border-border bg-card lg:col-span-3">
          <CardContent className="p-4">
            <div className="mb-3 flex items-center justify-between">
              <p className="flex items-center text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Velocity per Sprint
                <InfoTooltip text="Story points completed per sprint. The dashed line shows the 6-sprint rolling average. Bars above the line indicate above-average performance." />
              </p>
              <span className="text-xs text-muted-foreground">Last 6 Sprints</span>
            </div>
            <div className="h-[220px] min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={history} barCategoryGap="20%">
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="hsl(var(--border))"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="sprint"
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => v.replace("Sprint ", "S")}
                  />
                  <YAxis
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
                    axisLine={false}
                    tickLine={false}
                    domain={[0, Math.ceil(maxSP * 1.2)]}
                    tickFormatter={(v) => `${v}`}
                  />
                  <Tooltip content={<ChartTooltip />} />
                  <ReferenceLine
                    y={avg}
                    stroke="#f59e0b"
                    strokeDasharray="4 4"
                    strokeWidth={1.5}
                    label={{
                      value: `Avg: ${avg} SP`,
                      position: "right",
                      fill: "#f59e0b",
                      fontSize: 10,
                    }}
                  />
                  <Bar dataKey="sp" name="Velocity" radius={[4, 4, 0, 0]}>
                    {history.map((entry, index) => {
                      const isLast = index === history.length - 1
                      const aboveAvg = entry.sp >= avg
                      return (
                        <Cell
                          key={entry.sprint}
                          fill={isLast ? (aboveAvg ? "#34d399" : "#ef4444") : "#2dd4bf"}
                          fillOpacity={isLast ? 1 : 0.65}
                        />
                      )
                    })}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Right: Velocity KPIs */}
        <div className="flex flex-col gap-3">
          {/* Current Velocity */}
          <Card className="border-border bg-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <p className="flex items-center text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Current
                  <InfoTooltip text="Story points completed in the current sprint so far." />
                </p>
                <TrendBadge direction={pod.velocityDirection} delta={delta} />
              </div>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-3xl font-bold text-foreground">{current}</span>
                <span className="text-sm text-muted-foreground">SP</span>
              </div>
            </CardContent>
          </Card>

          {/* Average Velocity */}
          <Card className="border-border bg-card">
            <CardContent className="p-4">
              <p className="flex items-center text-xs font-medium uppercase tracking-wide text-muted-foreground">
                6-Sprint Average
                <InfoTooltip text="Mean velocity across the last 6 sprints. Used as the baseline for sprint planning capacity." />
              </p>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-3xl font-bold text-foreground">{avg}</span>
                <span className="text-sm text-muted-foreground">SP</span>
              </div>
            </CardContent>
          </Card>

          {/* 3-Sprint Rolling */}
          <Card className="border-border bg-card">
            <CardContent className="p-4">
              <p className="flex items-center text-xs font-medium uppercase tracking-wide text-muted-foreground">
                3-Sprint Rolling
                <InfoTooltip text="Rolling average of the most recent 3 sprints. More responsive to recent changes than the 6-sprint average." />
              </p>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-3xl font-bold text-foreground">{last3}</span>
                <span className="text-sm text-muted-foreground">SP</span>
              </div>
            </CardContent>
          </Card>

          {/* Variance */}
          <Card className="border-border bg-card">
            <CardContent className="p-4">
              <p className="flex items-center text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Variance
                <InfoTooltip text="Standard deviation of velocity. High variance (>5) indicates unpredictable delivery capacity." />
              </p>
              <div className="mt-2 flex items-baseline gap-1">
                <span className={`text-3xl font-bold ${variance > 5 ? "text-amber-400" : "text-foreground"}`}>
                  {variance}
                </span>
                <span className="text-sm text-muted-foreground">SP</span>
              </div>
              {variance > 5 && (
                <p className="mt-1 text-[10px] text-amber-400">
                  High variance - review estimation accuracy
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
