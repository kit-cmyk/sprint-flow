"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  FileText,
  Plus,
  Search,
  ArrowLeft,
  Send,
  Eye,
  Pencil,
  Trash2,
} from "lucide-react"
import { poSession } from "@/lib/session-data"
import { pods } from "@/lib/pod-data"

const assignedPods = pods.filter((p) =>
  poSession.assignedPodSlugs?.includes(p.slug)
)

type PulseStatus = "draft" | "published"

interface PulseCheck {
  id: string
  podSlug: string
  podName: string
  sprint: string
  status: PulseStatus
  date: string
  summary: string
  highlights: string
  risks: string
  mood: "positive" | "neutral" | "concerning"
}

const moodColors: Record<PulseCheck["mood"], string> = {
  positive: "bg-emerald-500/10 text-emerald-400",
  neutral: "bg-amber-500/10 text-amber-400",
  concerning: "bg-red-500/10 text-red-400",
}

const initialPulses: PulseCheck[] = [
  {
    id: "pc-1",
    podSlug: "momentum-pod",
    podName: "Momentum Pod",
    sprint: "Sprint 14",
    status: "published",
    date: "Mar 4, 2025",
    summary: "Strong sprint with 92% ticket completion. Team morale is high and client is satisfied with delivery pace.",
    highlights: "Completed the checkout flow redesign ahead of schedule. Zero critical bugs in production.",
    risks: "Integration with payment gateway still pending sign-off from client.",
    mood: "positive",
  },
  {
    id: "pc-2",
    podSlug: "velocity-pod",
    podName: "Velocity Pod",
    sprint: "Sprint 14",
    status: "draft",
    date: "Mar 3, 2025",
    summary: "Mid-sprint check — team is on track but one senior dev is out sick this week.",
    highlights: "Auth module unit tests passing at 98% coverage.",
    risks: "Sick leave may impact sprint commitment. Blocker on API schema from third-party vendor.",
    mood: "neutral",
  },
  {
    id: "pc-3",
    podSlug: "momentum-pod",
    podName: "Momentum Pod",
    sprint: "Sprint 13",
    status: "published",
    date: "Feb 18, 2025",
    summary: "Sprint 13 closed with 87% completion. Minor velocity dip due to scope change mid-sprint.",
    highlights: "Dashboard v2 shipped to staging. Positive client feedback on UI.",
    risks: "Scope changes are becoming a pattern — need to reinforce sprint freeze policy.",
    mood: "neutral",
  },
]

export default function POPulsePage() {
  const [pulses, setPulses] = useState<PulseCheck[]>(initialPulses)
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState<"all" | PulseStatus>("all")
  const [createOpen, setCreateOpen] = useState(false)
  const [viewTarget, setViewTarget] = useState<PulseCheck | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)

  // Form state
  const [form, setForm] = useState({
    podSlug: assignedPods[0]?.slug ?? "",
    sprint: "Sprint 14",
    summary: "",
    highlights: "",
    risks: "",
    mood: "neutral" as PulseCheck["mood"],
  })

  const filtered = pulses.filter((p) => {
    const matchSearch = p.podName.toLowerCase().includes(search.toLowerCase()) ||
      p.sprint.toLowerCase().includes(search.toLowerCase()) ||
      p.summary.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === "all" || p.status === filter
    return matchSearch && matchFilter
  })

  const handleCreate = (status: PulseStatus) => {
    const pod = assignedPods.find((p) => p.slug === form.podSlug)
    const newPulse: PulseCheck = {
      id: `pc-${Date.now()}`,
      podSlug: form.podSlug,
      podName: pod?.name ?? "",
      sprint: form.sprint,
      status,
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      summary: form.summary,
      highlights: form.highlights,
      risks: form.risks,
      mood: form.mood,
    }
    setPulses((prev) => [newPulse, ...prev])
    setForm({ podSlug: assignedPods[0]?.slug ?? "", sprint: "Sprint 14", summary: "", highlights: "", risks: "", mood: "neutral" })
    setCreateOpen(false)
  }

  const handlePublish = (id: string) => {
    setPulses((prev) => prev.map((p) => p.id === id ? { ...p, status: "published" } : p))
  }

  const handleDelete = (id: string) => {
    setPulses((prev) => prev.filter((p) => p.id !== id))
    setDeleteTarget(null)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1 px-4 py-6 md:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href="/po" className="rounded p-1 text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <div>
              <h1 className="text-balance text-lg font-semibold text-foreground">Pulse Checks</h1>
              <p className="mt-0.5 text-xs text-muted-foreground">Create and publish sprint pulse reports for your pods</p>
            </div>
          </div>
          <Button size="sm" className="shrink-0 gap-1.5 text-xs" onClick={() => setCreateOpen(true)}>
            <Plus className="h-3.5 w-3.5" />
            New Pulse Check
          </Button>
        </div>

        {/* Filters */}
        <div className="mb-5 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search pulses..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-8 border-border bg-background pl-8 text-xs"
            />
          </div>
          <div className="flex items-center gap-1 rounded-lg border border-border bg-card p-1">
            {(["all", "draft", "published"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`rounded px-3 py-1 text-xs font-medium capitalize transition-colors ${
                  filter === f ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Pulse list */}
        <div className="flex flex-col gap-3">
          {filtered.length === 0 && (
            <div className="flex flex-col items-center gap-2 py-16 text-center">
              <FileText className="h-8 w-8 text-muted-foreground/40" />
              <p className="text-sm text-muted-foreground">No pulse checks found</p>
            </div>
          )}
          {filtered.map((pulse) => (
            <Card key={pulse.id} className="border-border bg-card">
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-semibold text-foreground">{pulse.podName}</p>
                        <span className="text-xs text-muted-foreground">&mdash; {pulse.sprint}</span>
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize ${
                          pulse.status === "published" ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-400"
                        }`}>{pulse.status}</span>
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize ${moodColors[pulse.mood]}`}>{pulse.mood}</span>
                      </div>
                      <p className="mt-1 text-[11px] text-muted-foreground">{pulse.date}</p>
                      <p className="mt-2 line-clamp-2 text-xs text-muted-foreground">{pulse.summary}</p>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-1">
                    <button
                      onClick={() => setViewTarget(pulse)}
                      className="rounded p-1.5 text-muted-foreground transition-colors hover:text-foreground"
                      title="View"
                    >
                      <Eye className="h-3.5 w-3.5" />
                    </button>
                    {pulse.status === "draft" && (
                      <button
                        onClick={() => handlePublish(pulse.id)}
                        className="rounded p-1.5 text-muted-foreground transition-colors hover:text-emerald-400"
                        title="Publish"
                      >
                        <Send className="h-3.5 w-3.5" />
                      </button>
                    )}
                    <button
                      onClick={() => setDeleteTarget(pulse.id)}
                      className="rounded p-1.5 text-muted-foreground transition-colors hover:text-destructive"
                      title="Delete"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>

      <footer className="border-t border-border px-4 py-3 md:px-6 lg:px-8">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Assembled Systems v2.4.1</span>
          <span>Last synced: 2 min ago</span>
        </div>
      </footer>

      {/* Create Dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-w-lg bg-card">
          <DialogHeader>
            <DialogTitle className="text-foreground">New Pulse Check</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-1">
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs text-muted-foreground">Pod</Label>
                <Select value={form.podSlug} onValueChange={(v) => setForm((f) => ({ ...f, podSlug: v }))}>
                  <SelectTrigger className="h-8 border-border bg-background text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {assignedPods.map((p) => (
                      <SelectItem key={p.slug} value={p.slug} className="text-xs">{p.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs text-muted-foreground">Sprint</Label>
                <Input
                  value={form.sprint}
                  onChange={(e) => setForm((f) => ({ ...f, sprint: e.target.value }))}
                  className="h-8 border-border bg-background text-xs"
                  placeholder="Sprint 14"
                />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs text-muted-foreground">Overall Mood</Label>
              <div className="flex gap-2">
                {(["positive", "neutral", "concerning"] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => setForm((f) => ({ ...f, mood: m }))}
                    className={`flex-1 rounded-lg border px-3 py-1.5 text-xs font-medium capitalize transition-colors ${
                      form.mood === m
                        ? m === "positive" ? "border-emerald-500 bg-emerald-500/10 text-emerald-400"
                          : m === "neutral" ? "border-amber-500 bg-amber-500/10 text-amber-400"
                          : "border-red-500 bg-red-500/10 text-red-400"
                        : "border-border text-muted-foreground hover:border-border/80"
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs text-muted-foreground">Summary</Label>
              <Textarea
                value={form.summary}
                onChange={(e) => setForm((f) => ({ ...f, summary: e.target.value }))}
                placeholder="Overall sprint summary..."
                className="min-h-[70px] resize-none border-border bg-background text-xs"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs text-muted-foreground">Highlights</Label>
              <Textarea
                value={form.highlights}
                onChange={(e) => setForm((f) => ({ ...f, highlights: e.target.value }))}
                placeholder="Key wins and achievements..."
                className="min-h-[60px] resize-none border-border bg-background text-xs"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs text-muted-foreground">Risks & Blockers</Label>
              <Textarea
                value={form.risks}
                onChange={(e) => setForm((f) => ({ ...f, risks: e.target.value }))}
                placeholder="Current risks or blockers..."
                className="min-h-[60px] resize-none border-border bg-background text-xs"
              />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" size="sm" onClick={() => setCreateOpen(false)}>Cancel</Button>
            <Button variant="outline" size="sm" onClick={() => handleCreate("draft")}>
              <Pencil className="mr-1.5 h-3.5 w-3.5" />
              Save Draft
            </Button>
            <Button size="sm" onClick={() => handleCreate("published")} disabled={!form.summary.trim()}>
              <Send className="mr-1.5 h-3.5 w-3.5" />
              Publish
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      {viewTarget && (
        <Dialog open onOpenChange={() => setViewTarget(null)}>
          <DialogContent className="max-w-lg bg-card">
            <DialogHeader>
              <DialogTitle className="text-foreground">
                {viewTarget.podName} &mdash; {viewTarget.sprint}
              </DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-4 py-1">
              <div className="flex items-center gap-2">
                <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold capitalize ${
                  viewTarget.status === "published" ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-400"
                }`}>{viewTarget.status}</span>
                <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold capitalize ${moodColors[viewTarget.mood]}`}>{viewTarget.mood}</span>
                <span className="text-[11px] text-muted-foreground">{viewTarget.date}</span>
              </div>
              {[
                { label: "Summary", value: viewTarget.summary },
                { label: "Highlights", value: viewTarget.highlights },
                { label: "Risks & Blockers", value: viewTarget.risks },
              ].map((s) => (
                <div key={s.label}>
                  <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{s.label}</p>
                  <p className="text-xs text-foreground">{s.value}</p>
                </div>
              ))}
            </div>
            <DialogFooter>
              <Button variant="outline" size="sm" onClick={() => setViewTarget(null)}>Close</Button>
              {viewTarget.status === "draft" && (
                <Button size="sm" onClick={() => { handlePublish(viewTarget.id); setViewTarget(null) }}>
                  <Send className="mr-1.5 h-3.5 w-3.5" />
                  Publish
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Confirm */}
      <Dialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <DialogContent className="max-w-sm bg-card">
          <DialogHeader>
            <DialogTitle className="text-foreground">Delete Pulse Check</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">Are you sure you want to delete this pulse check? This cannot be undone.</p>
          <DialogFooter className="gap-2">
            <Button variant="outline" size="sm" onClick={() => setDeleteTarget(null)}>Cancel</Button>
            <Button variant="destructive" size="sm" onClick={() => deleteTarget && handleDelete(deleteTarget)}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
