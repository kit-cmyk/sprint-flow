"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Filter } from "lucide-react"

type DependencyType = "client" | "internal" | "architecture"
type EscalationStatus = "escalated" | "pending" | "resolved"

interface Blocker {
  ticket: string
  owner: string
  blockedDuration: string
  blockedHours: number
  dependencyType: DependencyType
  escalationStatus: EscalationStatus
}

const blockers: Blocker[] = [
  {
    ticket: "PROJ-342",
    owner: "Sarah Chen",
    blockedDuration: "36h",
    blockedHours: 36,
    dependencyType: "client",
    escalationStatus: "escalated",
  },
  {
    ticket: "PROJ-356",
    owner: "Marcus Rivera",
    blockedDuration: "28h",
    blockedHours: 28,
    dependencyType: "architecture",
    escalationStatus: "pending",
  },
  {
    ticket: "PROJ-361",
    owner: "Jake Thompson",
    blockedDuration: "18h",
    blockedHours: 18,
    dependencyType: "internal",
    escalationStatus: "pending",
  },
  {
    ticket: "PROJ-378",
    owner: "Aisha Patel",
    blockedDuration: "42h",
    blockedHours: 42,
    dependencyType: "client",
    escalationStatus: "escalated",
  },
  {
    ticket: "PROJ-385",
    owner: "Li Wei",
    blockedDuration: "12h",
    blockedHours: 12,
    dependencyType: "internal",
    escalationStatus: "resolved",
  },
]

function getDependencyLabel(type: DependencyType) {
  switch (type) {
    case "client":
      return { label: "Client", bg: "bg-sky-500/10", text: "text-sky-400" }
    case "internal":
      return { label: "Internal", bg: "bg-amber-500/10", text: "text-amber-400" }
    case "architecture":
      return { label: "Architecture", bg: "bg-purple-500/10", text: "text-purple-400" }
  }
}

function getEscalationStyle(status: EscalationStatus) {
  switch (status) {
    case "escalated":
      return "bg-red-500/15 text-red-400"
    case "pending":
      return "bg-amber-500/15 text-amber-400"
    case "resolved":
      return "bg-emerald-500/15 text-emerald-400"
  }
}

const filterOptions: { label: string; value: DependencyType | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Client", value: "client" },
  { label: "Internal", value: "internal" },
  { label: "Architecture", value: "architecture" },
]

export function BlockerPanel() {
  const [filter, setFilter] = useState<DependencyType | "all">("all")

  const filtered =
    filter === "all"
      ? blockers
      : blockers.filter((b) => b.dependencyType === filter)

  return (
    <section>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-semibold text-foreground">
            Blocker & Escalation Panel
          </h2>
          <p className="text-xs text-muted-foreground">
            Active blockers and dependency issues
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          <Filter className="h-3.5 w-3.5 text-muted-foreground" />
          {filterOptions.map((opt) => (
            <Button
              key={opt.value}
              variant="outline"
              size="sm"
              className={`h-7 px-2.5 text-xs ${
                filter === opt.value
                  ? "border-primary/30 bg-primary/10 text-primary"
                  : "border-border bg-secondary text-secondary-foreground hover:bg-muted"
              }`}
              onClick={() => setFilter(opt.value)}
            >
              {opt.label}
            </Button>
          ))}
        </div>
      </div>
      <Card className="border-border bg-card">
        <CardContent className="p-0">
          {/* Desktop Table */}
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs text-muted-foreground">
                  <th className="px-4 py-3 font-medium">Ticket</th>
                  <th className="px-4 py-3 font-medium">Owner</th>
                  <th className="px-4 py-3 font-medium">Blocked Duration</th>
                  <th className="px-4 py-3 font-medium">Dependency Type</th>
                  <th className="px-4 py-3 font-medium">Escalation</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((blocker) => {
                  const dep = getDependencyLabel(blocker.dependencyType)
                  const isOverSLA = blocker.blockedHours > 24
                  return (
                    <tr
                      key={blocker.ticket}
                      className={`border-b border-border/50 last:border-0 transition-colors hover:bg-secondary/50 ${
                        isOverSLA ? "bg-red-500/5" : ""
                      }`}
                    >
                      <td className="px-4 py-3">
                        <span className={`font-mono text-sm font-medium ${isOverSLA ? "text-red-400" : "text-foreground"}`}>
                          {blocker.ticket}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-foreground">{blocker.owner}</td>
                      <td className="px-4 py-3">
                        <span className={`font-semibold ${isOverSLA ? "text-red-400" : "text-foreground"}`}>
                          {blocker.blockedDuration}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex rounded-md px-2 py-0.5 text-[11px] font-semibold ${dep.bg} ${dep.text}`}>
                          {dep.label}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold capitalize ${getEscalationStyle(blocker.escalationStatus)}`}>
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              blocker.escalationStatus === "escalated"
                                ? "bg-red-400"
                                : blocker.escalationStatus === "pending"
                                  ? "bg-amber-400"
                                  : "bg-emerald-400"
                            }`}
                          />
                          {blocker.escalationStatus}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="flex flex-col gap-3 p-3 md:hidden">
            {filtered.map((blocker) => {
              const dep = getDependencyLabel(blocker.dependencyType)
              const isOverSLA = blocker.blockedHours > 24
              return (
                <div
                  key={blocker.ticket}
                  className={`rounded-lg border p-3 ${
                    isOverSLA
                      ? "border-red-500/20 bg-red-500/5"
                      : "border-border/50 bg-secondary/30"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`font-mono text-sm font-medium ${isOverSLA ? "text-red-400" : "text-foreground"}`}>
                      {blocker.ticket}
                    </span>
                    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize ${getEscalationStyle(blocker.escalationStatus)}`}>
                      {blocker.escalationStatus}
                    </span>
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                    <span>{blocker.owner}</span>
                    <span className={`font-semibold ${isOverSLA ? "text-red-400" : "text-foreground"}`}>
                      {blocker.blockedDuration}
                    </span>
                    <span className={`rounded-md px-1.5 py-0.5 text-[10px] font-semibold ${dep.bg} ${dep.text}`}>
                      {dep.label}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </section>
  )
}
