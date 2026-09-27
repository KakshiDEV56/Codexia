import { Platform } from "./types";

export interface ContestSeries {
  name: string;
  cadence: string;
  format: string;
  link: string;
  linkLabel: string;
}

export interface PlatformGuide {
  id: Platform;
  label: string;
  summary: string;
  site: string;
  series: ContestSeries[];
}

export const PLATFORM_GUIDES: PlatformGuide[] = [
  {
    id: "leetcode",
    label: "LeetCode",
    summary: "Short algorithm contests with a fixed problem count. Rating comes from contest performance.",
    site: "https://leetcode.com/contest/",
    series: [
      {
        name: "Weekly Contest",
        cadence: "Every Sunday, 08:00 IST (02:30 UTC)",
        format: "4 problems in 1 hour 30 minutes. The contest page opens the problemset when the round starts.",
        link: "https://leetcode.com/contest/",
        linkLabel: "Open LeetCode contests",
      },
      {
        name: "Biweekly Contest",
        cadence: "Every other Saturday, 20:00 IST (14:30 UTC)",
        format: "4 problems in 1 hour 30 minutes, on the same contest calendar as the weekly round.",
        link: "https://leetcode.com/contest/",
        linkLabel: "Open biweekly listing",
      },
    ],
  },
  {
    id: "codeforces",
    label: "Codeforces",
    summary: "Rounds are split by rating so each contestant solves a set aimed at their division.",
    site: "https://codeforces.com/contests",
    series: [
      {
        name: "Division 1",
        cadence: "Scheduled on the contest calendar, usually about 2 hours",
        format: "Rated for 1900 and above. Harder problemset, often paired with a Division 2 round.",
        link: "https://codeforces.com/contests",
        linkLabel: "Open Codeforces contests",
      },
      {
        name: "Division 2",
        cadence: "The most common Codeforces round",
        format: "Rated below 1900. Usually 5 or 6 problems in about 2 hours.",
        link: "https://codeforces.com/contests",
        linkLabel: "Open Division 2 rounds",
      },
      {
        name: "Division 3 and Division 4",
        cadence: "Regular rounds for newer contestants",
        format: "Division 3 is rated below 1600 and Division 4 below 1400. Both last about 2 to 2.5 hours.",
        link: "https://codeforces.com/contests",
        linkLabel: "Open beginner rounds",
      },
      {
        name: "Educational rounds",
        cadence: "Several times a month",
        format: "Problems chosen to practice standard techniques. Usually rated for contestants under 2100, lasting about 2 hours.",
        link: "https://codeforces.com/contests",
        linkLabel: "Open educational rounds",
      },
    ],
  },
  {
    id: "atcoder",
    label: "AtCoder",
    summary: "Japanese platform with three regular algorithm series. Beginner contests are the usual entry point.",
    site: "https://atcoder.jp/contests/",
    series: [
      {
        name: "Beginner Contest (ABC)",
        cadence: "Saturday 21:00 JST",
        format: "100 minutes, typically 6 or 7 problems, rated for contestants under 2000.",
        link: "https://atcoder.jp/contests/",
        linkLabel: "Open AtCoder contests",
      },
      {
        name: "Regular Contest (ARC)",
        cadence: "Most weeks, 21:00 JST",
        format: "About 100 to 120 minutes. Rated inside a middle band, often 1200 to 2799.",
        link: "https://atcoder.jp/contests/",
        linkLabel: "Open ARC rounds",
      },
      {
        name: "Grand Contest (AGC)",
        cadence: "Less frequent, 21:00 JST",
        format: "Longer high-difficulty round, about 150 minutes or more, rated from a high cutoff such as 2800.",
        link: "https://atcoder.jp/contests/",
        linkLabel: "Open AGC rounds",
      },
    ],
  },
  {
    id: "codechef",
    label: "CodeChef",
    summary: "Short rated rounds plus longer practice events. Starters is the weekly rated contest.",
    site: "https://www.codechef.com/contests",
    series: [
      {
        name: "Starters",
        cadence: "Weekly, usually Wednesday evening IST",
        format: "Rated short round, about 2 hours, with a rating cap stated in the contest name.",
        link: "https://www.codechef.com/contests",
        linkLabel: "Open CodeChef contests",
      },
      {
        name: "Practice events",
        cadence: "Listed beside rated rounds",
        format: "Longer unrated or lightly rated events such as placement practice. Each card links to that contest.",
        link: "https://www.codechef.com/contests",
        linkLabel: "Open the contest list",
      },
    ],
  },
  {
    id: "hackerrank",
    label: "HackerRank",
    summary: "Public timed contests such as company and community codesprints, alongside the practice track.",
    site: "https://www.hackerrank.com/contests",
    series: [
      {
        name: "Public contests",
        cadence: "Scheduled individually",
        format: "A contest page lists the challenges and the start and end time. Open the round from its card.",
        link: "https://www.hackerrank.com/contests",
        linkLabel: "Open HackerRank contests",
      },
    ],
  },
  {
    id: "gfg",
    label: "GeeksforGeeks",
    summary: "Contest events published on the GeeksforGeeks events calendar, including weekly coding contests when they are scheduled.",
    site: "https://www.geeksforgeeks.org/events",
    series: [
      {
        name: "Coding contests",
        cadence: "When a contest is published on the events page",
        format: "A timed set of problems. The contest card links to the GeeksforGeeks contest page.",
        link: "https://www.geeksforgeeks.org/events",
        linkLabel: "Open GFG events",
      },
    ],
  },
];
