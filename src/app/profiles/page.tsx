"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, Filter, Download, Plus } from "lucide-react";
import { format } from "date-fns";

import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Pagination } from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function ProfilesPage() {
  const [profiles, setProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Filters
  const [gender, setGender] = useState("");
  const [country, setCountry] = useState("");
  const [ageGroup, setAgeGroup] = useState("");

  useEffect(() => {
    fetchProfiles();
  }, [page, gender, country, ageGroup]);

  const fetchProfiles = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append("page", page.toString());
      params.append("limit", "10");
      if (gender) params.append("gender", gender);
      if (country) params.append("country_id", country);
      if (ageGroup) params.append("age_group", ageGroup);

      const res = await api.get(`/api/profiles?${params.toString()}`);
      setProfiles(res.data.data);
      setTotalPages(res.data.total_pages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    const params = new URLSearchParams();
    params.append("format", "csv");
    if (gender) params.append("gender", gender);
    if (country) params.append("country_id", country);
    if (ageGroup) params.append("age_group", ageGroup);

    api
      .get(`/api/profiles/export?${params.toString()}`, {
        responseType: "blob",
      })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute(
          "download",
          `profiles_${new Date().toISOString()}.csv`,
        );
        document.body.appendChild(link);
        link.click();
        link.remove();
      })
      .catch(console.error);
  };

  return (
    <div className="container mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">
            Profiles Directory
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400">
            Manage and browse intelligence profiles.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleExport} className="gap-2">
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Export CSV</span>
          </Button>
          <Button
            asChild
            className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white dark:bg-indigo-600 dark:text-white dark:hover:bg-indigo-700"
          >
            <Link href="/search">
              <Search className="h-4 w-4" />
              <span className="hidden sm:inline">Smart Search</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950 sm:flex-row sm:items-center">
        <div className="flex items-center gap-2 text-sm font-medium text-zinc-500">
          <Filter className="h-4 w-4" />
          Filters
        </div>
        <div className="flex flex-1 flex-wrap gap-4">
          <select
            value={gender}
            onChange={(e) => {
              setGender(e.target.value);
              setPage(1);
            }}
            className="h-10 rounded-md border border-zinc-200 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-zinc-800"
          >
            <option value="">All Genders</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>

          <select
            value={ageGroup}
            onChange={(e) => {
              setAgeGroup(e.target.value);
              setPage(1);
            }}
            className="h-10 rounded-md border border-zinc-200 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-zinc-800"
          >
            <option value="">All Ages</option>
            <option value="child">Child</option>
            <option value="teenager">Teenager</option>
            <option value="adult">Adult</option>
            <option value="senior">Senior</option>
          </select>

          <Input
            placeholder="Country Code (e.g. US)"
            value={country}
            onChange={(e) => {
              setCountry(e.target.value);
              setPage(1);
            }}
            className="max-w-[180px]"
          />
        </div>
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
                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
                  </div>
                </TableCell>
              </TableRow>
            ) : profiles.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="h-24 text-center text-zinc-500"
                >
                  No profiles found.
                </TableCell>
              </TableRow>
            ) : (
              profiles.map((profile) => (
                <TableRow key={profile.id}>
                  <TableCell className="font-medium">
                    <Link
                      href={`/profiles/${profile.id}`}
                      className="hover:text-indigo-600 hover:underline"
                    >
                      {profile.name}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {profile.gender || "Unknown"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {profile.age
                      ? `${profile.age} (${profile.age_group})`
                      : "N/A"}
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
              onPageChange={setPage}
            />
          </div>
        )}
      </div>
    </div>
  );
}
