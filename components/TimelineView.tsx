import { Contest, Platform } from "../lib/types";
import { useMemo } from "react";
import { 
  format, 
  addDays, 
  startOfDay, 
  differenceInMinutes, 
  subDays, 
  isSameDay 
} from "date-fns";

interface Props {
  data: Contest[];
}

const PLATFORM_LABELS: Record<Platform, string> = {
  codeforces: "Codeforces",
  leetcode: "LeetCode",
  codechef: "CodeChef",
  atcoder: "AtCoder",
  gfg: "GeeksForGeeks",
  hackerrank: "HackerRank",
};

const PLATFORM_COLORS: Record<Platform, string> = {
  codeforces: "bg-blue-600/90 border-blue-500",
  leetcode: "bg-yellow-500/90 border-yellow-400",
  codechef: "bg-orange-600/90 border-orange-500",
  atcoder: "bg-gray-600/90 border-gray-500",
  gfg: "bg-green-600/90 border-green-500",
  hackerrank: "bg-emerald-600/90 border-emerald-500",
};

export default function TimelineView({ data }: Props) {
  // Timeline Settings: 2 days lookback, 14 days total view
  const timelineStart = useMemo(() => subDays(startOfDay(new Date()), 2), []);
  const days = useMemo(() => Array.from({ length: 14 }, (_, i) => addDays(timelineStart, i)), [timelineStart]);
  const totalDurationMinutes = 14 * 24 * 60; // 14 days in minutes

  // Helper to calculate position and width
  const getPositionStyle = (start: string, durationHours: number) => {
    const startTime = new Date(start);
    const diffMinutes = differenceInMinutes(startTime, timelineStart);
    const durationMinutes = durationHours * 60;
    
    // Calculate percentages
    let left = (diffMinutes / totalDurationMinutes) * 100;
    let width = (durationMinutes / totalDurationMinutes) * 100;

    // Boundary checks
    if (left + width < 0) return null; // Ended before timeline
    if (left > 100) return null; // Starts after timeline

    // Visual constraints
    // Min width of 0.5% (~1.5h) to ensure visibility
    if (width < 0.5) width = 0.5;

    return { 
      left: `${left}%`, 
      width: `${width}%` 
    };
  };

  return (
  <div className="w-full rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-sm overflow-hidden flex flex-col">
      {/* Header Controls */}
   <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-zinc-800">
     <h3 className="text-lg font-semibold text-gray-900 dark:text-zinc-200">Competition Timeline</h3>
     <div className="text-sm text-gray-500 dark:text-zinc-400 font-medium">
             {format(timelineStart, "MMM d")} - {format(days[days.length-1], "MMM d, yyyy")}
           </div>
      </div>

      <div className="flex flex-1 overflow-hidden min-h-100">
        {/* Left Column: Platform Names (Sticky) */}
     <div className="w-32 md:w-48 shrink-0 border-r border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 z-20">
             {/* Header Spacer matching dates height */}
       <div className="h-14 border-b border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900"></div>
             
             {/* Platform Rows */}
             <div className="flex flex-col">
               {Object.keys(PLATFORM_LABELS).map((key) => (
                 <div key={key} className="h-16 flex items-center px-4 border-b border-gray-200 dark:border-zinc-800 dark:text-zinc-300 font-medium text-sm">
                   {PLATFORM_LABELS[key as Platform]}
                 </div>
               ))}
             </div>
        </div>

        {/* Right Column: Timeline Grid (Scrollable) */}
  <div className="flex-1 overflow-x-auto relative bg-white dark:bg-zinc-950">
           <div className="min-w-250 h-full relative">
              
              {/* Header: Days */}
              <div className="h-14 grid grid-cols-14 border-b border-gray-200 dark:border-zinc-800 sticky top-0 bg-gray-50 dark:bg-zinc-900 z-10">
                 {days.map((day, i) => {
                   const isToday = isSameDay(day, new Date());
                   return (
                     <div key={i} className={`flex flex-col items-center justify-center border-r border-gray-200 dark:border-zinc-800 last:border-0 ${isToday ? 'bg-blue-50/50 dark:bg-blue-950/20' : ''}`}>
                       <span className="text-[10px] font-semibold text-gray-500 dark:text-zinc-400 uppercase tracking-wider">{format(day, "EEE")}</span>
                       <span className={`text-sm font-bold ${isToday ? 'text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-zinc-300'}`}>
                         {format(day, "d")}
                       </span>
                     </div>
                   );
                 })}
              </div>

              {/* Grid Lines & Current Time Indicator */}
              <div className="absolute inset-0 top-14 grid grid-cols-14 pointer-events-none">
                {days.map((day, i) => {
                    const isToday = isSameDay(day, new Date());
                    return (
                        <div key={i} className={`border-r border-gray-100 dark:border-zinc-800/50 h-full ${isToday ? 'bg-blue-50/10 dark:bg-blue-950/10' : ''}`}></div>
                    );
                })}
                {/* Current Time Vertical Line */}
                <div 
                    className="absolute top-0 bottom-0 w-px bg-red-500 z-10"
                    style={{ left: `${(differenceInMinutes(new Date(), timelineStart) / totalDurationMinutes) * 100}%` }}
                >
                    <div className="absolute -top-1 -translate-x-1/2 w-2 h-2 bg-red-500 rounded-full"></div>
                </div>
              </div>

              {/* Contest Bars */}
              <div className="flex flex-col relative z-0">
                  {Object.keys(PLATFORM_LABELS).map((platform) => {
                      const p = platform as Platform;
                      const platformContests = data.filter(c => c.platform === p);

                      return (
                          <div key={p} className="h-16 relative border-b border-gray-200 dark:border-zinc-800 group hover:bg-gray-50 dark:hover:bg-zinc-900/30 transition-colors">
                              {platformContests.map(contest => {
                                  const style = getPositionStyle(contest.startTime, contest.duration);
                                  if (!style) return null;

                                  return (
                                      <div
                                          key={contest.id}
                                          className={`absolute top-1/2 -translate-y-1/2 h-8 rounded-md ${PLATFORM_COLORS[p]} border shadow-xs flex items-center px-3 overflow-hidden whitespace-nowrap text-white text-xs font-medium cursor-pointer hover:shadow-md hover:scale-[1.02] transition-all z-10`}
                                          style={style}
                                          title={`${contest.title} (${new Date(contest.startTime).toLocaleString()})`}
                                      >
                                          <span className="truncate drop-shadow-md">{contest.title}</span>
                                      </div>
                                  );
                              })}
                          </div>
                      );
                  })}
              </div>

           </div>
        </div>
      </div>
    </div>
  );
}
