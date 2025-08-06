"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { createClient, SupabaseClient, User } from "@supabase/supabase-js"
import { useRouter } from "next/navigation"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseClient = createClient(supabaseUrl, supabaseAnonKey)

type SupabaseContext = {
  supabase: SupabaseClient
  user: User | null
  isLoading: boolean
}

const Context = createContext<SupabaseContext | undefined>(undefined)

export default function SupabaseProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const getSession = async () => {
      const { data, error } = await supabaseClient.auth.getSession()
      if (error) {
        console.error("Error fetching session:", error.message)
      }
      setUser(data.session?.user ?? null)
      setIsLoading(false)
    }

    getSession()

    const { data: listener } = supabaseClient.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      router.refresh()
    })

    return () => {
      listener.subscription.unsubscribe()
    }
  }, [router])

  return (
    <Context.Provider value={{ supabase: supabaseClient, user, isLoading }}>
      {children}
    </Context.Provider>
  )
}

export const useSupabase = () => {
  const context = useContext(Context)
  if (!context) {
    throw new Error("useSupabase must be used inside SupabaseProvider")
  }
  return context
}
