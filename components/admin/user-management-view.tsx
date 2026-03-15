"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  UserPlus,
  Mail,
  Shield,
  Clock,
  MoreVertical,
  Check,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type Role = "admin" | "scrum-master" | "developer" | "client-viewer"

interface TeamMember {
  id: string
  name: string
  email: string
  role: Role
  status: "active" | "invited" | "disabled"
  lastActive: string
  avatar: string
}

const roleLabels: Record<Role, string> = {
  admin: "Admin",
  "scrum-master": "Scrum Master",
  developer: "Developer",
  "client-viewer": "Client Viewer",
}

const roleColors: Record<Role, string> = {
  admin: "bg-primary/15 text-primary",
  "scrum-master": "bg-accent/15 text-accent",
  developer: "bg-secondary text-secondary-foreground",
  "client-viewer": "bg-amber-500/15 text-amber-400",
}

const statusColors: Record<string, string> = {
  active: "bg-emerald-500/15 text-emerald-400",
  invited: "bg-amber-500/15 text-amber-400",
  disabled: "bg-red-500/15 text-red-400",
}

const initialMembers: TeamMember[] = [
  {
    id: "1",
    name: "James Mitchell",
    email: "james@assembled.dev",
    role: "admin",
    status: "active",
    lastActive: "2 min ago",
    avatar: "JM",
  },
  {
    id: "2",
    name: "Sarah Chen",
    email: "sarah@assembled.dev",
    role: "scrum-master",
    status: "active",
    lastActive: "15 min ago",
    avatar: "SC",
  },
  {
    id: "3",
    name: "Alex Rivera",
    email: "alex@assembled.dev",
    role: "developer",
    status: "active",
    lastActive: "1 hour ago",
    avatar: "AR",
  },
  {
    id: "4",
    name: "Marcus Johnson",
    email: "marcus@assembled.dev",
    role: "developer",
    status: "active",
    lastActive: "3 hours ago",
    avatar: "MJ",
  },
  {
    id: "5",
    name: "Emily Torres",
    email: "emily@clienta.com",
    role: "client-viewer",
    status: "active",
    lastActive: "1 day ago",
    avatar: "ET",
  },
  {
    id: "6",
    name: "David Kim",
    email: "david@assembled.dev",
    role: "developer",
    status: "invited",
    lastActive: "Pending",
    avatar: "DK",
  },
]

export function UserManagementView() {
  const [members, setMembers] = useState<TeamMember[]>(initialMembers)
  const [inviteEmail, setInviteEmail] = useState("")
  const [inviteRole, setInviteRole] = useState<Role>("developer")
  const [showSuccess, setShowSuccess] = useState(false)

  const handleInvite = () => {
    if (!inviteEmail.includes("@")) return
    const newMember: TeamMember = {
      id: Date.now().toString(),
      name: inviteEmail.split("@")[0].replace(/[._-]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      email: inviteEmail,
      role: inviteRole,
      status: "invited",
      lastActive: "Pending",
      avatar: inviteEmail.slice(0, 2).toUpperCase(),
    }
    setMembers((prev) => [...prev, newMember])
    setInviteEmail("")
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 3000)
  }

  const activeCount = members.filter((m) => m.status === "active").length
  const invitedCount = members.filter((m) => m.status === "invited").length

  return (
    <div className="flex flex-col gap-6">
      {/* Summary row */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Card className="border-border bg-card">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Total Users</p>
            <p className="mt-1 text-2xl font-bold text-foreground">
              {members.length}
            </p>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Active</p>
            <p className="mt-1 text-2xl font-bold text-emerald-400">
              {activeCount}
            </p>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Pending Invites</p>
            <p className={`mt-1 text-2xl font-bold ${invitedCount > 0 ? "text-amber-400" : "text-foreground"}`}>
              {invitedCount}
            </p>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Roles</p>
            <p className="mt-1 text-2xl font-bold text-foreground">4</p>
          </CardContent>
        </Card>
      </div>

      {/* Invite form */}
      <Card className="border-border bg-card">
        <CardContent className="p-4">
          <div className="mb-3 flex items-center gap-2">
            <UserPlus className="h-4 w-4 text-primary" />
            <h2 className="text-sm font-semibold text-foreground">
              Invite New User
            </h2>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Mail className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="email"
                placeholder="Enter email address"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                className="h-9 border-border bg-background pl-9 text-sm text-foreground placeholder:text-muted-foreground"
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleInvite()
                }}
              />
            </div>
            <select
              value={inviteRole}
              onChange={(e) => setInviteRole(e.target.value as Role)}
              className="h-9 rounded-md border border-border bg-background px-3 text-sm text-foreground"
            >
              <option value="developer">Developer</option>
              <option value="scrum-master">Scrum Master</option>
              <option value="admin">Admin</option>
              <option value="client-viewer">Client Viewer</option>
            </select>
            <Button
              size="sm"
              className="h-9 gap-2"
              onClick={handleInvite}
              disabled={!inviteEmail.includes("@")}
            >
              <UserPlus className="h-3.5 w-3.5" />
              Send Invite
            </Button>
          </div>
          {showSuccess && (
            <div className="mt-3 flex items-center gap-2 text-xs text-emerald-400">
              <Check className="h-3.5 w-3.5" />
              Invitation sent successfully
            </div>
          )}
        </CardContent>
      </Card>

      {/* User table (desktop) */}
      <Card className="hidden border-border bg-card md:block">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs text-muted-foreground">
                  <th className="px-4 py-3 font-medium">User</th>
                  <th className="px-4 py-3 font-medium">Role</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Last Active</th>
                  <th className="px-4 py-3 font-medium" />
                </tr>
              </thead>
              <tbody>
                {members.map((member) => (
                  <tr
                    key={member.id}
                    className="border-b border-border/50 transition-colors last:border-0 hover:bg-muted/30"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/15 text-xs font-bold text-primary">
                          {member.avatar}
                        </div>
                        <div>
                          <p className="font-medium text-foreground">
                            {member.name}
                          </p>
                          <p className="text-[10px] text-muted-foreground">
                            {member.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${roleColors[member.role]}`}
                      >
                        <Shield className="h-2.5 w-2.5" />
                        {roleLabels[member.role]}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize ${statusColors[member.status]}`}
                      >
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
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-muted-foreground hover:text-foreground"
                          >
                            <MoreVertical className="h-3.5 w-3.5" />
                            <span className="sr-only">Actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="border-border bg-popover text-popover-foreground"
                        >
                          <DropdownMenuItem>Change Role</DropdownMenuItem>
                          {member.status === "invited" && (
                            <DropdownMenuItem>Resend Invite</DropdownMenuItem>
                          )}
                          <DropdownMenuItem className="text-red-400">
                            {member.status === "disabled"
                              ? "Re-enable"
                              : "Disable Access"}
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

      {/* Mobile cards */}
      <div className="flex flex-col gap-3 md:hidden">
        {members.map((member) => (
          <Card key={member.id} className="border-border bg-card">
            <CardContent className="flex items-center gap-3 p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/15 text-sm font-bold text-primary">
                {member.avatar}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-foreground">
                  {member.name}
                </p>
                <p className="text-[10px] text-muted-foreground">
                  {member.email}
                </p>
                <div className="mt-1.5 flex items-center gap-1.5">
                  <span
                    className={`rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${roleColors[member.role]}`}
                  >
                    {roleLabels[member.role]}
                  </span>
                  <span
                    className={`rounded-full px-1.5 py-0.5 text-[10px] font-semibold capitalize ${statusColors[member.status]}`}
                  >
                    {member.status}
                  </span>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-muted-foreground"
                  >
                    <MoreVertical className="h-3.5 w-3.5" />
                    <span className="sr-only">Actions</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="border-border bg-popover text-popover-foreground"
                >
                  <DropdownMenuItem>Change Role</DropdownMenuItem>
                  {member.status === "invited" && (
                    <DropdownMenuItem>Resend Invite</DropdownMenuItem>
                  )}
                  <DropdownMenuItem className="text-red-400">
                    {member.status === "disabled"
                      ? "Re-enable"
                      : "Disable Access"}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
