"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSupabase } from "@/components/supabase-provider"
import DashboardNav from "@/components/dashboard-nav"
import Footer from "@/components/footer"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { supabase, user, isLoading } = useSupabase()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [isLoading, supabase, router, user])

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>
  }

  if (!user) {
    return null
  }

  return (
    <div className="flex min-h-screen flex-col">
      <div className="container p-2 mx-auto">
        <DashboardNav />
        <div className="py-8 bg-background rounded-3xl mb-8">{children}</div>
        <Footer />
      </div>
    </div>
  )
}
