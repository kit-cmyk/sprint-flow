"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Users,
  CreditCard,
  Map,
  ChevronDown,
  ChevronUp,
  Check,
  LayoutGrid,
  Activity,
  LogOut,
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { pulseReports } from "@/lib/pulse-data"

// Date-range label derived from report week string  e.g. "Week of Feb 10" → "Feb 10 – Feb 14"
function getDateRange(report: (typeof pulseReports)[0]): string {
  // Use date as end, subtract 4 days for start
  return `${report.week.replace("Week of ", "")} – ${report.date.split(",")[0]}`
}

const projects = [
  { id: "1", name: "Aviation", client: "AVI" },
  { id: "2", name: "Momentum Pod", client: "Client A" },
  { id: "3", name: "Horizon Pod", client: "Client B" },
]



export function ClientSidebarContent() {
  const pathname = usePathname()
  const [selectedProject, setSelectedProject] = useState(projects[0])
  const [pulseOpen, setPulseOpen] = useState(true)

  const isTaskTracking =
    pathname === "/client-dashboard" || pathname.startsWith("/client-dashboard/boards")

  return (
    <Sidebar>
      {/* ── Logo ── */}
      <SidebarHeader className="border-b border-sidebar-border pb-3">
        <Link href="/client-dashboard" className="flex items-center gap-2.5 px-2 pt-1">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none" className="text-primary" aria-hidden="true">
              <rect x="2" y="2" width="7" height="7" rx="1.5" fill="currentColor" />
              <rect x="11" y="2" width="7" height="7" rx="1.5" fill="currentColor" opacity="0.6" />
              <rect x="2" y="11" width="7" height="7" rx="1.5" fill="currentColor" opacity="0.6" />
              <rect x="11" y="11" width="7" height="7" rx="1.5" fill="currentColor" opacity="0.3" />
            </svg>
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-sm font-bold text-sidebar-foreground">Assembled</span>
            <span className="text-[10px] text-muted-foreground">Systems</span>
            <span className="mt-0.5 text-[9px] text-muted-foreground/60">
              Powered by <span className="font-medium text-primary/70">pulse pilot ai</span>
            </span>
          </div>
        </Link>

        {/* Client / project selector */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="mx-2 mt-2 flex w-[calc(100%-1rem)] items-center justify-between rounded-lg border border-sidebar-border bg-sidebar px-3 py-2 transition-colors hover:bg-sidebar-accent">
              <div className="flex items-center gap-2 min-w-0">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-primary/15 text-[10px] font-bold text-primary">
                  {selectedProject.client.slice(0, 2).toUpperCase()}
                </div>
                <div className="flex flex-col items-start min-w-0">
                  <span className="truncate text-sm font-semibold text-sidebar-foreground">
                    {selectedProject.name}
                  </span>
                  <span className="text-[10px] text-muted-foreground">{selectedProject.client}</span>
                </div>
              </div>
              <ChevronDown className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            <DropdownMenuLabel>Switch Project</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {projects.map((p) => (
              <DropdownMenuItem
                key={p.id}
                onClick={() => setSelectedProject(p)}
                className="flex cursor-pointer items-center justify-between"
              >
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{p.name}</span>
                  <span className="text-xs text-muted-foreground">{p.client}</span>
                </div>
                {selectedProject.id === p.id && <Check className="h-3.5 w-3.5 text-primary" />}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarHeader>

      <SidebarContent className="gap-0">
        {/* ── Pulse Checks collapsible ── */}
        <SidebarGroup className="py-2">
          <button
            onClick={() => setPulseOpen((o) => !o)}
            className="flex w-full items-center gap-2 rounded-md px-3 py-1.5 text-left transition-colors hover:bg-sidebar-accent"
          >
            <Activity className="h-4 w-4 shrink-0 text-muted-foreground" />
            <span className="flex-1 text-sm font-medium text-sidebar-foreground">Pulse Checks</span>
            {pulseOpen ? (
              <ChevronUp className="h-3.5 w-3.5 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
            )}
          </button>

          {pulseOpen && (
            <div className="ml-6 mt-1 flex flex-col gap-0.5 border-l border-sidebar-border pl-3">
              {pulseReports.map((report) => {
                const isActive = pathname === `/client-dashboard/pulse-checks/${report.id}`
                return (
                  <Link
                    key={report.id}
                    href={`/client-dashboard/pulse-checks/${report.id}`}
                    className={`rounded-md px-2 py-1.5 text-sm transition-colors ${
                      isActive
                        ? "font-medium text-primary"
                        : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground"
                    }`}
                  >
                    {getDateRange(report)}
                  </Link>
                )
              })}
            </div>
          )}
        </SidebarGroup>

        {/* ── Task Tracking ── */}
        <SidebarGroup className="py-0">
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isTaskTracking}>
                  <Link href="/client-dashboard">
                    <LayoutGrid className="h-4 w-4" />
                    <span>Task Tracking</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname.startsWith("/client-dashboard/roadmap")}>
                  <Link href="/client-dashboard/roadmap">
                    <Map className="h-4 w-4" />
                    <span>Roadmap</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname.startsWith("/client-dashboard/billing")}>
                  <Link href="/client-dashboard/billing">
                    <CreditCard className="h-4 w-4" />
                    <span>Billing &amp; Invoices</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname.startsWith("/client-dashboard/users")}>
                  <Link href="/client-dashboard/users">
                    <Users className="h-4 w-4" />
                    <span>User Management</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* ── Footer ── */}
      <SidebarFooter className="border-t border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/client-dashboard/profile" className="flex items-center gap-2.5">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/15 text-[11px] font-bold text-primary">
                  CA
                </div>
                <div className="flex flex-col leading-none">
                  <span className="text-sm font-medium text-sidebar-foreground">Client A</span>
                  <span className="text-[10px] text-muted-foreground">client@company.com</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/client-login" className="text-muted-foreground hover:text-destructive">
                <LogOut className="h-4 w-4" />
                <span>Sign out</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
