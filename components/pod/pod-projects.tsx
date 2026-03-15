"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  ExternalLink,
  Github,
  Plus,
  Pencil,
  Trash2,
  X,
  CheckCircle2,
  Clock,
  PauseCircle,
  Users,
  FolderKanban,
} from "lucide-react"
import type { PodData, PodProject, Client } from "@/lib/pod-data"

/* ── helpers ──────────────────────────────────────────────── */
const STATUS_CONFIG = {
  active: { label: "Active", icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-500/10" },
  "on-hold": { label: "On Hold", icon: PauseCircle, color: "text-amber-500", bg: "bg-amber-500/10" },
  completed: { label: "Completed", icon: Clock, color: "text-muted-foreground", bg: "bg-muted" },
} satisfies Record<PodProject["status"], { label: string; icon: React.ComponentType<{ className?: string }>; color: string; bg: string }>

function ClientBadge({ client }: { client: Client }) {
  return (
    <span className="inline-flex items-center rounded-full border border-border bg-muted px-2 py-0.5 text-[10px] font-medium text-foreground">
      {client.shortCode} · {client.name}
    </span>
  )
}

/* ── empty state ──────────────────────────────────────────── */
function EmptyProjects({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/20 py-16 text-center">
      <FolderKanban className="mb-3 h-10 w-10 text-muted-foreground/40" />
      <p className="text-sm font-semibold text-foreground">No projects yet</p>
      <p className="mt-1 max-w-xs text-xs text-muted-foreground">
        Add projects to this pod to track which clients and Jira boards the team is working on.
      </p>
      <Button size="sm" className="mt-4" onClick={onAdd}>
        <Plus className="mr-1.5 h-3.5 w-3.5" />
        Add Project
      </Button>
    </div>
  )
}

/* ── project form ─────────────────────────────────────────── */
interface ProjectFormProps {
  pod: PodData
  initial?: PodProject
  onSave: (project: PodProject) => void
  onCancel: () => void
}

const BLANK_PROJECT: Omit<PodProject, "id"> = {
  name: "",
  clientIds: [],
  jiraLink: "",
  jiraBoardKey: "",
  githubLink: "",
  allocationPct: 50,
  status: "active",
}

function ProjectForm({ pod, initial, onSave, onCancel }: ProjectFormProps) {
  const [form, setForm] = useState<Omit<PodProject, "id">>(
    initial
      ? { ...initial }
      : { ...BLANK_PROJECT }
  )

  function toggleClient(id: string) {
    setForm((f) => ({
      ...f,
      clientIds: f.clientIds.includes(id)
        ? f.clientIds.filter((c) => c !== id)
        : [...f.clientIds, id],
    }))
  }

  function handleSave() {
    if (!form.name.trim() || form.clientIds.length === 0) return
    onSave({
      id: initial?.id ?? `prj-${Date.now()}`,
      ...form,
    })
  }

  return (
    <div className="rounded-xl border border-primary/30 bg-primary/5 p-5">
      <div className="mb-4 flex items-center justify-between">
        <h4 className="text-sm font-semibold text-foreground">
          {initial ? "Edit Project" : "New Project"}
        </h4>
        <button
          type="button"
          onClick={onCancel}
          className="flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Project name */}
        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-muted-foreground">Project Name *</Label>
          <Input
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            placeholder="e.g. E-Commerce Core"
            className="border-border bg-background text-foreground"
          />
        </div>

        {/* Allocation */}
        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-muted-foreground">Pod Allocation %</Label>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              min={1}
              max={100}
              value={form.allocationPct}
              onChange={(e) => setForm((f) => ({ ...f, allocationPct: Number(e.target.value) }))}
              className="border-border bg-background text-foreground"
            />
            <span className="text-sm text-muted-foreground">%</span>
          </div>
        </div>

        {/* Jira link */}
        <div className="space-y-1.5">
          <Label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <ExternalLink className="h-3 w-3" /> Jira Board URL
          </Label>
          <Input
            value={form.jiraLink ?? ""}
            onChange={(e) => setForm((f) => ({ ...f, jiraLink: e.target.value }))}
            placeholder="https://org.atlassian.net/..."
            className="border-border bg-background text-foreground"
          />
        </div>

        {/* GitHub */}
        <div className="space-y-1.5">
          <Label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <Github className="h-3 w-3" /> GitHub Repository
          </Label>
          <Input
            value={form.githubLink ?? ""}
            onChange={(e) => setForm((f) => ({ ...f, githubLink: e.target.value }))}
            placeholder="https://github.com/org/repo"
            className="border-border bg-background text-foreground"
          />
        </div>

        {/* Status */}
        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-muted-foreground">Status</Label>
          <div className="flex gap-2">
            {(["active", "on-hold", "completed"] as PodProject["status"][]).map((s) => {
              const cfg = STATUS_CONFIG[s]
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, status: s }))}
                  className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                    form.status === s
                      ? `border-transparent ${cfg.bg} ${cfg.color}`
                      : "border-border text-muted-foreground hover:bg-muted"
                  }`}
                >
                  <cfg.icon className="h-3 w-3" />
                  {cfg.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Clients — full width */}
        <div className="space-y-2 sm:col-span-2">
          <Label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <Users className="h-3 w-3" /> Clients * <span className="text-muted-foreground/60">(select one or more)</span>
          </Label>
          <div className="flex flex-wrap gap-2">
            {pod.clients.map((client) => {
              const selected = form.clientIds.includes(client.id)
              return (
                <button
                  key={client.id}
                  type="button"
                  onClick={() => toggleClient(client.id)}
                  className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                    selected
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border text-muted-foreground hover:bg-muted"
                  }`}
                >
                  {selected && <CheckCircle2 className="h-3 w-3" />}
                  {client.shortCode} · {client.name}
                </button>
              )
            })}
          </div>
          {form.clientIds.length === 0 && (
            <p className="text-[11px] text-destructive">Select at least one client.</p>
          )}
        </div>
      </div>

      <div className="mt-5 flex justify-end gap-2">
        <Button variant="outline" size="sm" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          size="sm"
          onClick={handleSave}
          disabled={!form.name.trim() || form.clientIds.length === 0}
        >
          {initial ? "Save Changes" : "Add Project"}
        </Button>
      </div>
    </div>
  )
}

/* ── project card ─────────────────────────────────────────── */
function ProjectCard({
  project,
  pod,
  onEdit,
  onDelete,
}: {
  project: PodProject
  pod: PodData
  onEdit: () => void
  onDelete: () => void
}) {
  const cfg = STATUS_CONFIG[project.status]
  const Icon = cfg.icon
  const clients = project.clientIds
    .map((id) => pod.clients.find((c) => c.id === id))
    .filter(Boolean) as Client[]

  return (
    <Card className="border-border bg-card">
      <CardContent className="p-5">
        {/* Header row */}
        <div className="mb-3 flex items-start justify-between gap-3">
          <div className="flex flex-col gap-1.5">
            <h3 className="text-sm font-semibold text-foreground">{project.name}</h3>
            <div className="flex flex-wrap gap-1.5">
              {clients.map((c) => (
                <ClientBadge key={c.id} client={c} />
              ))}
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-1.5">
            <span className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-semibold ${cfg.bg} ${cfg.color}`}>
              <Icon className="h-3 w-3" />
              {cfg.label}
            </span>
            <button
              type="button"
              onClick={onEdit}
              className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
              aria-label="Edit project"
            >
              <Pencil className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={onDelete}
              className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
              aria-label="Remove project"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Allocation bar */}
        <div className="mb-3">
          <div className="mb-1 flex items-center justify-between text-[11px] text-muted-foreground">
            <span>Pod Allocation</span>
            <span className="font-medium text-foreground">{project.allocationPct}%</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{ width: `${project.allocationPct}%` }}
            />
          </div>
        </div>

        {/* Integration links */}
        <div className="flex flex-wrap gap-3">
          {project.jiraLink && (
            <a
              href={project.jiraLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-[11px] text-primary hover:underline"
            >
              <ExternalLink className="h-3 w-3" />
              {project.jiraBoardKey ? `Jira · ${project.jiraBoardKey}` : "Open Jira"}
            </a>
          )}
          {project.githubLink && (
            <a
              href={project.githubLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground hover:underline"
            >
              <Github className="h-3 w-3" />
              GitHub
            </a>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

/* ── main component ───────────────────────────────────────── */
export function PodProjects({ pod }: { pod: PodData }) {
  const [projects, setProjects] = useState<PodProject[]>(pod.projects)
  const [addingNew, setAddingNew] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  function handleAdd(project: PodProject) {
    setProjects((prev) => [...prev, project])
    setAddingNew(false)
  }

  function handleEdit(updated: PodProject) {
    setProjects((prev) => prev.map((p) => (p.id === updated.id ? updated : p)))
    setEditingId(null)
  }

  function handleDelete(id: string) {
    setProjects((prev) => prev.filter((p) => p.id !== id))
  }

  const totalAllocation = projects.reduce((sum, p) => sum + p.allocationPct, 0)

  return (
    <section className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Projects</h2>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {projects.length} project{projects.length !== 1 ? "s" : ""} · {totalAllocation}% total allocation
            {totalAllocation > 100 && (
              <span className="ml-2 text-destructive">(over 100% — review capacity)</span>
            )}
          </p>
        </div>
        {!addingNew && (
          <Button size="sm" onClick={() => setAddingNew(true)}>
            <Plus className="mr-1.5 h-3.5 w-3.5" />
            Add Project
          </Button>
        )}
      </div>

      {/* New project form */}
      {addingNew && (
        <ProjectForm
          pod={pod}
          onSave={handleAdd}
          onCancel={() => setAddingNew(false)}
        />
      )}

      {/* Project list */}
      {projects.length === 0 && !addingNew ? (
        <EmptyProjects onAdd={() => setAddingNew(true)} />
      ) : (
        <div className="flex flex-col gap-4">
          {projects.map((project) =>
            editingId === project.id ? (
              <ProjectForm
                key={project.id}
                pod={pod}
                initial={project}
                onSave={handleEdit}
                onCancel={() => setEditingId(null)}
              />
            ) : (
              <ProjectCard
                key={project.id}
                project={project}
                pod={pod}
                onEdit={() => setEditingId(project.id)}
                onDelete={() => handleDelete(project.id)}
              />
            )
          )}
        </div>
      )}
    </section>
  )
}
