import type { Metadata } from "next"
import { SettingsContent } from "@/components/admin/settings-content"

export const metadata: Metadata = {
  title: "Organization Settings | Assembled Systems",
  description: "Manage your organization profile, integrations, members, notifications, and role permissions.",
}

export default function SettingsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1 px-4 py-6 md:px-6 lg:px-8">
        <SettingsContent />
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
