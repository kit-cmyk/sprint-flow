import type { Metadata } from "next"
import { ProfileSettings } from "@/components/admin/profile-settings"

export const metadata: Metadata = {
  title: "Profile | Assembled Systems",
  description: "Manage your personal account settings and preferences.",
}

export default function ProfilePage() {
  return (
    <main className="flex flex-col gap-6 px-4 py-6 md:px-6 lg:px-8">
      <div>
        <h1 className="text-balance text-lg font-semibold text-foreground md:text-xl">
          Profile Settings
        </h1>
        <p className="mt-1 text-xs text-muted-foreground">
          Manage your personal information, password, and notification preferences.
        </p>
      </div>
      <ProfileSettings />
    </main>
  )
}
