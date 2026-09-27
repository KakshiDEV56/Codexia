"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Platform } from "../../lib/types";
import { LeaderboardEntry, fetchLeaderboard } from "../../lib/leaderboardApi";
import { Search } from "lucide-react";
import UnableToFetch from "../../components/UnableToFetch";
import { cn } from "@/lib/utils";

const PLATFORMS: { id: Platform; label: string }[] = [
  { id: "codeforces", label: "Codeforces" },
  { id: "leetcode", label: "LeetCode" },
  { id: "codechef", label: "CodeChef" },
  { id: "atcoder", label: "AtCoder" },
];

export default function LeaderboardPage() {
  const [activePlatform, setActivePlatform] = useState<Platform>("codeforces");
  const [data, setData] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetchLeaderboard(activePlatform);
        setData(res);
      } catch {
        setData([]);
        setError("Unable to fetch the data");
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
    <div className="text-gray-900 dark:rounded-2xl dark:border dark:border-white/10 dark:bg-[#0b0b0d] dark:px-5 dark:py-8 dark:text-zinc-100 dark:shadow-[0_30px_80px_rgba(0,0,0,0.45)] sm:dark:px-8">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl dark:font-semibold dark:text-white">
        <span className="dark:hidden">Global </span>
        <span className="text-blue-600 dark:text-white">Leaderboard</span>
      </h1>
      <p className="mt-2 max-w-2xl text-gray-500 dark:hidden">
        Follow the highest-rated competitive programmers on Codeforces, LeetCode, CodeChef, and AtCoder.
      </p>

      <div className="mt-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="inline-flex w-fit rounded-lg border border-gray-200 bg-white p-1 dark:border-transparent dark:bg-[#161616]">
          {PLATFORMS.map((platform) => (
            <button
              key={platform.id}
              onClick={() => {
                setActivePlatform(platform.id);
                setSearch("");
              }}
              className={cn(
                "rounded-md px-3.5 py-1.5 text-sm font-medium transition-colors",
                activePlatform === platform.id
                  ? "bg-gray-900 text-white dark:bg-[#2c2c2c]"
                  : "text-gray-500 hover:text-gray-800 dark:text-zinc-500 dark:hover:text-zinc-300"
              )}
            >
              {platform.label}
            </button>
          ))}
        </div>

        <div className="relative w-full lg:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-zinc-500" />
          <input
            type="text"
            placeholder="Search by username"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-10 pr-4 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-blue-500 dark:border-white/10 dark:bg-[#141414] dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-white/20"
          />
        </div>
      </div>

      {error ? (
        <div className="mt-8">
          <UnableToFetch />
        </div>
      ) : (
      <div className="mt-6 overflow-x-auto">
        <table className="w-full min-w-[560px] border-separate border-spacing-0 overflow-hidden rounded-xl border border-gray-200 bg-white text-left dark:rounded-none dark:border-0 dark:bg-transparent">
          <thead>
            <tr className="text-[11px] font-medium uppercase tracking-[0.14em] text-gray-500 dark:text-zinc-500">
              <th className="w-16 px-3 py-3 font-medium">#</th>
              <th className="px-3 py-3 font-medium">Username</th>
              <th className="px-3 py-3 text-right font-medium">Rating</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 8 }).map((_, index) => (
                <tr key={index}>
                  <td className="border-t border-gray-200 px-3 py-4 dark:border-white/[0.06]"><div className="h-4 w-6 animate-pulse rounded bg-gray-100 dark:bg-white/5" /></td>
                  <td className="border-t border-gray-200 px-3 py-4 dark:border-white/[0.06]"><div className="h-4 w-40 animate-pulse rounded bg-gray-100 dark:bg-white/5" /></td>
                  <td className="border-t border-gray-200 px-3 py-4 dark:border-white/[0.06]"><div className="ml-auto h-4 w-12 animate-pulse rounded bg-gray-100 dark:bg-white/5" /></td>
                </tr>
              ))
            ) : filteredData.length > 0 ? (
              filteredData.map((entry) => (
                <tr key={entry.handle} className="group hover:bg-gray-50 dark:hover:bg-white/[0.035]">
                  <td className="border-t border-gray-200 px-3 py-3.5 text-sm tabular-nums text-gray-500 dark:border-white/[0.06] dark:text-zinc-500">{entry.rank}</td>
                  <td className="border-t border-gray-200 px-3 py-3 dark:border-white/[0.06]">
                    <Link
                      href={entry.profileUrl}
                      target="_blank"
                      className="inline-flex items-center gap-3"
                    >
                      <UserAvatar src={entry.avatar} handle={entry.handle} />
                      <span className="text-sm font-medium text-gray-900 group-hover:text-blue-600 dark:text-zinc-100 dark:group-hover:text-white">
                        {entry.handle}
                      </span>
                    </Link>
                  </td>
                  <td className="border-t border-gray-200 px-3 py-3.5 text-right text-sm tabular-nums text-gray-700 dark:border-white/[0.06] dark:text-zinc-200">
                    {entry.rating.toLocaleString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="px-3 py-16 text-center text-sm text-gray-500 dark:text-zinc-500">
                  {search
                    ? `No handles found matching "${search}"`
                    : "No ranking data is stored for this platform yet."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      )}
    </div>
  );
}

function UserAvatar({ src, handle }: { src: string; handle: string }) {
  const [failed, setFailed] = useState(false);
  const initial = handle.trim().charAt(0).toUpperCase() || "?";

  if (!src || failed) {
    return (
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gray-100 text-[11px] font-semibold text-gray-600 dark:bg-[#2a2a2a] dark:text-zinc-300">
        {initial}
      </span>
    );
  }

  return (
    <Image
      src={src}
      alt=""
      width={28}
      height={28}
      unoptimized
      className="h-7 w-7 shrink-0 rounded-full object-cover"
      onError={() => setFailed(true)}
    />
  );
}
