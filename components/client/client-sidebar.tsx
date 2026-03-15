"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import {
  Users,
  CreditCard,
  LogOut,
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  Menu,
  Map,
  LayoutGrid,
  Activity,
} from "lucide-react"
import { pulseReports } from "@/lib/pulse-data"

function getDateRange(report: (typeof pulseReports)[0]): string {
  return `${report.week.replace("Week of ", "")} – ${report.date.split(",")[0]}`
}

export function ClientSidebar() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [pulseOpen, setPulseOpen] = useState(true)

  const closeMobile = () => setMobileOpen(false)
  const isTaskTracking = pathname === "/client-dashboard" || pathname.startsWith("/client-dashboard/boards")

  return (
    <>
      {/* Mobile toggle */}
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        className="fixed left-4 top-4 z-50 flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground shadow-sm lg:hidden"
        aria-label="Open menu"
      >
        <Menu className="h-4 w-4" />
      </button>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm lg:hidden" onClick={closeMobile} aria-hidden="true" />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex h-screen w-[260px] flex-col border-r border-border bg-background transition-transform duration-200 lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="flex shrink-0 items-center justify-between border-b border-border px-4 py-3">
          <Link href="/client-dashboard" className="flex items-center gap-2.5" onClick={closeMobile}>
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <svg width="16" height="16" viewBox="0 0 20 20" fill="none" className="text-primary">
                <rect x="2" y="2" width="7" height="7" rx="1.5" fill="currentColor" />
                <rect x="11" y="2" width="7" height="7" rx="1.5" fill="currentColor" opacity="0.6" />
                <rect x="2" y="11" width="7" height="7" rx="1.5" fill="currentColor" opacity="0.6" />
                <rect x="11" y="11" width="7" height="7" rx="1.5" fill="currentColor" opacity="0.3" />
              </svg>
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-sm font-bold text-foreground">Assembled</span>
              <span className="text-[10px] text-muted-foreground">Systems</span>
              <span className="mt-0.5 text-[9px] text-muted-foreground/60">
                Powered by <span className="font-medium text-primary/70">pulse pilot ai</span>
              </span>
            </div>
          </Link>
          <button
            type="button"
            onClick={closeMobile}
            className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-secondary lg:hidden"
            aria-label="Close menu"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex flex-1 flex-col overflow-y-auto px-3 py-3">

          {/* Pulse Checks collapsible */}
          <div className="mb-1">
            <button
              onClick={() => setPulseOpen((o) => !o)}
              className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left transition-colors hover:bg-secondary"
            >
              <Activity className="h-[18px] w-[18px] shrink-0 text-muted-foreground" />
              <span className="flex-1 text-sm font-medium text-foreground">Pulse Checks</span>
              {pulseOpen
                ? <ChevronUp className="h-3.5 w-3.5 text-muted-foreground" />
                : <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />}
            </button>

            {pulseOpen && (
              <div className="ml-7 mt-0.5 flex flex-col gap-0.5 border-l border-border pl-3">
                {pulseReports.map((report) => {
                  const isActive = pathname === `/client-dashboard/pulse-checks/${report.id}`
                  return (
                    <Link
                      key={report.id}
                      href={`/client-dashboard/pulse-checks/${report.id}`}
                      onClick={closeMobile}
                      className={`rounded-md px-2 py-1.5 text-sm transition-colors ${
                        isActive
                          ? "font-medium text-primary"
                          : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                      }`}
                    >
                      {getDateRange(report)}
                    </Link>
                  )
                })}
              </div>
            )}
          </div>

          {/* Task Tracking */}
          <Link
            href="/client-dashboard"
            onClick={closeMobile}
            className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              isTaskTracking ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-secondary hover:text-foreground"
            }`}
          >
            <LayoutGrid className={`h-[18px] w-[18px] shrink-0 ${isTaskTracking ? "text-primary" : ""}`} />
            Task Tracking
          </Link>

          {/* Roadmap */}
          <Link
            href="/client-dashboard/roadmap"
            onClick={closeMobile}
            className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              pathname.startsWith("/client-dashboard/roadmap") ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-secondary hover:text-foreground"
            }`}
          >
            <Map className={`h-[18px] w-[18px] shrink-0 ${pathname.startsWith("/client-dashboard/roadmap") ? "text-primary" : ""}`} />
            Roadmap
          </Link>

          {/* Billing & Invoices */}
          <Link
            href="/client-dashboard/billing"
            onClick={closeMobile}
            className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              pathname.startsWith("/client-dashboard/billing") ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-secondary hover:text-foreground"
            }`}
          >
            <CreditCard className={`h-[18px] w-[18px] shrink-0 ${pathname.startsWith("/client-dashboard/billing") ? "text-primary" : ""}`} />
            Billing &amp; Invoices
          </Link>

          {/* User Management */}
          <Link
            href="/client-dashboard/users"
            onClick={closeMobile}
            className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              pathname.startsWith("/client-dashboard/users") ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-secondary hover:text-foreground"
            }`}
          >
            <Users className={`h-[18px] w-[18px] shrink-0 ${pathname.startsWith("/client-dashboard/users") ? "text-primary" : ""}`} />
            User Management
          </Link>
        </nav>

        {/* Footer */}
        <div className="shrink-0 border-t border-border px-3 py-3">
          <Link
            href="/client-dashboard/profile"
            onClick={closeMobile}
            className="mb-1 flex items-center gap-2.5 rounded-lg px-3 py-2 transition-colors hover:bg-secondary"
          >
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/15 text-[11px] font-bold text-primary">
              CA
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-foreground">Client A</p>
              <p className="truncate text-[10px] text-muted-foreground">client@company.com</p>
            </div>
          </Link>
          <Link
            href="/client-login"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-destructive"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </Link>
        </div>
      </aside>
    </>
  )
}
