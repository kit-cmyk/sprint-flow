import { notFound } from "next/navigation"
import { pods } from "@/lib/pod-data"
import { developers, getDeveloperBySlug } from "@/lib/developer-data"
import { DevHeader } from "@/components/developer/dev-header"
import { WorkloadSnapshot } from "@/components/developer/workload-snapshot"
import { DevFlowMetrics } from "@/components/developer/dev-flow-metrics"
import { ActiveWorkTable } from "@/components/developer/active-work-table"
import { PrActivity } from "@/components/developer/pr-activity"
import { AllocationView } from "@/components/developer/allocation-view"
import { RiskSignals } from "@/components/developer/risk-signals"

export function generateStaticParams() {
  const params: { slug: string; devSlug: string }[] = []
  for (const pod of pods) {
    for (const dev of developers) {
      if (dev.allocations.some((a) => a.podName.toLowerCase().replace(/ /g, "-") === pod.slug)) {
        params.push({ slug: pod.slug, devSlug: dev.slug })
      }
    }
  }
  return params
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; devSlug: string }>
}) {
  const { devSlug } = await params
  const dev = getDeveloperBySlug(devSlug)
  if (!dev) return { title: "Developer Not Found" }
  return {
    title: `${dev.name} - Workload Dashboard | Assembled Systems`,
    description: `Individual workload, momentum, and risk signals for ${dev.name}`,
  }
}

export default async function DeveloperDetailPage({
  params,
}: {
  params: Promise<{ slug: string; devSlug: string }>
}) {
  const { slug, devSlug } = await params
  const dev = getDeveloperBySlug(devSlug)

  if (!dev) {
    notFound()
  }

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
