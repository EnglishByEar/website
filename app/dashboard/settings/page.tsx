"use client"

import { User, ShieldCheck } from "lucide-react"
import { useSupabase } from "@/components/supabase-provider"
import { AccountTab } from "@/components/settings/account-tabs"
import { ProfileForm } from "@/components/settings/profile-form"
import { SettingsTabs, type SettingsTab } from "@/components/settings/setting-tabs"

const TABS: SettingsTab[] = [
  {
    value: "profile",
    label: "Profile",
    icon: <User className="h-4 w-4" />,
    description: "Update how your name and details appear in the app.",
    content: <ProfileForm />,
  },
  {
    value: "account",
    label: "Account",
    icon: <ShieldCheck className="h-4 w-4" />,
    description: "Manage your sign-in details and account security.",
    content: <AccountTab />,
  },
]

export default function SettingsPage() {
  const { user } = useSupabase()
  const email: string | undefined = user?.email
  const name: string | undefined = user?.user_metadata?.username || user?.user_metadata?.full_name
  const initial = (name || email || "?").charAt(0).toUpperCase()

  return (
    <div className="grid gap-6 py-4">
      <section className="flex items-center gap-4 rounded-3xl bg-primary p-5 text-primary-foreground sm:p-6">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-accent text-2xl font-bold text-accent-foreground sm:h-16 sm:w-16">
          {initial}
        </div>
        <div className="min-w-0">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Settings</h1>
          <p className="truncate text-sm text-primary-foreground/80">
            {name ? `${name}${email ? ` · ${email}` : ""}` : email ?? "Manage your profile and account"}
          </p>
        </div>
      </section>

      <SettingsTabs tabs={TABS} />
    </div>
  )
}