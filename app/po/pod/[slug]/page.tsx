"use client"

import { use } from "react"
import { notFound } from "next/navigation"
import { useSession } from "next-auth/react"
import { usePod } from "@/lib/hooks/usePods"
import { PodDetailHeader } from "@/components/pod/pod-detail-header"
import { PodTabs } from "@/components/pod/pod-tabs"

export default function POPodDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = use(params)
  const { data: session, status } = useSession()
  const { pod, developers, isLoading } = usePod(slug)

  if (status === "loading" || isLoading) return null

  // PO can only access their assigned pods
  if (!session?.user?.assignedPodSlugs?.includes(slug)) {
    notFound()
  }

  if (!pod) notFound()

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
