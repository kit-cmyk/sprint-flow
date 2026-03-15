"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Shield, Check, X, Plus, Trash2 } from "lucide-react"

interface Permission {
  id: string
  label: string
  description: string
}

const permissions: Permission[] = [
  { id: "view-pods", label: "View Pods", description: "See all pods, sprint boards, and metrics" },
  { id: "edit-pods", label: "Edit Pods", description: "Modify pod data, sprint tickets, and settings" },
  { id: "publish-pulse", label: "Publish Pulse Checks", description: "Create and publish weekly pulse reports" },
  { id: "manage-users", label: "Manage Users", description: "Invite, disable, and change user roles" },
  { id: "view-billing", label: "View Billing", description: "Access billing information and invoices" },
  { id: "manage-billing", label: "Manage Billing", description: "Update billing details and payment methods" },
  { id: "manage-integrations", label: "Manage Integrations", description: "Connect and configure third-party tools" },
  { id: "view-client-portal", label: "View Client Portal", description: "Access the client-facing portal" },
  { id: "manage-teams", label: "Manage Teams", description: "Create, edit, and delete developer teams" },
  { id: "manage-settings", label: "Organization Settings", description: "Edit org-level settings and configuration" },
]

type BuiltInRole = "Admin" | "Scrum Master" | "Developer" | "Client Viewer"

interface CustomRole {
  id: string
  name: string
  permissionIds: string[]
}

const builtInRoles: BuiltInRole[] = ["Admin", "Scrum Master", "Developer", "Client Viewer"]

const builtInMatrix: Record<BuiltInRole, string[]> = {
  Admin: [
    "view-pods", "edit-pods", "publish-pulse", "manage-users",
    "view-billing", "manage-billing", "manage-integrations",
    "view-client-portal", "manage-teams", "manage-settings",
  ],
  "Scrum Master": [
    "view-pods", "edit-pods", "publish-pulse", "view-client-portal", "manage-teams",
  ],
  Developer: ["view-pods", "view-client-portal"],
  "Client Viewer": ["view-client-portal"],
}

const builtInColors: Record<BuiltInRole, string> = {
  Admin: "bg-primary/10 text-primary",
  "Scrum Master": "bg-accent/10 text-accent-foreground",
  Developer: "bg-secondary text-secondary-foreground",
  "Client Viewer": "bg-amber-500/10 text-amber-400",
}

const customRoleColor = "bg-violet-500/10 text-violet-400"

export function SettingsRoles() {
  const [customRoles, setCustomRoles] = useState<CustomRole[]>([])
  const [dialogOpen, setDialogOpen] = useState(false)
  const [roleName, setRoleName] = useState("")
  const [selectedPerms, setSelectedPerms] = useState<string[]>([])
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)

  const togglePerm = (id: string) => {
    setSelectedPerms((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    )
  }

  const handleCreate = () => {
    if (!roleName.trim()) return
    setCustomRoles((prev) => [
      ...prev,
      { id: crypto.randomUUID(), name: roleName.trim(), permissionIds: selectedPerms },
    ])
    setRoleName("")
    setSelectedPerms([])
    setDialogOpen(false)
  }

  const handleDelete = (id: string) => {
    setCustomRoles((prev) => prev.filter((r) => r.id !== id))
    setDeleteTarget(null)
  }

  const allRoleNames = [
    ...builtInRoles,
    ...customRoles.map((r) => r.name),
  ]

  return (
    <div className="flex flex-col gap-5">
      {/* Header row */}
      <div className="flex items-start justify-between gap-4">
        <p className="text-xs text-muted-foreground">
          This matrix shows what each role can access across the platform. Built-in roles have fixed permissions. Custom roles can be created and removed freely.
        </p>
        <Button
          size="sm"
          className="shrink-0 gap-1.5 text-xs"
          onClick={() => setDialogOpen(true)}
        >
          <Plus className="h-3.5 w-3.5" />
          Create Role
        </Button>
      </div>

      {/* Role badges */}
      <div className="flex flex-wrap gap-2">
        {builtInRoles.map((role) => (
          <span
            key={role}
            className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${builtInColors[role]}`}
          >
            <Shield className="h-3 w-3" />
            {role}
          </span>
        ))}
        {customRoles.map((role) => (
          <span
            key={role.id}
            className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${customRoleColor}`}
          >
            <Shield className="h-3 w-3" />
            {role.name}
            <button
              onClick={() => setDeleteTarget(role.id)}
              className="ml-0.5 rounded-full p-0.5 transition-colors hover:bg-violet-500/20"
              aria-label={`Remove ${role.name}`}
            >
              <X className="h-2.5 w-2.5" />
            </button>
          </span>
        ))}
      </div>

      {/* Permission matrix — desktop */}
      <Card className="hidden border-border bg-card md:block">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">
                    Permission
                  </th>
                  {builtInRoles.map((role) => (
                    <th key={role} className="px-4 py-3 text-center text-xs font-semibold text-muted-foreground">
                      <span className={`rounded-full px-2 py-0.5 ${builtInColors[role]}`}>
                        {role}
                      </span>
                    </th>
                  ))}
                  {customRoles.map((role) => (
                    <th key={role.id} className="px-4 py-3 text-center text-xs font-semibold text-muted-foreground">
                      <div className="flex items-center justify-center gap-1">
                        <span className={`rounded-full px-2 py-0.5 ${customRoleColor}`}>
                          {role.name}
                        </span>
                        <button
                          onClick={() => setDeleteTarget(role.id)}
                          className="rounded p-0.5 text-muted-foreground transition-colors hover:text-destructive"
                          aria-label={`Delete ${role.name}`}
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {permissions.map((perm, i) => (
                  <tr
                    key={perm.id}
                    className={`border-b border-border/50 transition-colors last:border-0 hover:bg-muted/20 ${
                      i % 2 === 0 ? "" : "bg-muted/10"
                    }`}
                  >
                    <td className="px-4 py-3">
                      <p className="text-xs font-semibold text-foreground">{perm.label}</p>
                      <p className="text-[11px] text-muted-foreground">{perm.description}</p>
                    </td>
                    {builtInRoles.map((role) => {
                      const has = builtInMatrix[role].includes(perm.id)
                      return (
                        <td key={role} className="px-4 py-3 text-center">
                          {has ? (
                            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/15">
                              <Check className="h-3 w-3 text-emerald-500" />
                            </span>
                          ) : (
                            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-muted">
                              <X className="h-3 w-3 text-muted-foreground/40" />
                            </span>
                          )}
                        </td>
                      )
                    })}
                    {customRoles.map((role) => {
                      const has = role.permissionIds.includes(perm.id)
                      return (
                        <td key={role.id} className="px-4 py-3 text-center">
                          {has ? (
                            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/15">
                              <Check className="h-3 w-3 text-emerald-500" />
                            </span>
                          ) : (
                            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-muted">
                              <X className="h-3 w-3 text-muted-foreground/40" />
                            </span>
                          )}
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Mobile — permission cards per role */}
      <div className="flex flex-col gap-4 md:hidden">
        {builtInRoles.map((role) => (
          <Card key={role} className="border-border bg-card">
            <CardContent className="p-4">
              <div className="mb-3 flex items-center gap-2">
                <span className={`flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${builtInColors[role]}`}>
                  <Shield className="h-3 w-3" />
                  {role}
                </span>
              </div>
              <div className="flex flex-col gap-2">
                {permissions.map((perm) => {
                  const has = builtInMatrix[role].includes(perm.id)
                  return (
                    <div key={perm.id} className="flex items-center justify-between gap-2">
                      <span className="text-xs text-foreground">{perm.label}</span>
                      {has ? (
                        <Check className="h-3.5 w-3.5 shrink-0 text-emerald-500" />
                      ) : (
                        <X className="h-3.5 w-3.5 shrink-0 text-muted-foreground/40" />
                      )}
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        ))}
        {customRoles.map((role) => (
          <Card key={role.id} className="border-border bg-card">
            <CardContent className="p-4">
              <div className="mb-3 flex items-center justify-between gap-2">
                <span className={`flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${customRoleColor}`}>
                  <Shield className="h-3 w-3" />
                  {role.name}
                </span>
                <button
                  onClick={() => setDeleteTarget(role.id)}
                  className="rounded p-1 text-muted-foreground transition-colors hover:text-destructive"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
              <div className="flex flex-col gap-2">
                {permissions.map((perm) => {
                  const has = role.permissionIds.includes(perm.id)
                  return (
                    <div key={perm.id} className="flex items-center justify-between gap-2">
                      <span className="text-xs text-foreground">{perm.label}</span>
                      {has ? (
                        <Check className="h-3.5 w-3.5 shrink-0 text-emerald-500" />
                      ) : (
                        <X className="h-3.5 w-3.5 shrink-0 text-muted-foreground/40" />
                      )}
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Create Role Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md bg-card">
          <DialogHeader>
            <DialogTitle className="text-foreground">Create Custom Role</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="role-name" className="text-xs text-muted-foreground">Role Name</Label>
              <Input
                id="role-name"
                placeholder="e.g. Project Manager"
                value={roleName}
                onChange={(e) => setRoleName(e.target.value)}
                className="border-border bg-background text-foreground"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label className="text-xs text-muted-foreground">Permissions</Label>
              <div className="flex flex-col gap-0 rounded-lg border border-border overflow-hidden">
                {permissions.map((perm, i) => {
                  const checked = selectedPerms.includes(perm.id)
                  return (
                    <label
                      key={perm.id}
                      className={`flex cursor-pointer items-start gap-3 px-3 py-2.5 transition-colors hover:bg-muted/40 ${
                        i !== permissions.length - 1 ? "border-b border-border/50" : ""
                      } ${checked ? "bg-primary/5" : ""}`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => togglePerm(perm.id)}
                        className="mt-0.5 accent-primary"
                      />
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-foreground">{perm.label}</p>
                        <p className="text-[11px] text-muted-foreground">{perm.description}</p>
                      </div>
                    </label>
                  )
                })}
              </div>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" size="sm" onClick={() => { setDialogOpen(false); setRoleName(""); setSelectedPerms([]) }}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleCreate} disabled={!roleName.trim()}>
              Create Role
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <DialogContent className="max-w-sm bg-card">
          <DialogHeader>
            <DialogTitle className="text-foreground">Delete Role</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Are you sure you want to delete{" "}
            <strong className="text-foreground">
              {customRoles.find((r) => r.id === deleteTarget)?.name}
            </strong>
            ? This cannot be undone. Users assigned this role will need to be reassigned.
          </p>
          <DialogFooter className="gap-2">
            <Button variant="outline" size="sm" onClick={() => setDeleteTarget(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => deleteTarget && handleDelete(deleteTarget)}
            >
              Delete Role
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
