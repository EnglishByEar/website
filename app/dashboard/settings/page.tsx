"use client"

import { AccountTab } from "@/components/settings/account-tabs"
import { ProfileForm } from "@/components/settings/profile-form"
import { SettingsTabs, type SettingsTab } from "@/components/settings/setting-tabs"

const TABS: SettingsTab[] = [
  { value: "profile", label: "Profile", content: <ProfileForm /> },
  { value: "account", label: "Account", content: <AccountTab /> },
]

export default function SettingsPage() {
  return (
    <div className="grid gap-6 px-2 py-4 sm:py-4">
      <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
      <SettingsTabs tabs={TABS} />
    </div>
  )
}