export interface Contest {
  id: string;
  platform: "codeforces" | "leetcode" | "codechef" | "atcoder" | "gfg" | "hackerrank";
  title: string;
  startTime: string; // ISO string
  endTime: string; // ISO string
  duration: number; // in hours
  status: "upcoming" | "ongoing" | "past";
  url: string;
}

export type Platform = Contest["platform"];
export type Status = Contest["status"];

export type ViewMode = "table" | "timeline";

export interface FilterState {
  search: string;
  platforms: Platform[];
  status: Status | "all";
  startDate: string | null;
}
