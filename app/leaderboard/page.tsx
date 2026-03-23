"use client";

import { useState, useEffect } from "react";
import { Platform } from "../../lib/types";
import { LeaderboardEntry, fetchLeaderboard } from "../../lib/leaderboardApi";
import { Search, Trophy, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

const PLATFORMS: { id: Platform; label: string }[] = [
  { id: "codeforces", label: "Codeforces" },
  { id: "leetcode", label: "LeetCode" },
  { id: "codechef", label: "CodeChef" },
  { id: "atcoder", label: "AtCoder" },
  { id: "gfg", label: "GeeksForGeeks" },
];

export default function LeaderboardPage() {
  const [activePlatform, setActivePlatform] = useState<Platform>("codeforces");
  const [data, setData] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await fetchLeaderboard(activePlatform);
        setData(res);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [activePlatform]);

  const filteredData = data.filter((entry) =>
    entry.handle.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
          Global <span className="text-blue-600">Leaderboard</span>
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          Follow the best competitive programmers across platforms.
        </p>
      </div>

      {/* Platform Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-gray-200 dark:border-gray-800 pb-1">
        {PLATFORMS.map((p) => (
          <button
            key={p.id}
            onClick={() => setActivePlatform(p.id)}
            className={cn(
              "px-4 py-2 text-sm font-medium rounded-t-lg transition-colors relative top-[1px]",
              activePlatform === p.id
                ? "bg-white dark:bg-gray-900 text-blue-600 dark:text-blue-400 border border-gray-200 dark:border-gray-800 border-b-white dark:border-b-gray-900"
                : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50"
            )}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="flex justify-between items-center bg-gray-50 dark:bg-gray-900/50 p-4 rounded-xl border border-gray-200 dark:border-gray-800">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder={`Search ${activePlatform} handles...`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 dark:bg-gray-900 text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-800">
            <tr>
              <th className="px-6 py-4 font-medium uppercase text-xs w-20">Rank</th>
              <th className="px-6 py-4 font-medium uppercase text-xs">Handle</th>
              <th className="px-6 py-4 font-medium uppercase text-xs text-right">Rating</th>
              <th className="px-6 py-4 font-medium uppercase text-xs text-right">Solved</th>
              <th className="px-6 py-4 font-medium uppercase text-xs text-right">Change</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-800 bg-white dark:bg-gray-950">
            {loading ? (
              // Skeleton Loading
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}>
                  <td className="px-6 py-4"><div className="h-4 w-8 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" /></td>
                  <td className="px-6 py-4"><div className="h-4 w-32 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" /></td>
                  <td className="px-6 py-4"><div className="h-4 w-12 bg-gray-200 dark:bg-gray-800 rounded animate-pulse ml-auto" /></td>
                  <td className="px-6 py-4"><div className="h-4 w-12 bg-gray-200 dark:bg-gray-800 rounded animate-pulse ml-auto" /></td>
                  <td className="px-6 py-4"><div className="h-4 w-16 bg-gray-200 dark:bg-gray-800 rounded animate-pulse ml-auto" /></td>
                </tr>
              ))
            ) : filteredData.length > 0 ? (
              filteredData.map((entry) => (
                <tr key={entry.handle} className="hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className={cn(
                      "flex items-center justify-center w-8 h-8 rounded-full font-bold text-xs",
                      entry.rank === 1 ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-500" :
                      entry.rank === 2 ? "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400" :
                      entry.rank === 3 ? "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-500" :
                      "text-gray-500"
                    )}>
                      {entry.rank <= 3 ? <Trophy className="w-4 h-4" /> : entry.rank}
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-gray-100">
                    {entry.handle}
                  </td>
                  <td className="px-6 py-4 text-right font-mono text-gray-600 dark:text-gray-300">
                    {entry.rating}
                  </td>
                  <td className="px-6 py-4 text-right text-gray-500">
                    {entry.solved}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className={cn(
                      "inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full",
                      entry.change > 0 ? "text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-900/20" :
                      entry.change < 0 ? "text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-900/20" :
                      "text-gray-500 bg-gray-50 dark:text-gray-400 dark:bg-gray-800"
                    )}>
                      {entry.change > 0 ? <TrendingUp className="w-3 h-3" /> :
                       entry.change < 0 ? <TrendingDown className="w-3 h-3" /> :
                       <Minus className="w-3 h-3" />}
                      {Math.abs(entry.change)}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
               <tr>
                 <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                   No handles found matching "{search}"
                 </td>
               </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
