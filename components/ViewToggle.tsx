"use client";

import { useContestStore } from "../store/contestStore";
import { LayoutList, Kanban } from "lucide-react";

export default function ViewToggle() {
  const { viewMode, setViewMode } = useContestStore();

  return (
  <div className="flex bg-white dark:bg-zinc-950 rounded-lg p-1 border border-gray-200 dark:border-zinc-800">
      <button
        onClick={() => setViewMode("timeline")}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
          viewMode === "timeline"
            ? "bg-blue-600 text-white shadow-sm"
            : "text-gray-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-zinc-100 hover:bg-gray-50 dark:hover:bg-zinc-900"
        }`}
      >
        <Kanban className="w-4 h-4" />
        Timeline
      </button>
      <button
        onClick={() => setViewMode("table")}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
          viewMode === "table"
            ? "bg-blue-600 text-white shadow-sm"
            : "text-gray-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-zinc-100 hover:bg-gray-50 dark:hover:bg-zinc-900"
        }`}
      >
        <LayoutList className="w-4 h-4" />
        Table
      </button>
    </div>
  );
}
