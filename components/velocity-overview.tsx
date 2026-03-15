"use client"

import { Card, CardContent } from "@/components/ui/card"
import { InfoTooltip } from "@/components/ui/info-tooltip"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
} from "recharts"
import { pods, getAverageVelocity, getCurrentVelocity } from "@/lib/pod-data"

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
            <span className="font-semibold">{entry.value} SP</span>
          </p>
        ))}
      </div>
    )
  }
  return null
}

const podColors = ["#34d399", "#2dd4bf", "#60a5fa", "#f59e0b", "#a78bfa", "#f472b6"]

export function VelocityOverview() {
  // Build per-pod comparison data
  const comparisonData = pods.map((pod, i) => ({
    name: pod.name.replace(" Pod", ""),
    current: getCurrentVelocity(pod),
    average: getAverageVelocity(pod),
    direction: pod.velocityDirection,
    color: podColors[i % podColors.length],
  }))

  // Build trend data: all pods across sprints
  const sprintLabels = pods[0].velocityHistory.map((v) => v.sprint)
  const trendData = sprintLabels.map((sprint, si) => {
    const entry: Record<string, string | number> = { sprint }
    for (const pod of pods) {
      entry[pod.name.replace(" Pod", "")] = pod.velocityHistory[si]?.sp ?? 0
    }
    return entry
  })

  // Org-wide average velocity
  const orgAvg = Math.round(
    pods.reduce((sum, pod) => sum + getAverageVelocity(pod), 0) / pods.length
  )

  const orgCurrent = Math.round(
    pods.reduce((sum, pod) => sum + getCurrentVelocity(pod), 0) / pods.length
  )

  function TrendIcon({ dir }: { dir: "up" | "down" | "stable" }) {
    if (dir === "up") return <TrendingUp className="h-3 w-3 text-emerald-400" />
    if (dir === "down") return <TrendingDown className="h-3 w-3 text-red-400" />
    return <Minus className="h-3 w-3 text-muted-foreground" />
  }

  return (
    <section>
      <div className="mb-4">
        <h2 className="text-base font-semibold text-foreground">
          Velocity Overview
        </h2>
        <p className="text-xs text-muted-foreground">
          Story point velocity per sprint across all pods
        </p>
      </div>

      {/* Top: Org-wide KPIs */}
      <div className="mb-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Card className="border-border bg-card">
          <CardContent className="p-3">
            <p className="flex items-center text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
              Org Avg Velocity
              <InfoTooltip text="Average velocity across all pods over the last 6 sprints." />
            </p>
            <p className="mt-1 text-xl font-bold text-foreground">
              {orgAvg} <span className="text-xs font-normal text-muted-foreground">SP</span>
            </p>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="p-3">
            <p className="flex items-center text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
              Org Current Sprint
              <InfoTooltip text="Average SP delivered across all pods in the current sprint." />
            </p>
            <p className="mt-1 text-xl font-bold text-foreground">
              {orgCurrent} <span className="text-xs font-normal text-muted-foreground">SP</span>
            </p>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="p-3">
            <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
              Highest Velocity
            </p>
            <p className="mt-1 text-xl font-bold text-foreground">
              {comparisonData.reduce((best, c) => (c.current > best.current ? c : best), comparisonData[0]).name}
            </p>
            <p className="text-[10px] text-emerald-400">
              {Math.max(...comparisonData.map((c) => c.current))} SP
            </p>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="p-3">
            <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
              Lowest Velocity
            </p>
            <p className="mt-1 text-xl font-bold text-foreground">
              {comparisonData.reduce((worst, c) => (c.current < worst.current ? c : worst), comparisonData[0]).name}
            </p>
            <p className="text-[10px] text-red-400">
              {Math.min(...comparisonData.map((c) => c.current))} SP
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid min-w-0 grid-cols-1 gap-3 lg:grid-cols-5">
        {/* Velocity Trend Lines (all pods overlaid) */}
        <Card className="border-border bg-card lg:col-span-3">
          <CardContent className="p-4">
            <div className="mb-3 flex items-center justify-between">
              <p className="flex items-center text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Velocity Trends
                <InfoTooltip text="Velocity trend lines for all pods over the last 6 sprints. Each line represents a pod's SP delivery." />
              </p>
              <span className="text-xs text-muted-foreground">Last 6 Sprints</span>
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
                    tickFormatter={(v) => v.replace("Sprint ", "S")}
                  />
                  <YAxis
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
                    axisLine={false}
                    tickLine={false}
                    domain={[0, 50]}
                    tickFormatter={(v) => `${v}`}
                  />
                  <Tooltip content={<ChartTooltip />} />
                  <Legend
                    wrapperStyle={{ fontSize: 10, color: "hsl(var(--muted-foreground))" }}
                    iconSize={8}
                    iconType="circle"
                  />
                  {pods.map((pod, i) => (
                    <Line
                      key={pod.slug}
                      type="monotone"
                      dataKey={pod.name.replace(" Pod", "")}
                      stroke={podColors[i % podColors.length]}
                      strokeWidth={1.5}
                      dot={{ r: 2.5, fill: podColors[i % podColors.length] }}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Pod Velocity Comparison (horizontal bar) */}
        <Card className="border-border bg-card lg:col-span-2">
          <CardContent className="p-4">
            <p className="mb-3 flex items-center text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Current Sprint vs Average
              <InfoTooltip text="Each pod's current sprint velocity compared to their 6-sprint average. Helps identify which pods are above or below their baseline." />
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
                        {' / '}
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
                      {/* Average marker */}
                      <div
                        className="absolute top-0 h-full border-r-2 border-dashed border-foreground/30"
                        style={{ left: "100%" }}
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
    </section>
  )
}
