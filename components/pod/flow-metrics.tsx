"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { InfoTooltip } from "@/components/ui/info-tooltip"
import { TrendingUp, TrendingDown, Rocket, Clock, ChevronDown } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
} from "recharts"

type DeployEnv = "production" | "staging" | "dev"

const deployEnvLabels: Record<DeployEnv, string> = {
  production: "Production",
  staging: "Staging",
  dev: "Dev",
}

const deployFrequencyData: Record<DeployEnv, { thisSprint: number; lastSprint: number; trend: "up" | "down" | "stable"; healthy: boolean }> = {
  production: { thisSprint: 7,  lastSprint: 5,  trend: "up",     healthy: true  },
  staging:    { thisSprint: 18, lastSprint: 21, trend: "down",   healthy: true  },
  dev:        { thisSprint: 43, lastSprint: 38, trend: "up",     healthy: true  },
}

const cycleTimeData = [
  { sprint: "Sprint 11", time: 2.4 },
  { sprint: "Sprint 12", time: 2.1 },
  { sprint: "Sprint 13", time: 2.6 },
  { sprint: "Sprint 14", time: 3.2 },
]

const throughputData = [
  { sprint: "Sprint 11", completed: 42, average: 39 },
  { sprint: "Sprint 12", completed: 48, average: 39 },
  { sprint: "Sprint 13", completed: 36, average: 42 },
  { sprint: "Sprint 14", completed: 27, average: 39 },
]

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

export function FlowMetrics() {
  const [deployEnv, setDeployEnv] = useState<DeployEnv>("production")
  const deployData = deployFrequencyData[deployEnv]
  const deployDelta = deployData.thisSprint - deployData.lastSprint

  const currentCycle = cycleTimeData[cycleTimeData.length - 1].time
  const prevAvg =
    cycleTimeData.slice(0, -1).reduce((sum, d) => sum + d.time, 0) /
    (cycleTimeData.length - 1)
  const cycleDeviation = ((currentCycle - prevAvg) / prevAvg) * 100
  const cycleDeviationHigh = cycleDeviation > 20

  return (
    <section>
      <div className="mb-4">
        <h2 className="text-base font-semibold text-foreground">
          Flow & Momentum Metrics
        </h2>
        <p className="text-xs text-muted-foreground">
          Cycle time, throughput, and quality indicators
        </p>
      </div>

      {/* Top Row: 3-column charts */}
      <div className="grid min-w-0 grid-cols-1 gap-3 md:grid-cols-3">
        {/* Cycle Time Trend */}
        <Card className="border-border bg-card">
          <CardContent className="p-4">
            <div className="mb-1 flex items-center justify-between">
              <p className="flex items-center text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Cycle Time Trend
                <InfoTooltip text="Average days from ticket start to completion. Spikes indicate process bottlenecks." />
              </p>
              <span className="text-xs text-muted-foreground">Last 4 Sprints</span>
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
                    dataKey="time"
                    name="Cycle Time"
                    stroke="#34d399"
                    strokeWidth={2}
                    dot={(props: { cx: number; cy: number; index: number }) => {
                      const isLast = props.index === cycleTimeData.length - 1
                      return (
                        <circle
                          key={`ct-${props.index}`}
                          cx={props.cx}
                          cy={props.cy}
                          r={4}
                          fill={cycleDeviationHigh && isLast ? "#ef4444" : "#34d399"}
                          stroke={cycleDeviationHigh && isLast ? "#ef4444" : "#34d399"}
                          strokeWidth={2}
                        />
                      )
                    }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            {cycleDeviationHigh && (
              <p className="mt-2 text-xs text-red-400">
                +{cycleDeviation.toFixed(0)}% deviation from 3-sprint avg
              </p>
            )}
          </CardContent>
        </Card>

        {/* Throughput */}
        <Card className="border-border bg-card">
          <CardContent className="p-4">
            <div className="mb-1 flex items-center justify-between">
              <p className="flex items-center text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Throughput
                <InfoTooltip text="Total story points completed per sprint. Compared against the rolling 3-sprint average." />
              </p>
              <span className="text-xs text-muted-foreground">SP / Sprint</span>
            </div>
            <div className="mt-3 h-[160px] min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={throughputData}>
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
                    domain={[0, 60]}
                  />
                  <Tooltip content={<ChartTooltip />} />
                  <ReferenceLine
                    y={39}
                    stroke="#f59e0b"
                    strokeDasharray="4 4"
                    strokeWidth={1}
                    label={{
                      value: "3-Sprint Avg",
                      position: "right",
                      fill: "#f59e0b",
                      fontSize: 9,
                    }}
                  />
                  <Bar
                    dataKey="completed"
                    name="Completed"
                    radius={[4, 4, 0, 0]}
                    fill="#2dd4bf"
                    fillOpacity={0.8}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="mt-2 text-xs text-amber-400">
              Sprint 14 trending below 3-sprint average
            </p>
          </CardContent>
        </Card>

        {/* Reopened Ticket % */}
        <Card className="border-border bg-card">
          <CardContent className="flex h-full flex-col justify-between p-4">
            <p className="flex items-center text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Reopened Ticket Rate
              <InfoTooltip text="Percentage of tickets moved back to In Progress after being marked Done. Indicates quality issues." />
            </p>
            <div className="flex flex-col items-center justify-center py-6">
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold text-foreground">8</span>
                <span className="text-xl font-medium text-muted-foreground">%</span>
              </div>
              <div className="mt-3 flex items-center gap-1.5">
                <TrendingUp className="h-3.5 w-3.5 text-red-400" />
                <span className="text-xs text-red-400">+2% from last sprint</span>
              </div>
            </div>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                <span>{'Target: <5%'}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-amber-500" />
                <span>{'Threshold: 10%'}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row: Sub-metrics */}
      <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Card className="border-border bg-card">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-500/10">
              <Clock className="h-4 w-4 text-amber-400" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">PR Review Latency</p>
              <p className="text-lg font-bold text-foreground">
                18.4<span className="ml-0.5 text-xs font-normal text-muted-foreground">hrs avg</span>
              </p>
            </div>
            <div className="ml-auto flex items-center gap-1 text-xs text-red-400">
              <TrendingUp className="h-3 w-3" />
              <span>+6h</span>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="p-4">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10">
                  <Rocket className="h-4 w-4 text-emerald-400" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Deployment Frequency</p>
                  <p className="text-lg font-bold text-foreground">
                    {deployData.thisSprint}
                    <span className="ml-0.5 text-xs font-normal text-muted-foreground"> this sprint</span>
                  </p>
                </div>
              </div>

              {/* Environment dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-1 rounded-md border border-border bg-muted/50 px-2 py-1 text-xs font-medium text-foreground transition-colors hover:bg-muted focus:outline-none">
                    {deployEnvLabels[deployEnv]}
                    <ChevronDown className="h-3 w-3 text-muted-foreground" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="min-w-[110px]">
                  {(Object.keys(deployEnvLabels) as DeployEnv[]).map((env) => (
                    <DropdownMenuItem
                      key={env}
                      className={`text-xs ${deployEnv === env ? "font-medium text-primary" : ""}`}
                      onSelect={() => setDeployEnv(env)}
                    >
                      {deployEnvLabels[env]}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="mt-3 flex items-center gap-3 text-xs">
              <div className={`flex items-center gap-1 ${deployDelta >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                {deployDelta >= 0
                  ? <TrendingUp className="h-3 w-3" />
                  : <TrendingDown className="h-3 w-3" />}
                <span>{deployDelta >= 0 ? "+" : ""}{deployDelta} vs last sprint</span>
              </div>
              <span className="text-muted-foreground">&middot;</span>
              <span className="text-muted-foreground">{deployData.lastSprint} last sprint</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
