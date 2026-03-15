"use client"

import { useState } from "react"
import { Bell, X, CheckCheck, AlertTriangle, TrendingDown, Zap, Users, CreditCard, MessageSquare, GitPullRequest } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

export type NotificationKind =
  | "pod-at-risk"
  | "health-dropped"
  | "sprint-completed"
  | "blocker-added"
  | "pulse-published"
  | "user-invited"
  | "billing"
  | "support-reply"
  | "pr-merged"

interface Notification {
  id: string
  kind: NotificationKind
  title: string
  body: string
  timestamp: string
  read: boolean
  href?: string
}

const kindMeta: Record<
  NotificationKind,
  { icon: React.ElementType; color: string; bg: string }
> = {
  "pod-at-risk":      { icon: AlertTriangle,   color: "text-red-400",     bg: "bg-red-500/10" },
  "health-dropped":   { icon: TrendingDown,    color: "text-orange-400",  bg: "bg-orange-500/10" },
  "sprint-completed": { icon: Zap,             color: "text-emerald-400", bg: "bg-emerald-500/10" },
  "blocker-added":    { icon: AlertTriangle,   color: "text-amber-400",   bg: "bg-amber-500/10" },
  "pulse-published":  { icon: GitPullRequest,  color: "text-primary",     bg: "bg-primary/10" },
  "user-invited":     { icon: Users,           color: "text-primary",     bg: "bg-primary/10" },
  "billing":          { icon: CreditCard,      color: "text-violet-400",  bg: "bg-violet-500/10" },
  "support-reply":    { icon: MessageSquare,   color: "text-primary",     bg: "bg-primary/10" },
  "pr-merged":        { icon: GitPullRequest,  color: "text-emerald-400", bg: "bg-emerald-500/10" },
}

const orgAdminNotifications: Notification[] = [
  { id: "n1",  kind: "pod-at-risk",      title: "Pod At Risk",                 body: "Velocity Pod health dropped to 48. Immediate attention required.",                         timestamp: "2 min ago",   read: false },
  { id: "n2",  kind: "support-reply",    title: "Support Reply",               body: "The team responded to your ticket TKT-001 (Jira integration).",                           timestamp: "18 min ago",  read: false },
  { id: "n3",  kind: "health-dropped",   title: "Health Score Dropped",        body: "Apex Pod fell below 70. Current score: 64.",                                              timestamp: "1 hr ago",    read: false },
  { id: "n4",  kind: "blocker-added",    title: "Blocker Added",               body: "A new blocker was flagged on Momentum Pod — Sprint MOM-Q2.",                              timestamp: "2 hrs ago",   read: false },
  { id: "n5",  kind: "sprint-completed", title: "Sprint Completed",            body: "Momentum Pod completed Sprint MOM-Q1 with 94% velocity.",                                 timestamp: "5 hrs ago",   read: true  },
  { id: "n6",  kind: "user-invited",     title: "User Invited",                body: "david@acme.com was successfully invited to your organization.",                           timestamp: "1 day ago",   read: true  },
  { id: "n7",  kind: "billing",          title: "Invoice Ready",               body: "Your March invoice for $4,800 is available for download.",                                timestamp: "2 days ago",  read: true  },
  { id: "n8",  kind: "pulse-published",  title: "Pulse Check Published",       body: "Weekly pulse check for Velocity Pod has been published.",                                 timestamp: "3 days ago",  read: true  },
  { id: "n9",  kind: "pr-merged",        title: "PR Merged",                   body: "Sarah Chen merged PR #142 into main on Apex Pod.",                                        timestamp: "4 days ago",  read: true  },
]

const superAdminNotifications: Notification[] = [
  { id: "sn1", kind: "pod-at-risk",      title: "Pod At Risk — Nexus Labs",    body: "Forge Pod health dropped to 0. Data migration may be required.",                         timestamp: "5 min ago",   read: false },
  { id: "sn2", kind: "support-reply",    title: "New Ticket — Pinecrest",      body: "TKT-009: Unable to access account after suspension. Critical priority.",                 timestamp: "20 min ago",  read: false },
  { id: "sn3", kind: "billing",          title: "Payment Failed — Orbital",    body: "Orbital Systems' trial renewal payment failed. Account at risk.",                        timestamp: "45 min ago",  read: false },
  { id: "sn4", kind: "user-invited",     title: "New Org Registered",          body: "A new organization 'Horizon Tech' completed signup.",                                    timestamp: "2 hrs ago",   read: false },
  { id: "sn5", kind: "health-dropped",   title: "Health Alert — Acme Corp",    body: "3 pods in Acme Corp have health scores below 60.",                                       timestamp: "3 hrs ago",   read: true  },
  { id: "sn6", kind: "support-reply",    title: "Ticket Escalated — Nexus",    body: "TKT-007 (pod health score stuck at 0) was escalated to high priority.",                  timestamp: "5 hrs ago",   read: true  },
  { id: "sn7", kind: "billing",          title: "Subscription Upgraded",       body: "Nexus Labs upgraded from Business to Enterprise plan.",                                  timestamp: "1 day ago",   read: true  },
  { id: "sn8", kind: "sprint-completed", title: "Sprint Wave Complete",        body: "14 pods across all orgs completed their sprint this week.",                              timestamp: "2 days ago",  read: true  },
]

interface NotificationSheetProps {
  variant?: "org-admin" | "super-admin"
}

export function NotificationSheet({ variant = "org-admin" }: NotificationSheetProps) {
  const initialData = variant === "super-admin" ? superAdminNotifications : orgAdminNotifications
  const [open, setOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>(initialData)
  const [filter, setFilter] = useState<"all" | "unread">("all")

  const unreadCount = notifications.filter((n) => !n.read).length

  const visible = filter === "unread"
    ? notifications.filter((n) => !n.read)
    : notifications

  const markAllRead = () =>
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))

  const markRead = (id: string) =>
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    )

  const dismiss = (id: string) =>
    setNotifications((prev) => prev.filter((n) => n.id !== id))

  return (
    <>
      {/* Bell trigger */}
      <button
        onClick={() => setOpen(true)}
        className="relative flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        aria-label="Open notifications"
      >
        <Bell className="h-4 w-4" />
        {unreadCount > 0 && (
          <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="right"
          className="flex w-full flex-col gap-0 border-border bg-card p-0 sm:max-w-sm"
        >
          {/* Header */}
          <SheetHeader className="flex flex-row items-center justify-between gap-2 border-b border-border px-4 py-3.5">
            <div className="flex items-center gap-2">
              <SheetTitle className="text-sm font-semibold text-foreground">
                Notifications
              </SheetTitle>
              {unreadCount > 0 && (
                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary">
                  {unreadCount} new
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="flex items-center gap-1 text-[11px] text-muted-foreground transition-colors hover:text-foreground"
              >
                <CheckCheck className="h-3.5 w-3.5" />
                Mark all read
              </button>
            )}
          </SheetHeader>

          {/* Filter pills */}
          <div className="flex gap-1.5 border-b border-border px-4 py-2.5">
            {(["all", "unread"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  "rounded-full px-3 py-1 text-[11px] font-medium capitalize transition-colors",
                  filter === f
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:text-foreground"
                )}
              >
                {f}
                {f === "unread" && unreadCount > 0 && (
                  <span className="ml-1.5 opacity-80">{unreadCount}</span>
                )}
              </button>
            ))}
          </div>

          {/* Notification list */}
          <div className="flex-1 overflow-y-auto">
            {visible.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                  <Bell className="h-5 w-5 text-muted-foreground" />
                </div>
                <p className="text-sm font-medium text-foreground">All caught up</p>
                <p className="text-xs text-muted-foreground">
                  {filter === "unread" ? "No unread notifications." : "No notifications yet."}
                </p>
              </div>
            ) : (
              <ul className="divide-y divide-border/50">
                {visible.map((n) => {
                  const meta = kindMeta[n.kind]
                  const Icon = meta.icon
                  return (
                    <li
                      key={n.id}
                      onClick={() => markRead(n.id)}
                      className={cn(
                        "group relative flex cursor-pointer gap-3 px-4 py-3.5 transition-colors hover:bg-muted/40",
                        !n.read && "bg-primary/[0.03]"
                      )}
                    >
                      {/* Unread dot */}
                      {!n.read && (
                        <span className="absolute left-1.5 top-4 h-1.5 w-1.5 rounded-full bg-primary" />
                      )}

                      {/* Icon */}
                      <div className={cn("mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full", meta.bg)}>
                        <Icon className={cn("h-3.5 w-3.5", meta.color)} />
                      </div>

                      {/* Content */}
                      <div className="min-w-0 flex-1">
                        <p className={cn("text-xs leading-snug", n.read ? "font-medium text-foreground" : "font-semibold text-foreground")}>
                          {n.title}
                        </p>
                        <p className="mt-0.5 text-[11px] leading-relaxed text-muted-foreground line-clamp-2">
                          {n.body}
                        </p>
                        <p className="mt-1 text-[10px] text-muted-foreground/60">{n.timestamp}</p>
                      </div>

                      {/* Dismiss */}
                      <button
                        onClick={(e) => { e.stopPropagation(); dismiss(n.id) }}
                        className="mt-0.5 shrink-0 rounded p-0.5 text-muted-foreground opacity-0 transition-opacity hover:text-foreground group-hover:opacity-100"
                        aria-label="Dismiss notification"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="border-t border-border px-4 py-3">
              <Button
                variant="ghost"
                size="sm"
                className="w-full text-xs text-muted-foreground hover:text-foreground"
                onClick={() => setNotifications([])}
              >
                Clear all notifications
              </Button>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </>
  )
}
