import { Contest, Platform } from "../lib/types";
import { ExternalLink, Calendar, Link as LinkIcon, Clock, ChevronRight } from "lucide-react";
import Link from "next/link";
import PlatformIcon from "./PlatformIcon";

interface Props {
  data: Contest[];
}

export default function ContestTable({ data }: Props) {
  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-gray-500 dark:text-gray-500 bg-white dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-gray-800">
        <Calendar className="w-12 h-12 mb-4 opacity-50" />
        <p className="text-lg font-medium">No contests found</p>
        <p className="text-sm">Try adjusting your filters</p>
      </div>
    );
  }

  // Shared Helper for Status Badge
  const StatusBadge = ({ status }: { status: Contest["status"] }) => (
    <span
      className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase border ${
        status === "upcoming"
          ? "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300 border-purple-200 dark:border-purple-700/50"
          : status === "ongoing"
          ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-300 border-green-200 dark:border-green-700/50"
          : "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-700"
      }`}
    >
      {status}
    </span>
  );

  return (
    <div className="space-y-4">
      {/* Mobile Card View (Visible on small screens) */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {data.map((contest) => (
          <div 
            key={contest.id}
            className="bg-white dark:bg-gray-950 p-4 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow active:scale-[0.99]" 
          >
            <div className="flex items-start gap-4">
               {/* Icon */}
               <div className="shrink-0 mt-1">
                 <PlatformIcon platform={contest.platform} className="w-10 h-10" />
               </div>
               
               {/* Content */}
               <div className="flex-1 min-w-0">
                 <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 line-clamp-2 leading-tight">
                      {contest.title}
                    </h3>
                 </div>
                 
                 <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-3">
                    <span>{new Date(contest.startTime).toLocaleDateString()}</span>
                    <span>•</span>
                    <span>{contest.duration}h</span>
                 </div>

                 <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 dark:border-gray-900">
                    <StatusBadge status={contest.status} />
                    
                    <Link
                      href={contest.url}
                      target="_blank"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-900 dark:bg-white text-white dark:text-black text-xs font-bold hover:opacity-90 transition-opacity"
                    >
                      View Contest
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                 </div>
               </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table View (Hidden on small screens) */}
      <div className="hidden md:block overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 shadow-sm">
      <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
        <thead className="bg-gray-50 dark:bg-gray-900/50 text-xs uppercase font-medium text-gray-500 dark:text-gray-500 border-b border-gray-200 dark:border-gray-800">
          <tr>
            <th className="px-6 py-4">Contest</th>
            <th className="px-6 py-4">Platform</th>
            <th className="px-6 py-4">Starts</th>
            <th className="px-6 py-4">Duration</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4 text-right">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
          {data.map((contest) => (
            <tr 
              key={contest.id} 
              className="hover:bg-gray-50/50 dark:hover:bg-gray-900/40 transition-colors group"
            >
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="shrink-0">
                    <PlatformIcon platform={contest.platform} className="w-8 h-8" />
                  </div>
                  <span className="font-medium text-gray-900 dark:text-gray-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {contest.title}
                  </span>
                </div>
              </td>
              <td className="px-6 py-4 capitalize">{contest.platform}</td>
              <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                {new Date(contest.startTime).toLocaleDateString()}
                <span className="text-gray-400 dark:text-gray-500 ml-2 text-xs">
                  {new Date(contest.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-500">
                    <Clock className="w-3.5 h-3.5" />
                    {contest.duration} Hours
                </div>
              </td>
              <td className="px-6 py-4">
                <StatusBadge status={contest.status} />
              </td>
              <td className="px-6 py-4 text-right">
                <Link
                  href={contest.url}
                  target="_blank"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-900 dark:bg-white text-white dark:text-black text-xs font-medium hover:opacity-90 transition-opacity shadow-sm whitespace-nowrap"
                >
                  View Contest
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  );
}
