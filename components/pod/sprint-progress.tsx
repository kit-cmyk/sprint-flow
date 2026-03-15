"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { InfoTooltip } from "@/components/ui/info-tooltip"
import {
  AlertTriangle,
  Target,
  PlayCircle,
  Clock,
  CheckCircle2,
  Calendar,
} from "lucide-react"
import type { PodData, TicketStatus } from "@/lib/pod-data"

/* ── UTC date formatter to avoid hydration mismatch ── */
function formatDateUTC(dateStr: string, includeYear: boolean) {
  const d = new Date(dateStr)
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  const month = months[d.getUTCMonth()]
  const day = d.getUTCDate()
  if (includeYear) {
    return `${month} ${day}, ${d.getUTCFullYear()}`
  }
  return `${month} ${day}`
}

/* ── colour map shared by tiles, bar & table ── */
const statusColors: Record<
  TicketStatus | "committed",
  { bg: string; text: string; bar: string; border: string; iconBg: string }
> = {
  committed: {
    bg: "bg-blue-500/8 dark:bg-blue-500/10",
    text: "text-blue-600 dark:text-blue-400",
    bar: "bg-blue-500",
    border: "border-blue-500/25",
    iconBg: "bg-blue-500/15",
  },
  "in-progress": {
    bg: "bg-amber-500/8 dark:bg-amber-500/10",
    text: "text-amber-600 dark:text-amber-400",
    bar: "bg-amber-500",
    border: "border-amber-500/25",
    iconBg: "bg-amber-500/15",
  },
  remaining: {
    bg: "bg-slate-400/8 dark:bg-slate-400/10",
    text: "text-slate-600 dark:text-slate-400",
    bar: "bg-slate-400 dark:bg-slate-500",
    border: "border-slate-400/25",
    iconBg: "bg-slate-400/15",
  },
  done: {
    bg: "bg-emerald-500/8 dark:bg-emerald-500/10",
    text: "text-emerald-600 dark:text-emerald-400",
    bar: "bg-emerald-500",
    border: "border-emerald-500/25",
    iconBg: "bg-emerald-500/15",
  },
}

const statusIcons = {
  committed: Target,
  "in-progress": PlayCircle,
  remaining: Clock,
  done: CheckCircle2,
}

type FilterKey = TicketStatus | "committed" | null

/* ── KPI tile ── */
function StatusTile({
  label,
  sp,
  tickets,
  colorKey,
  active,
  onClick,
}: {
  label: string
  sp: number
  tickets: number
  colorKey: TicketStatus | "committed"
  active: boolean
  onClick: () => void
}) {
  const c = statusColors[colorKey]
  const Icon = statusIcons[colorKey]
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-3 rounded-lg border p-3 text-left transition-all ${
        active
          ? `${c.border} ${c.bg} ring-1 ring-current ${c.text}`
          : `border-border bg-card hover:${c.bg}`
      }`}
    >
      <div
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${c.iconBg}`}
      >
        <Icon className={`h-4 w-4 ${c.text}`} />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-semibold text-foreground">
          {sp} <span className="text-xs font-normal text-muted-foreground">SP</span>
          <span className="mx-1 text-muted-foreground">/</span>
          {tickets} <span className="text-xs font-normal text-muted-foreground">tickets</span>
        </p>
      </div>
    </button>
  )
}

/* ── Ticket table ── */
function TicketTable({
  tickets,
}: {
  tickets: PodData["sprintTickets"]
}) {
  if (tickets.length === 0) return null

  const statusLabel: Record<TicketStatus, string> = {
    done: "Done",
    "in-progress": "In Progress",
    remaining: "To Do",
  }

  return (
    <div className="mt-4 overflow-x-auto rounded-lg border border-border">
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-border bg-muted/50">
            <th className="px-2 py-2 text-left font-medium text-muted-foreground sm:px-3">Ticket</th>
            <th className="px-2 py-2 text-left font-medium text-muted-foreground sm:px-3">Title</th>
            <th className="hidden px-3 py-2 text-left font-medium text-muted-foreground sm:table-cell">Assignee</th>
            <th className="px-2 py-2 text-center font-medium text-muted-foreground sm:px-3">SP</th>
            <th className="px-2 py-2 text-left font-medium text-muted-foreground sm:px-3">Status</th>
          </tr>
        </thead>
        <tbody>
          {tickets.map((t) => {
            const c = statusColors[t.status]
            return (
              <tr key={t.id} className="border-b border-border last:border-0">
                <td className="whitespace-nowrap px-2 py-2 font-mono text-muted-foreground sm:px-3">{t.id}</td>
                <td className="px-2 py-2 font-medium text-foreground sm:px-3">{t.title}</td>
                <td className="hidden px-3 py-2 text-muted-foreground sm:table-cell">{t.assignee}</td>
                <td className="px-2 py-2 text-center font-semibold text-foreground sm:px-3">{t.sp}</td>
                <td className="px-2 py-2 sm:px-3">
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${c.bg} ${c.text}`}
                  >
                    {statusLabel[t.status]}
                  </span>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

/* ── Main component ── */
export function SprintProgress({ pod }: { pod: PodData }) {
  const [filter, setFilter] = useState<FilterKey>(null)

  const completionGap = pod.expectedCompletion - pod.completion
  const isBehind = completionGap > 10
  const carryoverHigh = pod.carryoverRisk > 25

  const total = pod.committedSP
  const donePct = total > 0 ? (pod.doneSP / total) * 100 : 0
  const inProgressPct = total > 0 ? (pod.inProgressSP / total) * 100 : 0
  const remainingPct = total > 0 ? (pod.remainingSP / total) * 100 : 0

  const toggleFilter = (key: FilterKey) => {
    setFilter((prev) => (prev === key ? null : key))
  }

  /* Filtered tickets */
  const filteredTickets =
    filter === null || filter === "committed"
      ? filter === "committed"
        ? pod.sprintTickets
        : []
      : pod.sprintTickets.filter((t) => t.status === filter)

  return (
    <section>
      <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-semibold text-foreground">
            Sprint Progress
          </h2>
          <p className="text-xs text-muted-foreground">
            Current sprint completion and remaining work
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-md border border-border bg-muted/50 px-3 py-1.5">
          <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">
            {formatDateUTC(pod.sprintStartDate, false)}
            <span className="mx-1.5 text-foreground/30">-</span>
            {formatDateUTC(pod.sprintEndDate, true)}
          </span>
        </div>
      </div>
      <Card className="border-border bg-card">
        <CardContent className="p-4">
          {/* Segmented Progress Bar */}
          <div className="mb-4">
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center text-muted-foreground">
                Sprint Completion
                <InfoTooltip text="Segmented view of sprint story points: Done (green), In Progress (amber), and Remaining (grey). Click a tile below to filter tickets." />
              </span>
              <span
                className={`font-semibold ${
                  isBehind ? "text-red-400" : "text-foreground"
                }`}
              >
                {pod.completion}%
              </span>
            </div>
            <div className="relative mt-2 flex h-3 w-full overflow-hidden rounded-full bg-secondary">
              {/* Done segment */}
              <div
                className={`h-full transition-all ${statusColors.done.bar}`}
                style={{ width: `${donePct}%` }}
              />
              {/* In Progress segment */}
              <div
                className={`h-full transition-all ${statusColors["in-progress"].bar}`}
                style={{ width: `${inProgressPct}%` }}
              />
              {/* Remaining segment */}
              <div
                className={`h-full transition-all ${statusColors.remaining.bar}`}
                style={{ width: `${remainingPct}%` }}
              />
              {/* Expected pace marker */}
              <div
                className="absolute top-0 h-full border-r-2 border-dashed border-foreground/30"
                style={{ left: `${pod.expectedCompletion}%` }}
              />
            </div>
            <div className="mt-1 flex items-center justify-between text-[10px] text-muted-foreground">
              <span>0%</span>
              <span className="flex items-center gap-1">
                Expected: {pod.expectedCompletion}%
                <span className="inline-block h-px w-3 border-t-2 border-dashed border-foreground/30" />
              </span>
              <span>100%</span>
            </div>
          </div>

          {/* Carryover Risk */}
          <div>
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center text-muted-foreground">
                Predicted Carryover Risk
                <InfoTooltip text="AI-predicted likelihood of story points carrying to the next sprint based on current velocity and remaining scope." />
              </span>
              <span
                className={`font-semibold ${
                  carryoverHigh ? "text-amber-400" : "text-foreground"
                }`}
              >
                {pod.carryoverRisk}%
              </span>
            </div>
            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-secondary">
              <div
                className={`h-full rounded-full transition-all ${
                  carryoverHigh ? "bg-amber-500" : "bg-emerald-500"
                }`}
                style={{ width: `${pod.carryoverRisk}%` }}
              />
            </div>
          </div>

          {isBehind && (
            <div className="mt-3 flex items-center gap-2 rounded-md bg-red-500/10 px-3 py-2 text-xs text-red-400">
              <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
              <span>Sprint is {completionGap}% behind expected pace</span>
            </div>
          )}

          {/* Colour-coded KPI Tiles */}
          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
            <StatusTile
              label="Sprint Commitment"
              sp={pod.committedSP}
              tickets={pod.committedTasks}
              colorKey="committed"
              active={filter === "committed"}
              onClick={() => toggleFilter("committed")}
            />
            <StatusTile
              label="In Progress"
              sp={pod.inProgressSP}
              tickets={pod.inProgressTasks}
              colorKey="in-progress"
              active={filter === "in-progress"}
              onClick={() => toggleFilter("in-progress")}
            />
            <StatusTile
              label="Remaining"
              sp={pod.remainingSP}
              tickets={pod.remainingTasks}
              colorKey="remaining"
              active={filter === "remaining"}
              onClick={() => toggleFilter("remaining")}
            />
            <StatusTile
              label="Done"
              sp={pod.doneSP}
              tickets={pod.doneTasks}
              colorKey="done"
              active={filter === "done"}
              onClick={() => toggleFilter("done")}
            />
          </div>

          {/* Filtered Ticket Table */}
          {filter !== null && (
            <TicketTable tickets={filteredTickets} />
          )}
        </CardContent>
      </Card>
    </section>
  )
}
