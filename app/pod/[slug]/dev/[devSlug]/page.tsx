"use client"

import { use } from "react"
import { notFound } from "next/navigation"
import { useDeveloper } from "@/lib/hooks/useDevelopers"
import { DevHeader } from "@/components/developer/dev-header"
import { WorkloadSnapshot } from "@/components/developer/workload-snapshot"
import { DevFlowMetrics } from "@/components/developer/dev-flow-metrics"
import { ActiveWorkTable } from "@/components/developer/active-work-table"
import { PrActivity } from "@/components/developer/pr-activity"
import { AllocationView } from "@/components/developer/allocation-view"
import { RiskSignals } from "@/components/developer/risk-signals"

export default function DeveloperDetailPage({
  params,
}: {
  params: Promise<{ slug: string; devSlug: string }>
}) {
  const { slug, devSlug } = use(params)
  const { developer: dev, isLoading } = useDeveloper(devSlug)

  if (isLoading) return null
  if (!dev) notFound()

  return (
    <div className="flex min-h-screen flex-col">
      <DevHeader dev={dev} backSlug={slug} />
      <main className="flex-1 px-4 py-6 md:px-6 lg:px-8">
        <div className="flex flex-col gap-8">
          <WorkloadSnapshot dev={dev} />
          <DevFlowMetrics dev={dev} />
          <ActiveWorkTable dev={dev} />
          <PrActivity dev={dev} />
          <AllocationView dev={dev} />
          <RiskSignals dev={dev} />
        </div>
      </main>
      <footer className="border-t border-border px-4 py-3 md:px-6 lg:px-8">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Assembled Systems v2.4.1</span>
          <span>Last synced: 2 min ago</span>
        </div>
      </footer>
    </div>
  )
}
