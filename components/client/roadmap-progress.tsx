"use client"

import { useState, useEffect } from "react"
import {
  CheckCircle2,
  Clock,
  Circle,
  ChevronDown,
  ChevronRight,
  Calendar,
} from "lucide-react"
import { Card } from "@/components/ui/card"

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

interface Milestone {
  name: string
  start: string // ISO date
  end: string
  progress: number // 0-100
}

interface Phase {
  name: string
  status: "complete" | "in-progress" | "upcoming"
  start: string
  end: string
  progress: number
  color: string // tailwind bg-* class for the bar
  colorLight: string // lighter version for bg track
  milestones: Milestone[]
}

const phases: Phase[] = [
  {
    name: "Phase 1 - Foundation",
    status: "complete",
    start: "2024-09-01",
    end: "2024-12-31",
    progress: 100,
    color: "bg-emerald-500",
    colorLight: "bg-emerald-500/20",
    milestones: [
      { name: "Core platform architecture", start: "2024-09-01", end: "2024-10-01", progress: 100 },
      { name: "User authentication system", start: "2024-09-15", end: "2024-10-20", progress: 100 },
      { name: "Base API layer", start: "2024-10-10", end: "2024-11-25", progress: 100 },
      { name: "Initial deployment pipeline", start: "2024-11-15", end: "2024-12-31", progress: 100 },
    ],
  },
  {
    name: "Phase 2 - Enhancement",
    status: "in-progress",
    start: "2025-01-01",
    end: "2025-04-30",
    progress: 70,
    color: "bg-primary",
    colorLight: "bg-primary/20",
    milestones: [
      { name: "Client onboarding workflow", start: "2025-01-01", end: "2025-02-15", progress: 100 },
      { name: "Analytics module", start: "2025-01-15", end: "2025-03-15", progress: 70 },
      { name: "Performance optimizations", start: "2025-02-15", end: "2025-04-01", progress: 40 },
      { name: "Bulk data import", start: "2025-03-01", end: "2025-04-30", progress: 10 },
    ],
  },
  {
    name: "Phase 3 - Scale",
    status: "upcoming",
    start: "2025-05-01",
    end: "2025-09-30",
    progress: 0,
    color: "bg-muted-foreground",
    colorLight: "bg-muted-foreground/20",
    milestones: [
      { name: "Advanced reporting", start: "2025-05-01", end: "2025-06-15", progress: 0 },
      { name: "Third-party integrations", start: "2025-06-01", end: "2025-07-31", progress: 0 },
      { name: "Multi-tenant support", start: "2025-07-15", end: "2025-09-01", progress: 0 },
      { name: "Mobile companion app", start: "2025-08-01", end: "2025-09-30", progress: 0 },
    ],
  },
]

/* ------------------------------------------------------------------ */
/*  Timeline helpers                                                   */
/* ------------------------------------------------------------------ */

const SHORT_MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

function utcDate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number)
  return Date.UTC(y, m - 1, d)
}

const TIMELINE_START_ISO = "2024-09-01"
const TIMELINE_END_ISO = "2025-09-30"
const TIMELINE_START = utcDate(TIMELINE_START_ISO)
const TIMELINE_END = utcDate(TIMELINE_END_ISO)
const TOTAL_DAYS = (TIMELINE_END - TIMELINE_START) / (1000 * 60 * 60 * 24)

function dayOffset(date: string): number {
  return Math.max(0, (utcDate(date) - TIMELINE_START) / (1000 * 60 * 60 * 24))
}

function barStyle(start: string, end: string) {
  const left = (dayOffset(start) / TOTAL_DAYS) * 100
  const width = ((utcDate(end) - utcDate(start)) / (1000 * 60 * 60 * 24) / TOTAL_DAYS) * 100
  return { left: `${left}%`, width: `${Math.max(width, 0.8)}%` }
}

function getMonths() {
  const result: { label: string; left: number; width: number }[] = []
  const [startY, startM] = TIMELINE_START_ISO.split("-").map(Number)
  const [endY, endM] = TIMELINE_END_ISO.split("-").map(Number)
  let y = startY
  let m = startM
  while (y < endY || (y === endY && m <= endM)) {
    const monthStartMs = Date.UTC(y, m - 1, 1)
    const monthEndMs = Date.UTC(y, m, 0)
    const clampedEndMs = Math.min(monthEndMs, TIMELINE_END)
    const leftPct = ((monthStartMs - TIMELINE_START) / (1000 * 60 * 60 * 24) / TOTAL_DAYS) * 100
    const widthPct = ((clampedEndMs - monthStartMs) / (1000 * 60 * 60 * 24) / TOTAL_DAYS) * 100
    const showYear = result.length === 0 || m === 1
    result.push({
      label: `${SHORT_MONTHS[m - 1]}${showYear ? ` ${String(y).slice(2)}` : ""}`,
      left: leftPct,
      width: widthPct,
    })
    m++
    if (m > 12) { m = 1; y++ }
  }
  return result
}

function getWeeks() {
  const result: { label: string; left: number; width: number }[] = []
  const [startY, startM, startD] = TIMELINE_START_ISO.split("-").map(Number)
  let currentDate = new Date(Date.UTC(startY, startM - 1, startD))
  let weekNum = 1
  
  while (currentDate.getTime() < TIMELINE_END) {
    const weekStartMs = currentDate.getTime()
    const weekEndMs = Math.min(weekStartMs + 7 * 24 * 60 * 60 * 1000, TIMELINE_END)
    const leftPct = ((weekStartMs - TIMELINE_START) / (1000 * 60 * 60 * 24) / TOTAL_DAYS) * 100
    const widthPct = ((weekEndMs - weekStartMs) / (1000 * 60 * 60 * 24) / TOTAL_DAYS) * 100
    
    const month = SHORT_MONTHS[currentDate.getUTCMonth()]
    const day = currentDate.getUTCDate()
    result.push({
      label: `W${weekNum} ${month} ${day}`,
      left: leftPct,
      width: widthPct,
    })
    
    currentDate = new Date(weekEndMs)
    weekNum++
  }
  return result
}

function getQuarters() {
  const result: { label: string; left: number; width: number }[] = []
  const [startY] = TIMELINE_START_ISO.split("-").map(Number)
  const [endY] = TIMELINE_END_ISO.split("-").map(Number)
  
  for (let y = startY; y <= endY; y++) {
    for (let q = 1; q <= 4; q++) {
      const qStartMonth = (q - 1) * 3
      const qStartMs = Date.UTC(y, qStartMonth, 1)
      const qEndMs = Date.UTC(y, qStartMonth + 3, 0)
      
      if (qEndMs < TIMELINE_START || qStartMs > TIMELINE_END) continue
      
      const clampedStartMs = Math.max(qStartMs, TIMELINE_START)
      const clampedEndMs = Math.min(qEndMs, TIMELINE_END)
      const leftPct = ((clampedStartMs - TIMELINE_START) / (1000 * 60 * 60 * 24) / TOTAL_DAYS) * 100
      const widthPct = ((clampedEndMs - clampedStartMs) / (1000 * 60 * 60 * 24) / TOTAL_DAYS) * 100
      
      result.push({
        label: `Q${q} ${y}`,
        left: leftPct,
        width: widthPct,
      })
    }
  }
  return result
}

function getYears() {
  const result: { label: string; left: number; width: number }[] = []
  const [startY] = TIMELINE_START_ISO.split("-").map(Number)
  const [endY] = TIMELINE_END_ISO.split("-").map(Number)
  
  for (let y = startY; y <= endY; y++) {
    const yearStartMs = Date.UTC(y, 0, 1)
    const yearEndMs = Date.UTC(y, 11, 31)
    
    const clampedStartMs = Math.max(yearStartMs, TIMELINE_START)
    const clampedEndMs = Math.min(yearEndMs, TIMELINE_END)
    const leftPct = ((clampedStartMs - TIMELINE_START) / (1000 * 60 * 60 * 24) / TOTAL_DAYS) * 100
    const widthPct = ((clampedEndMs - clampedStartMs) / (1000 * 60 * 60 * 24) / TOTAL_DAYS) * 100
    
    result.push({
      label: String(y),
      left: leftPct,
      width: widthPct,
    })
  }
  return result
}

const months = getMonths()

/* today marker - computed client-side only to avoid hydration mismatch */
function useTodayOffset() {
  const [offset, setOffset] = useState<number | null>(null)
  useEffect(() => {
    const now = new Date()
    const iso = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`
    const nowMs = utcDate(iso)
    if (nowMs >= TIMELINE_START && nowMs <= TIMELINE_END) {
      setOffset((dayOffset(iso) / TOTAL_DAYS) * 100)
    }
  }, [])
  return offset
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

function PhaseIcon({ status }: { status: Phase["status"] }) {
  if (status === "complete")
    return <CheckCircle2 className="h-4 w-4 text-emerald-500" />
  if (status === "in-progress")
    return <Clock className="h-4 w-4 text-primary" />
  return <Circle className="h-4 w-4 text-muted-foreground" />
}

function StatusBadge({ status, progress }: { status: Phase["status"]; progress: number }) {
  if (status === "complete")
    return (
      <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
        Complete
      </span>
    )
  if (status === "in-progress")
    return (
      <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-semibold text-primary">
        {progress}%
      </span>
    )
  return (
    <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
      Upcoming
    </span>
  )
}

function formatRange(start: string, end: string) {
  const [sY, sM, sD] = start.split("-").map(Number)
  const [eY, eM, eD] = end.split("-").map(Number)
  return `${SHORT_MONTHS[sM - 1]} ${sD} - ${SHORT_MONTHS[eM - 1]} ${eD}, ${eY}`
}

type TimelineView = "weekly" | "monthly" | "quarterly" | "yearly"

export function RoadmapProgress() {
  const [expanded, setExpanded] = useState<number | null>(1)
  const [timelineView, setTimelineView] = useState<TimelineView>("monthly")
  const todayOffset = useTodayOffset()
  
  // Get timeline periods based on selected view
  const timelinePeriods = 
    timelineView === "weekly" ? getWeeks() :
    timelineView === "monthly" ? months :
    timelineView === "quarterly" ? getQuarters() :
    getYears()

  return (
    <section>
      <div className="mb-4 flex flex-col gap-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-lg font-semibold text-foreground">
            Project Roadmap
          </h2>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-5 text-[11px] text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-sm bg-emerald-500" /> Complete
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-sm bg-primary" /> In Progress
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-sm bg-muted-foreground/40" /> Upcoming
              </span>
            </div>
          </div>
        </div>
        
        {/* Timeline View Toggle */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Timeline View:</span>
          <div className="inline-flex rounded-lg border border-border bg-muted/30 p-1">
            {(["weekly", "monthly", "quarterly", "yearly"] as TimelineView[]).map((view) => (
              <button
                key={view}
                onClick={() => setTimelineView(view)}
                className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
                  timelineView === view
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {view.charAt(0).toUpperCase() + view.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <Card className="overflow-hidden border-border bg-card shadow-sm">
        <div className="overflow-x-auto">
        <div className="min-w-[700px]">
        {/* Month header */}
        <div className="flex border-b border-border">
          {/* Label column */}
          <div className="w-[200px] shrink-0 border-r border-border bg-muted/30 px-4 py-2 sm:w-[260px]">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Phase / Task
            </span>
          </div>
          {/* Timeline columns */}
          <div className="relative flex-1 overflow-hidden">
            <div className="flex h-full">
              {timelinePeriods.map((period, i) => (
                <div
                  key={i}
                  className="flex shrink-0 items-center justify-center border-r border-border/60 py-2 text-[10px] font-medium text-muted-foreground"
                  style={{ width: `${period.width}%`, marginLeft: i === 0 ? `${period.left}%` : undefined }}
                >
                  {period.label}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Gantt rows */}
        <div className="divide-y divide-border/60">
          {phases.map((phase, phaseIdx) => (
            <div key={phase.name}>
              {/* Phase row */}
              <button
                type="button"
                onClick={() => setExpanded(expanded === phaseIdx ? null : phaseIdx)}
                className="group flex w-full items-stretch transition-colors hover:bg-muted/30"
              >
                {/* Label */}
                <div className="flex w-[200px] shrink-0 items-center gap-2 border-r border-border px-3 py-3 sm:w-[260px] sm:px-4">
                  {expanded === phaseIdx ? (
                    <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                  )}
                  <PhaseIcon status={phase.status} />
                  <span className="truncate text-xs font-semibold text-foreground sm:text-sm">
                    {phase.name}
                  </span>
                  <StatusBadge status={phase.status} progress={phase.progress} />
                </div>

                {/* Timeline bar */}
                <div className="relative flex flex-1 items-center">
                  {/* Period grid lines */}
                  {timelinePeriods.map((period, i) => (
                    <div
                      key={i}
                      className="absolute top-0 h-full border-r border-border/40"
                      style={{ left: `${period.left + period.width}%` }}
                    />
                  ))}
                  {/* Today marker */}
                  {todayOffset !== null && (
                    <div
                      className="absolute top-0 z-20 h-full w-px bg-red-400"
                      style={{ left: `${todayOffset}%` }}
                    >
                      <span className="absolute -top-0 left-1 text-[8px] font-bold text-red-400">
                        TODAY
                      </span>
                    </div>
                  )}
                  {/* Phase bar track */}
                  <div
                    className={`absolute h-7 rounded ${phase.colorLight}`}
                    style={barStyle(phase.start, phase.end)}
                  />
                  {/* Phase bar fill */}
                  <div
                    className={`absolute h-7 rounded ${phase.color} opacity-90`}
                    style={{
                      ...barStyle(phase.start, phase.end),
                      width: `${parseFloat(barStyle(phase.start, phase.end).width) * (phase.progress / 100)}%`,
                    }}
                  />
                  {/* Date label on bar */}
                  <div
                    className="absolute flex h-7 items-center px-2"
                    style={barStyle(phase.start, phase.end)}
                  >
                    <span className="relative z-10 truncate text-[10px] font-medium text-white mix-blend-difference">
                      {formatRange(phase.start, phase.end)}
                    </span>
                  </div>
                </div>
              </button>

              {/* Milestone rows */}
              {expanded === phaseIdx && (
                <div className="divide-y divide-border/40">
                  {phase.milestones.map((ms) => (
                    <div key={ms.name} className="flex items-stretch bg-muted/20">
                      {/* Label */}
                      <div className="flex w-[200px] shrink-0 items-center gap-2 border-r border-border py-2.5 pl-8 pr-3 sm:w-[260px] sm:pl-12 sm:pr-4">
                        {ms.progress >= 100 ? (
                          <CheckCircle2 className="h-3 w-3 shrink-0 text-emerald-500" />
                        ) : ms.progress > 0 ? (
                          <Clock className="h-3 w-3 shrink-0 text-primary" />
                        ) : (
                          <Circle className="h-3 w-3 shrink-0 text-muted-foreground/50" />
                        )}
                        <span className="truncate text-xs text-foreground/80">
                          {ms.name}
                        </span>
                      </div>

                      {/* Timeline bar */}
                      <div className="relative flex flex-1 items-center">
                        {/* Grid lines */}
                        {timelinePeriods.map((period, i) => (
                          <div
                            key={i}
                            className="absolute top-0 h-full border-r border-border/40"
                            style={{ left: `${period.left + period.width}%` }}
                          />
                        ))}
                        {/* Today marker */}
                        {todayOffset !== null && (
                          <div
                            className="absolute top-0 z-20 h-full w-px bg-destructive/40"
                            style={{ left: `${todayOffset}%` }}
                          />
                        )}
                        {/* Milestone bar track */}
                        <div
                          className={`absolute h-4 rounded-sm ${phase.colorLight}`}
                          style={barStyle(ms.start, ms.end)}
                        />
                        {/* Milestone bar fill */}
                        <div
                          className={`absolute h-4 rounded-sm ${phase.color} opacity-70`}
                          style={{
                            ...barStyle(ms.start, ms.end),
                            width: `${parseFloat(barStyle(ms.start, ms.end).width) * (ms.progress / 100)}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
        </div>{/* min-w-[700px] */}
        </div>{/* overflow-x-auto */}
      </Card>
    </section>
  )
}
