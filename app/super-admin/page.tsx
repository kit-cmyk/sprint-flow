"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import {
  Building2,
  Users,
  DollarSign,
  AlertTriangle,
  ArrowUpRight,
  TrendingUp,
  TrendingDown,
  Minus,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { organizations, getTotalMRR, getTotalActiveDevelopers } from "@/lib/organization-data"
import { pods } from "@/lib/pod-data"
import { cn } from "@/lib/utils"

type StatusFilter = "all" | "active" | "trial" | "suspended"

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

function VelocityIcon({ dir }: { dir: string }) {
  if (dir === "up") return <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />
  if (dir === "down") return <TrendingDown className="h-3.5 w-3.5 text-red-400" />
  return <Minus className="h-3.5 w-3.5 text-muted-foreground" />
}

export default function SuperAdminDashboard() {
  const router = useRouter()
  const [filter, setFilter] = useState<StatusFilter>("all")

  const totalMRR = getTotalMRR()
  const totalDevs = getTotalActiveDevelopers()
  const atRiskPods = pods.filter((p) => p.healthScore < 60).length
  const totalOrgs = organizations.length

  const filtered = organizations.filter(
    (o) => filter === "all" || o.status === filter
  )

  const stats = [
    {
      label: "Organizations",
      value: totalOrgs,
      icon: Building2,
      sub: `${organizations.filter((o) => o.status === "active").length} active`,
    },
    {
      label: "Active Developers",
      value: totalDevs,
      icon: Users,
      sub: "across all orgs",
    },
    {
      label: "Monthly Revenue",
      value: `$${totalMRR.toLocaleString()}`,
      icon: DollarSign,
      sub: "active subscriptions",
    },
    {
      label: "At-Risk Pods",
      value: atRiskPods,
      icon: AlertTriangle,
      sub: "health score < 60",
      accent: atRiskPods > 0,
    },
  ]

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6 lg:p-8">
      {/* Header */}
      <div>
        <h1 className="text-balance text-lg font-semibold text-foreground md:text-xl">
          Command Center
        </h1>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Platform-wide view across all organizations.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map((s) => {
          const Icon = s.icon
          return (
            <Card key={s.label} className={cn("border-border bg-card", s.accent && "border-red-500/30")}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-[11px] font-medium text-muted-foreground">{s.label}</p>
                    <p className={cn("mt-1 text-xl font-bold text-foreground", s.accent && "text-red-400")}>
                      {s.value}
                    </p>
                    <p className="mt-0.5 text-[10px] text-muted-foreground">{s.sub}</p>
                  </div>
                  <div className={cn("rounded-md p-1.5", s.accent ? "bg-red-500/10" : "bg-muted")}>
                    <Icon className={cn("h-4 w-4", s.accent ? "text-red-400" : "text-muted-foreground")} />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Organizations table */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-sm font-semibold text-foreground">Organizations</h2>
          {/* Filter pills */}
          <div className="flex items-center gap-1">
            {(["all", "active", "trial", "suspended"] as StatusFilter[]).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  "rounded-full px-2.5 py-1 text-[11px] font-medium capitalize transition-colors",
                  filter === f
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                )}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <Card className="border-border bg-card">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Organization
                    </th>
                    <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Plan
                    </th>
                    <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Status
                    </th>
                    <th className="px-4 py-3 text-center text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Pods
                    </th>
                    <th className="px-4 py-3 text-center text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Devs
                    </th>
                    <th className="px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                      MRR
                    </th>
                    <th className="px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Seats
                    </th>
                    <th className="w-10 px-4 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((org, i) => (
                    <tr
                      key={org.id}
                      onClick={() => router.push(`/super-admin/org/${org.slug}`)}
                      className={cn(
                        "cursor-pointer border-b border-border/50 transition-colors last:border-0 hover:bg-muted/30",
                        i % 2 === 1 && "bg-muted/10"
                      )}
                    >
                      {/* Org name */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-primary/10 text-[10px] font-bold text-primary">
                            {org.logoInitials}
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-foreground">{org.name}</p>
                            <p className="text-[10px] text-muted-foreground">{org.adminEmail}</p>
                          </div>
                        </div>
                      </td>
                      {/* Plan */}
                      <td className="px-4 py-3">
                        <span className={cn("rounded-full px-2 py-0.5 text-[11px] font-semibold", planColors[org.plan])}>
                          {org.plan}
                        </span>
                      </td>
                      {/* Status */}
                      <td className="px-4 py-3">
                        <span className={cn("flex w-fit items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-semibold capitalize", statusColors[org.status])}>
                          <span className={cn("h-1.5 w-1.5 rounded-full", statusDots[org.status])} />
                          {org.status}
                        </span>
                      </td>
                      {/* Pods */}
                      <td className="px-4 py-3 text-center text-xs text-foreground">
                        {org.podSlugs.length}
                      </td>
                      {/* Devs */}
                      <td className="px-4 py-3 text-center text-xs text-foreground">
                        {org.developerSlugs.length}
                      </td>
                      {/* MRR */}
                      <td className="px-4 py-3 text-right text-xs font-medium text-foreground">
                        {org.mrr > 0 ? `$${org.mrr.toLocaleString()}` : <span className="text-muted-foreground">—</span>}
                      </td>
                      {/* Seats */}
                      <td className="px-4 py-3 text-right text-xs text-muted-foreground">
                        {org.seatsUsed}/{org.seats}
                      </td>
                      {/* Arrow */}
                      <td className="px-4 py-3 text-right">
                        <ArrowUpRight className="inline h-3.5 w-3.5 text-muted-foreground" />
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={8} className="px-4 py-8 text-center text-xs text-muted-foreground">
                        No organizations match this filter.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
