"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { User, Mail, Building2, Phone, MapPin, Save } from "lucide-react"

const initialProfile = {
  name: "Alex Morgan",
  email: "alex@clientcompany.com",
  company: "Client Company Inc.",
  phone: "+1 (555) 234-5678",
  location: "San Francisco, CA",
  role: "VP of Engineering",
}

export default function ClientProfilePage() {
  const [profile, setProfile] = useState(initialProfile)
  const [saved, setSaved] = useState(false)

  function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <main className="flex-1 px-4 py-6 pt-16 sm:px-6 sm:pt-8 lg:px-10">
      <div className="mx-auto max-w-[720px]">
        <h1 className="text-2xl font-bold text-[hsl(220,15%,15%)]">Profile</h1>
        <p className="mt-1 text-sm text-[hsl(220,10%,46%)]">
          Manage your account information and preferences.
        </p>

        <form onSubmit={handleSave} className="mt-8 flex flex-col gap-6">
          {/* Avatar section */}
          <Card className="border-[hsl(220,13%,90%)] bg-white shadow-sm">
            <CardContent className="flex items-center gap-5 p-6">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[hsl(160,51%,42%)]/10 text-xl font-bold text-[hsl(160,51%,42%)]">
                AM
              </div>
              <div>
                <p className="text-base font-semibold text-[hsl(220,15%,15%)]">{profile.name}</p>
                <p className="text-sm text-[hsl(220,10%,46%)]">{profile.role} at {profile.company}</p>
              </div>
            </CardContent>
          </Card>

          {/* Fields */}
          <Card className="border-[hsl(220,13%,90%)] bg-white shadow-sm">
            <CardContent className="flex flex-col gap-5 p-6">
              <FieldRow icon={User} label="Full name" value={profile.name} onChange={(v) => setProfile({ ...profile, name: v })} />
              <FieldRow icon={Mail} label="Email address" value={profile.email} onChange={(v) => setProfile({ ...profile, email: v })} type="email" />
              <FieldRow icon={Building2} label="Company" value={profile.company} onChange={(v) => setProfile({ ...profile, company: v })} />
              <FieldRow icon={Phone} label="Phone" value={profile.phone} onChange={(v) => setProfile({ ...profile, phone: v })} type="tel" />
              <FieldRow icon={MapPin} label="Location" value={profile.location} onChange={(v) => setProfile({ ...profile, location: v })} />
            </CardContent>
          </Card>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              className="flex h-10 items-center gap-2 rounded-lg bg-[hsl(160,51%,42%)] px-5 text-sm font-semibold text-white transition-colors hover:bg-[hsl(160,51%,36%)]"
            >
              <Save className="h-4 w-4" />
              Save changes
            </button>
            {saved && (
              <span className="text-sm font-medium text-[hsl(160,51%,42%)]">
                Profile updated successfully.
              </span>
            )}
          </div>
        </form>
      </div>
    </main>
  )
}

function FieldRow({
  icon: Icon,
  label,
  value,
  onChange,
  type = "text",
}: {
  icon: React.ElementType
  label: string
  value: string
  onChange: (v: string) => void
  type?: string
}) {
  return (
    <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:gap-4">
      <label className="flex w-36 shrink-0 items-center gap-2 text-sm font-medium text-[hsl(220,15%,15%)]">
        <Icon className="h-4 w-4 text-[hsl(220,10%,55%)]" />
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-10 w-full rounded-lg border border-[hsl(220,13%,87%)] bg-white px-3.5 text-sm text-[hsl(220,15%,15%)] outline-none transition-colors focus:border-[hsl(160,51%,42%)] focus:ring-2 focus:ring-[hsl(160,51%,42%)]/20"
      />
    </div>
  )
}
