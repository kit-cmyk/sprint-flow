"use client"

import { Circle, ArrowRight, CheckCircle2, Code2, TestTube2, MessageSquare, Calendar } from "lucide-react"
import { Card } from "@/components/ui/card"

type SubStatus = "development" | "code-review" | "qa"

interface KanbanTask {
  id: string
  title: string
  sp: number
  assignee: string
  subStatus?: SubStatus
}

const todoTasks: KanbanTask[] = [
  { id: "MOM-111", title: "API rate limiting setup", sp: 3, assignee: "Alex Kim" },
  { id: "MOM-112", title: "Onboarding wizard v2", sp: 3, assignee: "Jake Lee" },
  { id: "MOM-113", title: "Webhook retry logic", sp: 2, assignee: "Sarah Chen" },
]

const inProgressTasks: KanbanTask[] = [
  { id: "MOM-108", title: "Search indexing optimization", sp: 5, assignee: "Alex Kim", subStatus: "code-review" },
  { id: "MOM-109", title: "Webhook integration layer", sp: 3, assignee: "Sarah Chen", subStatus: "development" },
  { id: "MOM-110", title: "Billing page UI refresh", sp: 3, assignee: "Jake Lee", subStatus: "qa" },
]

const doneTasks: KanbanTask[] = [
  { id: "MOM-101", title: "User auth flow redesign", sp: 5, assignee: "Sarah Chen" },
  { id: "MOM-102", title: "Dashboard analytics API", sp: 3, assignee: "Alex Kim" },
  { id: "MOM-103", title: "Notification service setup", sp: 3, assignee: "Sarah Chen" },
  { id: "MOM-104", title: "Profile settings page", sp: 2, assignee: "Jake Lee" },
  { id: "MOM-105", title: "Data export CSV feature", sp: 3, assignee: "Alex Kim" },
  { id: "MOM-106", title: "Role-based access control", sp: 3, assignee: "Sarah Chen" },
  { id: "MOM-107", title: "Email template builder", sp: 2, assignee: "Jake Lee" },
]

const subStatusConfig: Record<SubStatus, { label: string; color: string; bg: string; icon: typeof Code2 }> = {
  development: {
    label: "Development",
    color: "text-blue-700",
    bg: "bg-blue-50 border-blue-200",
    icon: Code2,
  },
  "code-review": {
    label: "Code Review",
    color: "text-violet-700",
    bg: "bg-violet-50 border-violet-200",
    icon: MessageSquare,
  },
  qa: {
    label: "QA",
    color: "text-amber-700",
    bg: "bg-amber-50 border-amber-200",
    icon: TestTube2,
  },
}

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

function TaskCard({ task, showSubStatus }: { task: KanbanTask; showSubStatus?: boolean }) {
  const sub = task.subStatus ? subStatusConfig[task.subStatus] : null
  const SubIcon = sub?.icon

  return (
    <div className="rounded-lg border border-border bg-card p-3 shadow-sm transition-shadow hover:shadow-md">
      <div className="mb-2">
        <span className="font-mono text-[11px] font-medium text-muted-foreground">
          {task.id}
        </span>
      </div>
      <p className="mb-2.5 text-sm font-medium leading-snug text-foreground">
        {task.title}
      </p>
      {showSubStatus && sub && SubIcon && (
        <div
          className={`mb-2.5 inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium ${sub.bg} ${sub.color}`}
        >
          <SubIcon className="h-3 w-3" />
          {sub.label}
        </div>
      )}
      <div className="flex items-center gap-2">
        <div
          className={`flex h-5 w-5 items-center justify-center rounded-full text-[9px] font-bold ${getAvatarColor(task.assignee)}`}
        >
          {getInitials(task.assignee)}
        </div>
        <span className="text-xs text-muted-foreground">{task.assignee}</span>
      </div>
    </div>
  )
}

interface ColumnProps {
  title: string
  count: number
  icon: React.ReactNode
  accentColor: string
  headerBg: string
  children: React.ReactNode
}

function KanbanColumn({ title, count, icon, accentColor, headerBg, children }: ColumnProps) {
  return (
    <div className="flex min-w-0 flex-col rounded-xl border border-border bg-muted/30">
      <div className={`flex items-center rounded-t-xl border-b border-border px-4 py-3 ${headerBg}`}>
        <div className="flex items-center gap-2">
          {icon}
          <span className={`text-sm font-semibold ${accentColor}`}>{title}</span>
          <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-background/80 px-1.5 text-[11px] font-bold text-foreground">
            {count}
          </span>
        </div>
      </div>
      <div className="flex flex-col gap-2.5 p-3">{children}</div>
    </div>
  )
}

export function SprintKanban({ 
  boardName = "Sprint Board", 
  boardType = "Scrum" 
}: { 
  boardName?: string
  boardType?: string 
}) {
  const totalTasks = todoTasks.length + inProgressTasks.length + doneTasks.length
  const donePct = Math.round((doneTasks.length / totalTasks) * 100)
  const inProgressPct = Math.round((inProgressTasks.length / totalTasks) * 100)
  const todoPct = 100 - donePct - inProgressPct

  return (
    <section>
      <div className="mb-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-foreground">{boardName}</h2>
            <p className="text-xs text-muted-foreground">{boardType}</p>
          </div>
        </div>
        <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" />
            Feb 10 - Feb 21, 2025
          </span>
          <span className="text-border">|</span>
          <span>
            <span className="font-semibold text-foreground">{totalTasks}</span> tasks
          </span>
          <span className="text-border">|</span>
          <span>
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">{donePct}%</span> complete
          </span>
        </div>
      </div>

      <Card className="mb-5 border-border bg-card p-4 shadow-sm">
        <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
          <span>Sprint Progress</span>
          <span>{doneTasks.length} / {totalTasks} tasks completed</span>
        </div>
        <div className="flex h-3 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full bg-emerald-500 transition-all"
            style={{ width: `${donePct}%` }}
          />
          <div
            className="h-full bg-primary transition-all"
            style={{ width: `${inProgressPct}%` }}
          />
          <div
            className="h-full bg-muted-foreground/40 transition-all"
            style={{ width: `${todoPct}%` }}
          />
        </div>
        <div className="mt-2 flex items-center gap-5 text-[11px] text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
            Done ({doneTasks.length})
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-primary" />
            In Progress ({inProgressTasks.length})
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-muted-foreground/40" />
            To Do ({todoTasks.length})
          </span>
        </div>
      </Card>

      <div className="grid min-w-0 grid-cols-1 gap-4 md:grid-cols-3">
        <KanbanColumn
          title="To Do"
          count={todoTasks.length}
          accentColor="text-foreground"
          headerBg="bg-muted/50"
          icon={<Circle className="h-4 w-4 text-muted-foreground" />}
        >
          {todoTasks.map((t) => (
            <TaskCard key={t.id} task={t} />
          ))}
        </KanbanColumn>

        <KanbanColumn
          title="In Progress"
          count={inProgressTasks.length}
          accentColor="text-primary"
          headerBg="bg-primary/10"
          icon={<ArrowRight className="h-4 w-4 text-primary" />}
        >
          {inProgressTasks.map((t) => (
            <TaskCard key={t.id} task={t} showSubStatus />
          ))}
        </KanbanColumn>

        <KanbanColumn
          title="Done"
          count={doneTasks.length}
          accentColor="text-emerald-600 dark:text-emerald-400"
          headerBg="bg-emerald-500/10"
          icon={<CheckCircle2 className="h-4 w-4 text-emerald-500" />}
        >
          {doneTasks.map((t) => (
            <TaskCard key={t.id} task={t} />
          ))}
        </KanbanColumn>
      </div>
    </section>
  )
}
