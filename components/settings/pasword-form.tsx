"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useChangePassword, type PasswordValues } from "@/hooks/use-change-password"
import { TextField } from "@/components/settings/form-fields"
import { SettingsCard } from "@/components/settings/setting-card"

const EMPTY: PasswordValues = { currentPassword: "", newPassword: "", confirmPassword: "" }

const FIELDS: { key: keyof PasswordValues; label: string; autoComplete: string }[] = [
  { key: "currentPassword", label: "Current Password", autoComplete: "current-password" },
  { key: "newPassword", label: "New Password", autoComplete: "new-password" },
  { key: "confirmPassword", label: "Confirm New Password", autoComplete: "new-password" },
]

export function PasswordForm() {
  const [values, setValues] = useState<PasswordValues>(EMPTY)
  const { changePassword, isSaving } = useChangePassword()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (await changePassword(values)) setValues(EMPTY)
  }

  return (
    <SettingsCard
      title="Account Security"
      description="Manage your account security settings"
      onSubmit={handleSubmit}
      footer={
        <Button type="submit" disabled={isSaving}>
          {isSaving ? "Updating..." : "Change Password"}
        </Button>
      }
    >
      {FIELDS.map(({ key, label, autoComplete }) => (
        <TextField
          key={key}
          id={key}
          label={label}
          type="password"
          autoComplete={autoComplete}
          value={values[key]}
          onValueChange={(v) => setValues((prev) => ({ ...prev, [key]: v }))}
          required
        />
      ))}
    </SettingsCard>
  )
}