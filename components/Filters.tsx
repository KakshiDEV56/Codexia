"use client";

import { useContestStore } from "../store/contestStore";
import { Platform } from "../lib/types";
import { CalendarIcon, Check, ChevronDown, Search, X } from "lucide-react";
import { useMemo, useState } from "react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const PLATFORMS: { id: Platform; label: string; dot: string }[] = [
  { id: "codeforces", label: "Codeforces", dot: "bg-blue-500" },
  { id: "leetcode", label: "LeetCode", dot: "bg-yellow-500" },
  { id: "codechef", label: "CodeChef", dot: "bg-orange-500" },
  { id: "atcoder", label: "AtCoder", dot: "bg-zinc-500" },
  { id: "gfg", label: "GeeksForGeeks", dot: "bg-green-500" },
  { id: "hackerrank", label: "HackerRank", dot: "bg-emerald-500" },
];

const STATUS_OPTIONS = [
  { id: "all", label: "All" },
  { id: "upcoming", label: "Upcoming" },
  { id: "ongoing", label: "Ongoing" },
  { id: "past", label: "Past" },
] as const;

export default function Filters() {
  const { filters, setFilters } = useContestStore();
  const [platformQuery, setPlatformQuery] = useState("");
  const [statusOpen, setStatusOpen] = useState(false);
  const [platformsOpen, setPlatformsOpen] = useState(false);

  const togglePlatform = (p: Platform) => {
    const current = filters.platforms;
    if (current.includes(p)) {
      setFilters({ platforms: current.filter((id) => id !== p) });
    } else {
      setFilters({ platforms: [...current, p] });
    }
  };

  const filteredPlatforms = useMemo(() => {
    const query = platformQuery.trim().toLowerCase();
    if (!query) return PLATFORMS;
    return PLATFORMS.filter((p) => p.label.toLowerCase().includes(query));
  }, [platformQuery]);

  return (
    <div className="bg-white dark:bg-zinc-950 p-3 sm:p-4 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm overflow-hidden">
      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        {/* Status Dropdown */}
        <Popover open={statusOpen} onOpenChange={setStatusOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="h-10 flex-1 min-w-30 sm:min-w-35 lg:flex-none lg:w-44 justify-between bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 text-gray-700 dark:text-zinc-300 px-3"
            >
              <span className="truncate text-sm">{STATUS_OPTIONS.find((s) => s.id === filters.status)?.label ?? "Status"}</span>
              <ChevronDown className="w-4 h-4 text-zinc-500 shrink-0 ml-1" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-44 p-1 border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900" align="start">
            {STATUS_OPTIONS.map((status) => (
              <button
                key={status.id}
                onClick={() => {
                  setFilters({ status: status.id as typeof filters.status });
                  setStatusOpen(false);
                }}
                className="w-full flex items-center justify-between rounded-md px-2.5 py-2 text-sm text-left hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-200"
              >
                {status.label}
                {filters.status === status.id && <Check className="w-4 h-4 text-blue-500 shrink-0" />}
              </button>
            ))}
          </PopoverContent>
        </Popover>

        {/* Platforms Multi Select Dropdown */}
        <Popover open={platformsOpen} onOpenChange={setPlatformsOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="h-10 flex-1 min-w-40 sm:min-w-48 lg:flex-none lg:w-64 justify-between bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 text-gray-700 dark:text-zinc-300 px-3"
            >
              <span className="truncate text-sm">Platform</span>
              <ChevronDown className="w-4 h-4 text-zinc-500 shrink-0 ml-1" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-2 border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900" align="start">
            <div className="relative mb-2">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500" />
              <input
                value={platformQuery}
                onChange={(e) => setPlatformQuery(e.target.value)}
                placeholder="Search platforms"
                className="w-full h-8 rounded-md border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 pl-8 pr-2 text-xs text-zinc-700 dark:text-zinc-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div className="max-h-48 overflow-y-auto space-y-1 pr-1">
              {filteredPlatforms.length === 0 ? (
                <p className="px-2 py-1.5 text-xs text-zinc-500">No platform found.</p>
              ) : (
                filteredPlatforms.map((platform) => {
                  const selected = filters.platforms.includes(platform.id);
                  return (
                    <button
                      key={platform.id}
                      onClick={() => togglePlatform(platform.id)}
                      className="w-full flex items-center gap-2 rounded-md px-2 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-left"
                    >
                      <span className={cn(
                        "w-4 h-4 rounded-sm border flex items-center justify-center",
                        selected
                          ? "border-blue-500 bg-blue-500"
                          : "border-zinc-300 dark:border-zinc-700"
                      )}>
                        {selected && <Check className="w-3 h-3 text-white" />}
                      </span>
                      <span className={cn("w-2 h-2 rounded-full", platform.dot)} />
                      <span className="text-sm text-zinc-700 dark:text-zinc-200">{platform.label}</span>
                    </button>
                  );
                })
              )}
            </div>
          </PopoverContent>
        </Popover>

        {/* Date Picker */}
        <div className="relative flex-1 min-w-40 sm:min-w-48 lg:flex-none lg:w-56">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "h-10 w-full justify-start text-left font-normal bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 text-gray-700 dark:text-zinc-300",
                  !filters.startDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
                <span className="truncate text-sm">
                  {filters.startDate ? format(new Date(filters.startDate), "PPP") : "Pick a date"}
                </span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900" align="start">
              <Calendar
                mode="single"
                selected={filters.startDate ? new Date(filters.startDate) : undefined}
                onSelect={(date) => setFilters({ startDate: date ? date.toISOString() : null })}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          {filters.startDate && (
            <button
              onClick={() => setFilters({ startDate: null })}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-gray-100 dark:bg-zinc-800 rounded-full p-1 text-zinc-500 hover:text-red-500 transition-colors z-10"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>

        {/* Clear Platforms quick check */}
        {filters.platforms.length > 0 && (
          <button
            onClick={() => setFilters({ platforms: [] })}
            className="h-10 px-3 shrink-0 rounded-md text-xs border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900 ml-auto lg:ml-0"
          >
            Clear Platforms
          </button>
        )}
      </div>
    </div>
  );
}
