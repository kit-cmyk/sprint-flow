"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Building2, Mail, Globe, Clock, Check, AlertTriangle, Pencil, X, Upload, ImageIcon } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { useOrgIdentity, setOrgIdentity, resetOrgIdentity } from "@/lib/org-store"
import { useRef } from "react"

const timezones = [
  "UTC",
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "America/Toronto",
  "America/Vancouver",
  "Europe/London",
  "Europe/Paris",
  "Europe/Berlin",
  "Asia/Tokyo",
  "Asia/Singapore",
  "Asia/Sydney",
  "Australia/Sydney",
]

function SectionHeader({
  icon: Icon,
  title,
  editing,
  saved,
  onEdit,
  onCancel,
  onSave,
}: {
  icon: React.ElementType
  title: string
  editing: boolean
  saved: boolean
  onEdit: () => void
  onCancel: () => void
  onSave: () => void
}) {
  return (
    <div className="mb-5 flex items-center justify-between gap-2">
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-muted-foreground" />
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      </div>
      <div className="flex items-center gap-2">
        {saved && !editing && (
          <span className="flex items-center gap-1 text-[11px] text-emerald-500">
            <Check className="h-3 w-3" /> Saved
          </span>
        )}
        {editing ? (
          <>
            <Button size="sm" variant="ghost" className="h-7 gap-1.5 px-2 text-xs text-muted-foreground" onClick={onCancel}>
              <X className="h-3.5 w-3.5" />
              Cancel
            </Button>
            <Button size="sm" className="h-7 gap-1.5 px-2 text-xs" onClick={onSave}>
              <Check className="h-3.5 w-3.5" />
              Save
            </Button>
          </>
        ) : (
          <Button size="sm" variant="ghost" className="h-7 gap-1.5 px-2 text-xs text-muted-foreground hover:text-foreground" onClick={onEdit}>
            <Pencil className="h-3.5 w-3.5" />
            Edit
          </Button>
        )}
      </div>
    </div>
  )
}

function ReadOnlyField({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-0.5">
      <p className="text-[11px] font-medium text-muted-foreground">{label}</p>
      <p className="text-sm text-foreground">{value || <span className="italic text-muted-foreground/50">Not set</span>}</p>
    </div>
  )
}

export function SettingsGeneral() {
  const orgIdentity = useOrgIdentity()
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Profile section state
  const [profileEditing, setProfileEditing] = useState(false)
  const [profileSaved, setProfileSaved] = useState(false)
  const [orgName, setOrgName] = useState(orgIdentity.name)
  const [website, setWebsite] = useState("https://assembledsystems.com")
  const [supportEmail, setSupportEmail] = useState("support@assembledsystems.com")
  const [billingEmail, setBillingEmail] = useState("billing@assembledsystems.com")
  // Draft values for profile
  const [draftOrgName, setDraftOrgName] = useState(orgName)
  const [draftWebsite, setDraftWebsite] = useState(website)
  const [draftSupportEmail, setDraftSupportEmail] = useState(supportEmail)
  const [draftBillingEmail, setDraftBillingEmail] = useState(billingEmail)
  const [draftLogoUrl, setDraftLogoUrl] = useState<string | null>(orgIdentity.logoUrl)

  // Timezone section state
  const [tzEditing, setTzEditing] = useState(false)
  const [tzSaved, setTzSaved] = useState(false)
  const [timezone, setTimezone] = useState("America/New_York")
  const [draftTimezone, setDraftTimezone] = useState(timezone)

  const [showResetDialog, setShowResetDialog] = useState(false)

  function startProfileEdit() {
    setDraftOrgName(orgName)
    setDraftWebsite(website)
    setDraftSupportEmail(supportEmail)
    setDraftBillingEmail(billingEmail)
    setDraftLogoUrl(orgIdentity.logoUrl)
    setProfileEditing(true)
    setProfileSaved(false)
  }

  function handleLogoFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      setDraftLogoUrl(ev.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  function cancelProfileEdit() {
    setProfileEditing(false)
  }

  function saveProfile() {
    setOrgName(draftOrgName)
    setWebsite(draftWebsite)
    setSupportEmail(draftSupportEmail)
    setBillingEmail(draftBillingEmail)
    setOrgIdentity({ name: draftOrgName, logoUrl: draftLogoUrl })
    setProfileEditing(false)
    setProfileSaved(true)
    setTimeout(() => setProfileSaved(false), 3000)
  }

  function startTzEdit() {
    setDraftTimezone(timezone)
    setTzEditing(true)
    setTzSaved(false)
  }

  function cancelTzEdit() {
    setTzEditing(false)
  }

  function saveTz() {
    setTimezone(draftTimezone)
    setTzEditing(false)
    setTzSaved(true)
    setTimeout(() => setTzSaved(false), 3000)
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Organization Profile */}
      <Card className="border-border bg-card">
        <CardContent className="p-5">
          <SectionHeader
            icon={Building2}
            title="Organization Profile"
            editing={profileEditing}
            saved={profileSaved}
            onEdit={startProfileEdit}
            onCancel={cancelProfileEdit}
            onSave={saveProfile}
          />

          {profileEditing ? (
            <div className="flex flex-col gap-5">
              {/* Logo upload */}
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border bg-muted">
                  {draftLogoUrl ? (
                    <img src={draftLogoUrl} alt="Organization logo" className="h-full w-full object-cover" />
                  ) : (
                    <ImageIcon className="h-6 w-6 text-muted-foreground" />
                  )}
                </div>
                <div className="flex flex-col gap-1.5">
                  <p className="text-xs font-medium text-foreground">Organization Logo</p>
                  <p className="text-[11px] text-muted-foreground">Displayed in the sidebar. PNG, JPG or SVG, max 1 MB.</p>
                  <div className="flex items-center gap-2">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/png,image/jpeg,image/svg+xml"
                      className="hidden"
                      onChange={handleLogoFile}
                    />
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      className="h-7 gap-1.5 text-xs"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload className="h-3.5 w-3.5" />
                      Upload
                    </Button>
                    {draftLogoUrl && (
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        className="h-7 px-2 text-xs text-muted-foreground hover:text-destructive"
                        onClick={() => setDraftLogoUrl(null)}
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="org-name" className="text-xs font-medium text-muted-foreground">
                  Organization Name
                </Label>
                <Input
                  id="org-name"
                  value={draftOrgName}
                  onChange={(e) => setDraftOrgName(e.target.value)}
                  className="border-border bg-background text-foreground"
                  placeholder="Your organization name"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="website" className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                  <Globe className="h-3 w-3" />
                  Website
                </Label>
                <Input
                  id="website"
                  value={draftWebsite}
                  onChange={(e) => setDraftWebsite(e.target.value)}
                  className="border-border bg-background text-foreground"
                  placeholder="https://yoursite.com"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="support-email" className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                  <Mail className="h-3 w-3" />
                  Support Email
                </Label>
                <Input
                  id="support-email"
                  type="email"
                  value={draftSupportEmail}
                  onChange={(e) => setDraftSupportEmail(e.target.value)}
                  className="border-border bg-background text-foreground"
                  placeholder="support@yourorg.com"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="billing-email" className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                  <Mail className="h-3 w-3" />
                  Billing Email
                </Label>
                <Input
                  id="billing-email"
                  type="email"
                  value={draftBillingEmail}
                  onChange={(e) => setDraftBillingEmail(e.target.value)}
                  className="border-border bg-background text-foreground"
                  placeholder="billing@yourorg.com"
                />
              </div>
            </div>
            </div>
          ) : (
            <div className="flex flex-col gap-5">
              {orgIdentity.logoUrl && (
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border bg-muted">
                    <img src={orgIdentity.logoUrl} alt="Organization logo" className="h-full w-full object-cover" />
                  </div>
                  <p className="text-xs text-muted-foreground">Current logo</p>
                </div>
              )}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <ReadOnlyField label="Organization Name" value={orgName} />
              <ReadOnlyField label="Website" value={website} />
              <ReadOnlyField label="Support Email" value={supportEmail} />
              <ReadOnlyField label="Billing Email" value={billingEmail} />
            </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Timezone */}
      <Card className="border-border bg-card">
        <CardContent className="p-5">
          <SectionHeader
            icon={Clock}
            title="Timezone & Locale"
            editing={tzEditing}
            saved={tzSaved}
            onEdit={startTzEdit}
            onCancel={cancelTzEdit}
            onSave={saveTz}
          />

          {tzEditing ? (
            <div className="max-w-xs space-y-1.5">
              <Label htmlFor="timezone" className="text-xs font-medium text-muted-foreground">
                Default Timezone
              </Label>
              <select
                id="timezone"
                value={draftTimezone}
                onChange={(e) => setDraftTimezone(e.target.value)}
                className="h-9 w-full rounded-md border border-border bg-background px-3 text-sm text-foreground"
              >
                {timezones.map((tz) => (
                  <option key={tz} value={tz}>{tz}</option>
                ))}
              </select>
              <p className="text-[11px] text-muted-foreground">
                Used for pulse check scheduling and sprint date display.
              </p>
            </div>
          ) : (
            <div className="space-y-0.5">
              <p className="text-[11px] font-medium text-muted-foreground">Default Timezone</p>
              <p className="text-sm text-foreground">{timezone}</p>
              <p className="mt-1 text-[11px] text-muted-foreground">
                Used for pulse check scheduling and sprint date display.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-red-500/20 bg-card">
        <CardContent className="p-5">
          <div className="mb-3 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-red-400" />
            <h3 className="text-sm font-semibold text-red-400">Danger Zone</h3>
          </div>
          <p className="mb-4 text-xs text-muted-foreground">
            Resetting organization settings will revert all general settings to their default values. This cannot be undone.
          </p>
          <Button
            size="sm"
            variant="outline"
            className="border-red-500/30 text-xs text-red-400 hover:bg-red-500/10 hover:text-red-400"
            onClick={() => setShowResetDialog(true)}
          >
            Reset Organization Settings
          </Button>
        </CardContent>
      </Card>

      {/* Reset Confirmation Dialog */}
      <Dialog open={showResetDialog} onOpenChange={setShowResetDialog}>
        <DialogContent className="border-border bg-card sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-foreground">
              <AlertTriangle className="h-4 w-4 text-red-400" />
              Reset Organization Settings
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            This will reset all organization settings to their defaults. This action cannot be undone.
          </p>
          <DialogFooter className="gap-2">
            <Button variant="outline" size="sm" onClick={() => setShowResetDialog(false)}>
              Cancel
            </Button>
            <Button
              size="sm"
              className="bg-red-500 text-white hover:bg-red-600"
              onClick={() => {
                resetOrgIdentity()
                setOrgName("Assembled Systems")
                setWebsite("https://assembledsystems.com")
                setSupportEmail("support@assembledsystems.com")
                setBillingEmail("billing@assembledsystems.com")
                setTimezone("America/New_York")
                setDraftOrgName("Assembled Systems")
                setDraftWebsite("https://assembledsystems.com")
                setDraftSupportEmail("support@assembledsystems.com")
                setDraftBillingEmail("billing@assembledsystems.com")
                setDraftTimezone("America/New_York")
                setDraftLogoUrl(null)
                setProfileEditing(false)
                setTzEditing(false)
                setShowResetDialog(false)
              }}
            >
              Reset Settings
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
