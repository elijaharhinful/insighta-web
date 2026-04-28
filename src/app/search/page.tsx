"use client"

import * as React from "react"
import { useState } from "react"
import Link from "next/link"
import { Search as SearchIcon, ArrowRight, Loader2 } from "lucide-react"
import { format } from "date-fns"

import { api } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Pagination } from "@/components/ui/pagination"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export default function SearchPage() {
  const [query, setQuery] = useState("")
  const [profiles, setProfiles] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const [error, setError] = useState("")

  // Pagination
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const handleSearch = async (e?: React.FormEvent, pageNum = 1) => {
    if (e) e.preventDefault()
    if (!query.trim()) return

    setLoading(true)
    setError("")
    setHasSearched(true)
    setPage(pageNum)

    try {
      const res = await api.get(`/api/profiles/search?q=${encodeURIComponent(query)}&page=${pageNum}&limit=10`)
      setProfiles(res.data.data)
      setTotalPages(res.data.total_pages)
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to search profiles")
      setProfiles([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto flex max-w-5xl flex-col gap-10 px-4 py-12">
      
      {/* Search Header */}
      <div className="flex flex-col items-center text-center">
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-600 text-white shadow-lg shadow-violet-600/20">
          <SearchIcon className="h-8 w-8" />
        </div>
        <h1 className="mb-4 text-4xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
          Natural Intelligence Search
        </h1>
        <p className="max-w-xl text-lg text-zinc-500 dark:text-zinc-400">
          Ask for exactly what you need. <br />
          <span className="text-sm font-medium italic text-zinc-400">Example: "young males from nigeria"</span>
        </p>

        <form 
          onSubmit={e => handleSearch(e, 1)} 
          className="relative mt-8 flex w-full max-w-2xl items-center"
        >
          <div className="absolute left-4 text-zinc-400">
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <SearchIcon className="h-5 w-5" />}
          </div>
          <Input 
            type="text"
            placeholder="Type your query..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="h-16 w-full rounded-full border-zinc-200 bg-white pl-12 pr-32 text-lg shadow-sm focus-visible:ring-violet-500 dark:border-zinc-800 dark:bg-zinc-950"
            autoFocus
          />
          <Button 
            type="submit" 
            disabled={!query.trim() || loading}
            className="absolute right-2 h-12 rounded-full bg-violet-600 px-6 font-semibold text-white hover:bg-violet-700 dark:bg-violet-600 dark:hover:bg-violet-700"
          >
            Search
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </form>
      </div>

      {/* Error State */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-center text-red-600 dark:border-red-900/50 dark:bg-red-950/20 dark:text-red-400">
          {error}
        </div>
      )}

      {/* Results Section */}
      {hasSearched && !error && (
        <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold tracking-tight">Search Results</h2>
            <p className="text-sm text-zinc-500">
              {profiles.length} result{profiles.length !== 1 && "s"} on this page
            </p>
          </div>

          <div className="rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Gender</TableHead>
                  <TableHead>Age</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead className="text-right">Added</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      <div className="flex justify-center">
                        <div className="h-6 w-6 animate-spin rounded-full border-2 border-violet-600 border-t-transparent" />
                      </div>
                    </TableCell>
                  </TableRow>
                ) : profiles.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-32 text-center text-zinc-500">
                      No matching profiles found for your query. Try rephrasing it.
                    </TableCell>
                  </TableRow>
                ) : (
                  profiles.map((profile) => (
                    <TableRow key={profile.id}>
                      <TableCell className="font-medium">
                        <Link href={`/profiles/${profile.id}`} className="hover:text-violet-600 hover:underline">
                          {profile.name}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {profile.gender || "Unknown"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {profile.age ? `${profile.age} (${profile.age_group})` : "N/A"}
                      </TableCell>
                      <TableCell>
                        {profile.country_name || profile.country_id || "Unknown"}
                      </TableCell>
                      <TableCell className="text-right text-zinc-500">
                        {format(new Date(profile.created_at), "MMM d, yyyy")}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
            
            {!loading && totalPages > 1 && (
              <div className="border-t border-zinc-200 p-4 dark:border-zinc-800">
                <Pagination 
                  page={page} 
                  totalPages={totalPages} 
                  onPageChange={(p) => handleSearch(undefined, p)} 
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
