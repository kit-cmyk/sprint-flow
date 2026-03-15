"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  FolderKanban,
  UsersRound,
  ChevronDown,
  Plus,
  Settings,
} from "lucide-react"
import { AddPodModal } from "@/components/add-pod-modal"
import { pods } from "@/lib/pod-data"
import { teams } from "@/lib/team-data"
import { useOrgIdentity } from "@/lib/org-store"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

function podStatusColor(healthScore: number) {
  if (healthScore >= 80) return "bg-emerald-400"
  if (healthScore >= 60) return "bg-amber-400"
  return "bg-red-400"
}

export function AppSidebar() {
  const pathname = usePathname()
  const [addPodOpen, setAddPodOpen] = useState(false)
  const { name: orgName, logoUrl } = useOrgIdentity()

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarHeader className="p-3">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-primary/10">
            {logoUrl ? (
              <img src={logoUrl} alt={`${orgName} logo`} className="h-full w-full object-cover" />
            ) : (
              <svg
                width="18"
                height="18"
                viewBox="0 0 20 20"
                fill="none"
                className="text-primary"
                aria-hidden="true"
              >
                <rect x="2" y="2" width="7" height="7" rx="1.5" fill="currentColor" />
                <rect x="11" y="2" width="7" height="7" rx="1.5" fill="currentColor" opacity="0.6" />
                <rect x="2" y="11" width="7" height="7" rx="1.5" fill="currentColor" opacity="0.6" />
                <rect x="11" y="11" width="7" height="7" rx="1.5" fill="currentColor" opacity="0.3" />
              </svg>
            )}
          </div>
          <div className="flex flex-col group-data-[collapsible=icon]:hidden">
            <span className="text-sm font-semibold text-sidebar-foreground">
              {orgName}
            </span>
            <span className="text-[10px] leading-none text-sidebar-foreground/50">
              Delivery Control
            </span>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === "/"}
                  tooltip="Command Center"
                >
                  <Link href="/">
                    <LayoutDashboard className="h-4 w-4" />
                    <span>Command Center</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Projects / Pods */}
        <SidebarGroup>
          <SidebarGroupLabel>Projects</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <Collapsible defaultOpen className="group/collapsible">
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton tooltip="Projects">
                      <FolderKanban className="h-4 w-4" />
                      <span>All Pods</span>
                      <ChevronDown className="ml-auto h-3.5 w-3.5 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <SidebarMenuAction
                    onClick={(e) => {
                      e.stopPropagation()
                      setAddPodOpen(true)
                    }}
                    aria-label="Add new pod"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </SidebarMenuAction>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {pods.map((pod) => (
                        <SidebarMenuSubItem key={pod.slug}>
                          <SidebarMenuSubButton
                            asChild
                            isActive={pathname === `/pod/${pod.slug}` || pathname.startsWith(`/pod/${pod.slug}/`)}
                          >
                            <Link href={`/pod/${pod.slug}`}>
                              <span className={`h-2 w-2 shrink-0 rounded-full ${podStatusColor(pod.healthScore)}`} />
                              <span className="truncate">{pod.name}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Teams */}
        <SidebarGroup>
          <SidebarGroupLabel>Teams</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <Collapsible defaultOpen className="group/teams">
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton tooltip="Teams">
                      <UsersRound className="h-4 w-4" />
                      <span>All Teams</span>
                      <ChevronDown className="ml-auto h-3.5 w-3.5 transition-transform group-data-[state=open]/teams:rotate-180" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {teams.map((team) => (
                        <SidebarMenuSubItem key={team.slug}>
                          <SidebarMenuSubButton
                            asChild
                            isActive={pathname === `/team/${team.slug}` || pathname.startsWith(`/team/${team.slug}/`)}
                          >
                            <Link href={`/team/${team.slug}`}>
                              <span className="truncate">{team.name}</span>
                              <span className="ml-auto text-[10px] text-sidebar-foreground/40">
                                {team.podSlugs.length}p · {team.developerSlugs.length}d
                              </span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Settings */}
        <SidebarGroup>
          <SidebarGroupLabel>Settings</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === "/settings" || pathname.startsWith("/settings/")}
                  tooltip="Organization Settings"
                >
                  <Link href="/settings">
                    <Settings className="h-4 w-4" />
                    <span>Organization Settings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

      </SidebarContent>

      <SidebarFooter className="p-3 group-data-[collapsible=icon]:hidden">
        <div className="flex items-center gap-2 rounded-lg bg-sidebar-accent px-3 py-2">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/15 text-xs font-bold text-primary">
            SM
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-medium text-sidebar-foreground">
              Scrum Master
            </p>
            <p className="truncate text-[10px] text-sidebar-foreground/50">
              admin@assembled.dev
            </p>
          </div>
        </div>
      </SidebarFooter>

      <SidebarRail />
      <AddPodModal open={addPodOpen} onOpenChange={setAddPodOpen} />
    </Sidebar>
  )
}
