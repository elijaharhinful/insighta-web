"use client"

import * as React from "react"
import { useEffect, useState } from "react"
import { Users, Activity, Shield, Clock } from "lucide-react"
import { api } from "@/lib/api"
import { Badge } from "@/components/ui/badge"

interface DashboardMetrics {
  totalProfiles: number
  role: string
  username: string
}

export default function DashboardPage() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const [meRes, profilesRes] = await Promise.all([
          api.get("/auth/me"),
          api.get("/api/profiles?limit=1"),
        ])
        
        setMetrics({
          totalProfiles: profilesRes.data.total || 0,
          role: meRes.data.data.role,
          username: meRes.data.data.username,
        })
      } catch (err) {
        console.error("Failed to load dashboard metrics", err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="container mx-auto flex max-w-6xl flex-col gap-8 px-4 py-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-zinc-500 dark:text-zinc-400">
          Welcome back, <span className="font-medium text-zinc-900 dark:text-zinc-100">@{metrics?.username}</span>
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Metric Card 1 */}
        <div className="flex flex-col gap-2 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400">
            <h3 className="text-sm font-medium">Total Profiles</h3>
            <Users className="h-4 w-4 text-indigo-600" />
          </div>
          <p className="text-3xl font-semibold">{metrics?.totalProfiles.toLocaleString()}</p>
        </div>

        {/* Metric Card 2 */}
        <div className="flex flex-col gap-2 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400">
            <h3 className="text-sm font-medium">Your Role</h3>
            <Shield className="h-4 w-4 text-violet-600" />
          </div>
          <div className="mt-1">
            <Badge variant={metrics?.role === "admin" ? "default" : "secondary"}>
              {metrics?.role?.toUpperCase()}
            </Badge>
          </div>
        </div>

        {/* Metric Card 3 */}
        <div className="flex flex-col gap-2 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400">
            <h3 className="text-sm font-medium">System Status</h3>
            <Activity className="h-4 w-4 text-emerald-600" />
          </div>
          <p className="text-3xl font-semibold text-emerald-600 dark:text-emerald-500">Operational</p>
        </div>

        {/* Metric Card 4 */}
        <div className="flex flex-col gap-2 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400">
            <h3 className="text-sm font-medium">Last Login</h3>
            <Clock className="h-4 w-4 text-blue-600" />
          </div>
          <p className="text-xl font-medium tracking-tight">Just now</p>
        </div>
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-950">
        <h2 className="mb-4 text-xl font-semibold">Quick Actions</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <a
            href="/profiles"
            className="group flex flex-col gap-2 rounded-lg border border-zinc-200 p-6 transition-colors hover:border-indigo-600 dark:border-zinc-800 dark:hover:border-indigo-500"
          >
            <Users className="h-6 w-6 text-zinc-400 transition-colors group-hover:text-indigo-600 dark:text-zinc-500 dark:group-hover:text-indigo-400" />
            <h3 className="font-medium">Browse Profiles</h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">View and filter the entire intelligence database.</p>
          </a>
          
          <a
            href="/search"
            className="group flex flex-col gap-2 rounded-lg border border-zinc-200 p-6 transition-colors hover:border-violet-600 dark:border-zinc-800 dark:hover:border-violet-500"
          >
            <Activity className="h-6 w-6 text-zinc-400 transition-colors group-hover:text-violet-600 dark:text-zinc-500 dark:group-hover:text-violet-400" />
            <h3 className="font-medium">Natural Search</h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">Use natural language to find specific profiles instantly.</p>
          </a>
        </div>
      </div>
    </div>
  )
}
