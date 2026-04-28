"use client"

import * as React from "react"
import { useEffect, useState } from "react"
import { User, LogOut, ShieldCheck, Mail, Calendar } from "lucide-react"
import { format } from "date-fns"

import { api } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default function AccountPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await api.get("/auth/me")
        setUser(res.data.data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchUser()
  }, [])

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout")
    } catch (e) {
      // ignore
    }
    window.location.href = "/"
  }

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-900 border-t-transparent dark:border-white dark:border-t-transparent" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="container mx-auto flex max-w-2xl flex-col items-center justify-center px-4 py-16 text-center">
        <h2 className="mb-4 text-2xl font-semibold">Failed to load account details</h2>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto max-w-2xl px-4 py-12">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-semibold tracking-tight">Account Settings</h1>
      </div>

      <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        
        {/* Header Cover Area */}
        <div className="h-32 w-full bg-zinc-100 dark:bg-zinc-900" />
        
        {/* Profile Info Area */}
        <div className="relative px-6 pb-6">
          <div className="absolute -top-12 flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-white dark:border-zinc-950 dark:bg-zinc-950">
            {user.avatar_url ? (
              <img src={user.avatar_url} alt={user.username} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-zinc-100 text-3xl font-bold dark:bg-zinc-800">
                {user.username.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          
          <div className="ml-28 flex flex-col gap-1 pt-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-zinc-950 dark:text-zinc-50">@{user.username}</h2>
              <div className="mt-1 flex items-center gap-2">
                <Badge variant={user.role === "admin" ? "default" : "secondary"} className="gap-1">
                  <ShieldCheck className="h-3 w-3" />
                  {user.role.toUpperCase()}
                </Badge>
                {user.is_active && (
                  <Badge variant="outline" className="text-emerald-600 border-emerald-200 dark:border-emerald-900 dark:text-emerald-400">
                    Active
                  </Badge>
                )}
              </div>
            </div>
            
            <Button variant="destructive" className="mt-4 sm:mt-0 gap-2" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </div>

          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            <div>
              <p className="mb-1 flex items-center gap-2 text-sm font-medium text-zinc-500 dark:text-zinc-400">
                <Mail className="h-4 w-4" />
                Email Address
              </p>
              <p className="font-medium">{user.email || "No email provided"}</p>
            </div>
            
            <div>
              <p className="mb-1 flex items-center gap-2 text-sm font-medium text-zinc-500 dark:text-zinc-400">
                <User className="h-4 w-4" />
                GitHub ID
              </p>
              <p className="font-mono text-sm">{user.id}</p>
            </div>

            <div>
              <p className="mb-1 flex items-center gap-2 text-sm font-medium text-zinc-500 dark:text-zinc-400">
                <Calendar className="h-4 w-4" />
                Account Created
              </p>
              <p className="font-medium">
                {format(new Date(user.created_at), "MMMM d, yyyy")}
              </p>
            </div>

            <div>
              <p className="mb-1 flex items-center gap-2 text-sm font-medium text-zinc-500 dark:text-zinc-400">
                <Calendar className="h-4 w-4" />
                Last Login
              </p>
              <p className="font-medium">
                {format(new Date(user.last_login_at), "MMMM d, yyyy 'at' h:mm a")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
