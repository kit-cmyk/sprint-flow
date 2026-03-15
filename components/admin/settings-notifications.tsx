"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Bell, Mail } from "lucide-react"

interface NotificationEvent {
  id: string
  label: string
  description: string
  inApp: boolean
  email: boolean
}

interface Group {
  label: string
  events: NotificationEvent[]
}

const initialGroups: Group[] = [
  {
    label: "Pods",
    events: [
      { id: "pod-at-risk", label: "Pod At Risk", description: "Pod status changes to at-risk", inApp: true, email: true },
      { id: "health-dropped", label: "Health Score Dropped", description: "Pod health falls below 70", inApp: true, email: true },
      { id: "sprint-completed", label: "Sprint Completed", description: "A sprint cycle ends", inApp: true, email: false },
      { id: "blocker-added", label: "Blocker Added", description: "A blocker ticket is flagged", inApp: true, email: false },
    ],
  },
  {
    label: "Reports",
    events: [
      { id: "pulse-published", label: "Pulse Check Published", description: "A new pulse check report is published", inApp: true, email: false },
    ],
  },
  {
    label: "Organization",
    events: [
      { id: "user-invited", label: "New User Invited", description: "A new team member is invited", inApp: true, email: true },
    ],
  },
]

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
        checked ? "bg-primary" : "bg-muted-foreground/30"
      }`}
    >
      <span
        className={`pointer-events-none inline-block h-3.5 w-3.5 rounded-full bg-white shadow-sm transition-transform ${
          checked ? "translate-x-[18px]" : "translate-x-[2px]"
        }`}
      />
    </button>
  )
}

export function SettingsNotifications() {
  const [groups, setGroups] = useState<Group[]>(initialGroups)

  const update = (groupLabel: string, eventId: string, key: "inApp" | "email", value: boolean) => {
    setGroups((prev) =>
      prev.map((g) =>
        g.label === groupLabel
          ? { ...g, events: g.events.map((e) => (e.id === eventId ? { ...e, [key]: value } : e)) }
          : g
      )
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <p className="text-xs text-muted-foreground">
        Control which events notify you and how. Changes are saved automatically.
      </p>

      {groups.map((group) => (
        <div key={group.label} className="flex flex-col gap-2">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
            {group.label}
          </p>
          <Card className="border-border bg-card">
            <CardContent className="p-0">
              {/* Column headers */}
              <div className="grid grid-cols-[1fr_80px_80px] border-b border-border px-5 py-2.5">
                <span />
                <span className="flex items-center justify-center gap-1 text-[11px] font-medium text-muted-foreground">
                  <Bell className="h-3 w-3" />
                  In-App
                </span>
                <span className="flex items-center justify-center gap-1 text-[11px] font-medium text-muted-foreground">
                  <Mail className="h-3 w-3" />
                  Email
                </span>
              </div>

              {group.events.map((event, i) => (
                <div
                  key={event.id}
                  className={`grid grid-cols-[1fr_80px_80px] items-center px-5 py-3.5 ${
                    i < group.events.length - 1 ? "border-b border-border/50" : ""
                  }`}
                >
                  <div>
                    <p className="text-xs font-medium text-foreground">{event.label}</p>
                    <p className="text-[11px] text-muted-foreground">{event.description}</p>
                  </div>
                  <div className="flex justify-center">
                    <Toggle
                      checked={event.inApp}
                      onChange={(v) => update(group.label, event.id, "inApp", v)}
                      label={`${event.label} in-app`}
                    />
                  </div>
                  <div className="flex justify-center">
                    <Toggle
                      checked={event.email}
                      onChange={(v) => update(group.label, event.id, "email", v)}
                      label={`${event.label} email`}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      ))}
    </div>
  )
}
