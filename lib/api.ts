import { Contest } from "./types";

const DUMMY_CONTESTS: Contest[] = [
  // Upcoming Contests
  {
    id: "cf-905",
    platform: "codeforces",
    title: "Codeforces Round #905 (Div. 2)",
    startTime: new Date(Date.now() + 86400000 * 2).toISOString(), // 2 days from now
    endTime: new Date(Date.now() + 86400000 * 2 + 7200000).toISOString(),
    duration: 2,
    status: "upcoming",
    url: "https://codeforces.com/contest/905",
  },
  {
    id: "cf-982",
    platform: "codeforces",
    title: "Codeforces Round #982 (Div. 2)",
    startTime: new Date(Date.now() + 3600000 * 5).toISOString(),
    endTime: new Date(Date.now() + 3600000 * 7).toISOString(),
    duration: 2,
    status: "upcoming",
    url: "https://codeforces.com/contest/982",
  },
  {
    id: "cc-105",
    platform: "codechef",
    title: "Starters 105 (Div 3)",
    startTime: new Date(Date.now() + 86400000).toISOString(), // 1 day from now
    endTime: new Date(Date.now() + 86400000 + 10800000).toISOString(),
    duration: 3,
    status: "upcoming",
    url: "https://www.codechef.com/START105",
  },
  {
    id: "lc-369",
    platform: "leetcode",
    title: "Weekly Contest 369",
    startTime: new Date(Date.now() + 86400000 * 3).toISOString(), // 3 days from now
    endTime: new Date(Date.now() + 86400000 * 3 + 5400000).toISOString(),
    duration: 1.5,
    status: "upcoming",
    url: "https://leetcode.com/contest/weekly-contest-369",
  },
  {
    id: "at-326",
    platform: "atcoder",
    title: "Beginner Contest 326",
    startTime: new Date(Date.now() + 86400000 * 4).toISOString(), 
    endTime: new Date(Date.now() + 86400000 * 4 + 6000000).toISOString(),
    duration: 1.6,
    status: "upcoming",
    url: "https://atcoder.jp/contests/abc326",
  },

  // Ongoing Contests
  {
    id: "lc-368",
    platform: "leetcode",
    title: "Weekly Contest 368",
    startTime: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    endTime: new Date(Date.now() + 1800000).toISOString(), // 30 mins from now
    duration: 1.5,
    status: "ongoing",
    url: "https://leetcode.com/contest/weekly-contest-368",
  },
  {
    id: "cf-edu-171",
    platform: "codeforces",
    title: "Educational Codeforces Round 171",
    startTime: new Date(Date.now() - 1800000).toISOString(),
    endTime: new Date(Date.now() + 7200000).toISOString(),
    duration: 2.5,
    status: "ongoing",
    url: "https://codeforces.com/contest/171",
  },

  // Past Contests
  {
    id: "at-325",
    platform: "atcoder",
    title: "Beginner Contest 325",
    startTime: new Date(Date.now() - 86400000).toISOString(), // yesterday
    endTime: new Date(Date.now() - 86400000 + 5760000).toISOString(),
    duration: 1.6,
    status: "past",
    url: "https://atcoder.jp/contests/abc325",
  },
  {
    id: "gfg-178",
    platform: "gfg",
    title: "GFG Weekly Coding Contest 178",
    startTime: new Date(Date.now() - 86400000 * 2).toISOString(),
    endTime: new Date(Date.now() - 86400000 * 2 + 5400000).toISOString(),
    duration: 1.5,
    status: "past",
    url: "https://practice.geeksforgeeks.org/contest/weekly-interview-series-78",
  },
  {
    id: "cc-104",
    platform: "codechef",
    title: "Starters 104 (Div 2)",
    startTime: new Date(Date.now() - 86400000 * 3).toISOString(),
    endTime: new Date(Date.now() - 86400000 * 3 + 10800000).toISOString(),
    duration: 3,
    status: "past",
    url: "https://www.codechef.com/START104",
  },
  {
    id: "lc-367",
    platform: "leetcode",
    title: "Weekly Contest 367",
    startTime: new Date(Date.now() - 86400000 * 8).toISOString(),
    endTime: new Date(Date.now() - 86400000 * 8 + 5400000).toISOString(),
    duration: 1.5,
    status: "past",
    url: "https://leetcode.com/contest/weekly-contest-367",
  },
    {
    id: "cf-904",
    platform: "codeforces",
    title: "Codeforces Round #904 (Div. 2)",
    startTime: new Date(Date.now() - 86400000 * 5).toISOString(),
    endTime: new Date(Date.now() - 86400000 * 5 + 7200000).toISOString(),
    duration: 2,
    status: "past",
    url: "https://codeforces.com/contest/904",
  },
];

export async function fetchContests(): Promise<Contest[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));
  return DUMMY_CONTESTS;
}
