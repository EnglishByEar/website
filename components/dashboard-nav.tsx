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
import { LayoutDashboard, BookOpen, BookMarked, ArrowDownZA, Settings, LogOut } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import Logo from "./Logo"
import ToggleTheme from "./toggle-theme"

const navItems = [
  { name: "Home", href: "/dashboard", icon: LayoutDashboard },
  { name: "Exercises", href: "/dashboard/exercises", icon: BookOpen },
  { name: "Grammar", href: "/dashboard/grammar", icon: BookMarked },
  { name: "Vocabulary", href: "/dashboard/vocabulary", icon: ArrowDownZA },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
]

export default function DashboardNav() {
  const pathname = usePathname()
  const router = useRouter()
  const { supabase, user } = useSupabase()
  const { toast } = useToast()
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
        console.error("Error fetching avatar:", error)
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

  const isActive = (href: string) =>
    href === "/dashboard" ? pathname === href : pathname === href || pathname.startsWith(href + "/")

  return (
    <>
      <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur-md">
        <div className="flex items-center justify-between py-2">
          <Link href="/dashboard" className="flex items-center gap-2" aria-label="Go to dashboard">
            <Logo width={56} height={56} />
          </Link>


          <nav className="hidden md:flex items-center gap-1" aria-label="Main">
            {navItems.map((item) => {
              const Icon = item.icon
              const active = isActive(item.href)
              return (
                <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors",
                  active
                  ? "bg-primary/15 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
                >
                  <Icon className="h-4 w-4" />
                  {item.name}
                </Link>
              )
            })}
          </nav>
            <div className="flex items-center gap-4">
            <ToggleTheme />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={avatarUrl || "/user.png"} alt="User avatar" />
                    <AvatarFallback>{user?.email?.charAt(0).toUpperCase() ?? "?"}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user?.user_metadata?.username || "User"}
                    </p>
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

            </div>
        </div>
      </header>

      <nav
        aria-label="Main"
        className="fixed inset-x-0 bottom-0 z-50 border-t bg-background/90 backdrop-blur-md md:hidden"
        style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
      >
        <ul className="mx-auto grid max-w-md grid-cols-5">
          {navItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.href)
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex flex-col items-center justify-center gap-1 py-2 text-[11px] font-medium transition-colors",
                    active ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  <span
                    className={cn(
                      "flex h-7 w-12 items-center justify-center rounded-full transition-colors",
                      active && "bg-primary/15"
                    )}
                  >
                    <Icon className="h-5 w-5" />
                  </span>
                  {item.name}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
    </>
  )
}