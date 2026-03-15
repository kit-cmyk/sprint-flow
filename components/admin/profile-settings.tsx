"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Pencil, X, Check, Lock, Bell, User } from "lucide-react"

/* ── Shared editable card shell ───────────────── */
function EditableCard({
  title,
  children,
  onSave,
  onCancel,
  editing,
  onEdit,
  saved,
}: {
  title: string
  children: (editing: boolean) => React.ReactNode
  onSave: () => void
  onCancel: () => void
  editing: boolean
  onEdit: () => void
  saved: boolean
}) {
  return (
    <Card className="border-border bg-card">
      <CardContent className="p-5">
        <div className="mb-4 flex items-center justify-between gap-2">
          <h3 className="text-sm font-semibold text-foreground">{title}</h3>
          <div className="flex items-center gap-2">
            {saved && (
              <span className="flex items-center gap-1 text-[11px] text-emerald-500">
                <Check className="h-3 w-3" />
                Saved
              </span>
            )}
            {editing ? (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onCancel}
                  className="h-7 gap-1 px-2 text-xs text-muted-foreground hover:text-foreground"
                >
                  <X className="h-3 w-3" />
                  Cancel
                </Button>
                <Button size="sm" onClick={onSave} className="h-7 gap-1 px-2 text-xs">
                  <Check className="h-3 w-3" />
                  Save
                </Button>
              </>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={onEdit}
                className="h-7 gap-1 px-2 text-xs text-muted-foreground hover:text-foreground"
              >
                <Pencil className="h-3 w-3" />
                Edit
              </Button>
            )}
          </div>
        </div>
        {children(editing)}
      </CardContent>
    </Card>
  )
}

/* ── Tab definitions ──────────────────────────── */
const tabs = [
  { value: "personal", label: "Personal Info", icon: User },
  { value: "password", label: "Password", icon: Lock },
  { value: "notifications", label: "Notifications", icon: Bell },
]

/* ── Main component ───────────────────────────── */
export function ProfileSettings() {
  /* Personal Info */
  const [infoEditing, setInfoEditing] = useState(false)
  const [infoSaved, setInfoSaved] = useState(false)
  const [info, setInfo] = useState({
    firstName: "Alex",
    lastName: "Rivera",
    email: "admin@assembled.dev",
    role: "Organization Admin",
  })
  const [infoDraft, setInfoDraft] = useState(info)

  const saveInfo = () => {
    setInfo(infoDraft)
    setInfoEditing(false)
    setInfoSaved(true)
    setTimeout(() => setInfoSaved(false), 2500)
  }
  const cancelInfo = () => {
    setInfoDraft(info)
    setInfoEditing(false)
  }

  /* Password */
  const [pwEditing, setPwEditing] = useState(false)
  const [pwSaved, setPwSaved] = useState(false)
  const [pw, setPw] = useState({ current: "", next: "", confirm: "" })
  const pwMatch = pw.next === pw.confirm && pw.next.length >= 8

  const savePw = () => {
    if (!pwMatch) return
    setPwEditing(false)
    setPwSaved(true)
    setPw({ current: "", next: "", confirm: "" })
    setTimeout(() => setPwSaved(false), 2500)
  }
  const cancelPw = () => {
    setPw({ current: "", next: "", confirm: "" })
    setPwEditing(false)
  }

  /* Notifications */
  const [notifEditing, setNotifEditing] = useState(false)
  const [notifSaved, setNotifSaved] = useState(false)
  const [notif, setNotif] = useState({
    weeklyDigest: true,
    podAlerts: true,
    systemUpdates: false,
  })
  const [notifDraft, setNotifDraft] = useState(notif)

  const saveNotif = () => {
    setNotif(notifDraft)
    setNotifEditing(false)
    setNotifSaved(true)
    setTimeout(() => setNotifSaved(false), 2500)
  }
  const cancelNotif = () => {
    setNotifDraft(notif)
    setNotifEditing(false)
  }

  return (
    <div className="flex flex-col gap-0">
      {/* Avatar header — always visible above tabs */}
      <div className="flex items-center gap-4 border-b border-border px-4 py-5 md:px-6 lg:px-8">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary/10 text-lg font-bold text-primary">
          {info.firstName[0]}{info.lastName[0]}
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">
            {info.firstName} {info.lastName}
          </p>
          <p className="text-xs text-muted-foreground">{info.role}</p>
          <p className="text-xs text-muted-foreground">{info.email}</p>
        </div>
      </div>

      {/* Tab navigation — same pattern as settings-content.tsx */}
      <Tabs defaultValue="personal" className="w-full">
        <div className="sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="overflow-x-auto px-4 md:px-6 lg:px-8">
            <TabsList className="h-auto w-max min-w-full justify-start gap-0 rounded-none bg-transparent p-0 sm:w-full">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <TabsTrigger
                    key={tab.value}
                    value={tab.value}
                    className="relative flex h-11 items-center gap-2 rounded-none border-b-2 border-transparent px-4 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground data-[state=active]:border-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
                  >
                    <Icon className="h-3.5 w-3.5 shrink-0" />
                    {tab.label}
                  </TabsTrigger>
                )
              })}
            </TabsList>
          </div>
        </div>

        {/* Personal Info tab */}
        <TabsContent value="personal" className="mt-0 p-4 md:p-6 lg:p-8">
          <div className="mx-auto max-w-2xl">
            <EditableCard
              title="Personal Information"
              editing={infoEditing}
              onEdit={() => { setInfoDraft(info); setInfoEditing(true) }}
              onSave={saveInfo}
              onCancel={cancelInfo}
              saved={infoSaved}
            >
              {(editing) =>
                editing ? (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="flex flex-col gap-1.5">
                      <Label htmlFor="firstName" className="text-xs text-muted-foreground">First Name</Label>
                      <Input
                        id="firstName"
                        value={infoDraft.firstName}
                        onChange={(e) => setInfoDraft((d) => ({ ...d, firstName: e.target.value }))}
                        className="border-border bg-background text-foreground"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <Label htmlFor="lastName" className="text-xs text-muted-foreground">Last Name</Label>
                      <Input
                        id="lastName"
                        value={infoDraft.lastName}
                        onChange={(e) => setInfoDraft((d) => ({ ...d, lastName: e.target.value }))}
                        className="border-border bg-background text-foreground"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5 sm:col-span-2">
                      <Label htmlFor="email" className="text-xs text-muted-foreground">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={infoDraft.email}
                        onChange={(e) => setInfoDraft((d) => ({ ...d, email: e.target.value }))}
                        className="border-border bg-background text-foreground"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div>
                      <p className="text-[11px] text-muted-foreground">First Name</p>
                      <p className="text-sm text-foreground">{info.firstName}</p>
                    </div>
                    <div>
                      <p className="text-[11px] text-muted-foreground">Last Name</p>
                      <p className="text-sm text-foreground">{info.lastName}</p>
                    </div>
                    <div className="sm:col-span-2">
                      <p className="text-[11px] text-muted-foreground">Email</p>
                      <p className="text-sm text-foreground">{info.email}</p>
                    </div>
                    <div className="sm:col-span-2">
                      <p className="text-[11px] text-muted-foreground">Role</p>
                      <p className="text-sm text-foreground">{info.role}</p>
                    </div>
                  </div>
                )
              }
            </EditableCard>
          </div>
        </TabsContent>

        {/* Password tab */}
        <TabsContent value="password" className="mt-0 p-4 md:p-6 lg:p-8">
          <div className="mx-auto max-w-2xl">
            <EditableCard
              title="Change Password"
              editing={pwEditing}
              onEdit={() => setPwEditing(true)}
              onSave={savePw}
              onCancel={cancelPw}
              saved={pwSaved}
            >
              {(editing) =>
                editing ? (
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5">
                      <Label htmlFor="current-pw" className="text-xs text-muted-foreground">Current Password</Label>
                      <Input
                        id="current-pw"
                        type="password"
                        value={pw.current}
                        onChange={(e) => setPw((p) => ({ ...p, current: e.target.value }))}
                        className="border-border bg-background text-foreground"
                        placeholder="••••••••"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <Label htmlFor="new-pw" className="text-xs text-muted-foreground">New Password</Label>
                      <Input
                        id="new-pw"
                        type="password"
                        value={pw.next}
                        onChange={(e) => setPw((p) => ({ ...p, next: e.target.value }))}
                        className="border-border bg-background text-foreground"
                        placeholder="Min. 8 characters"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <Label htmlFor="confirm-pw" className="text-xs text-muted-foreground">Confirm New Password</Label>
                      <Input
                        id="confirm-pw"
                        type="password"
                        value={pw.confirm}
                        onChange={(e) => setPw((p) => ({ ...p, confirm: e.target.value }))}
                        className={`border-border bg-background text-foreground ${pw.confirm && !pwMatch ? "border-destructive" : ""}`}
                        placeholder="••••••••"
                      />
                      {pw.confirm && !pwMatch && (
                        <p className="text-[11px] text-destructive">Passwords do not match or are too short.</p>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Lock className="h-3.5 w-3.5" />
                    <span>Last changed 30 days ago</span>
                  </div>
                )
              }
            </EditableCard>
          </div>
        </TabsContent>

        {/* Notifications tab */}
        <TabsContent value="notifications" className="mt-0 p-4 md:p-6 lg:p-8">
          <div className="mx-auto max-w-2xl">
            <EditableCard
              title="Notification Preferences"
              editing={notifEditing}
              onEdit={() => { setNotifDraft(notif); setNotifEditing(true) }}
              onSave={saveNotif}
              onCancel={cancelNotif}
              saved={notifSaved}
            >
              {(editing) => {
                const items: { key: keyof typeof notif; label: string; description: string }[] = [
                  { key: "weeklyDigest", label: "Weekly Digest", description: "Summary of pod health and delivery metrics every Monday" },
                  { key: "podAlerts", label: "Pod Alerts", description: "Instant alerts when a pod drops to at-risk status" },
                  { key: "systemUpdates", label: "System Updates", description: "Platform announcements and feature releases" },
                ]
                const state = editing ? notifDraft : notif
                return (
                  <div className="flex flex-col divide-y divide-border/50">
                    {items.map(({ key, label, description }) => (
                      <div key={key} className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
                        <div>
                          <p className="text-xs font-medium text-foreground">{label}</p>
                          <p className="text-[11px] text-muted-foreground">{description}</p>
                        </div>
                        {editing ? (
                          <button
                            type="button"
                            role="switch"
                            aria-checked={notifDraft[key]}
                            onClick={() => setNotifDraft((d) => ({ ...d, [key]: !d[key] }))}
                            className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full transition-colors ${notifDraft[key] ? "bg-primary" : "bg-muted-foreground/30"}`}
                          >
                            <span
                              className={`pointer-events-none inline-block h-3.5 w-3.5 rounded-full bg-white shadow-sm transition-transform ${notifDraft[key] ? "translate-x-[18px]" : "translate-x-[2px]"}`}
                            />
                          </button>
                        ) : (
                          <span className={`text-[11px] font-medium ${state[key] ? "text-emerald-500" : "text-muted-foreground"}`}>
                            {state[key] ? "On" : "Off"}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )
              }}
            </EditableCard>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
