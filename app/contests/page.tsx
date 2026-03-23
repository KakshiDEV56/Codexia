"use client";

import { useContests } from "../../hooks/useContests";
import Filters from "../../components/Filters";
import ViewToggle from "../../components/ViewToggle";
import ContestTable from "../../components/ContestTable";
import TimelineView from "../../components/TimelineView";
import FeatureCards from "../../components/FeatureCards";
import { Loader2 } from "lucide-react";

export default function ContestsPage() {
  const { contests, isLoading, error, viewMode } = useContests();

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
          Explore Competitive <span className="text-blue-600">Programming Contests</span>
        </h1>
        <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl">
          Your unified command center for tracking, comparing, and entering the world's most prestigious coding challenges.
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
         <Filters />
         <ViewToggle />
      </div>

      {/* Main Content */}
      <div className="min-h-[400px]">
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

      {/* Footer Features */}
      <FeatureCards />
    </div>
  );
}
