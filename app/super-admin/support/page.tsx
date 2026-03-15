"use client"

import { useState, useMemo, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  HeadphonesIcon,
  Search,
  ArrowUpRight,
  Send,
  ChevronDown,
  CheckCircle2,
  Circle,
  Filter,
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import {
  allTickets,
  type SupportTicket,
  type TicketStatus,
  type TicketPriority,
  type TicketReply,
  ticketStatusColors,
  ticketPriorityColors,
  ticketCategoryLabels,
} from "@/lib/support-data"
import { organizations } from "@/lib/organization-data"
import { cn } from "@/lib/utils"

const STATUS_OPTIONS: { value: TicketStatus | "all"; label: string; dot: string }[] = [
  { value: "all", label: "All", dot: "bg-muted-foreground" },
  { value: "open", label: "Open", dot: "bg-amber-400" },
  { value: "in-progress", label: "In Progress", dot: "bg-primary" },
  { value: "resolved", label: "Resolved", dot: "bg-emerald-400" },
  { value: "closed", label: "Closed", dot: "bg-muted-foreground/40" },
]

const PRIORITY_OPTIONS: { value: TicketPriority | "all"; label: string }[] = [
  { value: "all", label: "All Priorities" },
  { value: "critical", label: "Critical" },
  { value: "high", label: "High" },
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" },
]

export default function SuperAdminSupportPage() {
  const router = useRouter()
  const [tickets, setTickets] = useState<SupportTicket[]>(allTickets)
  const [selected, setSelected] = useState<SupportTicket | null>(allTickets[0] ?? null)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<TicketStatus | "all">("all")
  const [priorityFilter, setPriorityFilter] = useState<TicketPriority | "all">("all")
  const [reply, setReply] = useState("")
  const threadRef = useRef<HTMLDivElement>(null)

  const orgMap = useMemo(
    () => Object.fromEntries(organizations.map((o) => [o.slug, o.name])),
    []
  )

  const filtered = useMemo(() => {
    return tickets.filter((t) => {
      if (statusFilter !== "all" && t.status !== statusFilter) return false
      if (priorityFilter !== "all" && t.priority !== priorityFilter) return false
      if (search) {
        const q = search.toLowerCase()
        if (
          !t.subject.toLowerCase().includes(q) &&
          !t.id.toLowerCase().includes(q) &&
          !t.submittedByName.toLowerCase().includes(q) &&
          !(orgMap[t.orgSlug] ?? "").toLowerCase().includes(q)
        )
          return false
      }
      return true
    })
  }, [tickets, statusFilter, priorityFilter, search, orgMap])

  // Keep selected in sync when filters change
  useEffect(() => {
    if (selected && !filtered.find((t) => t.id === selected.id)) {
      setSelected(filtered[0] ?? null)
    }
  }, [filtered, selected])

  // Scroll thread to bottom when ticket changes or reply added
  useEffect(() => {
    if (threadRef.current) {
      threadRef.current.scrollTop = threadRef.current.scrollHeight
    }
  }, [selected?.id, selected?.replies.length])

  const updateTicket = (id: string, patch: Partial<SupportTicket>) => {
    setTickets((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t)))
    setSelected((prev) => (prev?.id === id ? { ...prev, ...patch } : prev))
  }

  const updateStatus = (id: string, status: TicketStatus) => {
    updateTicket(id, { status, lastUpdate: "Just now" })
  }

  const sendReply = () => {
    if (!reply.trim() || !selected) return
    const newReply: TicketReply = {
      id: `r-${Date.now()}`,
      author: "Support Team",
      authorAvatar: "SA",
      role: "super-admin",
      body: reply.trim(),
      timestamp: new Date().toLocaleString("en-US", {
        month: "short", day: "numeric", year: "numeric",
        hour: "numeric", minute: "2-digit",
      }),
    }
    const updatedReplies = [...(selected.replies ?? []), newReply]
    updateTicket(selected.id, {
      replies: updatedReplies,
      lastUpdate: "Just now",
      status: selected.status === "open" ? "in-progress" : selected.status,
    })
    setReply("")
  }

  // counts
  const openCount = tickets.filter((t) => t.status === "open").length
  const inProgressCount = tickets.filter((t) => t.status === "in-progress").length
  const criticalCount = tickets.filter(
    (t) => t.priority === "critical" && t.status !== "closed" && t.status !== "resolved"
  ).length

  return (
    <div className="flex h-[calc(100vh-3rem)] flex-col overflow-hidden">

      {/* Top bar */}
      <div className="flex shrink-0 items-center justify-between gap-4 border-b border-border px-4 py-3 md:px-6">
        <div className="flex items-center gap-2.5">
          <HeadphonesIcon className="h-4 w-4 text-amber-400" />
          <h1 className="text-sm font-semibold text-foreground">Support Tickets</h1>
          <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-semibold text-muted-foreground">
            {tickets.length} total
          </span>
        </div>
        {/* Stat chips */}
        <div className="hidden items-center gap-2 sm:flex">
          {[
            { label: "Open", value: openCount, color: "text-amber-400" },
            { label: "In Progress", value: inProgressCount, color: "text-primary" },
            { label: "Critical", value: criticalCount, color: "text-red-400" },
          ].map((s) => (
            <span key={s.label} className="flex items-center gap-1 text-xs text-muted-foreground">
              <span className={cn("text-sm font-bold", s.color)}>{s.value}</span>
              {s.label}
            </span>
          ))}
        </div>
      </div>

      {/* Main split */}
      <div className="flex min-h-0 flex-1">

        {/* LEFT — ticket list */}
        <div className="flex w-72 shrink-0 flex-col border-r border-border xl:w-80">

          {/* Search + filters */}
          <div className="flex shrink-0 flex-col gap-2 border-b border-border p-3">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-8 border-border bg-background pl-8 text-xs"
              />
            </div>
            <div className="flex items-center gap-1.5">
              {/* Status filter pills */}
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
              {/* Priority filter */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex shrink-0 items-center gap-1 rounded-md border border-border bg-background px-2 py-1 text-[11px] text-muted-foreground hover:text-foreground">
                    <Filter className="h-3 w-3" />
                    Priority
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
                      isActive && "bg-primary/5 border-l-2 border-l-primary"
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
                      <span className="text-[11px] text-muted-foreground">
                        {orgMap[ticket.orgSlug] ?? ticket.orgSlug}
                      </span>
                      <span className={cn("rounded-full px-1.5 py-0.5 text-[10px] font-semibold capitalize", ticketStatusColors[ticket.status])}>
                        {ticket.status}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] text-muted-foreground">{ticket.submittedByName}</span>
                      <span className="text-[10px] text-muted-foreground/60">{ticket.lastUpdate}</span>
                    </div>
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
            <div className="flex shrink-0 items-start justify-between gap-4 border-b border-border px-5 py-3">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-sm font-semibold text-foreground">{selected.subject}</h2>
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
                  <button
                    onClick={() => router.push(`/super-admin/org/${selected.orgSlug}?tab=support`)}
                    className="flex items-center gap-1 text-[11px] text-primary hover:underline"
                  >
                    {orgMap[selected.orgSlug] ?? selected.orgSlug}
                    <ArrowUpRight className="h-3 w-3" />
                  </button>
                </div>
              </div>
              {/* Status changer */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-7 gap-1.5 text-xs">
                    Change Status
                    <ChevronDown className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="border-border bg-popover">
                  {(["open", "in-progress", "resolved", "closed"] as TicketStatus[]).map((s) => (
                    <DropdownMenuItem
                      key={s}
                      className={cn("gap-2 text-xs capitalize", selected.status === s && "font-semibold text-foreground")}
                      onClick={() => updateStatus(selected.id, s)}
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
            </div>

            {/* Message thread */}
            <div ref={threadRef} className="flex-1 overflow-y-auto p-5 space-y-5">
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
                  <Card className="mt-1.5 border-border bg-card p-3">
                    <p className="whitespace-pre-line text-xs text-foreground leading-relaxed">{selected.description}</p>
                  </Card>
                </div>
              </div>

              {/* Replies */}
              {selected.replies.map((r) => {
                const isSupport = r.role === "super-admin"
                return (
                  <div key={r.id} className={cn("flex gap-3", isSupport && "flex-row-reverse")}>
                    <div className={cn(
                      "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[11px] font-bold",
                      isSupport ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"
                    )}>
                      {r.authorAvatar}
                    </div>
                    <div className={cn("flex flex-col max-w-[75%]", isSupport && "items-end")}>
                      <div className="flex items-baseline gap-2">
                        <span className="text-xs font-semibold text-foreground">{r.author}</span>
                        <span className="text-[11px] text-muted-foreground">{r.timestamp}</span>
                      </div>
                      <Card className={cn(
                        "mt-1.5 border-border p-3",
                        isSupport ? "bg-primary/5 border-primary/20" : "bg-card"
                      )}>
                        <p className="whitespace-pre-line text-xs text-foreground leading-relaxed">{r.body}</p>
                      </Card>
                    </div>
                  </div>
                )
              })}

              {selected.replies.length === 0 && (
                <p className="text-center text-xs text-muted-foreground py-4">No replies yet. Be the first to respond.</p>
              )}
            </div>

            {/* Reply composer */}
            {selected.status !== "closed" && (
              <div className="shrink-0 border-t border-border p-4">
                <div className="flex flex-col gap-2">
                  <Textarea
                    placeholder="Write a reply..."
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) sendReply()
                    }}
                    className="min-h-[80px] resize-none border-border bg-background text-xs text-foreground placeholder:text-muted-foreground focus-visible:ring-primary"
                  />
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-[11px] text-muted-foreground">
                      Press {typeof window !== "undefined" && navigator.platform.includes("Mac") ? "⌘" : "Ctrl"}+Enter to send
                    </span>
                    <Button
                      size="sm"
                      onClick={sendReply}
                      disabled={!reply.trim()}
                      className="gap-1.5 text-xs"
                    >
                      <Send className="h-3.5 w-3.5" />
                      Send Reply
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {selected.status === "closed" && (
              <div className="shrink-0 border-t border-border bg-muted/20 px-5 py-3">
                <p className="text-center text-xs text-muted-foreground">
                  This ticket is closed.{" "}
                  <button
                    onClick={() => updateStatus(selected.id, "open")}
                    className="font-medium text-primary hover:underline"
                  >
                    Reopen it
                  </button>{" "}
                  to continue the conversation.
                </p>
              </div>
            )}

          </div>
        ) : (
          <div className="flex flex-1 items-center justify-center text-xs text-muted-foreground">
            Select a ticket to view the conversation.
          </div>
        )}
      </div>
    </div>
  )
}
