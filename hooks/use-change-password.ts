"use client"

import { useCallback, useState } from "react"
import { useSupabase } from "@/components/supabase-provider"
import { useToast } from "@/hooks/use-toast"
import { MIN_PASSWORD_LENGTH } from "@/lib/constant"

export interface PasswordValues {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

export function useChangePassword() {
  const { supabase, user } = useSupabase()
  const { toast } = useToast()
  const [isSaving, setIsSaving] = useState(false)

  const fail = useCallback(
    (description: string) => {
      toast({ title: "Password not changed", description, variant: "destructive" })
      return false
    },
    [toast],
  )

  const changePassword = useCallback(
    async ({ currentPassword, newPassword, confirmPassword }: PasswordValues): Promise<boolean> => {
      if (!supabase || !user?.email) return fail("You need to be signed in to change your password.")
      if (newPassword.length < MIN_PASSWORD_LENGTH) return fail(`Use at least ${MIN_PASSWORD_LENGTH} characters.`)
      if (newPassword !== confirmPassword) return fail("The new passwords don't match.")

      setIsSaving(true)
      try {
        const { error: authError } = await supabase.auth.signInWithPassword({
          email: user.email,
          password: currentPassword,
        })
        if (authError) return fail("Your current password is incorrect.")

        const { error } = await supabase.auth.updateUser({ password: newPassword })
        if (error) throw error

        toast({ title: "Password updated", description: "Your password has been changed." })
        return true
      } catch (error: any) {
        return fail(error.message || "There was an error changing your password.")
      } finally {
        setIsSaving(false)
      }
    },
    [supabase, user, toast, fail],
  )

  return { changePassword, isSaving }
}