"use client"

import { useState } from "react"
import { AlertTriangle, Info, Settings2, Check } from "lucide-react"
import type { Team } from "@/lib/team-data"
import { buildAllocationMatrix } from "@/lib/team-data"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

function AllocationBadge({ pct }: { pct: number }) {
  if (pct === 0)
    return <span className="text-xs text-muted-foreground/40">—</span>
  const color =
    pct >= 50
      ? "bg-primary/15 text-primary"
      : pct >= 20
      ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
      : "bg-muted text-muted-foreground"

  return (
    <span
      className={`inline-flex items-center justify-center rounded-md px-2 py-0.5 text-xs font-semibold tabular-nums ${color}`}
    >
      {pct}%
    </span>
  )
}

/** Inline WIP limit popover — used for both pod columns and developer rows */
function WipLimitPopover({
  label,
  current,
  limit,
  onSave,
}: {
  label: string
  current: number
  limit: number | null
  onSave: (val: number | null) => void
}) {
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState(limit !== null ? String(limit) : "")

  const handleSave = () => {
    const parsed = parseInt(draft, 10)
    onSave(isNaN(parsed) || parsed <= 0 ? null : parsed)
    setOpen(false)
  }

  const handleClear = () => {
    setDraft("")
    onSave(null)
    setOpen(false)
  }

  const isBreached = limit !== null && current > limit

  return (
    <Popover open={open} onOpenChange={(o) => { setOpen(o); if (o) setDraft(limit !== null ? String(limit) : "") }}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={`inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-medium transition-colors ${
            isBreached
              ? "bg-red-100 text-red-600 dark:bg-red-950/40 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-950/60"
              : limit !== null
              ? "bg-muted text-muted-foreground hover:bg-muted/80"
              : "text-muted-foreground/50 hover:text-muted-foreground"
          }`}
          aria-label={`Configure WIP limit for ${label}`}
        >
          {limit !== null ? (
            <>
              {isBreached && <AlertTriangle className="h-2.5 w-2.5" />}
              WIP {limit}
            </>
          ) : (
            <>
              <Settings2 className="h-2.5 w-2.5" />
              WIP
            </>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-3" align="center" side="bottom">
        <div className="flex flex-col gap-3">
          <div>
            <p className="text-xs font-semibold text-foreground">{label}</p>
            <p className="text-[11px] text-muted-foreground">
              {current} active · set max simultaneous items
            </p>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="wip-input" className="text-[11px] text-muted-foreground">
              WIP Limit
            </Label>
            <Input
              id="wip-input"
              type="number"
              min={1}
              max={99}
              placeholder="No limit"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSave()}
              className="h-7 text-xs"
            />
          </div>
          {isBreached && limit !== null && (
            <p className="text-[11px] text-red-500">
              Limit breached — {current} exceeds max of {limit}.
            </p>
          )}
          <div className="flex gap-2">
            <Button size="sm" className="h-7 flex-1 text-xs gap-1" onClick={handleSave}>
              <Check className="h-3 w-3" />
              Apply
            </Button>
            {limit !== null && (
              <Button size="sm" variant="ghost" className="h-7 text-xs text-muted-foreground" onClick={handleClear}>
                Clear
              </Button>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

export function TeamAllocationMatrix({ team }: { team: Team }) {
  const { developers, pods, cells } = buildAllocationMatrix(team)

  /** WIP limits keyed by pod slug — max developers active on that pod */
  const [podWipLimits, setPodWipLimits] = useState<Record<string, number | null>>({})
  /** WIP limits keyed by dev slug — max pods a developer is active on */
  const [devWipLimits, setDevWipLimits] = useState<Record<string, number | null>>({})

  const getCell = (devSlug: string, podSlug: string): number =>
    cells.find((c) => c.devSlug === devSlug && c.podSlug === podSlug)?.percentage ?? 0

  /** Number of developers with >0% allocation on a pod */
  const podActiveCounts = Object.fromEntries(
    pods.map((pod) => [
      pod.slug,
      cells.filter((c) => c.podSlug === pod.slug && c.percentage > 0).length,
    ])
  )

  /** Number of pods a developer is active on (>0%) */
  const devActivePodCounts = Object.fromEntries(
    developers.map((dev) => [
      dev.slug,
      cells.filter((c) => c.devSlug === dev.slug && c.percentage > 0).length,
    ])
  )

  /** Total allocation % for each developer */
  const devTotals = Object.fromEntries(
    developers.map((dev) => [
      dev.slug,
      cells.filter((c) => c.devSlug === dev.slug).reduce((s, c) => s + c.percentage, 0),
    ])
  )

  const anyWipBreached =
    pods.some((p) => {
      const lim = podWipLimits[p.slug]
      return lim !== null && lim !== undefined && podActiveCounts[p.slug] > lim
    }) ||
    developers.some((d) => {
      const lim = devWipLimits[d.slug]
      return lim !== null && lim !== undefined && devActivePodCounts[d.slug] > lim
    })

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold text-foreground">Allocation Matrix</h2>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Shows how each developer's capacity is distributed across this team's projects. Use the{" "}
            <span className="font-medium text-foreground">WIP Limit</span> column or pod header to configure max concurrent assignments.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-2.5 w-2.5 rounded-sm bg-primary/15" />
            High (&ge;50%)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-2.5 w-2.5 rounded-sm bg-amber-500/10" />
            Partial (20–49%)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-2.5 w-2.5 rounded-sm bg-muted" />
            Low (&lt;20%)
          </span>
        </div>
      </div>

      {developers.length === 0 || pods.length === 0 ? (
        <div className="flex items-center justify-center gap-2 rounded-lg border border-dashed border-border py-8 text-center text-xs text-muted-foreground">
          <Info className="h-4 w-4" />
          No developers or projects assigned to this team yet.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full min-w-[500px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Developer
                </th>

                {pods.map((pod) => {
                  const limit = podWipLimits[pod.slug] ?? null
                  const active = podActiveCounts[pod.slug]
                  const breached = limit !== null && active > limit
                  return (
                    <th
                      key={pod.slug}
                      className={`px-3 py-2.5 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground transition-colors ${
                        breached ? "bg-red-50 dark:bg-red-950/20" : ""
                      }`}
                    >
                      <div className="flex flex-col items-center gap-1">
                        <span className="max-w-[100px] truncate">{pod.name.replace(" Pod", "")}</span>
                        <span className="text-[10px] font-normal normal-case text-muted-foreground/60">
                          {pod.client}
                        </span>
                        <WipLimitPopover
                          label={pod.name}
                          current={active}
                          limit={limit}
                          onSave={(val) =>
                            setPodWipLimits((prev) => ({ ...prev, [pod.slug]: val }))
                          }
                        />
                      </div>
                    </th>
                  )
                })}

                <th className="px-3 py-2.5 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Total
                </th>
                <th className="px-3 py-2.5 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  WIP Limit
                </th>
              </tr>
            </thead>

            <tbody>
              {developers.map((dev, i) => {
                const total = devTotals[dev.slug] ?? 0
                const overAllocated = dev.totalAllocation > 100
                const devLimit = devWipLimits[dev.slug] ?? null
                const activePodCount = devActivePodCounts[dev.slug]
                const devWipBreached = devLimit !== null && activePodCount > devLimit

                return (
                  <tr
                    key={dev.slug}
                    className={`border-b border-border last:border-0 ${
                      i % 2 === 0 ? "bg-background" : "bg-muted/10"
                    }`}
                  >
                    {/* Developer info */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[11px] font-bold text-primary">
                          {dev.avatar}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-xs font-semibold text-foreground">{dev.name}</p>
                          <p className="text-[10px] text-muted-foreground">{dev.role}</p>
                        </div>
                      </div>
                    </td>

                    {/* Pod cells */}
                    {pods.map((pod) => {
                      const podLimit = podWipLimits[pod.slug] ?? null
                      const podBreached = podLimit !== null && podActiveCounts[pod.slug] > podLimit
                      return (
                        <td
                          key={pod.slug}
                          className={`px-3 py-3 text-center transition-colors ${
                            podBreached ? "bg-red-50/50 dark:bg-red-950/10" : ""
                          }`}
                        >
                          <AllocationBadge pct={getCell(dev.slug, pod.slug)} />
                        </td>
                      )
                    })}

                    {/* Total column */}
                    <td className="px-3 py-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <span
                          className={`text-xs font-bold tabular-nums ${
                            overAllocated ? "text-red-500" : "text-foreground"
                          }`}
                        >
                          {dev.totalAllocation}%
                        </span>
                        {overAllocated && (
                          <AlertTriangle className="h-3 w-3 shrink-0 text-red-500" />
                        )}
                      </div>
                    </td>

                    {/* WIP Limit column */}
                    <td className={`px-3 py-3 text-center transition-colors ${devWipBreached ? "bg-red-50/50 dark:bg-red-950/10" : ""}`}>
                      <div className="flex flex-col items-center gap-1">
                        <WipLimitPopover
                          label={`${dev.name}'s pods`}
                          current={activePodCount}
                          limit={devLimit}
                          onSave={(val) =>
                            setDevWipLimits((prev) => ({ ...prev, [dev.slug]: val }))
                          }
                        />
                        {devLimit !== null && (
                          <span className={`text-[10px] tabular-nums font-medium ${devWipBreached ? "text-red-500" : "text-muted-foreground"}`}>
                            {activePodCount}/{devLimit} pods
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Callouts */}
      {developers.some((d) => d.totalAllocation > 100) && (
        <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 dark:border-red-900/50 dark:bg-red-950/20">
          <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-red-500" />
          <p className="text-xs text-red-700 dark:text-red-400">
            One or more developers are over-allocated (&gt;100%). Review their project assignments to reduce context-switching and delivery risk.
          </p>
        </div>
      )}

      {anyWipBreached && (
        <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5 dark:border-amber-900/50 dark:bg-amber-950/20">
          <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-500" />
          <p className="text-xs text-amber-700 dark:text-amber-400">
            One or more WIP limits are breached. Consider rebalancing assignments to improve flow and reduce multitasking overhead.
          </p>
        </div>
      )}
    </div>
  )
}
