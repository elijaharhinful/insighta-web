"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Search, LayoutDashboard, Users, User, LogOut } from "lucide-react"
import { cn } from "@/lib/utils"
import { api } from "@/lib/api"
import { Button } from "./ui/button"

export function Header() {
  const pathname = usePathname()

  // Do not show header on login page
  if (pathname === "/") return null

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout")
    } catch (e) {
      // Ignore errors on logout
    }
    window.location.href = "/"
  }

  const links = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/profiles", label: "Profiles", icon: Users },
    { href: "/search", label: "Search", icon: Search },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200 bg-white/80 backdrop-blur-md dark:border-zinc-800 dark:bg-black/80">
      <div className="container mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
              <span className="text-xl font-bold leading-none">I</span>
            </div>
            <span className="text-lg font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
              Insighta<span className="text-indigo-600 dark:text-indigo-400">Labs+</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {links.map((link) => {
              const isActive = pathname.startsWith(link.href)
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium transition-colors hover:text-zinc-950 dark:hover:text-zinc-50",
                    isActive
                      ? "bg-zinc-100 text-zinc-950 dark:bg-zinc-800 dark:text-zinc-50"
                      : "text-zinc-500 dark:text-zinc-400"
                  )}
                >
                  <link.icon className="h-4 w-4" />
                  {link.label}
                </Link>
              )
            })}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild className="gap-2">
            <Link href="/account" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Account</span>
            </Link>
          </Button>
          <Button variant="ghost" size="sm" onClick={handleLogout} className="gap-2 text-zinc-500 hover:text-red-600 dark:hover:text-red-400">
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </div>
      </div>
    </header>
  )
}
