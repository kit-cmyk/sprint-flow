"use client"

import Link from "next/link"
import { ChevronRight, CheckCircle2 } from "lucide-react"
import { pulseReports, type PulseReport } from "@/lib/pulse-data"

/* ── helpers ────────────────────────────────────────────── */
function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase()
}

const avatarColors = [
  "bg-emerald-100 text-emerald-700",
  "bg-blue-100 text-blue-700",
  "bg-violet-100 text-violet-700",
  "bg-amber-100 text-amber-700",
  "bg-rose-100 text-rose-700",
]

function getAvatarColor(name: string) {
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
  return avatarColors[Math.abs(hash) % avatarColors.length]
}

function getDonePct(report: PulseReport) {
  const total = report.board.todo.length + report.board.inProgress.length + report.board.done.length
  return total > 0 ? Math.round((report.board.done.length / total) * 100) : 0
}

/* ── report list row (links to individual page) ─────────── */
function ReportListRow({ report }: { report: PulseReport }) {
  const donePct = getDonePct(report)

  return (
    <Link
      href={`/client-dashboard/pulse-checks/${report.id}`}
      className="group flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-3.5 transition-colors hover:bg-muted/40"
    >
      {/* Status dot */}
      <span
        className={`h-2 w-2 shrink-0 rounded-full ${
          donePct === 100
            ? "bg-emerald-400"
            : report.board.inProgress.length > 0
            ? "bg-amber-400"
            : "bg-muted-foreground/40"
        }`}
      />

      {/* Sprint badge + title */}
      <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
        {report.sprint}
      </span>
      <span className="flex-1 truncate text-sm font-semibold text-foreground">
        {report.week}
      </span>

      {/* Meta */}
      <div className="hidden items-center gap-3 sm:flex">
        <span className="text-xs text-muted-foreground">{report.date}</span>
        <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
          <CheckCircle2 className="h-3 w-3 text-emerald-500" />
          {donePct}%
        </span>
        <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[9px] font-bold ${getAvatarColor(report.author)}`}>
          {getInitials(report.author)}
        </div>
      </div>

      <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
    </Link>
  )
}

/* ── main component (index list) ────────────────────────── */
export function ClientPulseChecksContent() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">Pulse Checks</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Weekly reports published by your team — {pulseReports.length} reports available
          </p>
        </div>

        <div className="flex flex-col gap-2">
          {pulseReports.map((report) => (
            <ReportListRow key={report.id} report={report} />
          ))}
        </div>
      </div>
    </div>
  )
}
