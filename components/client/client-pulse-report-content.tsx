"use client"

import Link from "next/link"
import { Calendar, ChevronLeft, FileText, LayoutGrid } from "lucide-react"
import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Circle, ArrowRight, CheckCircle2 } from "lucide-react"

/* ── past report data ──────────────────────────────────── */
interface PastTask {
  id: string
  title: string
  assignee: string
}

interface PastSprintBoard {
  todo: PastTask[]
  inProgress: PastTask[]
  done: PastTask[]
}

interface PastReport {
  id: string
  sprint: string
  week: string
  date: string
  summary: string
  board: PastSprintBoard
}

const pastReports: PastReport[] = [
  {
    id: "pr-3",
    sprint: "Sprint 14",
    week: "Week of Feb 10",
    date: "Feb 14, 2025",
    summary:
      "Kicked off Sprint 14 with focus on the onboarding overhaul. Completed initial API refactoring and began performance benchmarking. The validation checks feature passed internal QA and is staged for deployment. Analytics module work continued with 60% of the new dashboard widgets in place.",
    board: {
      todo: [
        { id: "MOM-111", title: "API rate limiting setup", assignee: "Alex Kim" },
        { id: "MOM-112", title: "Onboarding wizard v2", assignee: "Jake Lee" },
        { id: "MOM-113", title: "Webhook retry logic", assignee: "Sarah Chen" },
        { id: "MOM-108", title: "Search indexing optimization", assignee: "Alex Kim" },
      ],
      inProgress: [
        { id: "MOM-109", title: "Webhook integration layer", assignee: "Sarah Chen" },
        { id: "MOM-110", title: "Billing page UI refresh", assignee: "Jake Lee" },
      ],
      done: [
        { id: "MOM-101", title: "User auth flow redesign", assignee: "Sarah Chen" },
        { id: "MOM-102", title: "Dashboard analytics API", assignee: "Alex Kim" },
        { id: "MOM-103", title: "Notification service setup", assignee: "Sarah Chen" },
        { id: "MOM-104", title: "Profile settings page", assignee: "Jake Lee" },
        { id: "MOM-105", title: "Data export CSV feature", assignee: "Alex Kim" },
      ],
    },
  },
  {
    id: "pr-2",
    sprint: "Sprint 13",
    week: "Week of Feb 3",
    date: "Feb 7, 2025",
    summary:
      "Sprint 13 delivered the core authentication re-architecture and SSO integration. The team completed migration of 12k user accounts with zero downtime. Dashboard load times improved by 35% following query optimisation work. One carryover item (bulk export) moved to Sprint 14.",
    board: {
      todo: [
        { id: "MOM-095", title: "SSO callback handler", assignee: "Alex Kim" },
        { id: "MOM-096", title: "Session persistence layer", assignee: "Jake Lee" },
      ],
      inProgress: [
        { id: "MOM-093", title: "Bulk export CSV", assignee: "Sarah Chen" },
      ],
      done: [
        { id: "MOM-088", title: "Auth re-architecture", assignee: "Alex Kim" },
        { id: "MOM-089", title: "SSO integration", assignee: "Sarah Chen" },
        { id: "MOM-090", title: "User migration script", assignee: "Jake Lee" },
        { id: "MOM-091", title: "Query optimization pass", assignee: "Alex Kim" },
        { id: "MOM-092", title: "Dashboard load perf", assignee: "Sarah Chen" },
        { id: "MOM-094", title: "Token refresh flow", assignee: "Jake Lee" },
      ],
    },
  },
  {
    id: "pr-1",
    sprint: "Sprint 12",
    week: "Week of Jan 27",
    date: "Jan 31, 2025",
    summary:
      "Completed the data pipeline overhaul and new reporting engine. Two critical bugs in the notification service were resolved. The team onboarded a new developer who is now ramping on the analytics module.",
    board: {
      todo: [
        { id: "MOM-082", title: "Analytics module kickoff", assignee: "Jake Lee" },
      ],
      inProgress: [
        { id: "MOM-080", title: "Reporting engine v2", assignee: "Alex Kim" },
        { id: "MOM-081", title: "Notification bug fix", assignee: "Sarah Chen" },
      ],
      done: [
        { id: "MOM-075", title: "Data pipeline overhaul", assignee: "Alex Kim" },
        { id: "MOM-076", title: "ETL job scheduler", assignee: "Sarah Chen" },
        { id: "MOM-077", title: "Pipeline monitoring", assignee: "Jake Lee" },
        { id: "MOM-078", title: "Notification bug #1", assignee: "Sarah Chen" },
        { id: "MOM-079", title: "New dev onboarding docs", assignee: "Alex Kim" },
      ],
    },
  },
]

/* ── helpers ────────────────────────────────────────────── */
function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
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

/* ── mini task row ──────────────────────────────────────── */
function MiniTask({ task }: { task: PastTask }) {
  return (
    <div className="flex items-center gap-2.5 rounded-md border border-border bg-card px-3 py-2">
      <span className="font-mono text-[10px] font-medium text-muted-foreground">
        {task.id}
      </span>
      <span className="flex-1 truncate text-xs font-medium text-foreground">
        {task.title}
      </span>
      <div
        className={`flex h-4 w-4 items-center justify-center rounded-full text-[7px] font-bold ${getAvatarColor(task.assignee)}`}
      >
        {getInitials(task.assignee)}
      </div>
    </div>
  )
}

/* ── mini column ────────────────────────────────────────── */
function MiniColumn({
  title,
  count,
  icon,
  accentColor,
  headerBg,
  tasks,
}: {
  title: string
  count: number
  icon: React.ReactNode
  accentColor: string
  headerBg: string
  tasks: PastTask[]
}) {
  return (
    <div className="flex flex-col rounded-lg border border-border bg-muted/30">
      <div className={`flex items-center gap-2 rounded-t-lg border-b border-border px-3 py-2 ${headerBg}`}>
        {icon}
        <span className={`text-xs font-semibold ${accentColor}`}>{title}</span>
        <span className="flex h-4 min-w-[16px] items-center justify-center rounded-full bg-background/80 px-1 text-[10px] font-bold text-foreground">
          {count}
        </span>
      </div>
      <div className="flex flex-col gap-1.5 p-2">
        {tasks.map((t) => (
          <MiniTask key={t.id} task={t} />
        ))}
      </div>
    </div>
  )
}

export function ClientPulseReportContent({ reportId }: { reportId: string }) {
  const [activeTab, setActiveTab] = useState<"summary" | "board">("summary")
  
  const report = pastReports.find((r) => r.id === reportId)

  if (!report) {
    return (
      <main className="flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:px-10">
        <div className="mx-auto max-w-[1100px]">
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <h1 className="text-2xl font-bold text-foreground">Report Not Found</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              The pulse check report you're looking for doesn't exist.
            </p>
            <Link
              href="/client-dashboard"
              className="mt-4 flex items-center gap-2 text-sm text-primary hover:underline"
            >
              <ChevronLeft className="h-4 w-4" />
              Back to Dashboard
            </Link>
          </div>
        </div>
      </main>
    )
  }

  const totalTasks = report.board.todo.length + report.board.inProgress.length + report.board.done.length
  const donePct = Math.round((report.board.done.length / totalTasks) * 100)

  return (
    <main className="flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:px-10">
      <div className="mx-auto max-w-[1100px]">
        {/* Page header */}
        <div className="mb-6 flex items-start justify-between">
          <div>
            <Link
              href="/client-dashboard"
              className="mb-2 flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              Back to Sprint Boards
            </Link>
            <h1 className="text-2xl font-bold text-foreground">
              {report.week}
            </h1>
            <p className="mt-0.5 text-sm text-muted-foreground">
              {report.sprint} &middot; Published {report.date}
            </p>
          </div>

        </div>

        {/* Content card */}
        <Card className="border-border bg-card">
          {/* Tab switcher */}
          <div className="flex gap-0 border-b border-border px-5">
            <button
              onClick={() => setActiveTab("summary")}
              className={`flex items-center gap-1.5 border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === "summary"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <FileText className="h-4 w-4" />
              Weekly Summary
            </button>
            <button
              onClick={() => setActiveTab("board")}
              className={`flex items-center gap-1.5 border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === "board"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <LayoutGrid className="h-4 w-4" />
              Sprint Board
            </button>
          </div>

          {/* Summary tab */}
          {activeTab === "summary" && (
            <CardContent className="px-6 py-6">
              <div className="mb-4 flex items-center gap-2 text-xs text-muted-foreground">
                <Calendar className="h-3.5 w-3.5" />
                Published {report.date}
              </div>
              {report.summary.split("\n\n").map((paragraph, i) => (
                <p
                  key={i}
                  className={`mb-3 text-sm leading-relaxed ${
                    i === 0 ? "text-foreground" : "text-muted-foreground"
                  }`}
                >
                  {paragraph}
                </p>
              ))}
            </CardContent>
          )}

          {/* Board tab */}
          {activeTab === "board" && (
            <CardContent className="px-6 py-6">
              {/* Progress bar */}
              <div className="mb-6 rounded-lg border border-border bg-muted/30 p-4">
                <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
                  <span>Sprint Progress</span>
                  <span>{report.board.done.length} / {totalTasks} tasks completed</span>
                </div>
                <div className="flex h-3 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full bg-emerald-500"
                    style={{ width: `${donePct}%` }}
                  />
                  <div
                    className="h-full bg-blue-400"
                    style={{
                      width: `${Math.round((report.board.inProgress.length / totalTasks) * 100)}%`,
                    }}
                  />
                </div>
                <div className="mt-2 flex items-center gap-5 text-[11px] text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                    Done ({report.board.done.length})
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-blue-400" />
                    In Progress ({report.board.inProgress.length})
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-muted-foreground/40" />
                    To Do ({report.board.todo.length})
                  </span>
                </div>
              </div>

              {/* Mini kanban columns */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <MiniColumn
                  title="To Do"
                  count={report.board.todo.length}
                  accentColor="text-foreground"
                  headerBg="bg-muted/50"
                  icon={<Circle className="h-3.5 w-3.5 text-muted-foreground" />}
                  tasks={report.board.todo}
                />
                <MiniColumn
                  title="In Progress"
                  count={report.board.inProgress.length}
                  accentColor="text-primary"
                  headerBg="bg-primary/10"
                  icon={<ArrowRight className="h-3.5 w-3.5 text-primary" />}
                  tasks={report.board.inProgress}
                />
                <MiniColumn
                  title="Done"
                  count={report.board.done.length}
                  accentColor="text-emerald-600 dark:text-emerald-400"
                  headerBg="bg-emerald-500/10"
                  icon={<CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />}
                  tasks={report.board.done}
                />
              </div>
            </CardContent>
          )}
        </Card>

        {/* Footer */}
        <footer className="mt-12 border-t border-border pt-4">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Assembled Systems - Client Delivery Portal</span>
            <span>Last updated: {report.date}</span>
          </div>
        </footer>
      </div>
    </main>
  )
}
