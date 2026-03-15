"use client"

import { use, useState } from "react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { LayoutDashboard, TableProperties, Settings, UsersRound } from "lucide-react"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getTeamBySlug, getTeamDevelopers, getTeamPods } from "@/lib/team-data"
import { TeamOverview } from "@/components/team/team-overview"
import { TeamAllocationMatrix } from "@/components/team/team-allocation-matrix"
import { TeamSettings } from "@/components/team/team-settings"

const tabs = [
  { value: "overview",    label: "Overview",          icon: LayoutDashboard },
  { value: "allocation",  label: "Allocation Matrix",  icon: TableProperties },
  { value: "settings",    label: "Settings",           icon: Settings },
] as const

export default function TeamDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = use(params)
  const team = getTeamBySlug(slug)

  if (!team) notFound()

  const [activeTab, setActiveTab] = useState<string>("overview")

  const developers = getTeamDevelopers(team)
  const pods = getTeamPods(team)

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="border-b border-border px-4 py-4 md:px-6 lg:px-8">
        <div className="flex flex-col gap-3">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/">Command Center</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{team.name}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <UsersRound className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h1 className="text-base font-semibold text-foreground md:text-lg">
                  {team.name}
                </h1>
                {team.description && (
                  <p className="text-xs text-muted-foreground">{team.description}</p>
                )}
              </div>
            </div>

            {/* Summary pills */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="flex items-center gap-1.5 rounded-full border border-border bg-muted/40 px-2.5 py-1 text-xs font-medium text-muted-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                {developers.length} developer{developers.length !== 1 ? "s" : ""}
              </span>
              <span className="flex items-center gap-1.5 rounded-full border border-border bg-muted/40 px-2.5 py-1 text-xs font-medium text-muted-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-primary/50" />
                {pods.length} project{pods.length !== 1 ? "s" : ""}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-1 flex-col">
        <div className="sticky top-12 z-20 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="overflow-x-auto px-4 md:px-6 lg:px-8">
            <TabsList className="h-auto w-max min-w-full justify-start gap-0 rounded-none bg-transparent p-0 sm:w-full">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <TabsTrigger
                    key={tab.value}
                    value={tab.value}
                    className="relative shrink-0 gap-2 rounded-none border-b-2 border-transparent px-3 py-3 text-xs font-medium text-muted-foreground shadow-none transition-none data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none sm:px-4 sm:text-sm"
                  >
                    <Icon className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </TabsTrigger>
                )
              })}
            </TabsList>
          </div>
        </div>

        <TabsContent value="overview" className="mt-0 flex-1">
          <div className="px-4 py-6 md:px-6 lg:px-8">
            <TeamOverview team={team} />
          </div>
        </TabsContent>

        <TabsContent value="allocation" className="mt-0 flex-1">
          <div className="px-4 py-6 md:px-6 lg:px-8">
            <TeamAllocationMatrix team={team} />
          </div>
        </TabsContent>

        <TabsContent value="settings" className="mt-0 flex-1">
          <div className="px-4 py-6 md:px-6 lg:px-8">
            <TeamSettings team={team} />
          </div>
        </TabsContent>
      </Tabs>

      <footer className="border-t border-border px-4 py-3 md:px-6 lg:px-8">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Assembled Systems v2.4.1</span>
          <span>Last synced: 2 min ago</span>
        </div>
      </footer>
    </div>
  )
}
