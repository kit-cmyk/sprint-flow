import type { Metadata } from "next"
import { ClientDashboardShell } from "@/components/client/client-dashboard-shell"

export const metadata: Metadata = {
  title: "Assembled Systems - Client Delivery Portal",
  description:
    "Track your project progress, sprint outcomes, and upcoming priorities.",
}

export default function ClientDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <ClientDashboardShell>{children}</ClientDashboardShell>
}
