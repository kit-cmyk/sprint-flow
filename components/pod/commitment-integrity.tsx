"use client"

import { Card, CardContent } from "@/components/ui/card"
import { InfoTooltip } from "@/components/ui/info-tooltip"
import { TrendingDown, TrendingUp, Minus } from "lucide-react"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Legend,
} from "recharts"
import type { PodData } from "@/lib/pod-data"
import { getCarryoverWithRolling, getRollingAvgCarryover } from "@/lib/pod-data"

const reliabilityHistory = [
  { sprint: "S12", reliability: 88 },
  { sprint: "S13", reliability: 82 },
  { sprint: "S14", reliability: 76 },
]

function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean
  payload?: Array<{ value: number; name: string; color?: string; payload?: { color?: string } }>
  label?: string
}) {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-border bg-popover px-3 py-2 text-xs text-popover-foreground shadow-lg">
        {label && <p className="mb-1 font-medium">{label}</p>}
        {payload.map((entry) => (
          <p key={entry.name} className="text-muted-foreground">
            <span style={{ color: entry.color || entry.payload?.color }}>
              {entry.name}:
            </span>{" "}
            {entry.value}%
          </p>
        ))}
      </div>
    )
  }
  return null
}

export function CommitmentIntegrity({ pod }: { pod: PodData }) {
  const currentReliability = reliabilityHistory[reliabilityHistory.length - 1].reliability
  const isBelowThreshold = currentReliability < 80

  const carryoverData = getCarryoverWithRolling(pod)
  const rollingAvg = getRollingAvgCarryover(pod)
  const latestPct = pod.carryoverHistory[pod.carryoverHistory.length - 1]?.pct ?? 0
  const prevPct = pod.carryoverHistory[pod.carryoverHistory.length - 2]?.pct ?? latestPct
  const carryoverDelta = latestPct - prevPct

  return (
    <section>
      <div className="mb-4">
        <h2 className="text-base font-semibold text-foreground">
          Sprint Commitment Integrity
        </h2>
        <p className="text-xs text-muted-foreground">
          Commitment reliability and carryover trend
        </p>
      </div>

      <div className="grid min-w-0 grid-cols-1 gap-3 md:grid-cols-3">
        {/* Commitment Reliability KPI */}
        <Card className="border-border bg-card">
          <CardContent className="flex h-full flex-col justify-between p-4">
            <p className="flex items-center text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Commitment Reliability
              <InfoTooltip text="Ratio of story points delivered vs. story points committed at sprint planning. Below 80% signals estimation or scope issues." />
            </p>
            <div className="flex flex-col items-center justify-center py-6">
              <div className="flex items-baseline gap-1">
                <span
                  className={`text-5xl font-bold ${
                    isBelowThreshold ? "text-red-400" : "text-foreground"
                  }`}
                >
                  {currentReliability}
                </span>
                <span className="text-2xl font-medium text-muted-foreground">%</span>
              </div>
              <div className="mt-3 flex items-center gap-1.5">
                <TrendingDown className="h-3.5 w-3.5 text-red-400" />
                <span className="text-xs text-red-400">-6% from Sprint 13</span>
              </div>
            </div>
            {isBelowThreshold && (
              <div className="rounded-md bg-red-500/10 px-3 py-2 text-xs text-red-400 text-center">
                Below 80% threshold — intervention recommended
              </div>
            )}
          </CardContent>
        </Card>

        {/* Historical Trend */}
        <Card className="border-border bg-card">
          <CardContent className="p-4">
            <div className="mb-1 flex items-center justify-between">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Historical Trend
              </p>
              <span className="text-xs text-muted-foreground">Last 3 Sprints</span>
            </div>
            <div className="mt-3 h-[180px] min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={reliabilityHistory}>
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
                  />
                  <YAxis
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
                    axisLine={false}
                    tickLine={false}
                    domain={[60, 100]}
                    tickFormatter={(v) => `${v}%`}
                  />
                  <Tooltip content={<ChartTooltip />} />
                  <ReferenceLine
                    y={80}
                    stroke="#ef4444"
                    strokeDasharray="4 4"
                    strokeWidth={1}
                    label={{
                      value: "80% threshold",
                      position: "right",
                      fill: "#ef4444",
                      fontSize: 9,
                    }}
                  />
                  <Bar
                    dataKey="reliability"
                    name="Reliability"
                    radius={[4, 4, 0, 0]}
                    fill="#34d399"
                    fillOpacity={0.8}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Rolling Avg Carryover */}
        <Card className="border-border bg-card">
          <CardContent className="p-4">
            <div className="mb-1 flex items-center justify-between">
              <p className="flex items-center text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Carryover Trend
                <InfoTooltip text="Per-sprint carryover % (bars) and the running rolling average across all sprints (line). A rising average signals systemic scope issues." />
              </p>
            </div>

            {/* Summary row */}
            <div className="mb-2 flex items-center gap-4">
              <div>
                <p className="text-[10px] text-muted-foreground">Rolling Avg</p>
                <p className={`text-lg font-bold ${rollingAvg > 20 ? "text-amber-400" : "text-foreground"}`}>
                  {rollingAvg}%
                </p>
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground">Latest Sprint</p>
                <div className="flex items-center gap-1">
                  <p className={`text-lg font-bold ${latestPct > 25 ? "text-amber-400" : "text-foreground"}`}>
                    {latestPct}%
                  </p>
                  {carryoverDelta > 0 ? (
                    <TrendingUp className="h-3.5 w-3.5 text-red-400" />
                  ) : carryoverDelta < 0 ? (
                    <TrendingDown className="h-3.5 w-3.5 text-emerald-400" />
                  ) : (
                    <Minus className="h-3.5 w-3.5 text-muted-foreground" />
                  )}
                </div>
              </div>
            </div>

            <div className="h-[120px] min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={carryoverData} margin={{ top: 2, right: 4, left: -20, bottom: 0 }}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="hsl(var(--border))"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="sprint"
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 9 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 9 }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => `${v}%`}
                    domain={[0, "dataMax + 10"]}
                  />
                  <Tooltip content={<ChartTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="pct"
                    name="Carryover %"
                    stroke="#f59e0b"
                    strokeWidth={1.5}
                    dot={{ r: 2.5, fill: "#f59e0b" }}
                    activeDot={{ r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="avg"
                    name="Rolling Avg"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    strokeDasharray="4 3"
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-2 flex items-center gap-4 text-[10px] text-muted-foreground">
              <span className="flex items-center gap-1">
                <span className="h-px w-4 bg-amber-400" />
                Per sprint
              </span>
              <span className="flex items-center gap-1">
                <span className="h-px w-4 border-t-2 border-dashed border-primary" />
                Rolling avg
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
