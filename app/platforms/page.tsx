"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ExternalLink, Loader2 } from "lucide-react";
import { Contest, Platform } from "../../lib/types";
import { fetchContests } from "../../lib/api";
import { PLATFORM_GUIDES } from "../../lib/platformGuides";
import PlatformIcon from "../../components/PlatformIcon";
import UnableToFetch from "../../components/UnableToFetch";
import { cn } from "@/lib/utils";

export default function PlatformsPage() {
  const [platform, setPlatform] = useState<Platform>("leetcode");
  const [contests, setContests] = useState<Contest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        setContests(await fetchContests());
      } catch {
        setError("Unable to fetch the data");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const guide = PLATFORM_GUIDES.find((item) => item.id === platform) ?? PLATFORM_GUIDES[0];
  const listed = useMemo(
    () =>
      contests
        .filter((contest) => contest.platform === platform && contest.status !== "past")
        .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()),
    [contests, platform]
  );

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-zinc-100 sm:text-4xl">
          Platform <span className="text-blue-600">guides</span>
        </h1>
        <p className="max-w-2xl text-gray-500 dark:text-zinc-400">
          How each site runs its contests, and the upcoming rounds Codexia is tracking right now.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {PLATFORM_GUIDES.map((item) => (
          <button
            key={item.id}
            onClick={() => setPlatform(item.id)}
            className={cn(
              "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-medium",
              platform === item.id
                ? "border-blue-600 bg-blue-600 text-white"
                : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200 dark:hover:bg-zinc-900"
            )}
          >
            <PlatformIcon platform={item.id} className="h-4 w-4" />
            {item.label}
          </button>
        ))}
      </div>

      <section className="rounded-xl border border-gray-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-zinc-100">{guide.label}</h2>
            <p className="max-w-3xl text-gray-600 dark:text-zinc-400">{guide.summary}</p>
          </div>
          <Link
            href={guide.site}
            target="_blank"
            className="inline-flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white dark:bg-zinc-100 dark:text-zinc-900"
          >
            Open {guide.label}
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {guide.series.map((series) => (
            <article key={series.name} className="rounded-lg border border-gray-200 p-4 dark:border-zinc-800">
              <h3 className="font-semibold text-gray-900 dark:text-zinc-100">{series.name}</h3>
              <p className="mt-1 text-sm text-blue-600 dark:text-blue-400">{series.cadence}</p>
              <p className="mt-3 text-sm leading-6 text-gray-600 dark:text-zinc-400">{series.format}</p>
              <Link
                href={series.link}
                target="_blank"
                className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-gray-900 underline-offset-4 hover:underline dark:text-zinc-100"
              >
                {series.linkLabel}
                <ExternalLink className="h-3.5 w-3.5" />
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-zinc-100">Upcoming and ongoing</h2>
        {loading ? (
          <div className="flex h-32 items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
          </div>
        ) : error ? (
          <UnableToFetch />
        ) : listed.length === 0 ? (
          <p className="rounded-xl border border-dashed border-gray-300 p-8 text-center text-gray-500 dark:border-zinc-700 dark:text-zinc-400">
            No upcoming contests are listed for {guide.label} right now.
          </p>
        ) : (
          <div className="grid gap-3">
            {listed.map((contest) => (
              <Link
                key={contest.id}
                href={contest.url}
                target="_blank"
                className="flex flex-col gap-2 rounded-xl border border-gray-200 bg-white p-4 transition hover:border-blue-400 sm:flex-row sm:items-center sm:justify-between dark:border-zinc-800 dark:bg-zinc-950"
              >
                <div>
                  <p className="font-medium text-gray-900 dark:text-zinc-100">{contest.title}</p>
                  <p className="text-sm text-gray-500 dark:text-zinc-400">
                    {new Date(contest.startTime).toLocaleString()} · {contest.duration} hours · {contest.status}
                  </p>
                </div>
                <span className="inline-flex items-center gap-1 text-sm font-medium text-blue-600">
                  Open contest
                  <ExternalLink className="h-3.5 w-3.5" />
                </span>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
