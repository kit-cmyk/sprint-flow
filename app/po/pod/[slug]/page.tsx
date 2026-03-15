"use client"

import { use } from "react"
import { notFound } from "next/navigation"
import { getPodBySlug } from "@/lib/pod-data"
import { getDevelopersByPod } from "@/lib/developer-data"
import { PodDetailHeader } from "@/components/pod/pod-detail-header"
import { PodTabs } from "@/components/pod/pod-tabs"
import { poSession } from "@/lib/session-data"

export default function POPodDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = use(params)

  // PO can only access their assigned pods
  if (!poSession.assignedPodSlugs?.includes(slug)) {
    notFound()
  }

  const pod = getPodBySlug(slug)
  if (!pod) notFound()

  const developers = getDevelopersByPod(pod.slug)

  return (
    <div className="flex min-h-screen flex-col">
      <PodDetailHeader pod={pod} />
      {/* Billing is hidden for product owners */}
      <PodTabs pod={pod} developers={developers} hideTabs={["billing"]} />
      <footer className="border-t border-border px-4 py-3 md:px-6 lg:px-8">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Assembled Systems v2.4.1</span>
          <span>Last synced: 2 min ago</span>
        </div>
      </footer>
    </div>
  )
}
