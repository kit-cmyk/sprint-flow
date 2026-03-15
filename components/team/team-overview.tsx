"use client"

import Link from "next/link"
import {
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Minus,
  Users,
  Zap,
  Clock,
  GitBranch,
} from "lucide-react"
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
} from "recharts"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Team } from "@/lib/team-data"
import { getTeamDevelopers, getTeamPods } from "@/lib/team-data"
import { PodHealthGrid } from "@/components/pod-health-grid"
import { pods as allPods } from "@/lib/pod-data"

/* ── Constants ─────────────────────────────────────────── */
const DEV_COLORS = ["hsl(var(--primary))", "#34d399", "#f59e0b", "#60a5fa", "#f472b6"]

const avatarBg: Record<string, string> = {
  AR: "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300",
  SC: "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300",
  MJ: "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300",
}

/* ── Helpers ────────────────────────────────────────────── */
function KpiTile({
  label,
  value,
  sub,
  danger,
}: {
  label: string
  value: string | number
  sub?: string
  danger?: boolean
}) {
  return (
    <div className="flex flex-col gap-1 rounded-xl border border-border bg-card p-4">
      <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
        {label}
      </span>
      <span
        className={`text-2xl font-bold leading-none ${danger ? "text-red-500" : "text-foreground"}`}
      >
        {value}
      </span>
      {sub && <span className="text-[11px] text-muted-foreground">{sub}</span>}
    </div>
  )
}

function SectionLabel({
  icon: Icon,
  label,
  count,
}: {
  icon: React.ElementType
  label: string
  count?: number
}) {
  return (
    <div className="mb-4 flex items-center gap-2">
      <Icon className="h-4 w-4 text-muted-foreground" />
      <h2 className="text-sm font-semibold text-foreground">{label}</h2>
      {count !== undefined && (
        <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
          {count}
        </span>
      )}
    </div>
  )
}

/* ── Main component ─────────────────────────────────────── */
export function TeamOverview({ team }: { team: Team }) {
  const developers = getTeamDevelopers(team)
  const teamPods   = getTeamPods(team)

  /* Map team pods to the full pod-data objects (for PodCard) */
  const teamPodsFull = allPods.filter((p) =>
    teamPods.some((tp) => tp.slug === p.slug)
  )

  /* Aggregate KPIs */
  const totalBlockers  = teamPods.reduce((s, p) => s + p.blockers, 0)
  const totalCommitted = teamPods.reduce((s, p) => s + p.committedSP, 0)
  const totalDone      = teamPods.reduce((s, p) => s + p.doneSP, 0)
  const avgHealth      = teamPods.length
    ? Math.round(teamPods.reduce((s, p) => s + p.healthScore, 0) / teamPods.length)
    : 0
  const avgCompletion  = teamPods.length
    ? Math.round(teamPods.reduce((s, p) => s + p.completion, 0) / teamPods.length)
    : 0
  const atRiskPods     = teamPods.filter((p) => p.healthStatus === "at-risk").length
  const totalRisks     = developers.reduce((s, d) => s + d.riskSignals.length, 0)

  /* Chart data */
  const sprints = ["Sprint 11", "Sprint 12", "Sprint 13", "Sprint 14"]

  const throughputData = sprints.map((sprint, idx) => {
    const row: Record<string, string | number> = {
      sprint: sprint.replace("Sprint ", "S"),
    }
    const ratio = [0.6, 0.8, 0.95, 1][idx]
    developers.forEach((dev) => {
      row[dev.name] =
        idx === 3
          ? dev.throughputThisSprint
          : Math.round(dev.throughput3SprintAvg * ratio)
    })
    return row
  })

  const cycleTimeData = sprints.map((sprint) => {
    const row: Record<string, string | number> = {
      sprint: sprint.replace("Sprint ", "S"),
    }
    developers.forEach((dev) => {
      const h = dev.cycleTimeHistory.find((c) => c.sprint === sprint)
      if (h) {
        row[dev.name]    = h.devTime
        row["Team Avg"]  = h.teamAvg
      }
    })
    return row
  })

  const tooltipStyle = {
    contentStyle: {
      background:   "hsl(var(--card))",
      border:       "1px solid hsl(var(--border))",
      borderRadius: 8,
      fontSize:     12,
    },
    labelStyle: { color: "hsl(var(--foreground))", fontWeight: 600 },
  }

  return (
    <div className="flex flex-col gap-8">

      {/* ── KPI strip ───────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
        <KpiTile label="Avg Health"   value={avgHealth}           sub="out of 100" />
        <KpiTile label="Avg Complete" value={`${avgCompletion}%`} sub="this sprint" />
        <KpiTile label="SP Done"      value={totalDone}           sub={`of ${totalCommitted} committed`} />
        <KpiTile label="Blockers"     value={totalBlockers}       danger={totalBlockers > 0} sub="active" />
        <KpiTile label="At-Risk Pods" value={atRiskPods}          danger={atRiskPods > 0} sub={`of ${teamPods.length} pods`} />
        <KpiTile label="Risk Signals" value={totalRisks}          danger={totalRisks > 3} sub="across team" />
      </div>

      {/* ── Team Members — badge row ─────────────────────────── */}
      <section>
        <SectionLabel icon={Users} label="Team Members" count={developers.length} />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
          {developers.map((dev) => {
            const overAlloc = dev.totalAllocation > 100
            const overWip   = dev.wipStatus === "over-limit"
            const hasRisk   = dev.riskSignals.length > 0

            return (
              <Link
                key={dev.slug}
                href={`/developers/${dev.slug}`}
                className="group flex min-w-0 flex-col gap-3 rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/30 hover:bg-muted/20"
              >
                {/* Avatar + name row */}
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                        avatarBg[dev.avatar] ?? "bg-muted text-foreground"
                      }`}
                    >
                      {dev.avatar}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-foreground group-hover:text-primary">
                        {dev.name}
                      </p>
                      <p className="text-xs text-muted-foreground">{dev.role}</p>
                    </div>
                  </div>

                  {overAlloc || overWip ? (
                    <Badge
                      variant="outline"
                      className="shrink-0 border-red-500/30 bg-red-500/10 text-[10px] text-red-500"
                    >
                      {overAlloc ? "Over-alloc" : "WIP limit"}
                    </Badge>
                  ) : (
                    <Badge
                      variant="outline"
                      className="shrink-0 border-emerald-500/30 bg-emerald-500/10 text-[10px] text-emerald-500"
                    >
                      Healthy
                    </Badge>
                  )}
                </div>

                {/* Quick stats */}
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div>
                    <p className="text-[10px] text-muted-foreground">Alloc</p>
                    <p className={`text-sm font-bold ${overAlloc ? "text-red-500" : "text-foreground"}`}>
                      {dev.totalAllocation}%
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground">WIP</p>
                    <p className={`text-sm font-bold ${overWip ? "text-red-500" : "text-foreground"}`}>
                      {dev.activeTickets}
                      <span className="text-xs font-normal text-muted-foreground">/{dev.wipLimit}</span>
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground">Throughput</p>
                    <p className="text-sm font-bold text-foreground">{dev.throughputThisSprint} SP</p>
                  </div>
                </div>

                {/* Pod allocation pills */}
                <div className="flex flex-wrap gap-1">
                  {dev.allocations.map((alloc) => (
                    <span
                      key={alloc.podName}
                      className="flex items-center gap-1 rounded-md border border-border bg-muted/40 px-1.5 py-0.5 text-[10px] text-foreground"
                    >
                      <GitBranch className="h-2.5 w-2.5 text-muted-foreground" />
                      {alloc.podName}
                      <span className="font-semibold text-primary">{alloc.percentage}%</span>
                    </span>
                  ))}
                </div>

                {/* Risk signal preview */}
                {hasRisk && (
                  <div className="flex items-start gap-1.5 rounded-md bg-amber-500/5 px-2 py-1.5 text-[11px] text-amber-600 dark:text-amber-400">
                    <AlertTriangle className="mt-px h-3 w-3 shrink-0" />
                    <span className="leading-snug">
                      {dev.riskSignals[0]}
                      {dev.riskSignals.length > 1 && (
                        <span className="text-muted-foreground">
                          {" "}+{dev.riskSignals.length - 1} more
                        </span>
                      )}
                    </span>
                  </div>
                )}
              </Link>
            )
          })}
        </div>
      </section>

      {/* ── Projects — command center pod cards ─────────────── */}
      <section>
        <SectionLabel icon={Zap} label="Projects" count={teamPodsFull.length} />
        <PodHealthGrid
          filteredPods={teamPodsFull}
          basePath="/pod"
          showAddPod={false}
        />
      </section>

      {/* ── Velocity + Cycle Time charts ─────────────────────── */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">

        {/* Velocity trend */}
        <Card className="border-border bg-card">
          <CardContent className="p-5">
            <div className="mb-1 flex items-center gap-2">
              <Zap className="h-3.5 w-3.5 text-primary" />
              <p className="text-sm font-semibold text-foreground">Velocity Trend</p>
            </div>
            <p className="mb-4 text-xs text-muted-foreground">
              Story points per developer · last 4 sprints
            </p>
            <div className="mb-3 flex flex-wrap gap-3">
              {developers.map((dev, i) => (
                <span key={dev.slug} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <span className="h-2.5 w-2.5 rounded-sm" style={{ background: DEV_COLORS[i] }} />
                  {dev.name.split(" ")[0]}
                </span>
              ))}
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={throughputData} barGap={4} barCategoryGap="30%">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="sprint" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                <Tooltip {...tooltipStyle} formatter={(val: number) => [`${val} SP`]} />
                {developers.map((dev, i) => (
                  <Bar key={dev.slug} dataKey={dev.name} fill={DEV_COLORS[i]} radius={[3, 3, 0, 0]} maxBarSize={28} />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Cycle time */}
        <Card className="border-border bg-card">
          <CardContent className="p-5">
            <div className="mb-1 flex items-center gap-2">
              <Clock className="h-3.5 w-3.5 text-primary" />
              <p className="text-sm font-semibold text-foreground">Cycle Time</p>
            </div>
            <p className="mb-4 text-xs text-muted-foreground">
              Days per ticket vs. team average · last 4 sprints
            </p>
            <div className="mb-3 flex flex-wrap gap-3">
              {developers.map((dev, i) => (
                <span key={dev.slug} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <span className="h-2 w-4 rounded-sm" style={{ background: DEV_COLORS[i] }} />
                  {dev.name.split(" ")[0]}
                </span>
              ))}
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span className="inline-block h-0.5 w-4 border-t-2 border-dashed border-muted-foreground" />
                Avg
              </span>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={cycleTimeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="sprint" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} unit="d" />
                <Tooltip {...tooltipStyle} formatter={(val: number) => [`${val}d`]} />
                {developers.map((dev, i) => (
                  <Line key={dev.slug} type="monotone" dataKey={dev.name} stroke={DEV_COLORS[i]} strokeWidth={2} dot={false} />
                ))}
                <Line type="monotone" dataKey="Team Avg" stroke="hsl(var(--muted-foreground))" strokeWidth={1.5} strokeDasharray="4 3" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* ── Risk Signal Digest ───────────────────────────────── */}
      {developers.some((d) => d.riskSignals.length > 0) && (
        <section>
          <SectionLabel icon={AlertTriangle} label="Risk Signals" />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {developers
              .filter((d) => d.riskSignals.length > 0)
              .flatMap((dev) =>
                dev.riskSignals.map((signal, i) => {
                  const isHigh =
                    signal.toLowerCase().includes("over") ||
                    signal.toLowerCase().includes("110") ||
                    signal.toLowerCase().includes("critical")
                  const isMed =
                    signal.toLowerCase().includes("above") ||
                    signal.toLowerCase().includes("aging") ||
                    signal.toLowerCase().includes("exceed")
                  const severity = isHigh ? "high" : isMed ? "medium" : "low"
                  const colors = {
                    high:   "border-red-500/20 bg-red-500/5",
                    medium: "border-amber-500/20 bg-amber-500/5",
                    low:    "border-border bg-muted/20",
                  }
                  const iconColor = {
                    high:   "text-red-500",
                    medium: "text-amber-500",
                    low:    "text-muted-foreground",
                  }
                  return (
                    <div
                      key={`${dev.slug}-${i}`}
                      className={`flex items-start gap-3 rounded-lg border p-3 ${colors[severity]}`}
                    >
                      <AlertTriangle className={`mt-0.5 h-3.5 w-3.5 shrink-0 ${iconColor[severity]}`} />
                      <div className="min-w-0">
                        <p className="text-[11px] font-medium text-foreground">{dev.name}</p>
                        <p className="mt-0.5 text-[11px] leading-relaxed text-muted-foreground">{signal}</p>
                      </div>
                    </div>
                  )
                })
              )}
          </div>
        </section>
      )}

    </div>
  )
}
