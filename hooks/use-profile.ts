"use client"

import { useCallback, useEffect, useState } from "react"
import { useSupabase } from "@/components/supabase-provider"
import { useToast } from "@/hooks/use-toast"
import { DEFAULT_PROFILE } from "@/lib/constant"
import type { AvatarId, EditableProfile, Profile } from "@/types/setting"

const isMissingTable = (error: { code?: string; message?: string }) =>
  error.code === "42P01" || error.message?.includes("does not exist")

/** Owns all profile data access: fetch + update. UI components stay free of Supabase. */
export function useProfile() {
  const { supabase, user } = useSupabase()
  const { toast } = useToast()
  const [profile, setProfile] = useState<Profile>(DEFAULT_PROFILE)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (!user || !supabase) return
    let cancelled = false

    const fetchProfile = async () => {
      try {
        const { data, error } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle()

        if (error) {
          if (isMissingTable(error)) return console.warn("profiles table not found – skipping profile fetch.")
          throw error
        }
        if (cancelled) return

        setProfile({
          username: data?.username ?? "",
          email: user.email ?? "",
          fullName: data?.full_name ?? "",
          bio: data?.bio ?? "",
          nativeLanguage: data?.native_language ?? DEFAULT_PROFILE.nativeLanguage,
          avatarId: (data?.avatar_url as AvatarId) ?? DEFAULT_PROFILE.avatarId,
        })
      } catch (error) {
        console.error("Error fetching profile:", error)
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    fetchProfile()
    return () => {
      cancelled = true
    }
  }, [supabase, user])

  const updateProfile = useCallback(
    async (values: EditableProfile) => {
      setIsSaving(true)
      try {
        if (!supabase || !user) throw new Error("Supabase client not initialized or user not logged in")

        const { error } = await supabase
          .from("profiles")
          .update({
            full_name: values.fullName,
            bio: values.bio,
            native_language: values.nativeLanguage,
            avatar_url: values.avatarId,
            updated_at: new Date().toISOString(),
          })
          .eq("id", user.id)

        if (error) throw error

        setProfile((prev) => ({ ...prev, ...values }))
        toast({ title: "Profile updated", description: "Your profile has been updated successfully." })
      } catch (error: any) {
        toast({
          title: "Update failed",
          description: error.message || "There was an error updating your profile.",
          variant: "destructive",
        })
      } finally {
        setIsSaving(false)
      }
    },
    [supabase, user, toast],
  )

  return { profile, isLoading, isSaving, updateProfile }
}