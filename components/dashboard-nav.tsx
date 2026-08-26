"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useSupabase } from "@/components/supabase-provider"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { LayoutDashboard, BookOpen, BookMarked, ArrowDownZA, Settings, LogOut, Menu, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Logo from "./Logo"

export default function DashboardNav() {
  const pathname = usePathname()
  const router = useRouter()
  const { supabase, user } = useSupabase()
  const { toast } = useToast()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)

  useEffect(() => {
    if (!user || !supabase) return

    const fetchAvatar = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("avatar_url")
        .eq("id", user.id)
        .maybeSingle()

      if (error) {
        console.error("Error fetching avatar:", {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint,
        })
        console.error("Error fetching avatar2:", error)
        return
      }

      setAvatarUrl(data?.avatar_url === "man" ? "/avatars/man.jpg" : "/avatars/woman.jpg")
    }

    fetchAvatar()
  }, [supabase, user])

  const handleLogout = async () => {
    if (!supabase) {
      toast({
        title: "Error",
        description: "Unable to log out. Supabase client not initialized.",
        variant: "destructive",
      })
      return
    }

    await supabase.auth.signOut()
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    })
    router.push("/")
  }

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Exercises", href: "/dashboard/exercises", icon: BookOpen },
    { name: "Grammar", href: "/dashboard/grammar", icon: BookMarked },
    { name: "Grammar", href: "/dashboard/vocabulary", icon: ArrowDownZA },
    // { name: "Leaderboard", href: "/dashboard/leaderboard", icon: Trophy },
    // { name: "Progress", href: "/dashboard/progress", icon: BarChart2 },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ]

  return (
    <header className="top-0 z-40 container rounded-2xl my-4 bg-white/10 shadow-2xl shadow-black/20 backdrop-blur-xl backdrop-saturate-150">
      <div className="flex items-center justify-between py-2">
        <div className="flex items-center gap-2">
          <Link href="/dashboard" className="flex items-center gap-2">
            <Logo />
            <span className="text-xl font-bold">EnglishByEar</span>
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary ${pathname === item.href ? "text-primary" : "text-muted-foreground"
                  }`}
              >
                <Icon className="h-4 w-4" />
                {item.name}
              </Link>
            )
          })}
        </nav>

        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-10 w-10">
                  <AvatarImage
                    src={avatarUrl || "/user.png"}
                    alt="User Avatar"
                  />
                  <AvatarFallback>
                    {user?.email?.charAt(0).toUpperCase() ?? "?"}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user?.user_metadata?.username || "User"}</p>
                  <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/dashboard/settings">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t">
          <div className="container py-2">
            <nav className="grid gap-2">
              {navItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-2 rounded-md p-2 text-sm font-medium transition-colors hover:bg-accent ${pathname === item.href ? "bg-accent" : ""
                      }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Icon className="h-4 w-4" />
                    {item.name}
                  </Link>
                )
              })}
              <Button
                variant="ghost"
                className="flex items-center gap-2 rounded-md p-2 text-sm font-medium justify-start"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" />
                Log out
              </Button>
            </nav>
          </div>
        </div>
      )}
    </header>
  )
}
