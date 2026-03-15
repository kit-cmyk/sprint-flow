import { ClientPulseReportContent } from "@/components/client/client-pulse-report-content"

export default function PulseReportPage({ params }: { params: { reportId: string } }) {
  return <ClientPulseReportContent reportId={params.reportId} />
}
