"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  UserPlus,
  MoreHorizontal,
  Shield,
  Mail,
  CheckCircle2,
  Clock,
  Eye,
  Pencil,
  ExternalLink,
  Send,
  Ban,
  X,
} from "lucide-react"
import type { PodData } from "@/lib/pod-data"

type PortalRole = "owner" | "collaborator" | "viewer"
type InviteStatus = "active" | "invited" | "expired" | "revoked"

interface ClientUser {
  name: string
  email: string
  company: string
  portalRole: PortalRole
  status: InviteStatus
  avatar: string
  lastLogin?: string
  invitedBy: string
  invitedAt: string
}

const clientUsers: ClientUser[] = [
  {
    name: "Marcus Rivera",
    email: "marcus@clienta.com",
    company: "Client A Inc.",
    portalRole: "owner",
    status: "active",
    avatar: "MR",
    lastLogin: "2 hours ago",
    invitedBy: "Sarah Chen",
    invitedAt: "Jan 15, 2026",
  },
  {
    name: "Lisa Thompson",
    email: "lisa.t@clienta.com",
    company: "Client A Inc.",
    portalRole: "collaborator",
    status: "active",
    avatar: "LT",
    lastLogin: "1 day ago",
    invitedBy: "Sarah Chen",
    invitedAt: "Jan 18, 2026",
  },
  {
    name: "David Park",
    email: "david.park@clienta.com",
    company: "Client A Inc.",
    portalRole: "viewer",
    status: "active",
    avatar: "DP",
    lastLogin: "3 days ago",
    invitedBy: "Alex Kim",
    invitedAt: "Feb 1, 2026",
  },
  {
    name: "Rachel Adams",
    email: "rachel@clienta.com",
    company: "Client A Inc.",
    portalRole: "viewer",
    status: "invited",
    avatar: "RA",
    invitedBy: "Sarah Chen",
    invitedAt: "Feb 14, 2026",
  },
  {
    name: "James Cooper",
    email: "j.cooper@clienta.com",
    company: "Client A Inc.",
    portalRole: "viewer",
    status: "expired",
    avatar: "JC",
    invitedBy: "Alex Kim",
    invitedAt: "Jan 5, 2026",
  },
]

const roleConfig: Record<PortalRole, { label: string; color: string; icon: typeof Shield; desc: string }> = {
  owner: {
    label: "Owner",
    color: "bg-primary/15 text-primary",
    icon: Shield,
    desc: "Full access to dashboard, roadmap, billing, and settings",
  },
  collaborator: {
    label: "Collaborator",
    color: "bg-blue-500/15 text-blue-400",
    icon: Pencil,
    desc: "Can view all data, add comments, and approve deliverables",
  },
  viewer: {
    label: "Viewer",
    color: "bg-muted text-muted-foreground",
    icon: Eye,
    desc: "Read-only access to dashboard and sprint progress",
  },
}

const statusConfig: Record<InviteStatus, { label: string; color: string; icon: typeof CheckCircle2 }> = {
  active: { label: "Active", color: "text-emerald-400", icon: CheckCircle2 },
  invited: { label: "Pending", color: "text-amber-400", icon: Clock },
  expired: { label: "Expired", color: "text-red-400", icon: Ban },
  revoked: { label: "Revoked", color: "text-muted-foreground", icon: X },
}

export function PodUserManagement({ pod }: { pod: PodData }) {
  const [showInvite, setShowInvite] = useState(false)
  const [inviteEmail, setInviteEmail] = useState("")
  const [inviteRole, setInviteRole] = useState<PortalRole>("viewer")

  const activeCount = clientUsers.filter((u) => u.status === "active").length
  const pendingCount = clientUsers.filter((u) => u.status === "invited").length
  const ownerCount = clientUsers.filter((u) => u.portalRole === "owner").length
  const viewerCount = clientUsers.filter(
    (u) => u.portalRole === "viewer" && u.status === "active"
  ).length

  return (
    <section>
      {/* Header */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-semibold text-foreground">
            Client Portal Access
          </h2>
          <p className="text-xs text-muted-foreground">
            Manage who can access the client portal for {pod.name}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-9 gap-2 border-border text-muted-foreground hover:text-foreground"
            asChild
          >
            <a href="/client-dashboard" target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-3.5 w-3.5" />
              View Portal
            </a>
          </Button>
          <Button
            size="sm"
            className="h-9 gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={() => setShowInvite(!showInvite)}
          >
            <UserPlus className="h-3.5 w-3.5" />
            Invite Client
          </Button>
        </div>
      </div>

      {/* Invite Form */}
      {showInvite && (
        <Card className="mb-6 border-primary/30 bg-primary/5">
          <CardContent className="p-4">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-foreground">
                Invite a new client user
              </h3>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
                onClick={() => setShowInvite(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
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
              <div className="sm:w-44">
                <label className="mb-1 block text-xs font-medium text-muted-foreground">
                  Portal role
                </label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as PortalRole)}
                  className="h-9 w-full rounded-md border border-border bg-card px-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="owner">Owner</option>
                  <option value="collaborator">Collaborator</option>
                  <option value="viewer">Viewer</option>
                </select>
              </div>
              <Button
                size="sm"
                className="h-9 gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Send className="h-3.5 w-3.5" />
                Send Invite
              </Button>
            </div>
            <p className="mt-2 text-[11px] text-muted-foreground">
              {roleConfig[inviteRole].desc}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Summary cards */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Card className="border-border bg-card">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-foreground">{activeCount}</p>
            <p className="text-xs text-muted-foreground">Active Users</p>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-amber-400">{pendingCount}</p>
            <p className="text-xs text-muted-foreground">Pending Invites</p>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-primary">{ownerCount}</p>
            <p className="text-xs text-muted-foreground">Portal Owners</p>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-foreground">{viewerCount}</p>
            <p className="text-xs text-muted-foreground">Viewers</p>
          </CardContent>
        </Card>
      </div>

      {/* Client users table */}
      <Card className="border-border bg-card">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-xs text-muted-foreground">
                  <th className="px-4 py-3 text-left font-medium">Client User</th>
                  <th className="px-4 py-3 text-left font-medium">Portal Role</th>
                  <th className="px-4 py-3 text-left font-medium">Status</th>
                  <th className="hidden px-4 py-3 text-left font-medium md:table-cell">
                    Last Login
                  </th>
                  <th className="hidden px-4 py-3 text-left font-medium lg:table-cell">
                    Invited By
                  </th>
                  <th className="px-4 py-3 text-right font-medium">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {clientUsers.map((user) => {
                  const role = roleConfig[user.portalRole]
                  const status = statusConfig[user.status]
                  const RoleIcon = role.icon
                  const StatusIcon = status.icon
                  return (
                    <tr
                      key={user.email}
                      className="border-b border-border last:border-0"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/15 text-xs font-bold text-primary">
                            {user.avatar}
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-foreground">
                              {user.name}
                            </p>
                            <p className="flex items-center gap-1 truncate text-xs text-muted-foreground">
                              <Mail className="h-3 w-3 shrink-0" />
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${role.color}`}
                        >
                          <RoleIcon className="h-3 w-3" />
                          {role.label}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center gap-1 text-xs ${status.color}`}
                        >
                          <StatusIcon className="h-3 w-3" />
                          {status.label}
                        </span>
                      </td>
                      <td className="hidden px-4 py-3 text-xs text-muted-foreground md:table-cell">
                        {user.lastLogin ?? "--"}
                      </td>
                      <td className="hidden px-4 py-3 text-xs text-muted-foreground lg:table-cell">
                        <span>{user.invitedBy}</span>
                        <span className="ml-1 text-muted-foreground/60">
                          {user.invitedAt}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">
                            Actions for {user.name}
                          </span>
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

      {/* Role legend */}
      <div className="mt-4 flex flex-wrap gap-4">
        {(Object.entries(roleConfig) as [PortalRole, typeof roleConfig.owner][]).map(
          ([key, cfg]) => (
            <div key={key} className="flex items-center gap-2 text-xs text-muted-foreground">
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${cfg.color}`}
              >
                <cfg.icon className="h-2.5 w-2.5" />
                {cfg.label}
              </span>
              <span>{cfg.desc}</span>
            </div>
          )
        )}
      </div>
    </section>
  )
}
