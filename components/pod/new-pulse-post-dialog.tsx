"use client"

import { useState, useRef, useCallback } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RichTextEditor } from "@/components/ui/rich-text-editor"
import { Card, CardContent } from "@/components/ui/card"
import {
  Sparkles,
  Save,
  CalendarClock,
  Send,
  Calendar,
  Paperclip,
  X,
  FileText,
  ImageIcon,
  UploadCloud,
} from "lucide-react"

interface AttachedFile {
  id: string
  file: File
  preview?: string // object URL for images
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function NewPulsePostDialog({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const [reportingWeek, setReportingWeek] = useState("")
  const [postContent, setPostContent] = useState("")
  const [showScheduleDialog, setShowScheduleDialog] = useState(false)
  const [scheduleDate, setScheduleDate] = useState("")
  const [scheduleTime, setScheduleTime] = useState("")
  const [attachments, setAttachments] = useState<AttachedFile[]>([])
  const [dragging, setDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const addFiles = useCallback((files: FileList | File[]) => {
    const allowed = Array.from(files).filter((f) =>
      f.type.startsWith("image/") || f.type === "application/pdf"
    )
    const mapped: AttachedFile[] = allowed.map((f) => ({
      id: `${f.name}-${f.size}-${Date.now()}`,
      file: f,
      preview: f.type.startsWith("image/") ? URL.createObjectURL(f) : undefined,
    }))
    setAttachments((prev) => [...prev, ...mapped])
  }, [])

  const removeAttachment = (id: string) => {
    setAttachments((prev) => {
      const item = prev.find((a) => a.id === id)
      if (item?.preview) URL.revokeObjectURL(item.preview)
      return prev.filter((a) => a.id !== id)
    })
  }

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    addFiles(e.dataTransfer.files)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-5xl overflow-y-auto bg-card">
        <DialogHeader>
          <DialogTitle className="text-foreground">New Pulse Check Post</DialogTitle>
          <p className="text-xs text-muted-foreground">
            Write and publish a weekly summary for the client portal.
          </p>
        </DialogHeader>

        <div className="flex flex-col gap-6">
          {/* Reporting Week */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="reporting-week" className="flex items-center gap-2 text-xs text-muted-foreground">
              <Calendar className="h-3.5 w-3.5" />
              Reporting Week
            </Label>
            <Input
              id="reporting-week"
              type="date"
              value={reportingWeek}
              onChange={(e) => setReportingWeek(e.target.value)}
              className="h-9 border-border bg-background text-sm text-foreground"
              placeholder="mm/dd/yyyy"
            />
          </div>

          {/* Rich Text Editor */}
          <div className="flex flex-col gap-2">
            <RichTextEditor
              value={postContent}
              onChange={setPostContent}
              placeholder="Write your weekly report... Describe progress, key deliverables, risks, and next steps."
              minHeight="200px"
            />
          </div>

          {/* Attachments */}
          <div className="flex flex-col gap-2">
            <Label className="flex items-center gap-2 text-xs text-muted-foreground">
              <Paperclip className="h-3.5 w-3.5" />
              Attachments
              <span className="text-muted-foreground/60">(images or PDFs)</span>
            </Label>

            {/* Drop zone */}
            <div
              onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
              onDragLeave={() => setDragging(false)}
              onDrop={onDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed px-4 py-6 transition-colors ${
                dragging
                  ? "border-primary bg-primary/5"
                  : "border-border bg-muted/20 hover:border-primary/50 hover:bg-muted/40"
              }`}
            >
              <UploadCloud className="h-6 w-6 text-muted-foreground" />
              <p className="text-sm font-medium text-foreground">
                Drop files here or <span className="text-primary">browse</span>
              </p>
              <p className="text-xs text-muted-foreground">PNG, JPG, GIF, PDF — no size limit</p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,application/pdf"
                multiple
                className="hidden"
                onChange={(e) => e.target.files && addFiles(e.target.files)}
              />
            </div>

            {/* Attached file list */}
            {attachments.length > 0 && (
              <div className="flex flex-col gap-2">
                {attachments.map((a) => (
                  <div
                    key={a.id}
                    className="flex items-center gap-3 rounded-lg border border-border bg-background px-3 py-2"
                  >
                    {a.preview ? (
                      // Image thumbnail
                      <img
                        src={a.preview}
                        alt={a.file.name}
                        className="h-10 w-10 shrink-0 rounded-md object-cover"
                      />
                    ) : (
                      // PDF icon
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-rose-50 dark:bg-rose-950">
                        <FileText className="h-5 w-5 text-rose-500" />
                      </div>
                    )}
                    <div className="flex min-w-0 flex-1 flex-col">
                      <span className="truncate text-sm font-medium text-foreground">{a.file.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {a.preview ? (
                          <span className="flex items-center gap-1">
                            <ImageIcon className="h-3 w-3" /> Image · {formatBytes(a.file.size)}
                          </span>
                        ) : (
                          <span className="flex items-center gap-1">
                            <FileText className="h-3 w-3" /> PDF · {formatBytes(a.file.size)}
                          </span>
                        )}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); removeAttachment(a.id) }}
                      className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                      aria-label="Remove attachment"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between border-t border-border pt-4">
            <Button variant="outline" size="sm" className="h-9 gap-2 border-border">
              <Sparkles className="h-3.5 w-3.5" />
              AI Enhance
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="h-9 gap-2 border-border">
                <Save className="h-3.5 w-3.5" />
                Save Draft
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-9 gap-2 border-border"
                onClick={() => setShowScheduleDialog(true)}
              >
                <CalendarClock className="h-3.5 w-3.5" />
                Schedule
              </Button>
              <Button size="sm" className="h-9 gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
                <Send className="h-3.5 w-3.5" />
                Publish to Portal
              </Button>
            </div>
          </div>

          {/* Schedule Dialog */}
          {showScheduleDialog && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
              <Card className="w-full max-w-md border-border bg-card shadow-lg">
                <CardContent className="p-6">
                  <div className="mb-4">
                    <h3 className="text-base font-semibold text-foreground">Schedule Publication</h3>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Choose when this pulse check should be published to the client portal
                    </p>
                  </div>

                  <div className="flex flex-col gap-4">
                    {/* Date Picker */}
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="schedule-date" className="text-xs font-medium text-foreground">
                        Publication Date
                      </Label>
                      <Input
                        id="schedule-date"
                        type="date"
                        value={scheduleDate}
                        onChange={(e) => setScheduleDate(e.target.value)}
                        className="h-9 border-border bg-background text-sm text-foreground"
                      />
                    </div>

                    {/* Time Picker */}
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="schedule-time" className="text-xs font-medium text-foreground">
                        Publication Time
                      </Label>
                      <Input
                        id="schedule-time"
                        type="time"
                        value={scheduleTime}
                        onChange={(e) => setScheduleTime(e.target.value)}
                        className="h-9 border-border bg-background text-sm text-foreground"
                      />
                    </div>

                    {/* Preview */}
                    {scheduleDate && scheduleTime && (
                      <div className="rounded-lg border border-border bg-muted/30 px-3 py-2">
                        <p className="text-xs text-muted-foreground">Will be published on:</p>
                        <p className="mt-0.5 text-sm font-medium text-foreground">
                          {new Date(`${scheduleDate}T${scheduleTime}`).toLocaleString("en-US", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "numeric",
                            minute: "2-digit",
                            hour12: true,
                          })}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="mt-6 flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowScheduleDialog(false)}
                      className="h-9 border-border"
                    >
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => {
                        // Handle schedule submission
                        console.log("[v0] Scheduled for:", scheduleDate, scheduleTime)
                        setShowScheduleDialog(false)
                      }}
                      className="h-9 bg-primary text-primary-foreground hover:bg-primary/90"
                      disabled={!scheduleDate || !scheduleTime}
                    >
                      <CalendarClock className="mr-2 h-3.5 w-3.5" />
                      Schedule Post
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
