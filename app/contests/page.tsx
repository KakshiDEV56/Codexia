"use client";

import { useContests } from "../../hooks/useContests";
import { useContestStore } from "../../store/contestStore";
import Filters from "../../components/Filters";
import ViewToggle from "../../components/ViewToggle";
import ContestTable from "../../components/ContestTable";
import TimelineView from "../../components/TimelineView";
import { Loader2 } from "lucide-react";
import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function ContestsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setSearchTargetContestId, setViewMode } = useContestStore();
  const { contests, isLoading, error, viewMode } = useContests();

  useEffect(() => {
    const focusContestId = searchParams.get("focus");
    if (!focusContestId) return;

    setViewMode("table");
    setSearchTargetContestId(focusContestId);

    router.replace("/contests", { scroll: false });
  }, [searchParams, setSearchTargetContestId, setViewMode, router]);

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header Section */}
      <div className="space-y-3 px-1">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl dark:text-zinc-100">
          Explore Competitive <span className="text-blue-600">Programming Contests</span>
        </h1>
        <p className="text-base text-gray-500 sm:text-lg dark:text-zinc-400 max-w-2xl">
          Your unified command center for tracking, comparing, and entering the world's most prestigious coding challenges.
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between px-1">
         <div className="w-full lg:flex-1">
           <Filters />
         </div>
         <div className="flex justify-end">
           <ViewToggle />
         </div>
      </div>

      {/* Main Content */}
      <div className="min-h-100">
        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          </div>
        ) : error ? (
          <div className="flex h-64 items-center justify-center text-red-500">
            {error}
          </div>
        ) : (
          viewMode === "table" ? (
            <ContestTable data={contests} />
          ) : (
             <TimelineView data={contests} />
          )
        )}
      </div>
    </div>
  );
}

export default function ContestsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        </div>
      }
    >
      <ContestsPageContent />
    </Suspense>
  );
}
