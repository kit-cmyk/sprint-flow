"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RichTextEditor } from "@/components/ui/rich-text-editor"
import {
  ExternalLink,
  Eye,
  Globe,
  FileText,
  MessageSquare,
  Send,
  Sparkles,
  Save,
  ChevronDown,
  ChevronUp,
  Clock,
  CheckCircle2,
  Pencil,
  CalendarClock,
  UserPlus,
  Mail,
  MoreHorizontal,
  Ban,
  Users as UsersIcon,
  Settings,
  Plus,
} from "lucide-react"
import Link from "next/link"
import type { PodData } from "@/lib/pod-data"

/* ── Post types and data ──────────────────────────────────── */
type PostStatus = "draft" | "scheduled" | "published"

interface PulsePost {
  id: string
  week: string
  dateRange: string
  sprint: string
  status: PostStatus
  author: string
  date: string
  body: string
}

const pulsePosts: PulsePost[] = [
  {
    id: "post-5",
    week: "Week of Feb 24",
    dateRange: "Feb 24 - Feb 28",
    sprint: "Sprint 14",
    status: "draft",
    author: "Sarah Chen",
    date: "Feb 22, 2025",
    body: "Work in progress for this week...",
  },
  {
    id: "post-4",
    week: "Week of Feb 17",
    dateRange: "Feb 17 - Feb 21",
    sprint: "Sprint 14",
    status: "scheduled",
    author: "Sarah Chen",
    date: "Feb 19, 2025",
    body: "This sprint continued work on the analytics dashboard with significant progress on data visualization components. The team delivered 8 story points and maintained high velocity.",
  },
  {
    id: "post-3",
    week: "Week of Feb 10",
    dateRange: "Feb 10 - Feb 14",
    sprint: "Sprint 14",
    status: "published",
    author: "Sarah Chen",
    date: "Feb 14, 2025",
    body: "This sprint focused on enhancing the client onboarding workflow and improving API response performance. Three new features were successfully deployed, including automated validation checks and performance optimizations that reduced load time by 22%.\n\nThe team also advanced the analytics module, bringing it to 70% completion. All committed items were delivered on schedule with zero production incidents.",
  },
  {
    id: "post-2",
    week: "Week of Feb 3",
    dateRange: "Feb 3 - Feb 7",
    sprint: "Sprint 13",
    status: "published",
    author: "Sarah Chen",
    date: "Feb 7, 2025",
    body: "Sprint 13 delivered the core authentication re-architecture and SSO integration. The team completed migration of 12k user accounts with zero downtime. Dashboard load times improved by 35% following query optimisation work.",
  },
  {
    id: "post-1",
    week: "Week of Jan 27",
    dateRange: "Jan 27 - Jan 31",
    sprint: "Sprint 12",
    status: "published",
    author: "Sarah Chen",
    date: "Jan 31, 2025",
    body: "Completed the data pipeline overhaul and new reporting engine. Two critical bugs in the notification service were resolved. The team onboarded a new developer who is now ramping on the analytics module.",
  },
]

const statusConfig: Record<PostStatus, { label: string; icon: typeof Clock; color: string }> = {
  draft: { label: "Draft", icon: Pencil, color: "text-amber-500" },
  scheduled: { label: "Scheduled", icon: CalendarClock, color: "text-blue-400" },
  published: { label: "Published", icon: CheckCircle2, color: "text-emerald-500" },
}

/* ── Portal settings ──────────────────────────────────────── */
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

/* ── Client users ─────────────────────────────────────────── */
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

const portalRoleConfig: Record<PortalRole, { label: string; color: string; icon: string }> = {
  owner: { label: "Owner", color: "text-primary", icon: "●" },
  collaborator: { label: "Collaborator", color: "text-blue-400", icon: "✏" },
  viewer: { label: "Viewer", color: "text-muted-foreground", icon: "👁" },
}

const inviteStatusConfig: Record<InviteStatus, { label: string; color: string; icon: string }> = {
  active: { label: "Active", color: "text-emerald-500", icon: "●" },
  invited: { label: "Pending", color: "text-amber-500", icon: "◐" },
  expired: { label: "Expired", color: "text-red-500", icon: "◯" },
}

/* ── Client activity ──────────────────────────────────────── */
interface ClientActivity {
  action: string
  user: string
  timestamp: string
}

const recentActivity: ClientActivity[] = [
  { action: "Viewed Sprint Board", user: "Marcus Rivera", timestamp: "2 hours ago" },
  { action: "Downloaded Sprint 13 Report", user: "Marcus Rivera", timestamp: "1 day ago" },
  { action: "Logged in", user: "Marcus Rivera", timestamp: "1 day ago" },
  { action: "Commented on Roadmap", user: "Marcus Rivera", timestamp: "3 days ago" },
  { action: "Logged in", user: "Marcus Rivera", timestamp: "3 days ago" },
]

/* ── Available boards ─────────────────────────────────────── */
interface AvailableBoard {
  name: string
  type: string
  taskCount: number
  completion: number
  enabled: boolean
}

const availableBoards: AvailableBoard[] = [
  { name: "AVI Product Backlog", type: "Scrum", taskCount: 14, completion: 36, enabled: true },
  { name: "Design", type: "Kanban", taskCount: 8, completion: 62, enabled: false },
]

/* ── Main component ──────────���────────────────────────────── */
export function PodClientPortalV2({ pod }: { pod: PodData }) {
  const router = useRouter()
  const [expandedPostId, setExpandedPostId] = useState<string | null>(null)
  const [editingPostId, setEditingPostId] = useState<string | null>(null)
  const [editDraft, setEditDraft] = useState("")

  const togglePost = (postId: string) => {
    if (expandedPostId === postId) {
      setExpandedPostId(null)
      setEditingPostId(null)
    } else {
      setExpandedPostId(postId)
      const post = pulsePosts.find((p) => p.id === postId)
      if (post) {
        setEditDraft(post.body)
      }
    }
  }

  const startEditing = (postId: string) => {
    setEditingPostId(postId)
    const post = pulsePosts.find((p) => p.id === postId)
    if (post) {
      setEditDraft(post.body)
    }
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
          <Button
            size="sm"
            className="h-9 gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={() => router.push(`/pod/${pod.slug}/pulse/new`)}
          >
            <Plus className="h-3.5 w-3.5" />
            New Post
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="pulse-checks" className="w-full">
        <TabsList className="mb-6 h-9 bg-muted/50 p-0.5">
          <TabsTrigger value="pulse-checks" className="gap-1.5 text-xs">
            <FileText className="h-3.5 w-3.5" />
            Pulse Checks
          </TabsTrigger>
          <TabsTrigger value="users" className="gap-1.5 text-xs">
            <UsersIcon className="h-3.5 w-3.5" />
            Users
          </TabsTrigger>
          <TabsTrigger value="features" className="gap-1.5 text-xs">
            <Settings className="h-3.5 w-3.5" />
            Features
          </TabsTrigger>

        </TabsList>

        {/* Pulse Checks Tab */}
        <TabsContent value="pulse-checks" className="mt-0">
          <Card className="border-border bg-card">
            <CardContent className="p-0">
              {/* Header */}
              <div className="border-b border-border px-5 py-4">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-primary" />
                  <h3 className="text-sm font-semibold text-foreground">All Posts</h3>
                </div>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {pulsePosts.length} pulse check posts for {pod.client}
                </p>
              </div>

              {/* Table Header */}
              <div className="grid grid-cols-12 gap-4 border-b border-border bg-muted/30 px-5 py-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                <div className="col-span-3">Week</div>
                <div className="col-span-2">Sprint</div>
                <div className="col-span-2">Status</div>
                <div className="col-span-3">Author</div>
                <div className="col-span-2">Date</div>
              </div>

              {/* Post Rows */}
              <div className="divide-y divide-border">
                {pulsePosts.map((post) => {
                  const isExpanded = expandedPostId === post.id
                  const isEditing = editingPostId === post.id
                  const StatusIcon = statusConfig[post.status].icon

                  return (
                    <div key={post.id}>
                      {/* Row */}
                      <button
                        onClick={() => togglePost(post.id)}
                        className="grid w-full grid-cols-12 gap-4 px-5 py-4 text-left transition-colors hover:bg-muted/30"
                      >
                        <div className="col-span-3">
                          <div className="font-medium text-foreground">{post.week}</div>
                          <div className="text-xs text-muted-foreground">{post.dateRange}</div>
                        </div>
                        <div className="col-span-2 text-sm text-muted-foreground">{post.sprint}</div>
                        <div className="col-span-2">
                          <span className={`flex items-center gap-1.5 text-xs font-medium ${statusConfig[post.status].color}`}>
                            <StatusIcon className="h-3.5 w-3.5" />
                            {statusConfig[post.status].label}
                          </span>
                        </div>
                        <div className="col-span-3 text-sm text-muted-foreground">{post.author}</div>
                        <div className="col-span-2 flex items-center justify-between text-sm text-muted-foreground">
                          <span>{post.date}</span>
                          {isExpanded ? (
                            <ChevronUp className="h-4 w-4 text-primary" />
                          ) : (
                            <ChevronDown className="h-4 w-4 text-muted-foreground" />
                          )}
                        </div>
                      </button>

                      {/* Expanded Editor/Viewer */}
                      {isExpanded && (
                        <div className="border-t border-border bg-muted/20 px-5 py-5">
                          <div className="mb-3 flex items-center justify-between">
                            <div className="flex items-center gap-3 text-xs text-muted-foreground">
                              <span className="rounded bg-muted px-2 py-0.5 font-medium text-foreground">{post.sprint}</span>
                              <span>{post.dateRange}</span>
                            </div>
                            <div className="flex gap-2">
                              {!isEditing ? (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="h-8 gap-2"
                                  onClick={() => startEditing(post.id)}
                                >
                                  <Pencil className="h-3.5 w-3.5" />
                                  Edit
                                </Button>
                              ) : (
                                <>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-8 gap-2"
                                  >
                                    <Sparkles className="h-3.5 w-3.5" />
                                    AI Enhance
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-8 gap-2"
                                  >
                                    <Save className="h-3.5 w-3.5" />
                                    Save
                                  </Button>
                                  <Button
                                    size="sm"
                                    className="h-8 gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
                                  >
                                    <Send className="h-3.5 w-3.5" />
                                    {post.status === "published" ? "Update" : "Publish"}
                                  </Button>
                                </>
                              )}
                            </div>
                          </div>

                          {isEditing ? (
                            <RichTextEditor
                              value={editDraft}
                              onChange={setEditDraft}
                              placeholder="Write your weekly sprint summary..."
                            />
                          ) : (
                            <div className="rounded-lg border border-border bg-card p-4">
                              <div
                                className="prose prose-sm max-w-none text-sm leading-relaxed text-foreground"
                                dangerouslySetInnerHTML={{ __html: post.body.replace(/\n/g, "<br />") }}
                              />
                            </div>
                          )}

                          <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                            <span>By {post.author} on {post.date}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Users Tab */}
        <TabsContent value="users" className="mt-0">
          <Card className="border-border bg-card">
            <CardContent className="p-0">
              <div className="border-b border-border px-5 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <UsersIcon className="h-4 w-4 text-primary" />
                      <h3 className="text-sm font-semibold text-foreground">Portal Users</h3>
                    </div>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      Manage who can access the client portal
                    </p>
                  </div>
                  <Button size="sm" className="h-8 gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
                    <UserPlus className="h-3.5 w-3.5" />
                    Invite
                  </Button>
                </div>
              </div>

              {/* Table Header */}
              <div className="grid grid-cols-12 gap-4 border-b border-border bg-muted/30 px-5 py-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                <div className="col-span-4">User</div>
                <div className="col-span-3">Role</div>
                <div className="col-span-3">Status</div>
                <div className="col-span-2">Last Login</div>
              </div>

              {/* User Rows */}
              <div className="divide-y divide-border">
                {clientUsers.map((user) => (
                  <div key={user.email} className="grid grid-cols-12 gap-4 px-5 py-4 transition-colors hover:bg-muted/30">
                    <div className="col-span-4 flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/15 text-xs font-bold text-primary">
                        {user.avatar}
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-medium text-foreground">{user.name}</div>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Mail className="h-3 w-3" />
                          {user.email}
                        </div>
                      </div>
                    </div>
                    <div className="col-span-3 flex items-center">
                      <span className={`flex items-center gap-1.5 text-xs font-medium ${portalRoleConfig[user.portalRole].color}`}>
                        <span>{portalRoleConfig[user.portalRole].icon}</span>
                        {portalRoleConfig[user.portalRole].label}
                      </span>
                    </div>
                    <div className="col-span-3 flex items-center">
                      <span className={`flex items-center gap-1.5 text-xs font-medium ${inviteStatusConfig[user.status].color}`}>
                        <span>{inviteStatusConfig[user.status].icon}</span>
                        {inviteStatusConfig[user.status].label}
                      </span>
                    </div>
                    <div className="col-span-2 flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">{user.lastLogin || "--"}</span>
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                        <MoreHorizontal className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Features Tab */}
        <TabsContent value="features" className="mt-0">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Left Column - Portal Settings */}
            <div className="lg:col-span-2">
              <div className="flex flex-col gap-6">
                {/* Portal Visibility */}
                <Card className="border-border bg-card">
                  <CardContent className="p-0">
                    <div className="border-b border-border px-5 py-4">
                      <div className="flex items-center gap-2">
                        <Lock className="h-4 w-4 text-primary" />
                        <h3 className="text-sm font-semibold text-foreground">Portal Visibility</h3>
                      </div>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        Control what the client can see
                      </p>
                    </div>
                    <div className="divide-y divide-border">
                      {portalSettings.map((setting) => {
                        const Icon = setting.icon
                        return (
                          <div key={setting.label} className="flex items-center justify-between px-5 py-4">
                            <div className="flex items-center gap-3">
                              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                                <Icon className="h-4 w-4 text-muted-foreground" />
                              </div>
                              <div>
                                <div className="text-sm font-medium text-foreground">{setting.label}</div>
                                <div className="text-xs text-muted-foreground">{setting.description}</div>
                              </div>
                            </div>
                            <label className="relative inline-flex cursor-pointer items-center">
                              <input
                                type="checkbox"
                                className="peer sr-only"
                                defaultChecked={setting.enabled}
                              />
                              <div className="peer h-5 w-9 rounded-full bg-muted after:absolute after:left-[2px] after:top-[2px] after:h-4 after:w-4 after:rounded-full after:bg-background after:transition-all after:content-[''] peer-checked:bg-primary peer-checked:after:translate-x-4 peer-focus:ring-2 peer-focus:ring-primary/20"></div>
                            </label>
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>

                {/* Available Boards */}
                <Card className="border-border bg-card">
                  <CardContent className="p-0">
                    <div className="border-b border-border px-5 py-4">
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-primary" />
                        <h3 className="text-sm font-semibold text-foreground">Available Boards</h3>
                      </div>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        Toggle which boards are visible to clients in the Pulse Check view.
                      </p>
                    </div>
                    <div className="divide-y divide-border">
                      {availableBoards.map((board) => (
                        <div key={board.name} className="flex items-center justify-between px-5 py-4">
                          <div className="flex items-center gap-3">
                            <label className="relative inline-flex cursor-pointer items-center">
                              <input
                                type="checkbox"
                                className="peer sr-only"
                                defaultChecked={board.enabled}
                              />
                              <div className="peer h-5 w-9 rounded-full bg-muted after:absolute after:left-[2px] after:top-[2px] after:h-4 after:w-4 after:rounded-full after:bg-background after:transition-all after:content-[''] peer-checked:bg-primary peer-checked:after:translate-x-4 peer-focus:ring-2 peer-focus:ring-primary/20"></div>
                            </label>
                            <div>
                              <div className="text-sm font-medium text-foreground">{board.name}</div>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <span className="rounded bg-muted px-1.5 py-0.5 font-medium">AVI</span>
                                <span>{board.type}</span>
                                <span>•</span>
                                <span>{board.taskCount} tasks</span>
                                <span>•</span>
                                <span>{board.completion}% complete</span>
                              </div>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm" className="h-8 gap-2 text-xs">
                            <Eye className="h-3.5 w-3.5" />
                            Preview
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Right Column - Recent Activity */}
            <div className="lg:col-span-1">
              <Card className="border-border bg-card">
                <CardContent className="p-0">
                  <div className="border-b border-border px-5 py-4">
                    <h3 className="text-sm font-semibold text-foreground">Recent Client Activity</h3>
                  </div>
                  <div className="divide-y divide-border">
                    {recentActivity.map((activity, idx) => (
                      <div key={idx} className="px-5 py-3">
                        <div className="text-sm text-foreground">{activity.action}</div>
                        <div className="mt-0.5 text-xs text-muted-foreground">
                          {activity.user} • {activity.timestamp}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>


      </Tabs>
    </section>
  )
}
