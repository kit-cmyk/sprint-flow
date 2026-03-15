"use client"

import { useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { signOut } from "next-auth/react"
import Link from "next/link"
import {
  LayoutDashboard,
  FolderKanban,
  UsersRound,
  ChevronDown,
  Settings,
  LogOut,
  User,
  HeadphonesIcon,
  Menu,
  X,
} from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { NotificationSheet } from "@/components/notification-sheet"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { pods } from "@/lib/pod-data"
import { teams } from "@/lib/team-data"
import { cn } from "@/lib/utils"

function podStatusColor(score: number) {
  if (score >= 80) return "bg-emerald-400"
  if (score >= 60) return "bg-amber-400"
  return "bg-red-400"
}

function NavLink({
  href,
  active,
  children,
}: {
  href: string
  active: boolean
  children: React.ReactNode
}) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
        active
          ? "bg-sidebar-accent text-primary"
          : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
      )}
    >
      {children}
    </Link>
  )
}

function Sidebar({
  pathname,
  onClose,
  assignedPods,
  name,
  initials,
}: {
  pathname: string
  onClose?: () => void
  assignedPods: typeof pods
  name: string
  initials: string
}) {
  return (
    <div className="flex h-full flex-col bg-sidebar-background">
      {/* Logo */}
      <div className="flex items-center justify-between border-b border-sidebar-border px-4 py-4">
        <Link href="/po" className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none" className="text-primary" aria-hidden="true">
              <rect x="2" y="2" width="7" height="7" rx="1.5" fill="currentColor" />
              <rect x="11" y="2" width="7" height="7" rx="1.5" fill="currentColor" opacity="0.6" />
              <rect x="2" y="11" width="7" height="7" rx="1.5" fill="currentColor" opacity="0.6" />
              <rect x="11" y="11" width="7" height="7" rx="1.5" fill="currentColor" opacity="0.3" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-sidebar-foreground">Assembled</span>
            <span className="text-[10px] leading-none text-sidebar-foreground/50">Product Owner</span>
          </div>
        </Link>
        {onClose && (
          <button onClick={onClose} className="rounded p-1 text-sidebar-foreground/50 hover:text-sidebar-foreground">
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <div className="flex flex-col gap-1">
          {/* Dashboard */}
          <NavLink href="/po" active={pathname === "/po"}>
            <LayoutDashboard className="h-4 w-4 shrink-0" />
            Dashboard
          </NavLink>

          {/* Pods — collapsible */}
          <Collapsible defaultOpen>
            <CollapsibleTrigger className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground">
              <FolderKanban className="h-4 w-4 shrink-0" />
              <span className="flex-1 text-left">My Pods</span>
              <ChevronDown className="h-3.5 w-3.5 transition-transform [[data-state=open]_&]:rotate-180" />
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="mt-1 flex flex-col gap-0.5 pl-4">
                {assignedPods.map((pod) => (
                  <Link
                    key={pod.slug}
                    href={`/po/pod/${pod.slug}`}
                    className={cn(
                      "flex items-center gap-2 rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
                      pathname === `/po/pod/${pod.slug}` || pathname.startsWith(`/po/pod/${pod.slug}/`)
                        ? "bg-sidebar-accent text-primary"
                        : "text-sidebar-foreground/50 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                    )}
                  >
                    <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${podStatusColor(pod.healthScore)}`} />
                    <span className="truncate">{pod.name}</span>
                  </Link>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Teams */}
          <Collapsible defaultOpen>
            <CollapsibleTrigger className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground">
              <UsersRound className="h-4 w-4 shrink-0" />
              <span className="flex-1 text-left">Teams</span>
              <ChevronDown className="h-3.5 w-3.5 transition-transform [[data-state=open]_&]:rotate-180" />
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="mt-1 flex flex-col gap-0.5 pl-4">
                {teams.map((team) => (
                  <Link
                    key={team.slug}
                    href={`/po/team/${team.slug}`}
                    className={cn(
                      "flex items-center gap-2 rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
                      pathname.startsWith(`/po/team/${team.slug}`)
                        ? "bg-sidebar-accent text-primary"
                        : "text-sidebar-foreground/50 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                    )}
                  >
                    <span className="truncate">{team.name}</span>
                    <span className="ml-auto text-[10px] text-sidebar-foreground/40">
                      {team.podSlugs.length}p
                    </span>
                  </Link>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Separator */}
          <div className="my-2 border-t border-sidebar-border" />

          {/* Settings */}
          <NavLink href="/po/settings" active={pathname.startsWith("/po/settings")}>
            <Settings className="h-4 w-4 shrink-0" />
            Settings
          </NavLink>

          {/* Support */}
          <NavLink href="/po/support" active={pathname.startsWith("/po/support")}>
            <HeadphonesIcon className="h-4 w-4 shrink-0" />
            Support
          </NavLink>
        </div>
      </nav>

      {/* Footer user card */}
      <div className="border-t border-sidebar-border px-3 py-4">
        <div className="flex items-center gap-2.5 rounded-lg bg-sidebar-accent px-3 py-2.5">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/20 text-[10px] font-bold text-primary">
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-medium text-sidebar-foreground">{name}</p>
            <p className="truncate text-[10px] text-sidebar-foreground/50">Product Owner</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export function ProductOwnerShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { data: session } = useSession()
  const [mobileOpen, setMobileOpen] = useState(false)

  const name = session?.user?.name ?? ""
  const email = session?.user?.email ?? ""
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "PO"

  // Filter pods to only those assigned to the current user via session
  const assignedPodSlugs = session?.user?.assignedPodSlugs ?? []
  const assignedPods = pods.filter((p) => assignedPodSlugs.includes(p.slug))

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/login" })
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Desktop sidebar */}
      <aside className="hidden w-60 shrink-0 overflow-y-auto border-r border-sidebar-border lg:flex lg:flex-col">
        <Sidebar pathname={pathname} assignedPods={assignedPods} name={name} initials={initials} />
      </aside>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 h-full w-64 overflow-y-auto border-r border-sidebar-border">
            <Sidebar pathname={pathname} onClose={() => setMobileOpen(false)} assignedPods={assignedPods} name={name} initials={initials} />
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header className="flex h-12 shrink-0 items-center justify-between border-b border-border bg-background px-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="rounded p-1.5 text-muted-foreground transition-colors hover:text-foreground lg:hidden"
              aria-label="Open menu"
            >
              <Menu className="h-4 w-4" />
            </button>
            <span className="text-xs font-medium text-muted-foreground">
              Product Owner
            </span>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <NotificationSheet variant="org-admin" />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 rounded-full border-border bg-primary/10 p-0 text-xs font-bold text-primary hover:bg-primary/20"
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
                <DropdownMenuItem className="cursor-pointer" onClick={() => router.push("/profile")}>
                  <User className="mr-2 h-4 w-4" />
                  Profile Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-destructive focus:text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
