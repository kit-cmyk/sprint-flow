"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RichTextEditor } from "@/components/ui/rich-text-editor"
import {
  ExternalLink,
  Eye,
  Globe,
  FileText,
  MessageSquare,
  Lock,
  Send,
  Sparkles,
  Save,
  ChevronDown,
  ChevronUp,
  Clock,
  CheckCircle2,
  Pencil,
  CalendarClock,
  X,
  UserPlus,
  Shield,
  Mail,
  MoreHorizontal,
  Ban,
} from "lucide-react"
import Link from "next/link"
import type { PodData } from "@/lib/pod-data"

/* ── portal visibility settings ─────────────────────────────── */
const portalSettings = [
  {
    label: "Sprint Board Visibility",
    description: "Client can see the Kanban sprint board with task statuses",
    enabled: true,
    icon: Eye,
  },
  {
    label: "Roadmap Access",
    description: "Client can view the project roadmap and phase progress",
    enabled: true,
    icon: Globe,
  },
  {
    label: "Sprint Reports",
    description: "Auto-generated sprint summary reports visible to client",
    enabled: true,
    icon: FileText,
  },
  {
    label: "In-App Messaging",
    description: "Allow client to send messages through the portal",
    enabled: false,
    icon: MessageSquare,
  },
]

/* ── past weekly summaries seed data ────────────────────────── */
interface WeeklySummary {
  id: string
  week: string
  sprint: string
  body: string
  status: "published" | "draft"
  author: string
  date: string
}

const pastSummaries: WeeklySummary[] = [
  {
    id: "ws-3",
    week: "Week of Feb 10",
    sprint: "Sprint 14",
    body: "This sprint focused on enhancing the client onboarding workflow and improving API response performance. Three new features were successfully deployed, including automated validation checks and performance optimizations that reduced load time by 22%.\n\nThe team also advanced the analytics module, bringing it to 70% completion. All committed items were delivered on schedule with zero production incidents.",
    status: "published",
    author: "Sarah Chen",
    date: "Feb 14, 2025",
  },
  {
    id: "ws-2",
    week: "Week of Feb 3",
    sprint: "Sprint 13",
    body: "Sprint 13 delivered the core authentication re-architecture and SSO integration. The team completed migration of 12k user accounts with zero downtime. Dashboard load times improved by 35% following query optimisation work. One carryover item (bulk export) moved to Sprint 14.",
    status: "published",
    author: "Sarah Chen",
    date: "Feb 7, 2025",
  },
  {
    id: "ws-1",
    week: "Week of Jan 27",
    sprint: "Sprint 12",
    body: "Completed the data pipeline overhaul and new reporting engine. Two critical bugs in the notification service were resolved. The team onboarded a new developer who is now ramping on the analytics module.",
    status: "published",
    author: "Sarah Chen",
    date: "Jan 31, 2025",
  },
]

/* ── recent activity ────────────────────────────────────────── */
const recentActivity = [
  { action: "Viewed Sprint Board", user: "Marcus Rivera", time: "2 hours ago" },
  { action: "Downloaded Sprint 13 Report", user: "Marcus Rivera", time: "1 day ago" },
  { action: "Logged in", user: "Marcus Rivera", time: "1 day ago" },
  { action: "Commented on Roadmap", user: "Marcus Rivera", time: "3 days ago" },
  { action: "Logged in", user: "Marcus Rivera", time: "3 days ago" },
]

/* ── client portal users ───────────────────────────────────── */
type PortalRole = "owner" | "collaborator" | "viewer"
type InviteStatus = "active" | "invited" | "expired"

interface ClientUser {
  name: string
  email: string
  portalRole: PortalRole
  status: InviteStatus
  avatar: string
  lastLogin?: string
}

const clientUsers: ClientUser[] = [
  { name: "Marcus Rivera", email: "marcus@clienta.com", portalRole: "owner", status: "active", avatar: "MR", lastLogin: "2 hours ago" },
  { name: "Lisa Thompson", email: "lisa.t@clienta.com", portalRole: "collaborator", status: "active", avatar: "LT", lastLogin: "1 day ago" },
  { name: "David Park", email: "david.park@clienta.com", portalRole: "viewer", status: "active", avatar: "DP", lastLogin: "3 days ago" },
  { name: "Rachel Adams", email: "rachel@clienta.com", portalRole: "viewer", status: "invited", avatar: "RA" },
  { name: "James Cooper", email: "j.cooper@clienta.com", portalRole: "viewer", status: "expired", avatar: "JC" },
]

const portalRoleConfig: Record<PortalRole, { label: string; color: string; icon: typeof Shield }> = {
  owner: { label: "Owner", color: "bg-primary/15 text-primary", icon: Shield },
  collaborator: { label: "Collaborator", color: "bg-blue-500/15 text-blue-400", icon: Pencil },
  viewer: { label: "Viewer", color: "bg-muted text-muted-foreground", icon: Eye },
}

const inviteStatusConfig: Record<InviteStatus, { label: string; color: string; icon: typeof CheckCircle2 }> = {
  active: { label: "Active", color: "text-emerald-400", icon: CheckCircle2 },
  invited: { label: "Pending", color: "text-amber-400", icon: Clock },
  expired: { label: "Expired", color: "text-red-400", icon: Ban },
}

/* ── main component ─────────────────────────────────────────── */
export function PodClientPortal({ pod }: { pod: PodData }) {
  const [draft, setDraft] = useState("")
  const [summaryStatus, setSummaryStatus] = useState<"idle" | "draft" | "enhancing" | "published" | "scheduled">("idle")
  const [enhancing, setEnhancing] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [expandedHistory, setExpandedHistory] = useState<string | null>(null)
  const [showScheduler, setShowScheduler] = useState(false)
  const [scheduledDate, setScheduledDate] = useState("")
  const [showInvite, setShowInvite] = useState(false)
  const [inviteEmail, setInviteEmail] = useState("")
  const [inviteRole, setInviteRole] = useState<PortalRole>("viewer")

  function handleSaveDraft() {
    if (!draft.trim()) return
    setSummaryStatus("draft")
  }

  function handlePublish() {
    if (!draft.trim()) return
    setSummaryStatus("published")
    setShowScheduler(false)
    setScheduledDate("")
  }

  function handleSchedule() {
    if (!draft.trim() || !scheduledDate) return
    setSummaryStatus("scheduled")
    setShowScheduler(false)
  }

  function handleAIEnhance() {
    if (!draft.trim()) return
    setEnhancing(true)
    // Simulate AI enhancement
    setTimeout(() => {
      setDraft((prev) => {
        const enhanced = prev.trim()
        return `${enhanced}\n\nKey highlights this week include improved system reliability, on-track delivery against sprint goals, and proactive risk mitigation on identified blockers. The team continues to demonstrate strong velocity and collaboration.`
      })
      setEnhancing(false)
      setSummaryStatus("draft")
    }, 1500)
  }

  return (
    <section>
      {/* Header */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-semibold text-foreground">Client Portal Settings</h2>
          <p className="text-xs text-muted-foreground">Configure client-facing portal for {pod.client}</p>
        </div>
        <div className="flex gap-2">
          <Link href="/client-dashboard">
            <Button variant="outline" size="sm" className="h-9 gap-2 border-border bg-secondary text-secondary-foreground hover:bg-muted">
              <ExternalLink className="h-3.5 w-3.5" />
              Preview Portal
            </Button>
          </Link>
          <Button size="sm" className="h-9 gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
            <Send className="h-3.5 w-3.5" />
            Send Invite
          </Button>
        </div>
      </div>

      {/* ── Pulse Weekly Summary Authoring ──────────────────── */}
      <Card className="mb-6 border-border bg-card">
        <CardContent className="p-0">
          <div className="border-b border-border px-5 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <FileText className="h-4 w-4 text-primary" />
                  Pulse Weekly Summary
                </h3>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Write a summary for the client portal. Published summaries update the client&apos;s Pulse Weekly Summary.
                </p>
              </div>
              {summaryStatus === "draft" && (
                <span className="flex items-center gap-1.5 rounded-full bg-amber-500/10 px-2.5 py-1 text-[11px] font-semibold text-amber-500">
                  <Clock className="h-3 w-3" />
                  Draft saved
                </span>
              )}
              {summaryStatus === "published" && (
                <span className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-500">
                  <CheckCircle2 className="h-3 w-3" />
                  Published
                </span>
              )}
              {summaryStatus === "scheduled" && (
                <span className="flex items-center gap-1.5 rounded-full bg-blue-500/10 px-2.5 py-1 text-[11px] font-semibold text-blue-400">
                  <CalendarClock className="h-3 w-3" />
                  Scheduled &middot; {new Date(scheduledDate).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}
                </span>
              )}
            </div>
          </div>

          <div className="p-5">
            {/* Sprint context */}
            <div className="mb-3 flex items-center gap-3 text-xs text-muted-foreground">
              <span className="rounded bg-muted px-2 py-0.5 font-medium text-foreground">Sprint {pod.currentSprint}</span>
              <span>Week of Feb 17, 2025</span>
            </div>

            {/* Rich text editor area */}
            <div className="relative">
              <RichTextEditor
                value={draft}
                onChange={(value) => {
                  setDraft(value)
                  if (summaryStatus === "published") setSummaryStatus("draft")
                }}
                placeholder="Write your weekly sprint summary for the client here... Describe progress, key deliverables, any risks, and next steps."
                disabled={enhancing}
              />
              {enhancing && (
                <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-background/80 backdrop-blur-sm">
                  <div className="flex items-center gap-2 text-sm text-primary">
                    <Sparkles className="h-4 w-4 animate-pulse" />
                    Enhancing with AI...
                  </div>
                </div>
              )}
            </div>

            {/* Action buttons */}
            <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <Button
                variant="outline"
                size="sm"
                className="h-8 gap-2 border-border text-foreground hover:bg-muted"
                onClick={handleAIEnhance}
                disabled={!draft.trim() || enhancing}
              >
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                AI Enhance
              </Button>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 gap-2 border-border text-foreground hover:bg-muted"
                  onClick={handleSaveDraft}
                  disabled={!draft.trim()}
                >
                  <Save className="h-3.5 w-3.5" />
                  Save Draft
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 gap-2 border-border text-foreground hover:bg-muted"
                  onClick={() => setShowScheduler(!showScheduler)}
                  disabled={!draft.trim()}
                >
                  <CalendarClock className="h-3.5 w-3.5" />
                  Schedule
                </Button>
                <Button
                  size="sm"
                  className="h-8 gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
                  onClick={handlePublish}
                  disabled={!draft.trim()}
                >
                  <Send className="h-3.5 w-3.5" />
                  Publish to Portal
                </Button>
              </div>
            </div>
            {/* Schedule picker panel */}
            {showScheduler && (
              <div className="mt-3 flex flex-col gap-3 rounded-lg border border-border bg-muted/30 p-4 sm:flex-row sm:items-end sm:gap-4">
                <div className="flex-1">
                  <label htmlFor="schedule-date" className="mb-1.5 block text-xs font-medium text-foreground">
                    Schedule publish date &amp; time
                  </label>
                  <input
                    id="schedule-date"
                    type="datetime-local"
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    min={new Date().toISOString().slice(0, 16)}
                    className="h-9 w-full rounded-md border border-border bg-background px-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:w-auto sm:min-w-[240px]"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    className="h-9 gap-2 bg-blue-600 text-white hover:bg-blue-700"
                    onClick={handleSchedule}
                    disabled={!scheduledDate}
                  >
                    <CalendarClock className="h-3.5 w-3.5" />
                    Confirm Schedule
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-9 w-9 p-0 text-muted-foreground hover:text-foreground"
                    onClick={() => {
                      setShowScheduler(false)
                      setScheduledDate("")
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Past summaries history */}
          <div className="border-t border-border">
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="flex w-full items-center justify-between px-5 py-3 text-left transition-colors hover:bg-muted/50"
            >
              <span className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                <Clock className="h-3.5 w-3.5" />
                Past Summaries ({pastSummaries.length})
              </span>
              {showHistory ? (
                <ChevronUp className="h-3.5 w-3.5 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
              )}
            </button>

            {showHistory && (
              <div className="divide-y divide-border border-t border-border">
                {pastSummaries.map((summary) => (
                  <div key={summary.id} className="px-5 py-3">
                    <button
                      onClick={() => setExpandedHistory(expandedHistory === summary.id ? null : summary.id)}
                      className="flex w-full items-center justify-between text-left"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          {summary.status === "published" ? (
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                          ) : (
                            <Pencil className="h-3.5 w-3.5 text-amber-500" />
                          )}
                          <span className="text-sm font-medium text-foreground">{summary.week}</span>
                        </div>
                        <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                          {summary.sprint}
                        </span>
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                            summary.status === "published"
                              ? "bg-emerald-500/10 text-emerald-500"
                              : "bg-amber-500/10 text-amber-500"
                          }`}
                        >
                          {summary.status === "published" ? "Published" : "Draft"}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-[11px] text-muted-foreground">{summary.date}</span>
                        {expandedHistory === summary.id ? (
                          <ChevronUp className="h-3.5 w-3.5 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                        )}
                      </div>
                    </button>

                    {expandedHistory === summary.id && (
                      <div className="mt-3 rounded-lg border border-border bg-muted/30 p-4">
                        <p className="whitespace-pre-line text-sm leading-relaxed text-foreground/80">
                          {summary.body}
                        </p>
                        <div className="mt-3 flex items-center justify-between text-[11px] text-muted-foreground">
                          <span>By {summary.author}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 gap-1.5 px-2 text-[11px] text-muted-foreground hover:text-foreground"
                            onClick={(e) => {
                              e.stopPropagation()
                              setDraft(summary.body)
                              setSummaryStatus("draft")
                            }}
                          >
                            <Pencil className="h-3 w-3" />
                            Use as template
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* ── Settings + Activity grid ────────────────────────── */}
      <div className="grid gap-6 lg:grid-cols-5">
        {/* Portal Visibility Settings */}
        <div className="lg:col-span-3">
          <Card className="border-border bg-card">
            <CardContent className="p-0">
              <div className="border-b border-border px-4 py-3">
                <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <Lock className="h-3.5 w-3.5 text-muted-foreground" />
                  Portal Visibility
                </h3>
                <p className="text-xs text-muted-foreground">Control what the client can see</p>
              </div>
              <div className="divide-y divide-border">
                {portalSettings.map((setting) => {
                  const Icon = setting.icon
                  return (
                    <div key={setting.label} className="flex items-center justify-between px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted">
                          <Icon className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">{setting.label}</p>
                          <p className="text-xs text-muted-foreground">{setting.description}</p>
                        </div>
                      </div>
                      <button
                        className={`relative h-6 w-11 rounded-full transition-colors ${
                          setting.enabled ? "bg-primary" : "bg-muted"
                        }`}
                        aria-label={`Toggle ${setting.label}`}
                      >
                        <span
                          className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                            setting.enabled ? "translate-x-5" : "translate-x-0"
                          }`}
                        />
                      </button>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Client Activity */}
        <div className="lg:col-span-2">
          <Card className="border-border bg-card">
            <CardContent className="p-0">
              <div className="border-b border-border px-4 py-3">
                <h3 className="text-sm font-semibold text-foreground">Recent Client Activity</h3>
              </div>
              <div className="divide-y divide-border">
                {recentActivity.map((activity, i) => (
                  <div key={i} className="px-4 py-3">
                    <p className="text-sm text-foreground">{activity.action}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {activity.user} &middot; {activity.time}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* ── Client Portal Users ────────────────────────────── */}
      <Card className="mt-6 border-border bg-card">
        <CardContent className="p-0">
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <div>
              <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <UserPlus className="h-4 w-4 text-muted-foreground" />
                Portal Users
              </h3>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Manage who can access the client portal
              </p>
            </div>
            <Button
              size="sm"
              className="h-8 gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={() => setShowInvite(!showInvite)}
            >
              <UserPlus className="h-3.5 w-3.5" />
              Invite
            </Button>
          </div>

          {/* Inline invite form */}
          {showInvite && (
            <div className="border-b border-border bg-primary/5 px-5 py-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                <div className="flex-1">
                  <label className="mb-1 block text-xs font-medium text-muted-foreground">
                    Email address
                  </label>
                  <input
                    type="email"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="name@clientcompany.com"
                    className="h-9 w-full rounded-md border border-border bg-card px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div className="sm:w-40">
                  <label className="mb-1 block text-xs font-medium text-muted-foreground">
                    Role
                  </label>
                  <select
                    value={inviteRole}
                    onChange={(e) => setInviteRole(e.target.value as PortalRole)}
                    className="h-9 w-full rounded-md border border-border bg-card px-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option value="viewer">Viewer</option>
                    <option value="collaborator">Collaborator</option>
                    <option value="owner">Owner</option>
                  </select>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" className="h-9 gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
                    <Send className="h-3.5 w-3.5" />
                    Send
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-9 w-9 p-0 text-muted-foreground hover:text-foreground"
                    onClick={() => { setShowInvite(false); setInviteEmail(""); }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* User table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-xs text-muted-foreground">
                  <th className="px-5 py-3 text-left font-medium">User</th>
                  <th className="px-4 py-3 text-left font-medium">Role</th>
                  <th className="px-4 py-3 text-left font-medium">Status</th>
                  <th className="hidden px-4 py-3 text-left font-medium md:table-cell">Last Login</th>
                  <th className="px-4 py-3 text-right font-medium"><span className="sr-only">Actions</span></th>
                </tr>
              </thead>
              <tbody>
                {clientUsers.map((user) => {
                  const role = portalRoleConfig[user.portalRole]
                  const status = inviteStatusConfig[user.status]
                  const RoleIcon = role.icon
                  const StatusIcon = status.icon
                  return (
                    <tr key={user.email} className="border-b border-border last:border-0">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/15 text-xs font-bold text-primary">
                            {user.avatar}
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-foreground">{user.name}</p>
                            <p className="flex items-center gap-1 truncate text-xs text-muted-foreground">
                              <Mail className="h-3 w-3 shrink-0" />
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${role.color}`}>
                          <RoleIcon className="h-3 w-3" />
                          {role.label}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 text-xs ${status.color}`}>
                          <StatusIcon className="h-3 w-3" />
                          {status.label}
                        </span>
                      </td>
                      <td className="hidden px-4 py-3 text-xs text-muted-foreground md:table-cell">
                        {user.lastLogin ?? "--"}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Actions for {user.name}</span>
                        </Button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </section>
  )
}
