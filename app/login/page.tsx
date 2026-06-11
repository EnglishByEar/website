"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useSupabase } from "@/components/supabase-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Headphones, EyeClosed, Eye } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Logo from "@/components/Logo"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [visible, setVisible] = useState(false)
  const router = useRouter()
  const { supabase } = useSupabase()
  const { toast } = useToast()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (!supabase) {
        throw new Error("Supabase client not initialized")
      }

      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        throw error
      }

      // Check if profile exists, create if it doesn't
      if (authData.user) {
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", authData.user.id)
          .single()

        if (profileError && profileError.code === "PGRST116") {
          // Profile doesn't exist, create it
          const { error: createProfileError } = await supabase.from("profiles").insert({
            id: authData.user.id,
            username: authData.user.user_metadata?.username || authData.user.email?.split("@")[0] || "user",
            email: authData.user.email || "",
            created_at: new Date().toISOString(),
          })

          if (createProfileError) {
            console.error("Error creating profile:", createProfileError)
          }
        }
      }

      toast({
        title: "Login successful",
        description: "Welcome back to EnglishByEar!",
      })

      router.push("/dashboard")
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message || "Please check your credentials and try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="hidden md:flex w-1/2 bg-blue-500 items-center justify-center">
        <Link
          href="/"
          className="flex flex-col items-center gap-4 text-white"
        >
          <Logo />
          <span className="text-4xl font-bold">EnglishByEar</span>
        </Link>
      </div>

      <div className="min-h-screen flex w-full md:w-1/2 items-center justify-center p-6 bg-background">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">Login</CardTitle>
            <CardDescription>
              Enter your email and password to access your account
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleLogin}>
            <CardContent className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                </div>

                <Input
                  id="password"
                  type={visible ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />

                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setVisible((prev) => !prev)}
                    aria-label={visible ? "Hide password" : "Show password"}
                    aria-pressed={visible}
                    className="p-2"
                  >
                    {visible ? (
                      <EyeClosed size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>

                  <Link
                    href="/forgot-password"
                    className="text-sm text-muted-foreground hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col gap-2">
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Logging in..." : "Login"}
              </Button>

              <div className="text-center text-sm text-muted-foreground">
                Don&apos;t have an account?{" "}
                <Link
                  href="/register"
                  className="underline underline-offset-4 hover:text-primary"
                >
                  Sign up
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}
