import type { Metadata } from "next"
import { ClientUserManagement } from "@/components/client/client-user-management"

export const metadata: Metadata = {
  title: "User Management - Assembled Client Portal",
  description: "Manage team members who have access to the client portal.",
}

export default function UsersPage() {
  return <ClientUserManagement />
}
