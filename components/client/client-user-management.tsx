"use client"

import { useState } from "react"
import {
  Users,
  UserPlus,
  MoreHorizontal,
  Mail,
  Shield,
  Pencil,
  CheckCircle2,
  Clock,
  X,
  ChevronDown,
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

type Role = "Admin" | "Member"
type Status = "Active" | "Invited" | "Deactivated"

interface PortalUser {
  id: string
  name: string
  email: string
  initials: string
  role: Role
  status: Status
  lastLogin: string | null
  addedBy: string
}

const users: PortalUser[] = [
  {
    id: "1",
    name: "Marcus Rivera",
    email: "marcus@clienta.com",
    initials: "MR",
    role: "Admin",
    status: "Active",
    lastLogin: "2 hours ago",
    addedBy: "System",
  },
  {
    id: "2",
    name: "Lisa Thompson",
    email: "lisa.t@clienta.com",
    initials: "LT",
    role: "Member",
    status: "Active",
    lastLogin: "1 day ago",
    addedBy: "Marcus Rivera",
  },
  {
    id: "3",
    name: "David Park",
    email: "d.park@clienta.com",
    initials: "DP",
    role: "Member",
    status: "Active",
    lastLogin: "3 days ago",
    addedBy: "Marcus Rivera",
  },
  {
    id: "4",
    name: "Nina Patel",
    email: "nina.p@clienta.com",
    initials: "NP",
    role: "Member",
    status: "Invited",
    lastLogin: null,
    addedBy: "Marcus Rivera",
  },
]

const roleConfig: Record<Role, { color: string; bg: string; icon: typeof Shield }> = {
  Admin: { color: "text-amber-700", bg: "bg-amber-50 border-amber-200", icon: Shield },
  Member: { color: "text-blue-700", bg: "bg-blue-50 border-blue-200", icon: Users },
}

const statusConfig: Record<Status, { color: string; icon: typeof CheckCircle2 }> = {
  Active: { color: "text-emerald-600", icon: CheckCircle2 },
  Invited: { color: "text-amber-500", icon: Clock },
  Deactivated: { color: "text-[hsl(220,10%,60%)]", icon: X },
}

export function ClientUserManagement() {
  const [showInvite, setShowInvite] = useState(false)
  const [inviteEmail, setInviteEmail] = useState("")
  const [inviteRole, setInviteRole] = useState<Role>("Member")
  const [openMenu, setOpenMenu] = useState<string | null>(null)

  const activeCount = users.filter((u) => u.status === "Active").length
  const invitedCount = users.filter((u) => u.status === "Invited").length

  return (
    <main className="min-h-screen bg-[hsl(0,0%,98%)] px-4 py-6 pt-16 sm:pt-6 md:px-8 lg:px-12">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl font-bold text-[hsl(220,15%,15%)]">User Management</h1>
            <p className="mt-1 text-sm text-[hsl(220,10%,50%)]">
              Manage team members who can access this portal
            </p>
          </div>
          <Button
            size="sm"
            className="h-9 gap-2 bg-[hsl(160,51%,42%)] text-white hover:bg-[hsl(160,51%,36%)]"
            onClick={() => setShowInvite(!showInvite)}
          >
            <UserPlus className="h-3.5 w-3.5" />
            Invite Member
          </Button>
        </div>

        {/* Stats */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Card className="border-[hsl(220,13%,90%)] bg-white p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[hsl(160,51%,42%)]/10">
                <Users className="h-4 w-4 text-[hsl(160,51%,42%)]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[hsl(220,15%,15%)]">{activeCount}</p>
                <p className="text-xs text-[hsl(220,10%,50%)]">Active Users</p>
              </div>
            </div>
          </Card>
          <Card className="border-[hsl(220,13%,90%)] bg-white p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50">
                <Clock className="h-4 w-4 text-amber-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[hsl(220,15%,15%)]">{invitedCount}</p>
                <p className="text-xs text-[hsl(220,10%,50%)]">Pending Invites</p>
              </div>
            </div>
          </Card>
          <Card className="border-[hsl(220,13%,90%)] bg-white p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50">
                <Shield className="h-4 w-4 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[hsl(220,15%,15%)]">{users.length}</p>
                <p className="text-xs text-[hsl(220,10%,50%)]">Total Members</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Invite form */}
        {showInvite && (
          <Card className="mb-6 border-[hsl(160,51%,42%)]/20 bg-[hsl(160,51%,42%)]/5 p-5 shadow-sm">
            <div className="mb-3 flex items-center gap-2">
              <Mail className="h-4 w-4 text-[hsl(160,51%,42%)]" />
              <span className="text-sm font-semibold text-[hsl(220,15%,15%)]">Invite a new member</span>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
              <div className="flex-1">
                <label htmlFor="invite-email" className="mb-1 block text-xs font-medium text-[hsl(220,10%,40%)]">
                  Email address
                </label>
                <input
                  id="invite-email"
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="colleague@company.com"
                  className="h-9 w-full rounded-md border border-[hsl(220,13%,87%)] bg-white px-3 text-sm text-[hsl(220,15%,15%)] placeholder:text-[hsl(220,10%,65%)] focus:border-[hsl(160,51%,42%)] focus:outline-none focus:ring-1 focus:ring-[hsl(160,51%,42%)]"
                />
              </div>
              <div className="sm:w-[160px]">
                <label htmlFor="invite-role" className="mb-1 block text-xs font-medium text-[hsl(220,10%,40%)]">
                  Role
                </label>
                <div className="relative">
                  <select
                    id="invite-role"
                    value={inviteRole}
                    onChange={(e) => setInviteRole(e.target.value as Role)}
                    className="h-9 w-full appearance-none rounded-md border border-[hsl(220,13%,87%)] bg-white px-3 pr-8 text-sm text-[hsl(220,15%,15%)] focus:border-[hsl(160,51%,42%)] focus:outline-none focus:ring-1 focus:ring-[hsl(160,51%,42%)]"
                  >
                    <option value="Member">Member</option>
                    <option value="Admin">Admin</option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[hsl(220,10%,55%)]" />
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  className="h-9 gap-2 bg-[hsl(160,51%,42%)] text-white hover:bg-[hsl(160,51%,36%)]"
                  disabled={!inviteEmail.trim()}
                >
                  <Mail className="h-3.5 w-3.5" />
                  Send Invite
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-9 text-[hsl(220,10%,50%)]"
                  onClick={() => {
                    setShowInvite(false)
                    setInviteEmail("")
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Users table (desktop) */}
        <Card className="hidden overflow-hidden border-[hsl(220,13%,90%)] bg-white shadow-sm md:block">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[hsl(220,13%,90%)] bg-[hsl(210,15%,97%)]">
                  <th className="px-5 py-3 text-left text-xs font-semibold text-[hsl(220,10%,45%)]">
                    Member
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-[hsl(220,10%,45%)]">
                    Role
                  </th>
                  <th className="hidden px-5 py-3 text-left text-xs font-semibold text-[hsl(220,10%,45%)] md:table-cell">
                    Last Login
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-[hsl(220,10%,45%)]">
                    Status
                  </th>
                  <th className="w-12 px-3 py-3" />
                </tr>
              </thead>
              <tbody>
                {users.map((user) => {
                  const role = roleConfig[user.role]
                  const status = statusConfig[user.status]
                  const RoleIcon = role.icon
                  const StatusIcon = status.icon
                  return (
                    <tr
                      key={user.id}
                      className="border-b border-[hsl(220,13%,93%)] transition-colors last:border-0 hover:bg-[hsl(210,15%,98%)]"
                    >
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[hsl(160,51%,42%)]/15 text-xs font-bold text-[hsl(160,51%,42%)]">
                            {user.initials}
                          </div>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium text-[hsl(220,15%,15%)]">
                              {user.name}
                            </p>
                            <p className="truncate text-xs text-[hsl(220,10%,55%)]">
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${role.bg} ${role.color}`}
                        >
                          <RoleIcon className="h-3 w-3" />
                          {user.role}
                        </span>
                      </td>
                      <td className="hidden px-5 py-3.5 md:table-cell">
                        <span className="text-xs text-[hsl(220,10%,50%)]">
                          {user.lastLogin ?? "Never"}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${status.color}`}>
                          <StatusIcon className="h-3.5 w-3.5" />
                          {user.status}
                        </span>
                      </td>
                      <td className="px-3 py-3.5">
                        <div className="relative">
                          <button
                            type="button"
                            onClick={() => setOpenMenu(openMenu === user.id ? null : user.id)}
                            className="flex h-7 w-7 items-center justify-center rounded-md text-[hsl(220,10%,55%)] transition-colors hover:bg-[hsl(210,15%,93%)]"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </button>
                          {openMenu === user.id && (
                            <>
                              <div className="fixed inset-0 z-10" onClick={() => setOpenMenu(null)} />
                              <div className="absolute right-0 top-8 z-20 w-40 rounded-lg border border-[hsl(220,13%,90%)] bg-white py-1 shadow-lg">
                                <button
                                  type="button"
                                  className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs text-[hsl(220,10%,35%)] hover:bg-[hsl(210,15%,95%)]"
                                  onClick={() => setOpenMenu(null)}
                                >
                                  <Pencil className="h-3 w-3" />
                                  Change Role
                                </button>
                                <button
                                  type="button"
                                  className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs text-[hsl(220,10%,35%)] hover:bg-[hsl(210,15%,95%)]"
                                  onClick={() => setOpenMenu(null)}
                                >
                                  <Mail className="h-3 w-3" />
                                  Resend Invite
                                </button>
                                <button
                                  type="button"
                                  className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs text-red-600 hover:bg-red-50"
                                  onClick={() => setOpenMenu(null)}
                                >
                                  <X className="h-3 w-3" />
                                  Remove
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Users mobile cards */}
        <div className="flex flex-col gap-3 md:hidden">
          {users.map((user) => {
            const role = roleConfig[user.role]
            const status = statusConfig[user.status]
            const RoleIcon = role.icon
            const StatusIcon = status.icon
            return (
              <Card key={user.id} className="border-[hsl(220,13%,90%)] bg-white shadow-sm">
                <div className="flex items-center gap-3 p-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[hsl(160,51%,42%)]/15 text-sm font-bold text-[hsl(160,51%,42%)]">
                    {user.initials}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-[hsl(220,15%,15%)]">{user.name}</p>
                    <p className="text-xs text-[hsl(220,10%,55%)]">{user.email}</p>
                    <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                      <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium ${role.bg} ${role.color}`}>
                        <RoleIcon className="h-3 w-3" />
                        {user.role}
                      </span>
                      <span className={`inline-flex items-center gap-1 text-[10px] font-medium ${status.color}`}>
                        <StatusIcon className="h-3 w-3" />
                        {user.status}
                      </span>
                    </div>
                  </div>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setOpenMenu(openMenu === user.id ? null : user.id)}
                      className="flex h-7 w-7 items-center justify-center rounded-md text-[hsl(220,10%,55%)] transition-colors hover:bg-[hsl(210,15%,93%)]"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                    {openMenu === user.id && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setOpenMenu(null)} />
                        <div className="absolute right-0 top-8 z-20 w-40 rounded-lg border border-[hsl(220,13%,90%)] bg-white py-1 shadow-lg">
                          <button type="button" className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs text-[hsl(220,10%,35%)] hover:bg-[hsl(210,15%,95%)]" onClick={() => setOpenMenu(null)}>
                            <Pencil className="h-3 w-3" />
                            Change Role
                          </button>
                          <button type="button" className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs text-[hsl(220,10%,35%)] hover:bg-[hsl(210,15%,95%)]" onClick={() => setOpenMenu(null)}>
                            <Mail className="h-3 w-3" />
                            Resend Invite
                          </button>
                          <button type="button" className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs text-red-600 hover:bg-red-50" onClick={() => setOpenMenu(null)}>
                            <X className="h-3 w-3" />
                            Remove
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </Card>
            )
          })}
        </div>

        {/* Role legend */}
        <div className="mt-6 rounded-lg border border-[hsl(220,13%,90%)] bg-white p-4">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-[hsl(220,10%,50%)]">
            Role Permissions
          </p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="flex items-start gap-2.5">
              <Shield className="mt-0.5 h-3.5 w-3.5 text-amber-600" />
              <div>
                <p className="text-xs font-medium text-[hsl(220,15%,15%)]">Admin</p>
                <p className="text-[11px] leading-relaxed text-[hsl(220,10%,55%)]">
                  Full access. Can invite and manage users, view all data, and configure portal settings.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <Users className="mt-0.5 h-3.5 w-3.5 text-blue-600" />
              <div>
                <p className="text-xs font-medium text-[hsl(220,15%,15%)]">Member</p>
                <p className="text-[11px] leading-relaxed text-[hsl(220,10%,55%)]">
                  View-only access. Can view all portal sections including pulse checks, sprint board, and roadmap.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
