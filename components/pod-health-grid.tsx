"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { InfoTooltip } from "@/components/ui/info-tooltip"
import { AlertTriangle, TrendingUp, TrendingDown, Minus, Plus } from "lucide-react"
import { AddPodModal } from "@/components/add-pod-modal"
import {
  LineChart,
  Line,
  ResponsiveContainer,
} from "recharts"
import { pods, getVelocityTrend, getAverageVelocity, getCurrentVelocity } from "@/lib/pod-data"
import type { HealthStatus } from "@/lib/pod-data"

function getStatusColor(status: HealthStatus) {
  switch (status) {
    case "healthy":
      return "bg-emerald-500/15 text-emerald-400 border-emerald-500/20"
    case "watch":
      return "bg-amber-500/15 text-amber-400 border-amber-500/20"
    case "at-risk":
      return "bg-red-500/15 text-red-400 border-red-500/20"
  }
}

function getStatusLabel(status: HealthStatus) {
  switch (status) {
    case "healthy":
      return "Healthy"
    case "watch":
      return "Watch"
    case "at-risk":
      return "At Risk"
  }
}

function getProgressColor(status: HealthStatus) {
  switch (status) {
    case "healthy":
      return "bg-emerald-500"
    case "watch":
      return "bg-amber-500"
    case "at-risk":
      return "bg-red-500"
  }
}

function getSparklineColor(status: HealthStatus) {
  switch (status) {
    case "healthy":
      return "#34d399"
    case "watch":
      return "#f59e0b"
    case "at-risk":
      return "#ef4444"
  }
}

function TrendIcon({ direction }: { direction: "up" | "down" | "stable" }) {
  if (direction === "up")
    return <TrendingUp className="h-3 w-3 text-emerald-400" />
  if (direction === "down")
    return <TrendingDown className="h-3 w-3 text-red-400" />
  return <Minus className="h-3 w-3 text-muted-foreground" />
}

function SparklineChart({
  data,
  status,
}: {
  data: number[]
  status: HealthStatus
}) {
  const chartData = data.map((value, index) => ({ index, value }))
  return (
    <ResponsiveContainer width="100%" height={32}>
      <LineChart data={chartData}>
        <Line
          type="monotone"
          dataKey="value"
          stroke={getSparklineColor(status)}
          strokeWidth={1.5}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}

function PodCard({ pod, basePath = "/pod" }: { pod: (typeof pods)[number]; basePath?: string }) {
  return (
    <Link href={`${basePath}/${pod.slug}`}>
    <Card className="group cursor-pointer border-border bg-card transition-all hover:border-primary/30 hover:bg-card/80">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-foreground">
              {pod.name}
            </p>
            <p className="text-xs text-muted-foreground">{pod.client}</p>
          </div>
          <Badge
            className={`shrink-0 border text-xs ${getStatusColor(pod.healthStatus)}`}
          >
            {getStatusLabel(pod.healthStatus)}
          </Badge>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-foreground">
              {pod.healthScore}
            </span>
            <span className="text-xs text-muted-foreground">/ 100</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <span>
              Day {pod.sprintDay}/{pod.totalDays}
            </span>
          </div>
        </div>

        <div className="mt-3">
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center text-muted-foreground">Completion<InfoTooltip text="Percentage of sprint story points moved to Done status." /></span>
            <span className="font-medium text-foreground">{pod.completion}%</span>
          </div>
          <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
            <div
              className={`h-full rounded-full transition-all ${getProgressColor(pod.healthStatus)}`}
              style={{ width: `${pod.completion}%` }}
            />
          </div>
        </div>

        <div className="mt-3 flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            {pod.blockers > 0 && (
              <AlertTriangle className="h-3 w-3 text-red-400" />
            )}
            <span className={pod.blockers > 0 ? "text-red-400" : "text-muted-foreground"}>
              {pod.blockers} Blocker{pod.blockers !== 1 ? "s" : ""}
            </span>
          </div>
          <div className="text-muted-foreground">
            <span className={`flex items-center ${pod.carryoverRisk > 25 ? "text-amber-400" : ""}`}>
              {pod.carryoverRisk}% Carryover
              <InfoTooltip text="Predicted % of story points that may carry into the next sprint based on velocity and remaining work." />
            </span>
          </div>
        </div>

        <div className="mt-3">
          <div className="mb-1 flex items-center justify-between text-[10px] text-muted-foreground">
            <span className="font-medium">Velocity</span>
            <span>
              <span className="font-semibold text-foreground">{getCurrentVelocity(pod)}</span>
              {' SP'}
              <span className="mx-0.5 text-muted-foreground/50">|</span>
              {'Avg '}
              <span className="font-semibold text-foreground">{getAverageVelocity(pod)}</span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="min-w-0 flex-1">
              <SparklineChart data={getVelocityTrend(pod)} status={pod.healthStatus} />
            </div>
            <TrendIcon direction={pod.velocityDirection} />
          </div>
        </div>
      </CardContent>
    </Card>
    </Link>
  )
}

export function PodHealthGrid({
  filteredPods,
  basePath = "/pod",
  showAddPod = true,
  columns,
}: {
  filteredPods?: (typeof pods)[number][]
  basePath?: string
  showAddPod?: boolean
  columns?: number
} = {}) {
  const [addPodOpen, setAddPodOpen] = useState(false)
  const displayPods = filteredPods ?? pods

  const gridStyle = columns
    ? { gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }
    : undefined

  const gridClass = columns
    ? "grid min-w-0 gap-3"
    : "grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5"

  return (
    <section>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-semibold text-foreground">
            {filteredPods ? "My Pods" : "Portfolio Health"}
          </h2>
          <p className="text-xs text-muted-foreground">
            {displayPods.length} {filteredPods ? "assigned" : "active"} pod{displayPods.length !== 1 ? "s" : ""}{filteredPods ? "" : " across all clients"}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span>Healthy</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-amber-500" />
            <span>Watch</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-red-500" />
            <span>At Risk</span>
          </div>
          {showAddPod && (
            <Button
              size="sm"
              className="ml-2 h-8 gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={() => setAddPodOpen(true)}
            >
              <Plus className="h-3.5 w-3.5" />
              Add Pod
            </Button>
          )}
        </div>
      </div>
      {showAddPod && <AddPodModal open={addPodOpen} onOpenChange={setAddPodOpen} />}
      <div className={gridClass} style={gridStyle}>
        {displayPods.map((pod) => (
          <PodCard key={pod.slug} pod={pod} basePath={basePath} />
        ))}
      </div>
    </section>
  )
}
