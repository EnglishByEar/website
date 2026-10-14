"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { LANGUAGES } from "@/lib/constant"
import { useProfile } from "@/hooks/use-profile"
import type { EditableProfile } from "@/types/setting"
import { AvatarPicker } from "@/components/settings/avatar-picker"
import { SelectField, TextField } from "@/components/settings/form-fields"
import { SettingsCard } from "@/components/settings/setting-card"

export function ProfileForm() {
  const { profile, isSaving, updateProfile } = useProfile()
  const [draft, setDraft] = useState<EditableProfile>(profile)

  // Re-sync the draft when the saved profile loads/changes.
  useEffect(() => setDraft(profile), [profile])

  const set = <K extends keyof EditableProfile>(key: K) => (value: EditableProfile[K]) =>
    setDraft((prev) => ({ ...prev, [key]: value }))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    updateProfile(draft)
  }

  return (
    <SettingsCard
      title="Profile Information"
      description="Update your profile information and how others see you on EnglishByEar"
      onSubmit={handleSubmit}
      contentClassName="space-y-6"
      footer={
        <Button type="submit" disabled={isSaving}>
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      }
    >
      <div className="flex flex-col gap-6 sm:flex-row">
        <AvatarPicker value={draft.avatarId} onChange={set("avatarId")} username={profile.username} />
        <div className="grid flex-1 gap-4">
          <TextField id="username" label="Username" value={profile.username} disabled />
          <TextField
            id="email"
            label="Email"
            value={profile.email}
            disabled
            hint="Your email cannot be changed. Contact support for assistance."
          />
        </div>
      </div>

      <Separator />

      <div className="grid gap-4">
        <TextField id="fullName" label="Full Name" value={draft.fullName} onValueChange={set("fullName")} />
        <TextField id="bio" label="Bio" value={draft.bio} onValueChange={set("bio")} />
        <SelectField
          id="nativeLanguage"
          label="Native Language"
          placeholder="Select language"
          value={draft.nativeLanguage}
          options={LANGUAGES}
          onValueChange={set("nativeLanguage")}
        />
      </div>
    </SettingsCard>
  )
}