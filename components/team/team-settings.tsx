"use client"

import { useState } from "react"
import Link from "next/link"
import { Plus, Trash2, ExternalLink, Save, X, AlertTriangle, Pencil, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import type { Team } from "@/lib/team-data"
import { developers as allDevelopers } from "@/lib/developer-data"
import { pods as allPods } from "@/lib/pod-data"

function healthColor(score: number) {
  if (score >= 80) return "bg-emerald-400"
  if (score >= 60) return "bg-amber-400"
  return "bg-red-400"
}

function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
}

export function TeamSettings({ team }: { team: Team }) {
  // Identity
  const [isEditingIdentity, setIsEditingIdentity] = useState(false)
  const [teamName, setTeamName] = useState(team.name)
  const [description, setDescription] = useState(team.description ?? "")
  const [savedIdentity, setSavedIdentity] = useState(false)

  // Members & projects state
  const [devSlugs, setDevSlugs] = useState<string[]>(team.developerSlugs)
  const [podSlugs, setPodSlugs] = useState<string[]>(team.podSlugs)

  // Add panels
  const [showAddDev, setShowAddDev] = useState(false)
  const [showAddPod, setShowAddPod] = useState(false)

  // Confirmation modal state
  const [confirmRemoveDev, setConfirmRemoveDev] = useState<string | null>(null)
  const [confirmRemovePod, setConfirmRemovePod] = useState<string | null>(null)
  const [confirmDeleteTeam, setConfirmDeleteTeam] = useState(false)

  // Resolved objects
  const currentDevs = devSlugs
    .map((s) => allDevelopers.find((d) => d.slug === s))
    .filter(Boolean) as typeof allDevelopers

  const currentPods = podSlugs
    .map((s) => allPods.find((p) => p.slug === s))
    .filter(Boolean) as typeof allPods

  const availableDevs = allDevelopers.filter((d) => !devSlugs.includes(d.slug))
  const availablePods = allPods.filter((p) => !podSlugs.includes(p.slug))

  // Actions
  const addDev = (slug: string) => {
    setDevSlugs((prev) => [...prev, slug])
  }

  const removeDev = (slug: string) => {
    setDevSlugs((prev) => prev.filter((s) => s !== slug))
    setConfirmRemoveDev(null)
  }

  const addPod = (slug: string) => {
    setPodSlugs((prev) => [...prev, slug])
  }

  const removePod = (slug: string) => {
    setPodSlugs((prev) => prev.filter((s) => s !== slug))
    setConfirmRemovePod(null)
  }

  const handleSaveIdentity = () => {
    setIsEditingIdentity(false)
    setSavedIdentity(true)
    setTimeout(() => setSavedIdentity(false), 2500)
  }

  const handleCancelIdentity = () => {
    setTeamName(team.name)
    setDescription(team.description ?? "")
    setIsEditingIdentity(false)
  }

  const devToRemove = confirmRemoveDev ? allDevelopers.find((d) => d.slug === confirmRemoveDev) : null
  const podToRemove = confirmRemovePod ? allPods.find((p) => p.slug === confirmRemovePod) : null

  return (
    <div className="flex flex-col gap-6">

      {/* ── Team Identity ── */}
      <Card className="border-border bg-card">
        <CardContent className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-foreground">Team Identity</h3>
            <div className="flex items-center gap-2">
              {savedIdentity && (
                <span className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400">
                  <Check className="h-3 w-3" /> Saved
                </span>
              )}
              {!isEditingIdentity ? (
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-7 gap-1.5 px-2 text-xs text-muted-foreground hover:text-foreground"
                  onClick={() => setIsEditingIdentity(true)}
                >
                  <Pencil className="h-3.5 w-3.5" />
                  Edit
                </Button>
              ) : (
                <div className="flex items-center gap-1.5">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 gap-1 px-2 text-xs text-muted-foreground hover:text-foreground"
                    onClick={handleCancelIdentity}
                  >
                    <X className="h-3.5 w-3.5" />
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    className="h-7 gap-1.5 px-3 text-xs"
                    onClick={handleSaveIdentity}
                  >
                    <Save className="h-3.5 w-3.5" />
                    Save Changes
                  </Button>
                </div>
              )}
            </div>
          </div>

          {isEditingIdentity ? (
            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="flex-1 space-y-1.5">
                <Label htmlFor="team-name" className="text-xs text-muted-foreground">Team Name</Label>
                <Input
                  id="team-name"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  className="border-border bg-background text-foreground"
                  autoFocus
                />
              </div>
              <div className="flex-1 space-y-1.5">
                <Label htmlFor="team-desc" className="text-xs text-muted-foreground">Description</Label>
                <Input
                  id="team-desc"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Optional short description…"
                  className="border-border bg-background text-foreground placeholder:text-muted-foreground"
                />
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-1">
              <p className="text-sm font-medium text-foreground">{teamName}</p>
              {description ? (
                <p className="text-xs text-muted-foreground">{description}</p>
              ) : (
                <p className="text-xs italic text-muted-foreground/50">No description set</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* ── Team Members ── */}
      <Card className="border-border bg-card">
        <CardContent className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-foreground">
              Team Members
              <span className="ml-2 rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                {currentDevs.length}
              </span>
            </h3>
            <Button
              size="sm"
              variant="outline"
              className="gap-1.5 border-border text-xs"
              onClick={() => { setShowAddDev((v) => !v); setShowAddPod(false) }}
            >
              {showAddDev ? <X className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
              {showAddDev ? "Close" : "Add Developer"}
            </Button>
          </div>

          {/* Add developer panel */}
          {showAddDev && (
            <div className="mb-4 rounded-lg border border-dashed border-primary/40 bg-muted/20 p-3">
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Available Developers
              </p>
              {availableDevs.length === 0 ? (
                <p className="py-2 text-center text-xs text-muted-foreground">
                  All developers are already assigned to this team.
                </p>
              ) : (
                <div className="flex flex-col gap-1.5">
                  {availableDevs.map((dev) => (
                    <button
                      key={dev.slug}
                      type="button"
                      onClick={() => addDev(dev.slug)}
                      className="flex w-full items-center gap-3 rounded-md border border-border bg-background px-3 py-2 text-left transition-colors hover:border-primary/50 hover:bg-primary/5"
                    >
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[11px] font-bold text-primary">
                        {dev.avatar || getInitials(dev.name)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-medium text-foreground">{dev.name}</p>
                        <p className="text-[10px] text-muted-foreground">{dev.role} · {dev.totalAllocation}% allocated</p>
                      </div>
                      <span className="flex items-center gap-1 rounded-md bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                        <Plus className="h-2.5 w-2.5" /> Add
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Current members */}
          <div className="flex flex-col gap-1.5">
            {currentDevs.length === 0 ? (
              <p className="rounded-lg border border-dashed border-border py-6 text-center text-xs text-muted-foreground">
                No developers assigned yet. Click "Add Developer" to get started.
              </p>
            ) : (
              currentDevs.map((dev) => (
                <div
                  key={dev.slug}
                  className="flex items-center gap-3 rounded-md border border-border bg-background px-3 py-2.5"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[11px] font-bold text-primary">
                    {dev.avatar || getInitials(dev.name)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-semibold text-foreground">{dev.name}</p>
                    <p className="text-[10px] text-muted-foreground">{dev.role} · {dev.totalAllocation}% allocated</p>
                  </div>
                  <Link
                    href={`/developers/${dev.slug}`}
                    className="shrink-0 text-muted-foreground hover:text-foreground"
                    aria-label={`View ${dev.name}`}
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                  </Link>
                  <button
                    type="button"
                    onClick={() => setConfirmRemoveDev(dev.slug)}
                    className="shrink-0 text-muted-foreground transition-colors hover:text-red-500"
                    aria-label={`Remove ${dev.name}`}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* ── Projects ── */}
      <Card className="border-border bg-card">
        <CardContent className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-foreground">
              Projects
              <span className="ml-2 rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                {currentPods.length}
              </span>
            </h3>
            <Button
              size="sm"
              variant="outline"
              className="gap-1.5 border-border text-xs"
              onClick={() => { setShowAddPod((v) => !v); setShowAddDev(false) }}
            >
              {showAddPod ? <X className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
              {showAddPod ? "Close" : "Add Project"}
            </Button>
          </div>

          {/* Add project panel */}
          {showAddPod && (
            <div className="mb-4 rounded-lg border border-dashed border-primary/40 bg-muted/20 p-3">
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Available Projects
              </p>
              {availablePods.length === 0 ? (
                <p className="py-2 text-center text-xs text-muted-foreground">
                  All projects are already assigned to this team.
                </p>
              ) : (
                <div className="flex flex-col gap-1.5">
                  {availablePods.map((pod) => (
                    <button
                      key={pod.slug}
                      type="button"
                      onClick={() => addPod(pod.slug)}
                      className="flex w-full items-center gap-3 rounded-md border border-border bg-background px-3 py-2 text-left transition-colors hover:border-primary/50 hover:bg-primary/5"
                    >
                      <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${healthColor(pod.healthScore)}`} />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-medium text-foreground">{pod.name}</p>
                        <p className="text-[10px] text-muted-foreground">{pod.client} · {pod.sprint}</p>
                      </div>
                      <span className="flex items-center gap-1 rounded-md bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                        <Plus className="h-2.5 w-2.5" /> Add
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Current projects */}
          <div className="flex flex-col gap-1.5">
            {currentPods.length === 0 ? (
              <p className="rounded-lg border border-dashed border-border py-6 text-center text-xs text-muted-foreground">
                No projects assigned yet. Click "Add Project" to get started.
              </p>
            ) : (
              currentPods.map((pod) => (
                <div
                  key={pod.slug}
                  className="flex items-center gap-3 rounded-md border border-border bg-background px-3 py-2.5"
                >
                  <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${healthColor(pod.healthScore)}`} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-semibold text-foreground">{pod.name}</p>
                    <p className="text-[10px] text-muted-foreground">{pod.client} · {pod.sprint}</p>
                  </div>
                  <Link
                    href={`/pod/${pod.slug}`}
                    className="shrink-0 text-muted-foreground hover:text-foreground"
                    aria-label={`Open ${pod.name}`}
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                  </Link>
                  <button
                    type="button"
                    onClick={() => setConfirmRemovePod(pod.slug)}
                    className="shrink-0 text-muted-foreground transition-colors hover:text-red-500"
                    aria-label={`Remove ${pod.name}`}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* ── Danger Zone ── */}
      <Card className="border-red-200 bg-card dark:border-red-900/40">
        <CardContent className="p-5">
          <h3 className="mb-1 text-sm font-semibold text-red-600 dark:text-red-400">Danger Zone</h3>
          <p className="mb-4 text-xs text-muted-foreground">
            Deleting a team removes the grouping only — all developers and projects remain untouched.
          </p>
          <Button
            size="sm"
            variant="outline"
            className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 dark:border-red-900/40 dark:text-red-400 dark:hover:bg-red-950/20"
            onClick={() => setConfirmDeleteTeam(true)}
          >
            Delete Team
          </Button>
        </CardContent>
      </Card>

      {/* ── Confirm remove developer ── */}
      <Dialog open={!!confirmRemoveDev} onOpenChange={() => setConfirmRemoveDev(null)}>
        <DialogContent className="max-w-sm bg-card">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-foreground">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              Remove Developer
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Are you sure you want to remove{" "}
            <span className="font-semibold text-foreground">{devToRemove?.name}</span> from{" "}
            <span className="font-semibold text-foreground">{teamName}</span>? They will remain in the system — only their team membership is removed.
          </p>
          <DialogFooter className="gap-2">
            <Button size="sm" variant="outline" className="border-border" onClick={() => setConfirmRemoveDev(null)}>
              Cancel
            </Button>
            <Button
              size="sm"
              className="bg-red-600 text-white hover:bg-red-700"
              onClick={() => confirmRemoveDev && removeDev(confirmRemoveDev)}
            >
              Remove
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Confirm remove project ── */}
      <Dialog open={!!confirmRemovePod} onOpenChange={() => setConfirmRemovePod(null)}>
        <DialogContent className="max-w-sm bg-card">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-foreground">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              Remove Project
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Are you sure you want to remove{" "}
            <span className="font-semibold text-foreground">{podToRemove?.name}</span> from{" "}
            <span className="font-semibold text-foreground">{teamName}</span>? The project itself will not be deleted.
          </p>
          <DialogFooter className="gap-2">
            <Button size="sm" variant="outline" className="border-border" onClick={() => setConfirmRemovePod(null)}>
              Cancel
            </Button>
            <Button
              size="sm"
              className="bg-red-600 text-white hover:bg-red-700"
              onClick={() => confirmRemovePod && removePod(confirmRemovePod)}
            >
              Remove
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Confirm delete team ── */}
      <Dialog open={confirmDeleteTeam} onOpenChange={setConfirmDeleteTeam}>
        <DialogContent className="max-w-sm bg-card">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600 dark:text-red-400">
              <AlertTriangle className="h-4 w-4" />
              Delete Team
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Are you sure you want to permanently delete{" "}
            <span className="font-semibold text-foreground">{teamName}</span>? This action cannot be undone. All developers and projects will remain unaffected.
          </p>
          <DialogFooter className="gap-2">
            <Button size="sm" variant="outline" className="border-border" onClick={() => setConfirmDeleteTeam(false)}>
              Cancel
            </Button>
            <Button
              size="sm"
              className="bg-red-600 text-white hover:bg-red-700"
              onClick={() => setConfirmDeleteTeam(false)}
            >
              Delete Team
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
