"use client"

import { useSession } from "next-auth/react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { FileText } from "lucide-react"
import { pods } from "@/lib/pod-data"
import { PodHealthGrid } from "@/components/pod-health-grid"

const recentPulses = [
  { id: "p1", pod: "Momentum Pod", sprint: "Sprint 14", status: "published", date: "Mar 4, 2025" },
  { id: "p2", pod: "Velocity Pod", sprint: "Sprint 14", status: "draft",     date: "Mar 3, 2025" },
  { id: "p3", pod: "Momentum Pod", sprint: "Sprint 13", status: "published", date: "Feb 18, 2025" },
]

export default function PODashboard() {
  const { data: session } = useSession()
  const assignedPods = pods.filter((p) =>
    session?.user?.assignedPodSlugs?.includes(p.slug)
  )

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1 px-4 py-6 md:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-balance text-lg font-semibold text-foreground md:text-xl">
            Welcome back, {session?.user?.name?.split(" ")[0]}
          </h1>
          <p className="mt-1 text-xs text-muted-foreground">
            Your assigned pods &middot; Sprint 14
          </p>
        </div>

        <div className="flex flex-col gap-8">
          {/* Pod cards — reuses org admin pod card exactly */}
          <PodHealthGrid
            filteredPods={assignedPods}
            basePath="/po/pod"
            showAddPod={false}
          />

          {/* Recent pulse checks */}
          <section>
            <div className="mb-3 flex items-center justify-between gap-4">
              <h2 className="text-sm font-semibold text-foreground">Recent Pulse Checks</h2>
              <Link href="/po/pulse" className="text-[11px] font-medium text-primary hover:underline">
                View all
              </Link>
            </div>
            <Card className="border-border bg-card">
              <CardContent className="p-0">
                {recentPulses.map((pulse, i) => (
                  <div
                    key={pulse.id}
                    className={`flex items-center justify-between gap-4 px-5 py-3.5 ${
                      i < recentPulses.length - 1 ? "border-b border-border/50" : ""
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
                      <div>
                        <p className="text-xs font-medium text-foreground">{pulse.pod} &mdash; {pulse.sprint}</p>
                        <p className="text-[10px] text-muted-foreground">{pulse.date}</p>
                      </div>
                    </div>
                    <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                      pulse.status === "published"
                        ? "bg-emerald-500/10 text-emerald-400"
                        : "bg-amber-500/10 text-amber-400"
                    }`}>
                      {pulse.status}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </section>
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
