"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { InfoTooltip } from "@/components/ui/info-tooltip"
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
  ReferenceLine,
  Legend,
} from "recharts"
import { pods, getAverageVelocity, getCurrentVelocity } from "@/lib/pod-data"

const cycleTimeData = [
  { date: "Jan 15", time: 3.2 },
  { date: "Jan 29", time: 2.8 },
  { date: "Feb 12", time: 3.1 },
  { date: "Feb 26", time: 4.5 },
]

const carryoverData = [
  { date: "Jan 15", rate: 14 },
  { date: "Jan 29", rate: 18 },
  { date: "Feb 12", rate: 22 },
  { date: "Feb 26", rate: 28 },
]

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean
  payload?: Array<{ value: number }>
  label?: string
}) {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-border bg-popover px-3 py-2 text-xs text-popover-foreground shadow-lg">
        <p className="font-medium">{label}</p>
        <p className="text-muted-foreground">{payload[0].value}</p>
      </div>
    )
  }
  return null
}

export function OrgMetrics() {
  return (
    <section>
      <div className="mb-4">
        <h2 className="text-base font-semibold text-foreground">
          Organization-Wide Metrics
        </h2>
        <p className="text-xs text-muted-foreground">
          Aggregate performance across all pods
        </p>
      </div>
      <div className="grid min-w-0 grid-cols-1 gap-3 md:grid-cols-3">
        {/* Cycle Time Trend */}
        <Card className="border-border bg-card">
          <CardContent className="p-4">
            <div className="mb-1 flex items-center justify-between">
              <p className="flex items-center text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Cycle Time Trend
                <InfoTooltip text="Average number of days from ticket In Progress to Done. Lower is better." />
              </p>
              <span className="text-xs text-muted-foreground">Last 6 Weeks</span>
            </div>
            <div className="mt-3 h-[160px] min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={cycleTimeData}>
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
                    tickFormatter={(value) => value.replace("Sprint ", "S")}
                  />
                  <YAxis
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
                    axisLine={false}
                    tickLine={false}
                    domain={[0, 6]}
                    tickFormatter={(value) => `${value}d`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="time"
                    stroke="#34d399"
                    strokeWidth={2}
                    dot={(props: { cx: number; cy: number; index: number }) => {
                      const { cx, cy, index } = props
                      const isLast = index === cycleTimeData.length - 1
                      return (
                        <circle
                          key={`dot-${index}`}
                          cx={cx}
                          cy={cy}
                          r={4}
                          fill={isLast ? "#ef4444" : "#34d399"}
                          stroke={isLast ? "#ef4444" : "#34d399"}
                          strokeWidth={2}
                        />
                      )
                    }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <p className="mt-2 text-xs text-red-400">
              +45% increase on Feb 26
            </p>
          </CardContent>
        </Card>

        {/* Commitment Reliability */}
        <Card className="border-border bg-card">
          <CardContent className="flex h-full flex-col justify-between p-4">
            <div>
              <p className="flex items-center text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Commitment Reliability
                <InfoTooltip text="Percentage of story points committed at sprint planning that were actually delivered by sprint end." />
              </p>
              <p className="text-xs text-muted-foreground">Planned vs Delivered</p>
            </div>
            <div className="flex flex-col items-center justify-center py-6">
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-bold text-foreground">82</span>
                <span className="text-2xl font-medium text-muted-foreground">%</span>
              </div>
              <div className="mt-3 flex items-center gap-1.5">
                <TrendingDown className="h-3.5 w-3.5 text-red-400" />
                <span className="text-xs text-red-400">-4% from last sprint</span>
              </div>
            </div>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                <span>Target: 90%+</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-amber-500" />
                <span>Threshold: 75%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Carryover Rate Trend */}
        <Card className="border-border bg-card">
          <CardContent className="p-4">
            <div className="mb-1 flex items-center justify-between">
              <p className="flex items-center text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Carryover Rate
                <InfoTooltip text="Percentage of committed story points not completed and carried to next sprint. Target: under 25%." />
              </p>
              <div className="flex items-center gap-1">
                <TrendingUp className="h-3 w-3 text-red-400" />
                <span className="text-xs text-red-400">Rising</span>
              </div>
            </div>
            <div className="mt-3 h-[160px] min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={carryoverData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="hsl(var(--border))"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="date"
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
                    axisLine={false}
                    tickLine={false}
                    domain={[0, 40]}
                    tickFormatter={(value) => `${value}%`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <ReferenceLine
                    y={25}
                    stroke="#f59e0b"
                    strokeDasharray="4 4"
                    strokeWidth={1}
                  />
                  <Bar
                    dataKey="rate"
                    radius={[4, 4, 0, 0]}
                    fill="#2dd4bf"
                    fillOpacity={0.8}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="mt-2 text-xs text-amber-400">
              Feb 26 exceeds 25% threshold
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Velocity Trends + Current Sprint vs Average */}
      <VelocityCharts />
    </section>
  )
}

/* ── Velocity charts (moved from VelocityOverview) ── */

const podColors = ["#34d399", "#2dd4bf", "#60a5fa", "#f59e0b", "#a78bfa", "#f472b6"]

function VelocityChartTooltip({
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
            <span className="font-semibold">{entry.value} SP</span>
          </p>
        ))}
      </div>
    )
  }
  return null
}

function TrendIcon({ dir }: { dir: "up" | "down" | "stable" }) {
  if (dir === "up") return <TrendingUp className="h-3 w-3 text-emerald-400" />
  if (dir === "down") return <TrendingDown className="h-3 w-3 text-red-400" />
  return <Minus className="h-3 w-3 text-muted-foreground" />
}

function VelocityCharts() {
  const [selectedPod, setSelectedPod] = useState<string>("all")

  const comparisonData = pods.map((pod, i) => ({
    name: pod.name.replace(" Pod", ""),
    current: getCurrentVelocity(pod),
    average: getAverageVelocity(pod),
    direction: pod.velocityDirection,
    color: podColors[i % podColors.length],
  }))

  // Filter pods based on selection
  const filteredPods = selectedPod === "all" ? pods : pods.filter((p) => p.slug === selectedPod)

  const sprintLabels = pods[0].velocityHistory.map((v) => v.sprint)
  const trendData = sprintLabels.map((sprint, si) => {
    const entry: Record<string, string | number> = { sprint }
    for (const pod of filteredPods) {
      entry[pod.name.replace(" Pod", "")] = pod.velocityHistory[si]?.sp ?? 0
    }
    return entry
  })

  return (
    <div className="mt-3 grid min-w-0 grid-cols-1 gap-3 lg:grid-cols-5">
      {/* Velocity Trend Lines */}
      <Card className="border-border bg-card lg:col-span-3">
        <CardContent className="p-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <p className="flex items-center text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Velocity Trends
              <InfoTooltip text="Velocity trend lines for selected pod(s) over the last 6 sprints. Each line represents a pod's SP delivery." />
            </p>
            <div className="flex items-center gap-2">
              <Select value={selectedPod} onValueChange={setSelectedPod}>
                <SelectTrigger className="h-7 w-[140px] border-border bg-background text-xs">
                  <SelectValue placeholder="All Pods" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all" className="text-xs">All Pods</SelectItem>
                  {pods.map((pod) => (
                    <SelectItem key={pod.slug} value={pod.slug} className="text-xs">
                      {pod.name.replace(" Pod", "")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <span className="text-xs text-muted-foreground">Last 6 Sprints</span>
            </div>
          </div>
          <div className="h-[220px] min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
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
                    tickFormatter={(value) => value.replace("Sprint ", "S")}
                  />
                <YAxis
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                  domain={[0, 50]}
                  tickFormatter={(v) => `${v}`}
                />
                <Tooltip content={<VelocityChartTooltip />} />
                  <Legend
                    wrapperStyle={{ fontSize: 10, color: "hsl(var(--muted-foreground))" }}
                    iconSize={8}
                    iconType="circle"
                  />
                  {filteredPods.map((pod) => {
                    const originalIndex = pods.findIndex((p) => p.slug === pod.slug)
                    return (
                      <Line
                        key={pod.slug}
                        type="monotone"
                        dataKey={pod.name.replace(" Pod", "")}
                        stroke={podColors[originalIndex % podColors.length]}
                        strokeWidth={1.5}
                        dot={{ r: 2.5, fill: podColors[originalIndex % podColors.length] }}
                      />
                    )
                  })}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Current Sprint vs Average */}
      <Card className="border-border bg-card lg:col-span-2">
        <CardContent className="p-4">
          <p className="mb-3 flex items-center text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Current Sprint vs Average
            <InfoTooltip text="Each pod's current sprint velocity compared to their 6-sprint average." />
          </p>
          <div className="flex flex-col gap-3">
            {comparisonData.map((pod) => {
              const pct = pod.average > 0 ? Math.round((pod.current / pod.average) * 100) : 0
              const isBelow = pod.current < pod.average
              return (
                <div key={pod.name}>
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5">
                      <span
                        className="h-2 w-2 rounded-full"
                        style={{ backgroundColor: pod.color }}
                      />
                      <span className="font-medium text-foreground">{pod.name}</span>
                      <TrendIcon dir={pod.direction} />
                    </div>
                    <span className="text-muted-foreground">
                      <span className={`font-semibold ${isBelow ? "text-red-400" : "text-emerald-400"}`}>
                        {pod.current}
                      </span>
                      {" / "}
                      {pod.average} SP
                    </span>
                  </div>
                  <div className="relative h-2 w-full overflow-hidden rounded-full bg-secondary">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${Math.min(pct, 100)}%`,
                        backgroundColor: isBelow ? "#ef4444" : pod.color,
                        opacity: 0.8,
                      }}
                    />
                  </div>
                  <div className="mt-0.5 text-right text-[10px] text-muted-foreground">
                    {pct}% of average
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
