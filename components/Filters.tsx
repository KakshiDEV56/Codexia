"use client";

import { useContestStore } from "../store/contestStore";
import { Platform } from "../lib/types";
import { Filter, CalendarIcon, X } from "lucide-react";
import { useState } from "react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const PLATFORMS: { id: Platform; label: string; color: string; ringColor: string }[] = [
  { id: "codeforces", label: "Codeforces", color: "bg-blue-600", ringColor: "ring-blue-600" },
  { id: "leetcode", label: "LeetCode", color: "bg-yellow-600", ringColor: "ring-yellow-600" },
  { id: "codechef", label: "CodeChef", color: "bg-orange-600", ringColor: "ring-orange-600" },
  { id: "atcoder", label: "AtCoder", color: "bg-gray-600", ringColor: "ring-gray-600" },
  { id: "gfg", label: "GFG", color: "bg-green-600", ringColor: "ring-green-600" },
];

export default function Filters() {
  const { filters, setFilters } = useContestStore();

  const togglePlatform = (p: Platform) => {
    const current = filters.platforms;
    if (current.includes(p)) {
      setFilters({ platforms: current.filter((id) => id !== p) });
    } else {
      setFilters({ platforms: [...current, p] });
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 justify-between bg-white dark:bg-gray-900/50 p-4 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
      <div className="flex flex-wrap items-center gap-2">
         {/* Search in filters specific to contest list */}
         <div className="relative">
            <input 
              value={filters.search}
              onChange={(e) => setFilters({ search: e.target.value })}
              type="text"
              placeholder="Search contests..."
              className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-1.5 text-sm text-gray-900 dark:text-gray-300 w-40 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
            />
         </div>

         <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 mx-2 hidden md:block"></div>

        {PLATFORMS.map((p) => (
          <button
            key={p.id}
            onClick={() => togglePlatform(p.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-2 border
              ${
                filters.platforms.includes(p.id)
                  ? `${p.color} text-white border-transparent shadow-md`
                  : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750"
              }
            `}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <div className="relative">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-gray-800 rounded-lg text-xs text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 h-9 font-normal justify-start text-left w-[140px]",
                    !filters.startDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="w-3.5 h-3.5" />
                  {filters.startDate ? format(new Date(filters.startDate), "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
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
                    className="absolute -right-2 -top-2 bg-gray-200 dark:bg-gray-700 rounded-full p-0.5 text-gray-600 dark:text-gray-300 hover:bg-red-100 hover:text-red-500 transition-colors"
                >
                    <X className="w-3 h-3" />
                </button>
            )}
        </div>

        <select
          value={filters.status}
          onChange={(e) => setFilters({ status: e.target.value as any })}
          className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-300 text-xs border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer h-9"
        >
          <option value="all">All Status</option>
          <option value="upcoming">Upcoming</option>
          <option value="ongoing">Ongoing</option>
          <option value="past">Past</option>
        </select>
      </div>
    </div>
  );
}
