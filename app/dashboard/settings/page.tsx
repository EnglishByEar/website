"use client"

import type React from "react"

import { useState, useEffect, } from "react"
import { useSupabase } from "@/components/supabase-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"

export default function SettingsPage() {
  const { supabase, user } = useSupabase()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [profile, setProfile] = useState({
    username: "",
    email: "",
    fullName: "",
    bio: "",
    nativeLanguage: "english",
    avatar_url: "man",
  })
  const [preferences, setPreferences] = useState({
    darkMode: true,
    notifications: true,
    soundEffects: true,
    autoPlayAudio: false,
    defaultDifficulty: "simple",
  })

  // const [avatarUploading, setAvatarUploading] = useState(false)
  // const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user || !supabase) return

      try {
        const { data, error } = await supabase.from("profiles").select("*").eq("id", user.id).single()

        if (error) {
          if (error.code === "42P01" || error.message?.includes("does not exist")) {
            console.warn("profiles table not found – skipping profile fetch.")
            return
          }
          throw error
        }

        setProfile({
          username: data.username || "",
          email: user.email || "",
          fullName: data.full_name || "",
          bio: data.bio || "",
          nativeLanguage: data.native_language || "english",
          avatar_url: data.avatar_url || "man",
        })

        // In a real app, you would fetch preferences from the database
        setPreferences({
          darkMode: true,
          notifications: true,
          soundEffects: true,
          autoPlayAudio: false,
          defaultDifficulty: "simple",
        })
      } catch (error) {
        console.error("Error fetching profile:", error)
      }
    }

    fetchProfile()
  }, [supabase, user])

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (!supabase || !user) {
        throw new Error("Supabase client not initialized or user not logged in")
      }

      const { error } = await supabase
        .from("profiles")
        .update({
          username: profile.username,
          full_name: profile.fullName,
          bio: profile.bio,
          native_language: profile.nativeLanguage,
          avatar_url: profile.avatar_url,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user?.id)

      if (error) throw error

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      })
    } catch (error: any) {
      toast({
        title: "Update failed",
        description: error.message || "There was an error updating your profile.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handlePreferencesUpdate = async () => {
    setLoading(true)

    try {
      // In a real app, you would save preferences to the database
      toast({
        title: "Preferences updated",
        description: "Your preferences have been updated successfully.",
      })
    } catch (error: any) {
      toast({
        title: "Update failed",
        description: error.message || "There was an error updating your preferences.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    // Password change logic would go here
    toast({
      title: "Password reset email sent",
      description: "Check your email for a link to reset your password.",
    })
  }


  const getAvatarSrc = (avatar: string) => {
    switch (avatar) {
      case "woman":
        return "/avatars/woman.jpg"
      case "man":
      default:
        return "/avatars/man.jpg"
    }
  }

  return (
    <div className="grid gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
      </div>

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
        </TabsList>
        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your profile information and how others see you on EnglishByEar</CardDescription>
            </CardHeader>
            <form onSubmit={handleProfileUpdate}>
              <CardContent className="space-y-6">
                <div className="flex flex-col gap-6 sm:flex-row">
                  <div className="flex flex-col items-center gap-4">
                    <Avatar className="h-24 w-24">
                      <AvatarImage
                        src={getAvatarSrc(profile.avatar_url)}
                        alt={profile.username}
                      />
                      <AvatarFallback>
                        {profile.username.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>

                    <div className="space-y-2">
                      <Label>Profile Picture</Label>

                      <div className="flex gap-3">
                        <button
                          type="button"
                          onClick={() =>
                            setProfile((prev) => ({
                              ...prev,
                              avatar_url: "man",
                            }))
                          }
                          className={`rounded-xl border-2 p-2 transition ${profile.avatar_url === "man"
                            ? "border-primary"
                            : "border-transparent hover:border-muted-foreground"
                            }`}
                        >
                          <Image
                            src="/avatars/man.jpg"
                            height={50}
                            width={50}
                            alt="Man"
                            className="h-16 w-16 rounded-full object-cover"
                          />
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            setProfile((prev) => ({
                              ...prev,
                              avatar_url: "woman",
                            }))
                          }
                          className={`rounded-xl border-2 p-2 transition ${profile.avatar_url === "woman"
                            ? "border-primary"
                            : "border-transparent hover:border-muted-foreground"
                            }`}
                        >
                          <Image
                            src="/avatars/woman.jpg"
                            height={50}
                            width={50}
                            alt="Woman"
                            className="h-16 w-16 rounded-full object-cover"
                          />
                        </button>
                      </div>

                      <p className="text-xs text-muted-foreground">
                        Choose your profile picture.
                      </p>
                    </div>
                  </div>
                  <div className="grid flex-1 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="username">Username</Label>
                      <Input
                        id="username"
                        value={profile.username}
                        disabled
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" value={profile.email} disabled />
                      <p className="text-xs text-muted-foreground">
                        Your email cannot be changed. Contact support for assistance.
                      </p>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      value={profile.fullName}
                      onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Input
                      id="bio"
                      value={profile.bio}
                      onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="nativeLanguage">Native Language</Label>
                    <Select
                      value={profile.nativeLanguage}
                      onValueChange={(value) => setProfile({ ...profile, nativeLanguage: value })}
                    >
                      <SelectTrigger id="nativeLanguage">
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="english">English</SelectItem>
                        <SelectItem value="spanish">Spanish</SelectItem>
                        <SelectItem value="french">French</SelectItem>
                        <SelectItem value="german">German</SelectItem>
                        <SelectItem value="chinese">Chinese</SelectItem>
                        <SelectItem value="japanese">Japanese</SelectItem>
                        <SelectItem value="korean">Korean</SelectItem>
                        <SelectItem value="russian">Russian</SelectItem>
                        <SelectItem value="arabic">Arabic</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={loading}>
                  {loading ? "Saving..." : "Save Changes"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
        <TabsContent value="preferences" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Preferences</CardTitle>
              <CardDescription>Customize your experience on EnglishByEar</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Appearance</h3>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="darkMode">Dark Mode</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable dark mode for a more comfortable viewing experience
                    </p>
                  </div>
                  <Switch
                    id="darkMode"
                    checked={preferences.darkMode}
                    onCheckedChange={(checked) => setPreferences({ ...preferences, darkMode: checked })}
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Notifications</h3>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="notifications">Enable Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications for new challenges and achievements
                    </p>
                  </div>
                  <Switch
                    id="notifications"
                    checked={preferences.notifications}
                    onCheckedChange={(checked) => setPreferences({ ...preferences, notifications: checked })}
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Exercise Settings</h3>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="soundEffects">Sound Effects</Label>
                    <p className="text-sm text-muted-foreground">Play sounds for correct and incorrect answers</p>
                  </div>
                  <Switch
                    id="soundEffects"
                    checked={preferences.soundEffects}
                    onCheckedChange={(checked) => setPreferences({ ...preferences, soundEffects: checked })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="autoPlayAudio">Auto-Play Audio</Label>
                    <p className="text-sm text-muted-foreground">Automatically play audio when starting an exercise</p>
                  </div>
                  <Switch
                    id="autoPlayAudio"
                    checked={preferences.autoPlayAudio}
                    onCheckedChange={(checked) => setPreferences({ ...preferences, autoPlayAudio: checked })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="defaultDifficulty">Default Difficulty</Label>
                  <Select
                    value={preferences.defaultDifficulty}
                    onValueChange={(value) => setPreferences({ ...preferences, defaultDifficulty: value })}
                  >
                    <SelectTrigger id="defaultDifficulty">
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="simple">Simple</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handlePreferencesUpdate} disabled={loading}>
                {loading ? "Saving..." : "Save Preferences"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="account" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Account Security</CardTitle>
              <CardDescription>Manage your account security settings</CardDescription>
            </CardHeader>
            <form onSubmit={handlePasswordChange}>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input id="currentPassword" type="password" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input id="newPassword" type="password" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input id="confirmPassword" type="password" />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit">Change Password</Button>
              </CardFooter>
            </form>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Delete Account</CardTitle>
              <CardDescription>Permanently delete your account and all associated data</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                This action cannot be undone. Once you delete your account, all of your data will be permanently removed
                from our servers.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="destructive">Delete Account</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
