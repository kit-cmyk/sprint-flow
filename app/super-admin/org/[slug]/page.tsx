"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import {
  LayoutDashboard,
  FolderKanban,
  Users,
  CreditCard,
  ArrowLeft,
  ArrowUpRight,
  TrendingUp,
  TrendingDown,
  Minus,
  Check,
  X,
  AlertTriangle,
  ShieldOff,
  ShieldCheck,
  Calendar,
  HeadphonesIcon,
  ScrollText,
  Shield,
  Clock,
  MessageSquare,
  MoreVertical,
  ChevronDown,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { getOrgBySlug } from "@/lib/organization-data"
import {
  type SupportTicket,
  type TicketStatus,
  ticketStatusColors,
  ticketPriorityColors,
  ticketCategoryLabels,
  auditActionColors,
  getTicketsByOrg,
  getAuditEventsByOrg,
} from "@/lib/support-data"
import { pods } from "@/lib/pod-data"
import { developers } from "@/lib/developer-data"
import { cn } from "@/lib/utils"

/* ── helpers ─────────────────────────── */
const planColors: Record<string, string> = {
  Enterprise: "bg-violet-500/10 text-violet-400",
  Business: "bg-primary/10 text-primary",
  Starter: "bg-secondary text-secondary-foreground",
}
const statusColors: Record<string, string> = {
  active: "bg-emerald-500/10 text-emerald-400",
  trial: "bg-amber-500/10 text-amber-400",
  suspended: "bg-red-500/10 text-red-400",
}
const statusDots: Record<string, string> = {
  active: "bg-emerald-400",
  trial: "bg-amber-400",
  suspended: "bg-red-400",
}
function healthColor(score: number) {
  if (score >= 80) return "text-emerald-400"
  if (score >= 60) return "text-amber-400"
  return "text-red-400"
}
function healthDot(score: number) {
  if (score >= 80) return "bg-emerald-400"
  if (score >= 60) return "bg-amber-400"
  return "bg-red-400"
}

const tabs = [
  { value: "overview", label: "Overview", icon: LayoutDashboard },
  { value: "projects", label: "Projects", icon: FolderKanban },
  { value: "developers", label: "Developers", icon: Users },
  { value: "members", label: "Members", icon: Shield },
  { value: "billing", label: "Billing", icon: CreditCard },
  { value: "support", label: "Support", icon: HeadphonesIcon },
  { value: "audit-log", label: "Audit Log", icon: ScrollText },
]



const mockInvoices = [
  { id: "INV-2025-03", date: "Mar 1, 2025", amount: "$1,800", status: "paid" },
  { id: "INV-2025-02", date: "Feb 1, 2025", amount: "$1,800", status: "paid" },
  { id: "INV-2025-01", date: "Jan 1, 2025", amount: "$1,800", status: "paid" },
  { id: "INV-2024-12", date: "Dec 1, 2024", amount: "$1,200", status: "paid" },
]

export default function OrgDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const router = useRouter()
  const org = getOrgBySlug(slug)

  const [activeTab, setActiveTab] = useState("overview")
  const [suspendOpen, setSuspendOpen] = useState(false)
  const [isSuspended, setIsSuspended] = useState(org?.status === "suspended")

  const [tickets, setTickets] = useState<SupportTicket[]>(() =>
    org ? getTicketsByOrg(org.slug) : []
  )
  const auditEvents = org ? getAuditEventsByOrg(org.slug) : []

  if (!org) {
    return (
      <div className="flex items-center justify-center p-12 text-sm text-muted-foreground">
        Organization not found.
      </div>
    )
  }

  const orgPods = pods.filter((p) => org.podSlugs.includes(p.slug))
  const orgDevs = developers.filter((d) => org.developerSlugs.includes(d.slug))
  const atRiskCount = orgPods.filter((p) => p.healthScore < 60).length
  const avgHealth =
    orgPods.length > 0
      ? Math.round(orgPods.reduce((s, p) => s + p.healthScore, 0) / orgPods.length)
      : 0

  return (
    <div className="flex flex-col">
      {/* Page header */}
      <div className="border-b border-border bg-background px-4 py-4 md:px-6 lg:px-8">
        <button
          onClick={() => router.push("/super-admin")}
          className="mb-3 flex items-center gap-1.5 text-[11px] text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-3 w-3" />
          Back to Dashboard
        </button>
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary">
            {org.logoInitials}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-balance text-base font-semibold text-foreground md:text-lg">
                {org.name}
              </h1>
              <span className={cn("rounded-full px-2 py-0.5 text-[11px] font-semibold", planColors[org.plan])}>
                {org.plan}
              </span>
              <span className={cn("flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-semibold capitalize", statusColors[isSuspended ? "suspended" : org.status])}>
                <span className={cn("h-1.5 w-1.5 rounded-full", statusDots[isSuspended ? "suspended" : org.status])} />
                {isSuspended ? "suspended" : org.status}
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground">{org.adminEmail}</p>
          </div>
        </div>
      </div>

      {/* Tab bar */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-1 flex-col">
        <div className="sticky top-12 z-20 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="overflow-x-auto px-4 md:px-6 lg:px-8">
            <TabsList className="h-auto w-max min-w-full justify-start gap-0 rounded-none bg-transparent p-0 sm:w-full">
              {tabs.map(({ value, label, icon: Icon }) => (
                <TabsTrigger
                  key={value}
                  value={value}
                  className="relative shrink-0 gap-2 rounded-none border-b-2 border-transparent px-3 py-3 text-xs font-medium text-muted-foreground shadow-none transition-none data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none sm:px-4 sm:text-sm"
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">{label}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
        </div>

        {/* ── Overview ─────────────────────────── */}
        <TabsContent value="overview" className="mt-0 p-4 md:p-6 lg:p-8">
          <div className="flex flex-col gap-6">
            {/* Quick stats */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { label: "Pods", value: orgPods.length },
                { label: "Developers", value: orgDevs.length },
                { label: "At-Risk Pods", value: atRiskCount, accent: atRiskCount > 0 },
                { label: "Avg Health", value: `${avgHealth}%`, accent: avgHealth < 70 },
              ].map((s) => (
                <Card key={s.label} className={cn("border-border bg-card", s.accent && "border-red-500/20")}>
                  <CardContent className="p-4">
                    <p className="text-[11px] text-muted-foreground">{s.label}</p>
                    <p className={cn("mt-1 text-xl font-bold", s.accent ? "text-red-400" : "text-foreground")}>
                      {s.value}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Identity card */}
            <Card className="border-border bg-card">
              <CardContent className="p-5">
                <p className="mb-3 text-xs font-semibold text-foreground">Organization Details</p>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {[
                    { label: "Admin Email", value: org.adminEmail },
                    { label: "Created", value: new Date(org.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) },
                    { label: "Plan", value: org.plan },
                    { label: "MRR", value: org.mrr > 0 ? `$${org.mrr.toLocaleString()}/mo` : "—" },
                    { label: "Seats Used", value: `${org.seatsUsed} of ${org.seats}` },
                    { label: "Teams", value: org.teamSlugs.length },
                  ].map(({ label, value }) => (
                    <div key={label}>
                      <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
                      <p className="mt-0.5 text-xs font-semibold text-foreground">{value}</p>
                    </div>
                  ))}
                </div>
                {/* Seat usage bar */}
                <div className="mt-4">
                  <div className="mb-1 flex justify-between text-[10px] text-muted-foreground">
                    <span>Seat usage</span>
                    <span>{Math.round((org.seatsUsed / org.seats) * 100)}%</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary transition-all"
                      style={{ width: `${Math.min(100, (org.seatsUsed / org.seats) * 100)}%` }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Pod health grid */}
            {orgPods.length > 0 && (
              <div>
                <p className="mb-3 text-xs font-semibold text-foreground">Pod Health</p>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {orgPods.map((pod) => (
                    <Card key={pod.slug} className="border-border bg-card">
                      <CardContent className="p-4">
                        <div className="mb-2 flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 min-w-0">
                            <span className={cn("h-2 w-2 shrink-0 rounded-full", healthDot(pod.healthScore))} />
                            <p className="truncate text-xs font-semibold text-foreground">{pod.name}</p>
                          </div>
                          <span className={cn("text-xs font-bold", healthColor(pod.healthScore))}>
                            {pod.healthScore}%
                          </span>
                        </div>
                        <p className="mb-2 text-[11px] text-muted-foreground">{pod.client} · {pod.sprint}</p>
                        <div className="h-1 w-full overflow-hidden rounded-full bg-muted">
                          <div
                            className={cn("h-full rounded-full", healthDot(pod.healthScore))}
                            style={{ width: `${pod.healthScore}%` }}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        </TabsContent>

        {/* ── Projects ─────────────────────────── */}
        <TabsContent value="projects" className="mt-0 p-4 md:p-6 lg:p-8">
          <Card className="border-border bg-card">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/30">
                      {["Pod", "Client", "Health", "Sprint", "Completion", "Blockers", "Velocity"].map((h) => (
                        <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground first:sticky first:left-0 first:bg-muted/30">
                          {h}
                        </th>
                      ))}
                      <th className="w-10 px-4 py-3" />
                    </tr>
                  </thead>
                  <tbody>
                    {orgPods.map((pod, i) => (
                      <tr key={pod.slug} className={cn("border-b border-border/50 transition-colors last:border-0 hover:bg-muted/20", i % 2 === 1 && "bg-muted/10")}>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <span className={cn("h-2 w-2 shrink-0 rounded-full", healthDot(pod.healthScore))} />
                            <p className="text-xs font-semibold text-foreground">{pod.name}</p>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-xs text-muted-foreground">{pod.client}</td>
                        <td className={cn("px-4 py-3 text-xs font-bold", healthColor(pod.healthScore))}>
                          {pod.healthScore}%
                        </td>
                        <td className="px-4 py-3 text-xs text-foreground">{pod.sprint}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="h-1.5 w-16 overflow-hidden rounded-full bg-muted">
                              <div className="h-full rounded-full bg-primary" style={{ width: `${pod.completion}%` }} />
                            </div>
                            <span className="text-[11px] text-muted-foreground">{pod.completion}%</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          {pod.blockers > 0 ? (
                            <span className="flex items-center gap-1 text-xs text-red-400">
                              <AlertTriangle className="h-3 w-3" /> {pod.blockers}
                            </span>
                          ) : (
                            <span className="text-xs text-muted-foreground">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          {pod.velocityDirection === "up" && <TrendingUp className="h-4 w-4 text-emerald-400" />}
                          {pod.velocityDirection === "down" && <TrendingDown className="h-4 w-4 text-red-400" />}
                          {pod.velocityDirection === "stable" && <Minus className="h-4 w-4 text-muted-foreground" />}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <Link href={`/pod/${pod.slug}`} className="inline-flex items-center gap-0.5 text-[11px] text-primary hover:underline">
                            View <ArrowUpRight className="h-3 w-3" />
                          </Link>
                        </td>
                      </tr>
                    ))}
                    {orgPods.length === 0 && (
                      <tr>
                        <td colSpan={8} className="px-4 py-8 text-center text-xs text-muted-foreground">
                          No pods assigned to this organization.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Developers ─────────────────────────── */}
        <TabsContent value="developers" className="mt-0 p-4 md:p-6 lg:p-8">
          <Card className="border-border bg-card">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/30">
                      {["Developer", "Role", "Allocation", "WIP", "Blockers", "Pods"].map((h) => (
                        <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                          {h}
                        </th>
                      ))}
                      <th className="w-10 px-4 py-3" />
                    </tr>
                  </thead>
                  <tbody>
                    {orgDevs.map((dev, i) => (
                      <tr key={dev.slug} className={cn("border-b border-border/50 transition-colors last:border-0 hover:bg-muted/20", i % 2 === 1 && "bg-muted/10")}>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2.5">
                            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">
                              {dev.avatar}
                            </div>
                            <p className="text-xs font-semibold text-foreground">{dev.name}</p>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-xs text-muted-foreground">{dev.role}</td>
                        <td className="px-4 py-3">
                          <span className={cn("text-xs font-bold", dev.totalAllocation > 100 ? "text-red-400" : "text-foreground")}>
                            {dev.totalAllocation}%
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={cn("rounded-full px-2 py-0.5 text-[11px] font-semibold", dev.wipStatus === "over-limit" ? "bg-red-500/10 text-red-400" : "bg-emerald-500/10 text-emerald-400")}>
                            {dev.activeTickets}/{dev.wipLimit}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-xs text-foreground">{dev.blockersOwned}</td>
                        <td className="px-4 py-3 text-xs text-muted-foreground">{dev.activeProjectsCount}</td>
                        <td className="px-4 py-3 text-right">
                          <Link href={`/developer/${dev.slug}`} className="inline-flex items-center gap-0.5 text-[11px] text-primary hover:underline">
                            View <ArrowUpRight className="h-3 w-3" />
                          </Link>
                        </td>
                      </tr>
                    ))}
                    {orgDevs.length === 0 && (
                      <tr>
                        <td colSpan={7} className="px-4 py-8 text-center text-xs text-muted-foreground">
                          No developers assigned to this organization.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Billing ─────────────────────────── */}
        <TabsContent value="billing" className="mt-0 p-4 md:p-6 lg:p-8">
          <div className="flex flex-col gap-5">
            {/* Plan card */}
            <Card className="border-border bg-card">
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold text-foreground">Current Plan</p>
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-semibold", planColors[org.plan])}>
                        {org.plan}
                      </span>
                      <span className="text-sm font-bold text-foreground">
                        {org.mrr > 0 ? `$${org.mrr.toLocaleString()}/mo` : "Free trial"}
                      </span>
                    </div>
                    <div className="mt-3 grid gap-2 text-[11px] sm:grid-cols-3">
                      <div>
                        <p className="text-muted-foreground">Seats</p>
                        <p className="font-semibold text-foreground">{org.seatsUsed}/{org.seats} used</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Renewal</p>
                        <p className="font-semibold text-foreground">Apr 1, 2025</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Member since</p>
                        <p className="font-semibold text-foreground">
                          {new Date(org.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Invoice history */}
            <Card className="border-border bg-card">
              <CardContent className="p-0">
                <div className="border-b border-border px-5 py-3">
                  <p className="text-xs font-semibold text-foreground">Invoice History</p>
                </div>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/30">
                      {["Invoice", "Date", "Amount", "Status"].map((h) => (
                        <th key={h} className="px-5 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {mockInvoices.map((inv) => (
                      <tr key={inv.id} className="border-b border-border/50 last:border-0">
                        <td className="px-5 py-3 text-xs font-medium text-foreground">{inv.id}</td>
                        <td className="px-5 py-3 text-xs text-muted-foreground">{inv.date}</td>
                        <td className="px-5 py-3 text-xs font-semibold text-foreground">{inv.amount}</td>
                        <td className="px-5 py-3">
                          <span className="flex w-fit items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-semibold text-emerald-400">
                            <Check className="h-3 w-3" /> Paid
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>

            {/* Danger zone */}
            <Card className="border-red-500/30 bg-card">
              <CardContent className="p-5">
                <p className="mb-1 text-xs font-semibold text-red-400">Danger Zone</p>
                <p className="mb-4 text-[11px] text-muted-foreground">
                  {isSuspended
                    ? "Reactivating this organization will restore all access and resume billing."
                    : "Suspending this organization will immediately revoke all user access and pause billing."}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className={cn(
                    "gap-1.5 text-xs",
                    isSuspended
                      ? "border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/10"
                      : "border-red-500/40 text-red-400 hover:bg-red-500/10"
                  )}
                  onClick={() => setSuspendOpen(true)}
                >
                  {isSuspended ? (
                    <><ShieldCheck className="h-3.5 w-3.5" /> Reactivate Organization</>
                  ) : (
                    <><ShieldOff className="h-3.5 w-3.5" /> Suspend Organization</>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        {/* ── Members ──────────────────────────────── */}
        <TabsContent value="members" className="mt-0 p-4 md:p-6 lg:p-8">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between gap-4">
              <p className="text-xs text-muted-foreground">
                Users with access to this organization.
              </p>
              <span className="rounded-full bg-muted px-2.5 py-0.5 text-[11px] font-semibold text-muted-foreground">
                {org.members.length} members
              </span>
            </div>
            <Card className="border-border bg-card">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border bg-muted/30">
                        {["User", "Role", "Status", "Last Active"].map((h) => (
                          <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                            {h}
                          </th>
                        ))}
                        <th className="w-10 px-4 py-3" />
                      </tr>
                    </thead>
                    <tbody>
                      {org.members.map((member, i) => {
                        const roleLabels: Record<string, string> = { admin: "Admin", "scrum-master": "Scrum Master", developer: "Developer", "client-viewer": "Client Viewer" }
                        const roleColors: Record<string, string> = { admin: "bg-primary/10 text-primary", "scrum-master": "bg-accent/10 text-accent-foreground", developer: "bg-secondary text-secondary-foreground", "client-viewer": "bg-amber-500/10 text-amber-400" }
                        const memberStatusColors: Record<string, string> = { active: "bg-emerald-500/10 text-emerald-400", invited: "bg-amber-500/10 text-amber-400", disabled: "bg-red-500/10 text-red-400" }
                        return (
                          <tr key={member.id} className={cn("border-b border-border/50 transition-colors last:border-0 hover:bg-muted/20", i % 2 === 1 && "bg-muted/10")}>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2.5">
                                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">
                                  {member.avatar}
                                </div>
                                <div>
                                  <p className="text-xs font-semibold text-foreground">{member.name}</p>
                                  <p className="text-[10px] text-muted-foreground">{member.email}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <span className={cn("flex w-fit items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold", roleColors[member.role])}>
                                <Shield className="h-2.5 w-2.5" />
                                {roleLabels[member.role]}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <span className={cn("rounded-full px-2 py-0.5 text-[11px] font-semibold capitalize", memberStatusColors[member.status])}>
                                {member.status}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Clock className="h-3 w-3" />
                                {member.lastActive}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <button className="rounded p-1 text-muted-foreground transition-colors hover:text-foreground">
                                    <MoreVertical className="h-3.5 w-3.5" />
                                  </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="border-border bg-popover">
                                  <DropdownMenuItem>Change Role</DropdownMenuItem>
                                  {member.status === "invited" && <DropdownMenuItem>Resend Invite</DropdownMenuItem>}
                                  <DropdownMenuItem className="text-destructive">
                                    {member.status === "disabled" ? "Re-enable Access" : "Disable Access"}
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ── Support Tickets ───────────────────────── */}
        <TabsContent value="support" className="mt-0 p-4 md:p-6 lg:p-8">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between gap-4">
              <p className="text-xs text-muted-foreground">Support tickets submitted by this organization.</p>
              <div className="flex items-center gap-2">
                {(["open", "in-progress", "resolved"] as TicketStatus[]).map((s) => {
                  const count = tickets.filter((t) => t.status === s).length
                  return (
                    <span key={s} className={cn("rounded-full px-2.5 py-0.5 text-[11px] font-semibold capitalize", ticketStatusColors[s])}>
                      {count} {s}
                    </span>
                  )
                })}
              </div>
            </div>
            <Card className="border-border bg-card">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border bg-muted/30">
                        {["Ticket", "Subject", "Category", "Submitted By", "Priority", "Status", "Last Update"].map((h) => (
                          <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                            {h}
                          </th>
                        ))}
                        <th className="w-10 px-4 py-3" />
                      </tr>
                    </thead>
                    <tbody>
                      {tickets.map((ticket, i) => (
                        <tr key={ticket.id} className={cn("border-b border-border/50 transition-colors last:border-0 hover:bg-muted/20", i % 2 === 1 && "bg-muted/10")}>
                          <td className="px-4 py-3 text-xs font-mono text-muted-foreground">{ticket.id}</td>
                          <td className="px-4 py-3 text-xs font-semibold text-foreground max-w-[200px] truncate">{ticket.subject}</td>
                          <td className="px-4 py-3">
                            <span className="text-[11px] text-muted-foreground">
                              {ticketCategoryLabels[ticket.category]}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-xs text-muted-foreground">{ticket.submittedByName || ticket.submittedBy}</td>
                          <td className="px-4 py-3">
                            <span className={cn("rounded-full px-2 py-0.5 text-[11px] font-semibold capitalize", ticketPriorityColors[ticket.priority])}>
                              {ticket.priority}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span className={cn("rounded-full px-2 py-0.5 text-[11px] font-semibold capitalize", ticketStatusColors[ticket.status])}>
                              {ticket.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-xs text-muted-foreground">{ticket.lastUpdate}</td>
                          <td className="px-4 py-3 text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <button className="rounded p-1 text-muted-foreground transition-colors hover:text-foreground">
                                  <MoreVertical className="h-3.5 w-3.5" />
                                </button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="border-border bg-popover">
                                <DropdownMenuItem onClick={() => setTickets((prev) => prev.map((t) => t.id === ticket.id ? { ...t, status: "in-progress" } : t))}>
                                  Mark In Progress
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setTickets((prev) => prev.map((t) => t.id === ticket.id ? { ...t, status: "resolved" } : t))}>
                                  Mark Resolved
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setTickets((prev) => prev.map((t) => t.id === ticket.id ? { ...t, status: "closed" } : t))}>
                                  Close Ticket
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ── Audit Log ────────────────────────────── */}
        <TabsContent value="audit-log" className="mt-0 p-4 md:p-6 lg:p-8">
          <div className="flex flex-col gap-4">
            <p className="text-xs text-muted-foreground">
              A chronological record of actions taken within this organization.
            </p>
            <Card className="border-border bg-card">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border bg-muted/30">
                        {["Actor", "Action", "Target", "IP Address", "Timestamp"].map((h) => (
                          <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {auditEvents.map((event, i) => (
                        <tr key={event.id} className={cn("border-b border-border/50 transition-colors last:border-0 hover:bg-muted/20", i % 2 === 1 && "bg-muted/10")}>
                          <td className="px-4 py-3 text-xs font-medium text-foreground">{event.actor}</td>
                          <td className="px-4 py-3">
                            <span className={cn("text-xs font-semibold capitalize", auditActionColors[event.action] ?? "text-foreground")}>
                              {event.action}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-xs text-muted-foreground max-w-[180px] truncate">{event.target}</td>
                          <td className="px-4 py-3 font-mono text-[11px] text-muted-foreground">{event.ip}</td>
                          <td className="px-4 py-3 text-[11px] text-muted-foreground">{event.timestamp}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

      </Tabs>

      {/* Suspend/Reactivate Dialog */}
      <Dialog open={suspendOpen} onOpenChange={setSuspendOpen}>
        <DialogContent className="max-w-sm bg-card">
          <DialogHeader>
            <DialogTitle className="text-foreground">
              {isSuspended ? "Reactivate Organization" : "Suspend Organization"}
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            {isSuspended
              ? `Reactivating ${org.name} will restore all access for their users and resume billing. Are you sure?`
              : `Suspending ${org.name} will immediately revoke access for all ${org.seatsUsed} users and pause their billing. Are you sure?`}
          </p>
          <DialogFooter className="gap-2">
            <Button variant="outline" size="sm" onClick={() => setSuspendOpen(false)}>
              Cancel
            </Button>
            <Button
              size="sm"
              variant={isSuspended ? "default" : "destructive"}
              onClick={() => {
                setIsSuspended((v) => !v)
                setSuspendOpen(false)
              }}
            >
              {isSuspended ? "Reactivate" : "Suspend"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
