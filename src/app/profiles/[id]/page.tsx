"use client"

import * as React from "react"
import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, User, MapPin, Calendar, Activity, ShieldAlert } from "lucide-react"
import { format } from "date-fns"

import { api } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default function ProfileDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await api.get(`/api/profiles/${id}`)
        setProfile(res.data.data)
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load profile")
      } finally {
        setLoading(false)
      }
    }
    if (id) fetchProfile()
  }, [id])

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
      </div>
    )
  }

  if (error || !profile) {
    return (
      <div className="container mx-auto max-w-3xl px-4 py-16 text-center">
        <ShieldAlert className="mx-auto mb-4 h-12 w-12 text-red-500" />
        <h2 className="mb-2 text-2xl font-semibold">Profile Not Found</h2>
        <p className="mb-6 text-zinc-500">{error}</p>
        <Button onClick={() => router.back()}>Go Back</Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <div className="mb-8">
        <Button variant="ghost" asChild className="-ml-4 mb-4 gap-2 text-zinc-500">
          <Link href="/profiles">
            <ArrowLeft className="h-4 w-4" />
            Back to Profiles
          </Link>
        </Button>
        <div className="flex items-center gap-4">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-indigo-100 text-3xl font-bold text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400">
            {profile.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight capitalize">{profile.name}</h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Added on {format(new Date(profile.created_at), "MMMM d, yyyy 'at' h:mm a")}
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Core Demographics */}
        <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
            <User className="h-5 w-5 text-indigo-500" />
            Demographics
          </h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">Gender</p>
              <div className="flex items-center gap-2">
                <p className="text-lg font-medium capitalize">{profile.gender || "Unknown"}</p>
                {profile.gender_probability && (
                  <Badge variant="secondary" className="text-xs">
                    {(profile.gender_probability * 100).toFixed(0)}% Confidence
                  </Badge>
                )}
              </div>
            </div>
            <div className="h-px bg-zinc-100 dark:bg-zinc-800" />
            <div>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">Age & Group</p>
              <div className="flex items-center gap-2">
                <p className="text-lg font-medium">
                  {profile.age ? profile.age : "Unknown"}
                </p>
                {profile.age_group && (
                  <Badge variant="outline" className="capitalize">
                    {profile.age_group}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Location Intelligence */}
        <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
            <MapPin className="h-5 w-5 text-violet-500" />
            Location Intelligence
          </h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">Country</p>
              <div className="flex items-center gap-2">
                <p className="text-lg font-medium">
                  {profile.country_name || profile.country_id || "Unknown"}
                </p>
                {profile.country_id && (
                  <Badge variant="secondary" className="text-xs font-mono uppercase">
                    {profile.country_id}
                  </Badge>
                )}
              </div>
            </div>
            <div className="h-px bg-zinc-100 dark:bg-zinc-800" />
            <div>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">Location Confidence</p>
              <div className="mt-2 flex w-full h-2 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                <div 
                  className="bg-violet-500" 
                  style={{ width: `${(profile.country_probability || 0) * 100}%` }}
                />
              </div>
              <p className="mt-1 text-xs text-zinc-500">
                {((profile.country_probability || 0) * 100).toFixed(1)}% probable match
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
