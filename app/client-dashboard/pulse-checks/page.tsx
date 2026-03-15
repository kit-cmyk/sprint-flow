import { redirect } from "next/navigation"
import { pulseReports } from "@/lib/pulse-data"

export default function PulseChecksPage() {
  // Redirect to the most recent report
  redirect(`/client-dashboard/pulse-checks/${pulseReports[0].id}`)
}
