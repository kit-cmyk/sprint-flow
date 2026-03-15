"use client"

import { useState } from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import { SettingsNotifications } from "@/components/admin/settings-notifications"
import { Bell, User } from "lucide-react"
import { POProfile } from "@/components/po/po-profile"

const tabs = [
  { value: "profile", label: "Profile", icon: User },
  { value: "notifications", label: "Notifications", icon: Bell },
]

export default function POSettingsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1 px-4 py-6 md:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-balance text-lg font-semibold text-foreground">Settings</h1>
          <p className="mt-1 text-xs text-muted-foreground">Manage your profile and notification preferences.</p>
        </div>

        <Tabs defaultValue="profile" className="w-full">
          <div className="border-b border-border mb-6">
            <TabsList className="h-auto w-full justify-start gap-0 rounded-none bg-transparent p-0">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <TabsTrigger
                    key={tab.value}
                    value={tab.value}
                    className="relative shrink-0 gap-2 rounded-none border-b-2 border-transparent px-4 py-3 text-xs font-medium text-muted-foreground shadow-none transition-none data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none sm:text-sm"
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {tab.label}
                  </TabsTrigger>
                )
              })}
            </TabsList>
          </div>
          <TabsContent value="profile" className="mt-0">
            <POProfile />
          </TabsContent>
          <TabsContent value="notifications" className="mt-0">
            <SettingsNotifications />
          </TabsContent>
        </Tabs>
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
