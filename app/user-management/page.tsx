import type { Metadata } from "next"
import { UserManagementView } from "@/components/admin/user-management-view"

export const metadata: Metadata = {
  title: "User Management | Assembled Systems",
  description: "Invite users, manage roles, and control access.",
}

export default function UserManagementPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1 px-4 py-6 md:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-balance text-lg font-semibold text-foreground md:text-xl">
            User Management
          </h1>
          <p className="mt-1 text-xs text-muted-foreground">
            Invite team members, manage roles, and control dashboard access
          </p>
        </div>
        <UserManagementView />
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
