"use client"

// The PO profile reuses the same ProfileSettings component used across the app.
// It is scoped to the PO session data (name, email, role label).
import { ProfileSettings } from "@/components/admin/profile-settings"

export function POProfile() {
  return <ProfileSettings />
}
