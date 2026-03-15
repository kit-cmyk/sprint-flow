import { ClientDashboardContent } from "@/components/client/client-dashboard-content"

export default function ClientDashboardPage() {
  // Set hasReports to false to see empty state demo (no reports created yet)
  // Set hasReports to true to see full data
  return <ClientDashboardContent hasReports={false} />
}
