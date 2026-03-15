"use client"

import { use, useState } from "react"
import { useRouter } from "next/navigation"
import { notFound } from "next/navigation"
import { getPodBySlug } from "@/lib/pod-data"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { RichTextEditor } from "@/components/ui/rich-text-editor"
import {
  ArrowLeft,
  Save,
  Send,
  CalendarClock,
  Sparkles,
  FileText,
  ChevronDown,
  Clock,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

type SaveState = "idle" | "saving" | "saved"

export default function NewPulsePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = use(params)
  const pod = getPodBySlug(slug)
  const router = useRouter()

  if (!pod) notFound()

  const [title, setTitle] = useState("")
  const [reportingWeek, setReportingWeek] = useState("")
  const [content, setContent] = useState("")
  const [saveState, setSaveState] = useState<SaveState>("idle")
  const [scheduleOpen, setScheduleOpen] = useState(false)
  const [scheduleDate, setScheduleDate] = useState("")
  const [scheduleTime, setScheduleTime] = useState("")

  const handleSaveDraft = () => {
    setSaveState("saving")
    setTimeout(() => {
      setSaveState("saved")
      setTimeout(() => setSaveState("idle"), 2000)
    }, 800)
  }

  const handlePublish = () => {
    router.push(`/pod/${slug}?tab=client-portal`)
  }

  const wordCount = content.replace(/<[^>]*>/g, "").trim().split(/\s+/).filter(Boolean).length

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* ── Top bar ─────────────────────────────────────────── */}
      <header className="sticky top-0 z-30 flex h-12 items-center justify-between border-b border-border bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/80 md:px-6">
        {/* Left: back + doc title */}
        <div className="flex min-w-0 items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 shrink-0 gap-1.5 px-2 text-xs text-muted-foreground hover:text-foreground"
            onClick={() => router.push(`/pod/${slug}`)}
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Back to {pod.name}</span>
          </Button>
          <div className="hidden h-4 w-px bg-border sm:block" />
          <div className="flex min-w-0 items-center gap-2">
            <FileText className="h-3.5 w-3.5 shrink-0 text-primary" />
            <span className="truncate text-sm font-medium text-foreground">
              {title || "Untitled Pulse Check"}
            </span>
            {saveState === "saving" && (
              <span className="hidden text-[11px] text-muted-foreground sm:inline">Saving…</span>
            )}
            {saveState === "saved" && (
              <span className="hidden text-[11px] text-emerald-500 sm:inline">Saved</span>
            )}
          </div>
        </div>

        {/* Right: actions */}
        <div className="flex shrink-0 items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 gap-1.5 px-2.5 text-xs"
            onClick={handleSaveDraft}
          >
            <Save className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Save Draft</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="h-8 gap-1.5 px-2.5 text-xs"
            onClick={() => setScheduleOpen(true)}
          >
            <CalendarClock className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Schedule</span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" className="h-8 gap-1 bg-primary px-3 text-xs text-primary-foreground hover:bg-primary/90">
                <Send className="h-3.5 w-3.5" />
                Publish
                <ChevronDown className="h-3 w-3 opacity-70" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="border-border">
              <DropdownMenuItem onClick={handlePublish}>
                <Send className="mr-2 h-3.5 w-3.5" />
                Publish Now
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setScheduleOpen(true)}>
                <CalendarClock className="mr-2 h-3.5 w-3.5" />
                Schedule Publication
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* ── Document body ───────────────────────────────────── */}
      <main className="flex-1 py-10 px-4">
        <div className="mx-auto w-full max-w-3xl">

          {/* Breadcrumb meta */}
          <div className="mb-6 flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
            <span className="rounded-md bg-muted px-2 py-0.5 font-medium text-foreground">{pod.name}</span>
            <span>/</span>
            <span>Client Portal</span>
            <span>/</span>
            <span>New Pulse Check</span>
          </div>

          {/* Title input — large, document-style */}
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Pulse Check Title"
            className="mb-2 w-full bg-transparent text-3xl font-bold text-foreground placeholder:text-muted-foreground/40 focus:outline-none"
          />

          {/* Reporting week — subtle meta line */}
          <div className="mb-8 flex items-center gap-2 border-b border-border pb-6">
            <Clock className="h-3.5 w-3.5 text-muted-foreground" />
            <label className="text-xs text-muted-foreground">Reporting week</label>
            <input
              type="date"
              value={reportingWeek}
              onChange={(e) => setReportingWeek(e.target.value)}
              className="bg-transparent text-xs text-foreground focus:outline-none"
            />
            <span className="ml-auto flex items-center gap-1 text-[11px] text-muted-foreground">
              <Sparkles className="h-3 w-3" />
              {wordCount} word{wordCount !== 1 ? "s" : ""}
            </span>
          </div>

          {/* Rich text editor — full width, no card border */}
          <div className="mb-8">
            <RichTextEditor
              value={content}
              onChange={setContent}
              placeholder="Write your weekly sprint summary — describe progress, key deliverables, blockers, and next steps…"
              minHeight="320px"
            />
          </div>

          {/* AI Enhance button — inline, subtle */}
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              AI Enhance
            </Button>
            <span className="text-[11px] text-muted-foreground">
              Let AI refine tone and structure your summary
            </span>
          </div>

          {/* Bottom publish bar */}
          <div className="mt-10 flex items-center justify-between border-t border-border pt-6">
            <Button
              variant="ghost"
              size="sm"
              className="h-9 gap-1.5 text-xs text-muted-foreground hover:text-foreground"
              onClick={() => router.push(`/pod/${slug}`)}
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Discard
            </Button>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="h-9 gap-1.5 text-xs" onClick={handleSaveDraft}>
                <Save className="h-3.5 w-3.5" />
                Save Draft
              </Button>
              <Button
                size="sm"
                className="h-9 gap-1.5 bg-primary text-xs text-primary-foreground hover:bg-primary/90"
                onClick={handlePublish}
              >
                <Send className="h-3.5 w-3.5" />
                Publish to Portal
              </Button>
            </div>
          </div>
        </div>
      </main>

      {/* ── Schedule dialog ─────────────────────────────────── */}
      <Dialog open={scheduleOpen} onOpenChange={setScheduleOpen}>
        <DialogContent className="max-w-sm border-border bg-card">
          <DialogHeader>
            <DialogTitle className="text-sm font-semibold text-foreground">Schedule Publication</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 pt-1">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="sched-date" className="text-xs text-muted-foreground">Date</Label>
              <Input
                id="sched-date"
                type="date"
                value={scheduleDate}
                onChange={(e) => setScheduleDate(e.target.value)}
                className="h-9 border-border bg-background text-sm text-foreground"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="sched-time" className="text-xs text-muted-foreground">Time</Label>
              <Input
                id="sched-time"
                type="time"
                value={scheduleTime}
                onChange={(e) => setScheduleTime(e.target.value)}
                className="h-9 border-border bg-background text-sm text-foreground"
              />
            </div>
            {scheduleDate && scheduleTime && (
              <div className="rounded-lg border border-border bg-muted/30 px-3 py-2">
                <p className="text-[11px] text-muted-foreground">Will publish on</p>
                <p className="mt-0.5 text-xs font-semibold text-foreground">
                  {new Date(`${scheduleDate}T${scheduleTime}`).toLocaleString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </p>
              </div>
            )}
            <div className="flex justify-end gap-2 pt-1">
              <Button variant="outline" size="sm" className="h-9 border-border text-xs" onClick={() => setScheduleOpen(false)}>
                Cancel
              </Button>
              <Button
                size="sm"
                className="h-9 gap-1.5 bg-primary text-xs text-primary-foreground hover:bg-primary/90"
                disabled={!scheduleDate || !scheduleTime}
                onClick={() => {
                  setScheduleOpen(false)
                  router.push(`/pod/${slug}`)
                }}
              >
                <CalendarClock className="h-3.5 w-3.5" />
                Schedule
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
