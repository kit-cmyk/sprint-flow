"use client"

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { SprintProgress } from "@/components/pod/sprint-progress"
import { LiveRiskIndicators } from "@/components/pod/live-risk-indicators"
import { VelocityTracker } from "@/components/pod/velocity-tracker"
import { FlowMetrics } from "@/components/pod/flow-metrics"
import { WipControl } from "@/components/pod/wip-control"
import { BlockerPanel } from "@/components/pod/blocker-panel"
import { CommitmentIntegrity } from "@/components/pod/commitment-integrity"
import { AIObservations } from "@/components/pod/ai-observations"
import { DevPicker } from "@/components/developer/dev-picker"
import { PodBilling } from "@/components/pod/pod-billing"
import { PodClientPortalV2 } from "@/components/pod/pod-client-portal-v2"
import { PodSettings } from "@/components/pod/pod-settings"
import type { PodData } from "@/lib/pod-data"
import type { DeveloperData } from "@/lib/developer-data"
import {
  LayoutDashboard,
  Users,
  CreditCard,
  ExternalLink,
  Settings,
} from "lucide-react"

const tabs = [
  { value: "overview", label: "Overview", icon: LayoutDashboard },
  { value: "developers", label: "Team Pod", icon: Users },
  { value: "billing", label: "Billing", icon: CreditCard },
  { value: "client-portal", label: "Client Portal", icon: ExternalLink },
  { value: "settings", label: "Settings", icon: Settings },
] as const

export function PodTabs({
  pod,
  developers,
  hideTabs = [],
}: {
  pod: PodData
  developers: DeveloperData[]
  hideTabs?: string[]
}) {
  const visibleTabs = tabs.filter((t) => !hideTabs.includes(t.value))

  return (
    <Tabs defaultValue="overview" className="w-full">
      <div className="sticky top-12 z-20 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="overflow-x-auto px-4 md:px-6 lg:px-8">
          <TabsList className="h-auto w-max min-w-full justify-start gap-0 rounded-none bg-transparent p-0 sm:w-full">
            {visibleTabs.map((tab) => {
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

      {/* Overview Tab */}
      <TabsContent value="overview" className="mt-0">
        <div className="px-4 py-6 md:px-6 lg:px-8">
          <div className="flex flex-col gap-8">
            <SprintProgress pod={pod} />
            <LiveRiskIndicators />
            <VelocityTracker pod={pod} />
            <FlowMetrics />
            <WipControl />
            <BlockerPanel />
            <CommitmentIntegrity pod={pod} />
            <AIObservations />
          </div>
        </div>
      </TabsContent>

      {/* Developer Drill Down Tab */}
      <TabsContent value="developers" className="mt-0">
        <div className="px-4 py-6 md:px-6 lg:px-8">
          <DevPicker developers={developers} podSlug={pod.slug} />
        </div>
      </TabsContent>

      {/* Billing Tab */}
      <TabsContent value="billing" className="mt-0">
        <div className="px-4 py-6 md:px-6 lg:px-8">
          <PodBilling pod={pod} />
        </div>
      </TabsContent>

      {/* Client Portal Tab */}
      <TabsContent value="client-portal" className="mt-0">
        <div className="px-4 py-6 md:px-6 lg:px-8">
          <PodClientPortalV2 pod={pod} />
        </div>
      </TabsContent>

      {/* Settings Tab */}
      <TabsContent value="settings" className="mt-0">
        <div className="px-4 py-6 md:px-6 lg:px-8">
          <PodSettings pod={pod} />
        </div>
      </TabsContent>
    </Tabs>
  )
}
