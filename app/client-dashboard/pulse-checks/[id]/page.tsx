"use client"

import { use } from "react"
import { notFound } from "next/navigation"
import { Calendar, CheckCircle2, FileText } from "lucide-react"
import { usePulse } from "@/lib/hooks/usePulse"

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

/* ── page ───────────────────────────────────────────────── */
export default function PulseReportPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { reports, isLoading } = usePulse()

  if (isLoading) return null
  const report = reports.find((r) => r.id === id)
  if (!report) notFound()

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8">

        {/* Report header */}
        <div className="mb-6 rounded-lg border border-border bg-card px-5 py-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="mb-1">
                <span className="rounded bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                  {report.sprint}
                </span>
              </div>
              <h1 className="text-xl font-bold text-foreground">{report.week}</h1>
            </div>
            <div className="flex items-center gap-2.5">
              <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${getAvatarColor(report.author)}`}>
                {getInitials(report.author)}
              </div>
              <div>
                <p className="text-xs font-medium text-foreground">{report.author}</p>
                <p className="text-[10px] text-muted-foreground">{report.role}</p>
              </div>
              <div className="ml-2 flex items-center gap-1 text-xs text-muted-foreground">
                <Calendar className="h-3.5 w-3.5" />
                {report.date}
              </div>
            </div>
          </div>
        </div>

        {/* Weekly Summary */}
        <section className="mb-6">
          <div className="mb-3 flex items-center gap-2">
            <FileText className="h-4 w-4 text-muted-foreground" />
            <h2 className="text-sm font-semibold text-foreground">Weekly Summary</h2>
          </div>
          <div className="rounded-lg border border-border bg-card px-5 py-4">
            <p className="text-sm leading-relaxed text-foreground">{report.summary}</p>

            {report.highlights.length > 0 && (
              <div className="mt-4 rounded-lg border border-border bg-muted/30 p-4">
                <p className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                  Highlights
                </p>
                <ul className="flex flex-col gap-2.5">
                  {report.highlights.map((h, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                      <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-500" />
                      {h}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>



      </div>
    </div>
  )
}
