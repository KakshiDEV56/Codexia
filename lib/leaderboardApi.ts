import { Platform } from "./types";
import { API_BASE } from "./api";

export interface LeaderboardEntry {
  rank: number;
  handle: string;
  avatar: string;
  rating: number;
  change: number | null;
  solved: number | null;
  platform: Platform;
  profileUrl: string;
}

export async function fetchLeaderboard(platform: Platform): Promise<LeaderboardEntry[]> {
  const response = await fetch(
    `${API_BASE}/api/leaderboard?platform=${encodeURIComponent(platform)}`,
    { cache: "no-store" }
  );
  if (!response.ok) {
    throw new Error("Failed to fetch leaderboard");
  }

  const data: LeaderboardEntry[] = await response.json();
  return data;
}
