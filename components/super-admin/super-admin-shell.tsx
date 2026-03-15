"use client"

import { usePathname, useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { signOut } from "next-auth/react"
import Link from "next/link"
import {
  Building2,
  LayoutDashboard,
  LogOut,
  ChevronDown,
  ChevronRight,
  Shield,
  Users,
  HeadphonesIcon,
  ScrollText,
  Menu,
} from "lucide-react"
import { useState } from "react"
import { organizations } from "@/lib/organization-data"
import { ThemeToggle } from "@/components/theme-toggle"
import { NotificationSheet } from "@/components/notification-sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const statusColors: Record<string, string> = {
  active: "bg-emerald-400",
  trial: "bg-amber-400",
  suspended: "bg-red-400",
}

function NavItem({
  href,
  icon: Icon,
  label,
  active,
}: {
  href: string
  icon: React.ElementType
  label: string
  active: boolean
}) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-2.5 rounded-md px-3 py-2 text-xs font-medium transition-colors",
        active
          ? "bg-amber-500/15 text-amber-500 dark:text-amber-400"
          : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
      )}
    >
      <Icon className="h-3.5 w-3.5 shrink-0" />
      {label}
    </Link>
  )
}

function Sidebar({ pathname }: { pathname: string }) {
  const [orgsOpen, setOrgsOpen] = useState(true)

  return (
    <aside className="flex h-full w-60 shrink-0 flex-col border-r border-sidebar-border bg-sidebar-background">
      {/* Branding */}
      <div className="flex items-center gap-2.5 border-b border-sidebar-border px-4 py-3.5">
        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-amber-500/20">
          <Shield className="h-4 w-4 text-amber-500 dark:text-amber-400" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-xs font-semibold text-sidebar-foreground">Super Admin</p>
          <p className="truncate text-[10px] text-sidebar-foreground/50">Assembled Systems</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-3">
        <NavItem
          href="/super-admin"
          icon={LayoutDashboard}
          label="Dashboard"
          active={pathname === "/super-admin"}
        />

        {/* Organizations collapsible */}
        <div>
          <button
            onClick={() => setOrgsOpen((v) => !v)}
            className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-xs font-medium text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground"
          >
            <Building2 className="h-3.5 w-3.5 shrink-0" />
            <span className="flex-1 text-left">Organizations</span>
            {orgsOpen ? (
              <ChevronDown className="h-3 w-3" />
            ) : (
              <ChevronRight className="h-3 w-3" />
            )}
          </button>
          {orgsOpen && (
            <div className="ml-3 mt-0.5 flex flex-col gap-0.5 border-l border-sidebar-border pl-3">
              {organizations.map((org) => (
                <Link
                  key={org.slug}
                  href={`/super-admin/org/${org.slug}`}
                  className={cn(
                    "flex items-center gap-2 rounded-md px-2 py-1.5 text-[11px] font-medium transition-colors",
                    pathname === `/super-admin/org/${org.slug}`
                      ? "bg-amber-500/10 text-amber-500 dark:text-amber-400"
                      : "text-sidebar-foreground/50 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                  )}
                >
                  <span
                    className={cn(
                      "h-1.5 w-1.5 shrink-0 rounded-full",
                      statusColors[org.status]
                    )}
                  />
                  <span className="truncate">{org.name}</span>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="mt-2 border-t border-sidebar-border pt-2">
          <NavItem
            href="/super-admin/support"
            icon={HeadphonesIcon}
            label="Support Tickets"
            active={pathname.startsWith("/super-admin/support")}
          />
          <NavItem
            href="/super-admin/audit-log"
            icon={ScrollText}
            label="Audit Log"
            active={pathname.startsWith("/super-admin/audit-log")}
          />
        </div>
      </nav>

      {/* Footer */}
      <div className="border-t border-sidebar-border p-3">
        <Link
          href="/"
          className="flex items-center gap-2 rounded-md px-3 py-2 text-xs text-sidebar-foreground/50 transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground"
        >
          <Users className="h-3.5 w-3.5" />
          Back to Org Admin
        </Link>
      </div>
    </aside>
  )
}

export function SuperAdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { data: session } = useSession()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const name = session?.user?.name ?? "System Admin"
  const email = session?.user?.email ?? ""
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "SA"

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/login" })
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Desktop sidebar */}
      <div className="hidden md:flex md:flex-col">
        <Sidebar pathname={pathname} />
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="relative flex h-full flex-col">
            <Sidebar pathname={pathname} />
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header className="sticky top-0 z-30 flex h-12 items-center justify-between gap-2 border-b border-border bg-background/95 px-4 backdrop-blur">
          <button
            className="text-muted-foreground hover:text-foreground md:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="hidden items-center gap-1.5 md:flex">
            <Shield className="h-3.5 w-3.5 text-amber-500 dark:text-amber-400" />
            <span className="text-xs font-semibold text-amber-500 dark:text-amber-400">Super Admin Console</span>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <NotificationSheet variant="super-admin" />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 rounded-full border-amber-500/30 bg-amber-500/10 p-0 text-xs font-bold text-amber-500 hover:bg-amber-500/20 dark:text-amber-400"
                >
                  {initials}
                  <span className="sr-only">User menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                <DropdownMenuLabel className="flex flex-col gap-0.5">
                  <span className="text-xs font-semibold text-foreground">{name}</span>
                  <span className="text-[11px] font-normal text-muted-foreground">{email}</span>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer" onClick={() => router.push("/")}>
                  <Users className="mr-2 h-4 w-4" />
                  Switch to Org Admin
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer text-destructive focus:text-destructive"
                  onClick={handleSignOut}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto bg-background">
          {children}
        </main>
      </div>
    </div>
  )
}
