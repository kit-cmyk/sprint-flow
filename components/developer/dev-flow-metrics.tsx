"use client"

import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
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
            {entry.value}
          </p>
        ))}
      </div>
    )
  }
  return null
}

export function DevFlowMetrics({ dev }: { dev: DeveloperData }) {
  const currentCycleTime =
    dev.cycleTimeHistory[dev.cycleTimeHistory.length - 1].devTime
  const currentTeamAvg =
    dev.cycleTimeHistory[dev.cycleTimeHistory.length - 1].teamAvg
  const deviation =
    ((currentCycleTime - currentTeamAvg) / currentTeamAvg) * 100
  const isDeviationHigh = deviation > 30

  const throughputDiff =
    dev.throughputThisSprint - dev.throughput3SprintAvg
  const throughputPercent = dev.throughput3SprintAvg > 0
    ? ((throughputDiff / dev.throughput3SprintAvg) * 100).toFixed(0)
    : "0"

  return (
    <section>
      <div className="mb-4">
        <h2 className="text-base font-semibold text-foreground">
          Flow & Momentum Metrics
        </h2>
        <p className="text-xs text-muted-foreground">
          Individual cycle time, throughput, and ticket aging
        </p>
      </div>

      <div className="grid min-w-0 grid-cols-1 gap-3 md:grid-cols-3">
        {/* Panel 1: Cycle Time */}
        <Card className="border-border bg-card">
          <CardContent className="p-4">
            <div className="mb-1 flex items-center justify-between">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Avg Cycle Time
              </p>
              <span className="text-xs text-muted-foreground">
                vs Team Avg
              </span>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span
                className={`text-3xl font-bold ${isDeviationHigh ? "text-red-400" : "text-foreground"}`}
              >
                {currentCycleTime.toFixed(1)}d
              </span>
              <span className="text-sm text-muted-foreground">
                / {currentTeamAvg.toFixed(1)}d team
              </span>
            </div>
            {isDeviationHigh && (
              <p className="mt-1 text-xs font-medium text-red-400">
                +{deviation.toFixed(0)}% above team average
              </p>
            )}
            <div className="mt-3 h-[130px] min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dev.cycleTimeHistory}>
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
                    domain={[0, 5]}
                    tickFormatter={(v) => `${v}d`}
                  />
                  <Tooltip content={<ChartTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="teamAvg"
                    name="Team Avg"
                    stroke="hsl(var(--muted-foreground))"
                    strokeWidth={1.5}
                    strokeDasharray="4 4"
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="devTime"
                    name="Developer"
                    stroke="#34d399"
                    strokeWidth={2}
                    dot={(props: {
                      cx: number
                      cy: number
                      index: number
                    }) => {
                      const isLast =
                        props.index === dev.cycleTimeHistory.length - 1
                      return (
                        <circle
                          key={`ct-${props.index}`}
                          cx={props.cx}
                          cy={props.cy}
                          r={4}
                          fill={
                            isDeviationHigh && isLast ? "#ef4444" : "#34d399"
                          }
                          stroke={
                            isDeviationHigh && isLast ? "#ef4444" : "#34d399"
                          }
                          strokeWidth={2}
                        />
                      )
                    }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Panel 2: Throughput */}
        <Card className="border-border bg-card">
          <CardContent className="flex h-full flex-col justify-between p-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Throughput
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Story points completed this sprint
              </p>
            </div>
            <div className="flex flex-col items-center justify-center py-4">
              <div className="flex items-baseline gap-1">
                <span className="text-5xl font-bold text-foreground">
                  {dev.throughputThisSprint}
                </span>
                <span className="text-lg text-muted-foreground">SP</span>
              </div>
              <div className="mt-3 flex items-center gap-1.5">
                {throughputDiff > 0 ? (
                  <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />
                ) : throughputDiff < 0 ? (
                  <TrendingDown className="h-3.5 w-3.5 text-red-400" />
                ) : (
                  <Minus className="h-3.5 w-3.5 text-muted-foreground" />
                )}
                <span
                  className={`text-xs font-medium ${
                    throughputDiff > 0
                      ? "text-emerald-400"
                      : throughputDiff < 0
                        ? "text-red-400"
                        : "text-muted-foreground"
                  }`}
                >
                  {throughputDiff > 0 ? "+" : ""}
                  {throughputPercent}% vs 3-sprint avg (
                  {dev.throughput3SprintAvg})
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                On Track
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-red-500" />
                Below Avg
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Panel 3: Ticket Aging */}
        <Card className="border-border bg-card">
          <CardContent className="p-4">
            <div className="mb-1 flex items-center justify-between">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Ticket Aging Distribution
              </p>
            </div>
            <div className="mt-3 h-[140px] min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dev.ticketAging} layout="vertical">
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="hsl(var(--border))"
                    horizontal={false}
                  />
                  <XAxis
                    type="number"
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
                    axisLine={false}
                    tickLine={false}
                    allowDecimals={false}
                  />
                  <YAxis
                    type="category"
                    dataKey="range"
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
                    axisLine={false}
                    tickLine={false}
                    width={70}
                  />
                  <Tooltip content={<ChartTooltip />} />
                  <Bar
                    dataKey="count"
                    name="Tickets"
                    radius={[0, 4, 4, 0]}
                    barSize={18}
                  >
                    {dev.ticketAging.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} fillOpacity={0.8} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            {dev.ticketAging[2].count > 0 && (
              <p className="mt-2 text-xs font-medium text-red-400">
                {dev.ticketAging[2].count} ticket
                {dev.ticketAging[2].count > 1 ? "s" : ""} aging beyond 6
                days
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
