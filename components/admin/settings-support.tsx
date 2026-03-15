"use client"

import { useState, useMemo, useRef, useEffect } from "react"
import {
  HeadphonesIcon,
  Search,
  Send,
  ChevronDown,
  CheckCircle2,
  Circle,
  Filter,
  Plus,
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import {
  type SupportTicket,
  type TicketStatus,
  type TicketPriority,
  type TicketCategory,
  type TicketReply,
  ticketStatusColors,
  ticketPriorityColors,
  ticketCategoryLabels,
  getTicketsByOrg,
} from "@/lib/support-data"
import { cn } from "@/lib/utils"

const ORG_SLUG = "acme-corp"
const ORG_ADMIN_NAME = "James Mitchell"
const ORG_ADMIN_EMAIL = "admin@acme.com"
const ORG_ADMIN_AVATAR = "JM"

const STATUS_OPTIONS: { value: TicketStatus | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "open", label: "Open" },
  { value: "in-progress", label: "In Progress" },
  { value: "resolved", label: "Resolved" },
  { value: "closed", label: "Closed" },
]

const PRIORITY_OPTIONS: { value: TicketPriority | "all"; label: string }[] = [
  { value: "all", label: "All Priorities" },
  { value: "critical", label: "Critical" },
  { value: "high", label: "High" },
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" },
]

const priorities: TicketPriority[] = ["low", "medium", "high", "critical"]
const categories: TicketCategory[] = ["billing", "integration", "bug", "feature-request", "access", "other"]

export function SettingsSupport() {
  const [tickets, setTickets] = useState<SupportTicket[]>(getTicketsByOrg(ORG_SLUG))
  const [selected, setSelected] = useState<SupportTicket | null>(tickets[0] ?? null)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<TicketStatus | "all">("all")
  const [priorityFilter, setPriorityFilter] = useState<TicketPriority | "all">("all")
  const [reply, setReply] = useState("")
  const threadRef = useRef<HTMLDivElement>(null)

  /* new ticket form */
  const [createOpen, setCreateOpen] = useState(false)
  const [subject, setSubject] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState<TicketCategory>("bug")
  const [priority, setPriority] = useState<TicketPriority>("medium")

  const filtered = useMemo(() => {
    return tickets.filter((t) => {
      if (statusFilter !== "all" && t.status !== statusFilter) return false
      if (priorityFilter !== "all" && t.priority !== priorityFilter) return false
      if (search) {
        const q = search.toLowerCase()
        if (
          !t.subject.toLowerCase().includes(q) &&
          !t.id.toLowerCase().includes(q)
        )
          return false
      }
      return true
    })
  }, [tickets, statusFilter, priorityFilter, search])

  useEffect(() => {
    if (selected && !filtered.find((t) => t.id === selected.id)) {
      setSelected(filtered[0] ?? null)
    }
  }, [filtered, selected])

  useEffect(() => {
    if (threadRef.current) {
      threadRef.current.scrollTop = threadRef.current.scrollHeight
    }
  }, [selected?.id, selected?.replies?.length])

  const updateTicket = (id: string, patch: Partial<SupportTicket>) => {
    setTickets((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t)))
    setSelected((prev) => (prev?.id === id ? { ...prev, ...patch } : prev))
  }

  const sendReply = () => {
    if (!reply.trim() || !selected) return
    const newReply: TicketReply = {
      id: `r-${Date.now()}`,
      author: ORG_ADMIN_NAME,
      authorAvatar: ORG_ADMIN_AVATAR,
      role: "org-admin",
      body: reply.trim(),
      timestamp: new Date().toLocaleString("en-US", {
        month: "short", day: "numeric", year: "numeric",
        hour: "numeric", minute: "2-digit",
      }),
    }
    updateTicket(selected.id, {
      replies: [...(selected.replies ?? []), newReply],
      lastUpdate: "Just now",
    })
    setReply("")
  }

  const handleCreate = () => {
    if (!subject.trim() || !description.trim()) return
    const next: SupportTicket = {
      id: `TKT-${String(tickets.length + 10).padStart(3, "0")}`,
      subject: subject.trim(),
      description: description.trim(),
      submittedBy: ORG_ADMIN_EMAIL,
      submittedByName: ORG_ADMIN_NAME,
      submittedByAvatar: ORG_ADMIN_AVATAR,
      category,
      status: "open",
      priority,
      created: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      lastUpdate: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      orgSlug: ORG_SLUG,
      replies: [],
    }
    setTickets((prev) => [next, ...prev])
    setSelected(next)
    setSubject("")
    setDescription("")
    setCategory("bug")
    setPriority("medium")
    setCreateOpen(false)
  }

  const openCount = tickets.filter((t) => t.status === "open").length
  const inProgressCount = tickets.filter((t) => t.status === "in-progress").length

  return (
    <div className="flex h-[calc(100vh-12rem)] min-h-[500px] flex-col overflow-hidden rounded-lg border border-border">

      {/* Top bar */}
      <div className="flex shrink-0 items-center justify-between gap-4 border-b border-border bg-card px-4 py-3">
        <div className="flex items-center gap-2.5">
          <HeadphonesIcon className="h-4 w-4 text-amber-400" />
          <h2 className="text-sm font-semibold text-foreground">Support</h2>
          {openCount > 0 && (
            <span className={cn("rounded-full px-2 py-0.5 text-[11px] font-semibold", ticketStatusColors.open)}>
              {openCount} open
            </span>
          )}
          {inProgressCount > 0 && (
            <span className={cn("rounded-full px-2 py-0.5 text-[11px] font-semibold", ticketStatusColors["in-progress"])}>
              {inProgressCount} in progress
            </span>
          )}
        </div>
        <Button size="sm" className="gap-1.5 text-xs" onClick={() => setCreateOpen(true)}>
          <Plus className="h-3.5 w-3.5" />
          New Ticket
        </Button>
      </div>

      {/* Main split */}
      <div className="flex min-h-0 flex-1">

        {/* LEFT — ticket list */}
        <div className="flex w-64 shrink-0 flex-col border-r border-border xl:w-72">

          {/* Search + filters */}
          <div className="flex shrink-0 flex-col gap-2 border-b border-border p-3">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search tickets..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-8 border-border bg-background pl-8 text-xs"
              />
            </div>
            <div className="flex items-center gap-1.5">
              <div className="flex flex-1 items-center gap-1 overflow-x-auto">
                {STATUS_OPTIONS.map((o) => (
                  <button
                    key={o.value}
                    onClick={() => setStatusFilter(o.value)}
                    className={cn(
                      "flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium transition-colors",
                      statusFilter === o.value
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {o.label}
                  </button>
                ))}
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex shrink-0 items-center gap-1 rounded-md border border-border bg-background px-2 py-1 text-[11px] text-muted-foreground hover:text-foreground">
                    <Filter className="h-3 w-3" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="border-border bg-popover">
                  {PRIORITY_OPTIONS.map((o) => (
                    <DropdownMenuItem
                      key={o.value}
                      onClick={() => setPriorityFilter(o.value)}
                      className={cn("text-xs", priorityFilter === o.value && "font-semibold text-foreground")}
                    >
                      {o.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Ticket rows */}
          <div className="flex-1 overflow-y-auto">
            {filtered.length === 0 ? (
              <p className="p-4 text-center text-xs text-muted-foreground">No tickets match your filters.</p>
            ) : (
              filtered.map((ticket) => {
                const isActive = selected?.id === ticket.id
                return (
                  <button
                    key={ticket.id}
                    onClick={() => setSelected(ticket)}
                    className={cn(
                      "flex w-full flex-col gap-1 border-b border-border/50 px-4 py-3 text-left transition-colors hover:bg-muted/30",
                      isActive && "border-l-2 border-l-primary bg-primary/5"
                    )}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="line-clamp-1 flex-1 text-xs font-semibold text-foreground">
                        {ticket.subject}
                      </p>
                      <span className={cn("shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-semibold capitalize", ticketPriorityColors[ticket.priority])}>
                        {ticket.priority}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-[10px] text-muted-foreground/60">{ticket.id}</span>
                      <span className={cn("rounded-full px-1.5 py-0.5 text-[10px] font-semibold capitalize", ticketStatusColors[ticket.status])}>
                        {ticket.status}
                      </span>
                    </div>
                    <p className="text-[10px] text-muted-foreground">{ticket.lastUpdate}</p>
                  </button>
                )
              })
            )}
          </div>
        </div>

        {/* RIGHT — thread */}
        {selected ? (
          <div className="flex min-w-0 flex-1 flex-col">

            {/* Thread header */}
            <div className="flex shrink-0 items-start justify-between gap-4 border-b border-border bg-card px-5 py-3">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-sm font-semibold text-foreground">{selected.subject}</h3>
                  <span className="font-mono text-[10px] text-muted-foreground">{selected.id}</span>
                </div>
                <div className="mt-1 flex flex-wrap items-center gap-2">
                  <span className={cn("rounded-full px-2 py-0.5 text-[11px] font-semibold capitalize", ticketStatusColors[selected.status])}>
                    {selected.status}
                  </span>
                  <span className={cn("rounded-full px-2 py-0.5 text-[11px] font-semibold capitalize", ticketPriorityColors[selected.priority])}>
                    {selected.priority}
                  </span>
                  <span className="text-[11px] text-muted-foreground">
                    {ticketCategoryLabels[selected.category]}
                  </span>
                </div>
              </div>
              {/* Status changer */}
              {selected.status !== "closed" && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="h-7 gap-1.5 text-xs">
                      Change Status
                      <ChevronDown className="h-3 w-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="border-border bg-popover">
                    {(["open", "in-progress", "closed"] as TicketStatus[]).map((s) => (
                      <DropdownMenuItem
                        key={s}
                        className={cn("gap-2 text-xs capitalize", selected.status === s && "font-semibold text-foreground")}
                        onClick={() => updateTicket(selected.id, { status: s, lastUpdate: "Just now" })}
                      >
                        {selected.status === s ? (
                          <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                        ) : (
                          <Circle className="h-3.5 w-3.5 text-muted-foreground" />
                        )}
                        {s}
                      </DropdownMenuItem>
                    ))}
                    <DropdownMenuSeparator />
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>

            {/* Message thread */}
            <div ref={threadRef} className="flex-1 overflow-y-auto space-y-5 p-5">
              {/* Original message */}
              <div className="flex gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-[11px] font-bold text-muted-foreground">
                  {selected.submittedByAvatar}
                </div>
                <div className="flex-1">
                  <div className="flex items-baseline gap-2">
                    <span className="text-xs font-semibold text-foreground">{selected.submittedByName}</span>
                    <span className="text-[11px] text-muted-foreground">{selected.created}</span>
                  </div>
                  <Card className="mt-1.5 border-border bg-muted/30 p-3">
                    <p className="whitespace-pre-line text-xs leading-relaxed text-foreground">{selected.description}</p>
                  </Card>
                </div>
              </div>

              {/* Replies */}
              {(selected.replies ?? []).map((r) => {
                const isSupport = r.role === "super-admin"
                return (
                  <div key={r.id} className={cn("flex gap-3", isSupport && "flex-row-reverse")}>
                    <div className={cn(
                      "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[11px] font-bold",
                      isSupport ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"
                    )}>
                      {r.authorAvatar}
                    </div>
                    <div className={cn("flex max-w-[75%] flex-col", isSupport && "items-end")}>
                      <div className="flex items-baseline gap-2">
                        <span className="text-xs font-semibold text-foreground">{r.author}</span>
                        <span className="text-[11px] text-muted-foreground">{r.timestamp}</span>
                      </div>
                      <Card className={cn(
                        "mt-1.5 border-border p-3",
                        isSupport ? "bg-primary/5 border-primary/20" : "bg-card"
                      )}>
                        <p className="whitespace-pre-line text-xs leading-relaxed text-foreground">{r.body}</p>
                      </Card>
                    </div>
                  </div>
                )
              })}

              {(selected.replies ?? []).length === 0 && (
                <p className="py-4 text-center text-xs text-muted-foreground">
                  No responses yet. The Assembled support team will reply shortly.
                </p>
              )}
            </div>

            {/* Reply composer */}
            {selected.status !== "closed" && selected.status !== "resolved" ? (
              <div className="shrink-0 border-t border-border p-4">
                <div className="flex flex-col gap-2">
                  <Textarea
                    placeholder="Add a reply or additional details..."
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) sendReply()
                    }}
                    className="min-h-[80px] resize-none border-border bg-background text-xs text-foreground placeholder:text-muted-foreground focus-visible:ring-primary"
                  />
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-[11px] text-muted-foreground">
                      Press Ctrl+Enter to send
                    </span>
                    <Button size="sm" onClick={sendReply} disabled={!reply.trim()} className="gap-1.5 text-xs">
                      <Send className="h-3.5 w-3.5" />
                      Send Reply
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="shrink-0 border-t border-border bg-muted/20 px-5 py-3">
                <p className="text-center text-xs text-muted-foreground">
                  This ticket is {selected.status}.{" "}
                  {selected.status === "closed" && (
                    <button
                      onClick={() => updateTicket(selected.id, { status: "open", lastUpdate: "Just now" })}
                      className="font-medium text-primary hover:underline"
                    >
                      Reopen it
                    </button>
                  )}
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center gap-2 text-center">
            <HeadphonesIcon className="h-8 w-8 text-muted-foreground/30" />
            <p className="text-xs text-muted-foreground">Select a ticket to view the conversation.</p>
          </div>
        )}
      </div>

      {/* Create Ticket Dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-w-lg bg-card">
          <DialogHeader>
            <DialogTitle className="text-foreground">New Support Ticket</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-1">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="ticket-subject" className="text-xs text-muted-foreground">Subject</Label>
              <Input
                id="ticket-subject"
                placeholder="Briefly describe the issue"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="border-border bg-background text-foreground"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="ticket-description" className="text-xs text-muted-foreground">Description</Label>
              <Textarea
                id="ticket-description"
                rows={4}
                placeholder="Provide as much detail as possible..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="resize-none border-border bg-background text-xs text-foreground placeholder:text-muted-foreground"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs text-muted-foreground">Category</Label>
                <div className="relative">
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as TicketCategory)}
                    className="w-full appearance-none rounded-md border border-border bg-background px-3 py-2 pr-8 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>{ticketCategoryLabels[c]}</option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs text-muted-foreground">Priority</Label>
                <div className="relative">
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as TicketPriority)}
                    className="w-full appearance-none rounded-md border border-border bg-background px-3 py-2 pr-8 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    {priorities.map((p) => (
                      <option key={p} value={p} className="capitalize">{p.charAt(0).toUpperCase() + p.slice(1)}</option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                </div>
              </div>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" size="sm" onClick={() => { setCreateOpen(false); setSubject(""); setDescription("") }}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleCreate} disabled={!subject.trim() || !description.trim()}>
              Submit Ticket
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
