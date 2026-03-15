"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { usePulse } from "@/lib/hooks/usePulse"

export default function PulseChecksPage() {
  const { reports, isLoading } = usePulse()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && reports.length > 0) {
      router.replace(`/client-dashboard/pulse-checks/${reports[0].id}`)
    }
  }, [reports, isLoading, router])

  return null
}
