"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { ScrollText, Search, Filter, ArrowUpRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  allAuditEvents,
  auditActionColors,
  type AuditEvent,
} from "@/lib/support-data"
import { organizations } from "@/lib/organization-data"
import { cn } from "@/lib/utils"

const ALL_ACTIONS = [
  "all",
  "login",
  "created",
  "updated",
  "deleted",
  "invited",
  "suspended",
  "reactivated",
  "role changed",
  "settings changed",
  "integration connected",
  "integration disconnected",
  "password reset",
]

const ORG_OPTIONS = [
  { value: "all", label: "All Organizations" },
  ...organizations.map((o) => ({ value: o.slug, label: o.name })),
]

export default function SuperAdminAuditLogPage() {
  const router = useRouter()
  const [search, setSearch] = useState("")
  const [actionFilter, setActionFilter] = useState("all")
  const [orgFilter, setOrgFilter] = useState("all")

  const orgMap = useMemo(
    () => Object.fromEntries(organizations.map((o) => [o.slug, o.name])),
    []
  )

  const filtered = useMemo(() => {
    return allAuditEvents.filter((e) => {
      if (orgFilter !== "all" && e.orgSlug !== orgFilter) return false
      if (actionFilter !== "all" && e.action !== actionFilter) return false
      if (search) {
        const q = search.toLowerCase()
        if (
          !e.actor.toLowerCase().includes(q) &&
          !e.target.toLowerCase().includes(q) &&
          !(orgMap[e.orgSlug] ?? "").toLowerCase().includes(q) &&
          !e.action.toLowerCase().includes(q)
        )
          return false
      }
      return true
    })
  }, [actionFilter, orgFilter, search, orgMap])

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6 lg:p-8">
      {/* Header */}
      <div>
        <h1 className="flex items-center gap-2 text-lg font-semibold text-foreground">
          <ScrollText className="h-5 w-5 text-amber-400" />
          Audit Log
        </h1>
        <p className="mt-0.5 text-xs text-muted-foreground">
          A complete chronological record of actions across all organizations.
        </p>
      </div>

      {/* Stat row */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Total Events", value: allAuditEvents.length, color: "text-foreground" },
          {
            label: "Super Admin Actions",
            value: allAuditEvents.filter((e) => e.actor.startsWith("superadmin")).length,
            color: "text-amber-400",
          },
          {
            label: "Orgs Covered",
            value: new Set(allAuditEvents.map((e) => e.orgSlug)).size,
            color: "text-primary",
          },
          {
            label: "Critical Actions",
            value: allAuditEvents.filter((e) =>
              ["suspended", "deleted", "integration disconnected"].includes(e.action)
            ).length,
            color: "text-red-400",
          },
        ].map((s) => (
          <Card key={s.label} className="border-border bg-card">
            <CardContent className="p-4">
              <p className="text-[11px] text-muted-foreground">{s.label}</p>
              <p className={cn("mt-1 text-2xl font-bold", s.color)}>{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative min-w-[180px] max-w-xs flex-1">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search actor, target, org..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-8 border-border bg-background pl-8 text-xs"
          />
        </div>

        {/* Org filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex h-8 items-center gap-1.5 rounded-md border border-border bg-background px-3 text-xs text-muted-foreground hover:text-foreground">
              <Filter className="h-3 w-3" />
              {ORG_OPTIONS.find((o) => o.value === orgFilter)?.label ?? "All Organizations"}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="border-border bg-popover">
            {ORG_OPTIONS.map((o) => (
              <DropdownMenuItem
                key={o.value}
                onClick={() => setOrgFilter(o.value)}
                className={cn("text-xs", orgFilter === o.value && "font-semibold text-foreground")}
              >
                {o.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Action filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex h-8 items-center gap-1.5 rounded-md border border-border bg-background px-3 text-xs text-muted-foreground hover:text-foreground">
              <Filter className="h-3 w-3" />
              {actionFilter === "all" ? "All Actions" : actionFilter}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="border-border bg-popover">
            {ALL_ACTIONS.map((a) => (
              <DropdownMenuItem
                key={a}
                onClick={() => setActionFilter(a)}
                className={cn("text-xs capitalize", actionFilter === a && "font-semibold text-foreground")}
              >
                {a === "all" ? "All Actions" : a}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <span className="ml-auto text-[11px] text-muted-foreground">
          {filtered.length} of {allAuditEvents.length} events
        </span>
      </div>

      {/* Table */}
      <Card className="border-border bg-card">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  {["Actor", "Action", "Target", "Organization", "IP Address", "Timestamp"].map((h) => (
                    <th
                      key={h}
                      className="whitespace-nowrap px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-10 text-center text-xs text-muted-foreground">
                      No events match your filters.
                    </td>
                  </tr>
                ) : (
                  filtered.map((event: AuditEvent, i) => (
                    <tr
                      key={event.id}
                      className={cn(
                        "border-b border-border/50 transition-colors last:border-0 hover:bg-muted/20",
                        i % 2 === 1 && "bg-muted/10"
                      )}
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[9px] font-bold text-primary">
                            {event.actorAvatar}
                          </div>
                          <span className="text-xs text-foreground">{event.actor}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={cn(
                            "text-xs font-semibold capitalize",
                            auditActionColors[event.action] ?? "text-foreground"
                          )}
                        >
                          {event.action}
                        </span>
                      </td>
                      <td className="max-w-[180px] truncate px-4 py-3 text-xs text-muted-foreground">
                        {event.target}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() =>
                            router.push(`/super-admin/org/${event.orgSlug}?tab=audit-log`)
                          }
                          className="flex items-center gap-1 text-xs font-medium text-foreground hover:text-primary"
                        >
                          {orgMap[event.orgSlug] ?? event.orgSlug}
                          <ArrowUpRight className="h-3 w-3 shrink-0" />
                        </button>
                      </td>
                      <td className="px-4 py-3 font-mono text-[11px] text-muted-foreground">
                        {event.ip}
                      </td>
                      <td className="px-4 py-3 text-[11px] text-muted-foreground">
                        {event.timestamp}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
