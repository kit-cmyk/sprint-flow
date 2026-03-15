"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  TrendingUp,
  TrendingDown,
  Minus,
  AlertTriangle,
  GitPullRequest,
  Clock,
  Zap,
  Activity,
  ShieldAlert,
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
  Legend,
} from "recharts"
import type { Team } from "@/lib/team-data"
import { getTeamDevelopers } from "@/lib/team-data"

const DEV_COLORS = ["hsl(var(--primary))", "#34d399", "#f59e0b", "#60a5fa", "#f472b6"]

const avatarColors: Record<string, string> = {
  AR: "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300",
  SC: "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300",
  MJ: "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300",
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
      {children}
    </p>
  )
}

function StatChip({ label, value, variant = "default" }: { label: string; value: string | number; variant?: "default" | "danger" | "warn" | "ok" }) {
  const colors = {
    default: "bg-muted/50 text-foreground",
    danger: "bg-red-500/10 text-red-500",
    warn: "bg-amber-500/10 text-amber-500",
    ok: "bg-emerald-500/10 text-emerald-500",
  }
  return (
    <div className={`flex flex-col rounded-md px-3 py-2 ${colors[variant]}`}>
      <span className="text-[10px] text-muted-foreground">{label}</span>
      <span className="text-sm font-bold">{value}</span>
    </div>
  )
}

export function TeamReports({ team }: { team: Team }) {
  const developers = getTeamDevelopers(team)
  const [activeReport, setActiveReport] = useState<"throughput" | "cycletime" | "wip" | "aging" | "prs" | "risks">("throughput")

  const reports = [
    { id: "throughput", label: "Velocity Trend",     icon: Zap },
    { id: "cycletime",  label: "Cycle Time",          icon: Clock },
    { id: "wip",        label: "WIP & Allocation",    icon: Activity },
    { id: "aging",      label: "Ticket Aging",         icon: AlertTriangle },
    { id: "prs",        label: "PR Health",            icon: GitPullRequest },
    { id: "risks",      label: "Risk Signals",         icon: ShieldAlert },
  ] as const

  // --- Throughput data: throughput per developer per sprint ---
  const sprints = ["Sprint 11", "Sprint 12", "Sprint 13", "Sprint 14"]
  const throughputData = sprints.map((sprint) => {
    const row: Record<string, string | number> = { sprint: sprint.replace("Sprint ", "S") }
    developers.forEach((dev) => {
      const hist = dev.cycleTimeHistory.find((h) => h.sprint === sprint)
      // use throughputThisSprint for current, mock decreasing for prior
      const sprintIdx = sprints.indexOf(sprint)
      const ratio = [0.6, 0.8, 0.95, 1][sprintIdx]
      row[dev.name] = sprintIdx === 3 ? dev.throughputThisSprint : Math.round(dev.throughput3SprintAvg * ratio)
    })
    return row
  })

  // --- Cycle time data: multi-line, one per dev + team avg ---
  const cycleTimeData = sprints.map((sprint) => {
    const row: Record<string, string | number> = { sprint: sprint.replace("Sprint ", "S") }
    developers.forEach((dev) => {
      const hist = dev.cycleTimeHistory.find((h) => h.sprint === sprint)
      if (hist) {
        row[dev.name] = hist.devTime
        row["Team Avg"] = hist.teamAvg
      }
    })
    return row
  })

  // All risk signals with attribution
  const allRisks = developers.flatMap((dev) =>
    dev.riskSignals.map((signal) => ({
      dev,
      signal,
      severity: signal.toLowerCase().includes("critical") || signal.toLowerCase().includes("doubles") || signal.toLowerCase().includes("over") || signal.toLowerCase().includes("110")
        ? "high"
        : signal.toLowerCase().includes("above") || signal.toLowerCase().includes("exceed") || signal.toLowerCase().includes("aging")
        ? "medium"
        : "low",
    }))
  )

  const riskColor = {
    high: "bg-red-500/10 text-red-500 border-red-500/20",
    medium: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    low: "bg-muted/50 text-muted-foreground border-border",
  }

  return (
    <div className="flex flex-col gap-6">

      {/* Report selector */}
      <div className="flex flex-wrap gap-2">
        {reports.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveReport(id as typeof activeReport)}
            className={`flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-medium transition-colors ${
              activeReport === id
                ? "border-primary bg-primary/10 text-primary"
                : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground"
            }`}
          >
            <Icon className="h-3.5 w-3.5" />
            {label}
          </button>
        ))}
      </div>

      {/* ── Velocity Trend ────────────────────────────────────── */}
      {activeReport === "throughput" && (
        <div className="flex flex-col gap-4">
          <div>
            <h2 className="text-sm font-semibold text-foreground">Team Velocity Trend</h2>
            <p className="mt-0.5 text-xs text-muted-foreground">Story points completed per developer across the last 4 sprints.</p>
          </div>

          {/* Summary chips */}
          <div className="flex flex-wrap gap-2">
            {developers.map((dev, i) => {
              const delta = dev.throughputThisSprint - dev.throughput3SprintAvg
              return (
                <div key={dev.slug} className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2">
                  <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${avatarColors[dev.avatar] ?? "bg-muted"}`}>
                    {dev.avatar}
                  </div>
                  <div>
                    <p className="text-xs font-medium text-foreground">{dev.name}</p>
                    <p className="flex items-center gap-1 text-[10px] text-muted-foreground">
                      {dev.throughputThisSprint} SP this sprint
                      <span className={`font-semibold ${delta >= 0 ? "text-emerald-500" : "text-red-500"}`}>
                        ({delta >= 0 ? "+" : ""}{delta} vs avg)
                      </span>
                    </p>
                  </div>
                </div>
              )
            })}
          </div>

          <Card className="border-border bg-card">
            <CardContent className="p-5">
              <div className="mb-1 flex items-center gap-3 text-xs text-muted-foreground">
                {developers.map((dev, i) => (
                  <span key={dev.slug} className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-sm" style={{ background: DEV_COLORS[i] }} />
                    {dev.name}
                  </span>
                ))}
              </div>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={throughputData} barGap={4} barCategoryGap="30%">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis dataKey="sprint" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }}
                    labelStyle={{ color: "hsl(var(--foreground))", fontWeight: 600 }}
                    formatter={(val: number) => [`${val} SP`]}
                  />
                  {developers.map((dev, i) => (
                    <Bar key={dev.slug} dataKey={dev.name} fill={DEV_COLORS[i]} radius={[3, 3, 0, 0]} maxBarSize={32} />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ── Cycle Time ────────────────────────────────────────── */}
      {activeReport === "cycletime" && (
        <div className="flex flex-col gap-4">
          <div>
            <h2 className="text-sm font-semibold text-foreground">Cycle Time Comparison</h2>
            <p className="mt-0.5 text-xs text-muted-foreground">Average days per ticket from start to done, per developer vs. team average.</p>
          </div>
          <Card className="border-border bg-card">
            <CardContent className="p-5">
              <div className="mb-1 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                {developers.map((dev, i) => (
                  <span key={dev.slug} className="flex items-center gap-1.5">
                    <span className="h-2 w-5 rounded-sm" style={{ background: DEV_COLORS[i] }} />
                    {dev.name}
                  </span>
                ))}
                <span className="flex items-center gap-1.5">
                  <span className="h-0.5 w-5 rounded-full bg-muted-foreground" style={{ borderTop: "2px dashed" }} />
                  Team Avg
                </span>
              </div>
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={cycleTimeData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis dataKey="sprint" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} unit="d" />
                  <Tooltip
                    contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }}
                    labelStyle={{ color: "hsl(var(--foreground))", fontWeight: 600 }}
                    formatter={(val: number) => [`${val}d`]}
                  />
                  {developers.map((dev, i) => (
                    <Line key={dev.slug} type="monotone" dataKey={dev.name} stroke={DEV_COLORS[i]} strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                  ))}
                  <Line type="monotone" dataKey="Team Avg" stroke="hsl(var(--muted-foreground))" strokeWidth={1.5} strokeDasharray="5 3" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ── WIP & Allocation ──────────────────────────────────── */}
      {activeReport === "wip" && (
        <div className="flex flex-col gap-4">
          <div>
            <h2 className="text-sm font-semibold text-foreground">WIP & Allocation Health</h2>
            <p className="mt-0.5 text-xs text-muted-foreground">Current capacity usage, WIP count vs limit, and context switching index per developer.</p>
          </div>
          <div className="flex flex-col gap-3">
            {developers.map((dev) => {
              const overAlloc = dev.totalAllocation > 100
              const overWip = dev.wipStatus === "over-limit"
              const wipPct = Math.min((dev.activeTickets / dev.wipLimit) * 100, 150)
              return (
                <Card key={dev.slug} className={`border-border bg-card ${overAlloc || overWip ? "ring-1 ring-red-500/30" : ""}`}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold ${avatarColors[dev.avatar] ?? "bg-muted"}`}>
                          {dev.avatar}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-foreground">{dev.name}</p>
                          <p className="text-xs text-muted-foreground">{dev.role}</p>
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="outline" className={`text-[10px] ${overAlloc ? "border-red-500/30 bg-red-500/10 text-red-500" : "border-emerald-500/30 bg-emerald-500/10 text-emerald-500"}`}>
                          {dev.totalAllocation}% allocated
                        </Badge>
                        <Badge variant="outline" className={`text-[10px] ${overWip ? "border-red-500/30 bg-red-500/10 text-red-500" : "border-emerald-500/30 bg-emerald-500/10 text-emerald-500"}`}>
                          WIP {dev.activeTickets}/{dev.wipLimit}
                        </Badge>
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
                      {/* Allocation bar */}
                      <div>
                        <div className="mb-1 flex items-center justify-between text-[11px] text-muted-foreground">
                          <span>Allocation</span>
                          <span className={overAlloc ? "font-semibold text-red-500" : "text-foreground"}>{dev.totalAllocation}%</span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-muted">
                          <div
                            className={`h-full rounded-full transition-all ${overAlloc ? "bg-red-500" : "bg-emerald-500"}`}
                            style={{ width: `${Math.min(dev.totalAllocation, 100)}%` }}
                          />
                        </div>
                        <p className="mt-1 text-[10px] text-muted-foreground">{dev.activeProjectsCount} active project{dev.activeProjectsCount !== 1 ? "s" : ""}</p>
                      </div>

                      {/* WIP bar */}
                      <div>
                        <div className="mb-1 flex items-center justify-between text-[11px] text-muted-foreground">
                          <span>WIP</span>
                          <span className={overWip ? "font-semibold text-red-500" : "text-foreground"}>{dev.activeTickets} / {dev.wipLimit}</span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-muted">
                          <div
                            className={`h-full rounded-full transition-all ${overWip ? "bg-red-500" : "bg-emerald-500"}`}
                            style={{ width: `${Math.min(wipPct, 100)}%` }}
                          />
                        </div>
                        <p className="mt-1 text-[10px] text-muted-foreground">Limit: {dev.wipLimit} tickets</p>
                      </div>

                      {/* Context switch */}
                      <div>
                        <div className="mb-1 flex items-center justify-between text-[11px] text-muted-foreground">
                          <span>Context Switch Index</span>
                          <span className={dev.contextSwitchIndex >= 3.0 ? "font-semibold text-red-500" : dev.contextSwitchIndex >= 2.0 ? "font-semibold text-amber-500" : "text-foreground"}>{dev.contextSwitchIndex}</span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-muted">
                          <div
                            className={`h-full rounded-full transition-all ${dev.contextSwitchIndex >= 3.0 ? "bg-red-500" : dev.contextSwitchIndex >= 2.0 ? "bg-amber-500" : "bg-emerald-500"}`}
                            style={{ width: `${Math.min((dev.contextSwitchIndex / 5) * 100, 100)}%` }}
                          />
                        </div>
                        <p className="mt-1 text-[10px] text-muted-foreground">Threshold: 2.0</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      )}

      {/* ── Ticket Aging ──────────────────────────────────────── */}
      {activeReport === "aging" && (
        <div className="flex flex-col gap-4">
          <div>
            <h2 className="text-sm font-semibold text-foreground">Ticket Aging Distribution</h2>
            <p className="mt-0.5 text-xs text-muted-foreground">How long active tickets have been in progress per developer. Older tickets signal scope risk.</p>
          </div>
          <Card className="border-border bg-card">
            <CardContent className="p-5">
              <div className="mb-2 flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-emerald-500" />0–2 days</span>
                <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-amber-500" />3–5 days</span>
                <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-red-500" />6+ days</span>
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart
                  data={developers.map((dev) => ({
                    name: dev.name.split(" ")[0],
                    "0–2d": dev.ticketAging[0].count,
                    "3–5d": dev.ticketAging[1].count,
                    "6+d":  dev.ticketAging[2].count,
                  }))}
                  barGap={2}
                  barCategoryGap="35%"
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }}
                    labelStyle={{ color: "hsl(var(--foreground))", fontWeight: 600 }}
                    formatter={(val: number) => [`${val} ticket${val !== 1 ? "s" : ""}`]}
                  />
                  <Bar dataKey="0–2d" stackId="a" fill="#34d399" radius={[0, 0, 0, 0]} maxBarSize={48} />
                  <Bar dataKey="3–5d" stackId="a" fill="#f59e0b" maxBarSize={48} />
                  <Bar dataKey="6+d"  stackId="a" fill="#ef4444" radius={[3, 3, 0, 0]} maxBarSize={48} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Per-dev detail */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {developers.map((dev) => {
              const stale = dev.ticketAging[2].count
              return (
                <Card key={dev.slug} className={`border-border bg-card ${stale > 0 ? "ring-1 ring-red-500/20" : ""}`}>
                  <CardContent className="p-4">
                    <div className="mb-3 flex items-center gap-2">
                      <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${avatarColors[dev.avatar] ?? "bg-muted"}`}>
                        {dev.avatar}
                      </div>
                      <p className="text-xs font-semibold text-foreground">{dev.name}</p>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      {dev.ticketAging.map((bucket) => (
                        <div key={bucket.range} className="flex items-center justify-between gap-2">
                          <span className="text-[11px] text-muted-foreground">{bucket.range}</span>
                          <div className="flex items-center gap-2">
                            <div className="h-1.5 w-20 overflow-hidden rounded-full bg-muted">
                              <div className="h-full rounded-full" style={{ background: bucket.color, width: `${(bucket.count / dev.activeTickets) * 100}%` }} />
                            </div>
                            <span className="w-4 text-right text-[11px] font-semibold text-foreground">{bucket.count}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      )}

      {/* ── PR Health ─────────────────────────────────────────── */}
      {activeReport === "prs" && (
        <div className="flex flex-col gap-4">
          <div>
            <h2 className="text-sm font-semibold text-foreground">PR Health</h2>
            <p className="mt-0.5 text-xs text-muted-foreground">Pull request throughput, review latency, and merge efficiency for this sprint.</p>
          </div>

          {/* Summary stat row */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <StatChip label="Total PRs Open"           value={developers.reduce((s, d) => s + d.prsOpen, 0)} variant={developers.reduce((s, d) => s + d.prsOpen, 0) > 6 ? "warn" : "ok"} />
            <StatChip label="Waiting Review"           value={developers.reduce((s, d) => s + d.prsWaitingReview, 0)} variant={developers.reduce((s, d) => s + d.prsWaitingReview, 0) > 4 ? "danger" : "ok"} />
            <StatChip label="Avg Time to Merge"        value={`${Math.round(developers.reduce((s, d) => s + d.avgTimeToMerge, 0) / developers.length)}h`} variant="default" />
            <StatChip label="Reviews Done This Sprint" value={developers.reduce((s, d) => s + d.reviewsDone, 0)} variant="ok" />
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {developers.map((dev) => {
              const latencyHigh = dev.avgPrReviewTime > 24
              return (
                <Card key={dev.slug} className={`border-border bg-card ${latencyHigh ? "ring-1 ring-amber-500/20" : ""}`}>
                  <CardContent className="p-4">
                    <div className="mb-3 flex items-center gap-2">
                      <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${avatarColors[dev.avatar] ?? "bg-muted"}`}>
                        {dev.avatar}
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-foreground">{dev.name}</p>
                        <p className="text-[10px] text-muted-foreground">{dev.role}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="rounded-md bg-muted/40 px-2.5 py-2">
                        <p className="text-[10px] text-muted-foreground">Opened</p>
                        <p className="text-sm font-bold text-foreground">{dev.prsOpenedThisSprint}</p>
                      </div>
                      <div className="rounded-md bg-muted/40 px-2.5 py-2">
                        <p className="text-[10px] text-muted-foreground">Merged</p>
                        <p className="text-sm font-bold text-foreground">{dev.prsMerged}</p>
                      </div>
                      <div className={`rounded-md px-2.5 py-2 ${latencyHigh ? "bg-amber-500/10" : "bg-muted/40"}`}>
                        <p className="text-[10px] text-muted-foreground">Avg Review Time</p>
                        <p className={`text-sm font-bold ${latencyHigh ? "text-amber-500" : "text-foreground"}`}>{dev.avgPrReviewTime}h</p>
                      </div>
                      <div className="rounded-md bg-muted/40 px-2.5 py-2">
                        <p className="text-[10px] text-muted-foreground">Reviews Done</p>
                        <p className="text-sm font-bold text-foreground">{dev.reviewsDone}</p>
                      </div>
                    </div>
                    {dev.prsWaitingReview > 0 && (
                      <p className="mt-2 text-[11px] text-amber-500">
                        {dev.prsWaitingReview} PR{dev.prsWaitingReview !== 1 ? "s" : ""} waiting review
                      </p>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      )}

      {/* ── Risk Signals ──────────────────────────────────────── */}
      {activeReport === "risks" && (
        <div className="flex flex-col gap-4">
          <div>
            <h2 className="text-sm font-semibold text-foreground">Risk Signal Digest</h2>
            <p className="mt-0.5 text-xs text-muted-foreground">All active risk signals across team members, grouped by severity.</p>
          </div>

          {/* Count chips */}
          <div className="flex items-center gap-3">
            {(["high", "medium", "low"] as const).map((sev) => {
              const count = allRisks.filter((r) => r.severity === sev).length
              return (
                <div key={sev} className={`rounded-md border px-3 py-1.5 text-xs font-semibold ${riskColor[sev]}`}>
                  {count} {sev}
                </div>
              )
            })}
            <span className="text-xs text-muted-foreground">{allRisks.length} total signals</span>
          </div>

          {/* Signal list */}
          <div className="flex flex-col gap-2">
            {(["high", "medium", "low"] as const).flatMap((sev) =>
              allRisks
                .filter((r) => r.severity === sev)
                .map(({ dev, signal }, i) => (
                  <div
                    key={`${sev}-${i}`}
                    className={`flex items-start gap-3 rounded-lg border px-4 py-3 ${riskColor[sev]}`}
                  >
                    <ShieldAlert className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs leading-relaxed">{signal}</p>
                    </div>
                    <div className={`flex shrink-0 items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-medium ${avatarColors[dev.avatar] ?? "bg-muted text-foreground"}`}>
                      {dev.avatar}
                      <span className="hidden sm:inline">{dev.name.split(" ")[0]}</span>
                    </div>
                  </div>
                ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
