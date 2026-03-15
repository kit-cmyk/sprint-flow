import type { Metadata } from "next"
import { AllDevelopersView } from "@/components/developer/all-developers-view"

export const metadata: Metadata = {
  title: "Team Pod | Assembled Systems",
  description: "Cross-pod team member workload, allocation, and risk overview.",
}

export default function DevelopersPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1 px-4 py-6 md:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-balance text-lg font-semibold text-foreground md:text-xl">
            Team Pod
          </h1>
          <p className="mt-1 text-xs text-muted-foreground">
            Cross-pod team member workload, allocation, and risk overview
          </p>
        </div>
        <AllDevelopersView />
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
