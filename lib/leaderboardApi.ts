import { Platform } from "./types";

export interface LeaderboardEntry {
  rank: number;
  handle: string;
  avatar: string;
  rating: number;
  change: number;
  solved: number;
  platform: Platform;
}

export const DUMMY_LEADERBOARD: LeaderboardEntry[] = [
  // Codeforces
  { rank: 1, handle: "tourist", avatar: "", rating: 3971, change: 10, solved: 2500, platform: "codeforces" },
  { rank: 2, handle: "Benq", avatar: "", rating: 3820, change: -5, solved: 2100, platform: "codeforces" },
  { rank: 3, handle: "Radewoosh", avatar: "", rating: 3750, change: 15, solved: 1950, platform: "codeforces" },
  { rank: 1, handle: "neal", avatar: "", rating: 3200, change: 25, solved: 3000, platform: "leetcode" },
  { rank: 2, handle: "uwi", avatar: "", rating: 3100, change: 10, solved: 2800, platform: "leetcode" },
  { rank: 1, handle: "gennady", avatar: "", rating: 2900, change: 5, solved: 1500, platform: "codechef" },
  { rank: 1, handle: "chokudai", avatar: "", rating: 3300, change: 0, solved: 4000, platform: "atcoder" },
  // ... more entries
];

export async function fetchLeaderboard(platform: Platform): Promise<LeaderboardEntry[]> {
  await new Promise((resolve) => setTimeout(resolve, 800));
  return DUMMY_LEADERBOARD.filter(e => e.platform === platform).sort((a, b) => a.rank - b.rank);
}
