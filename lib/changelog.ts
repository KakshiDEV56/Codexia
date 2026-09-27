export interface ChangelogEntry {
  hash: string;
  date: string;
  title: string;
  summary: string;
}

const REPO = "https://github.com/KakshiDEV56/Codexia";

export const CHANGELOG: ChangelogEntry[] = [
  {
    hash: "fd5cab0cc38d78f6335911ed89ce5c57901546e2",
    date: "2026-09-27",
    title: "Contest aggregation backend and API integration",
    summary:
      "Replaced the dummy contest list with a Go API. Contests are polled from LeetCode and Codeforces, stored in memory or Postgres, and served in the shape the Next.js app already renders.",
  },
  {
    hash: "d45f716889d5d2f4c8db2d69d5605a2a9fb9dc88",
    date: "2026-05-16",
    title: "ESLint cleanup across components",
    summary:
      "Cleared ESLint errors and warnings in the frontend components so the project lints cleanly.",
  },
  {
    hash: "50e34fc88f22e2800bd91309ffbd83b2962ecc25",
    date: "2026-05-16",
    title: "GitHub Actions CI/CD",
    summary:
      "Added a GitHub Actions workflow that lints and builds the Next.js app, then deploys preview and production builds through Vercel.",
  },
  {
    hash: "4abb83a23715060e919d6ddd5d08e1e3c956aa69",
    date: "2026-03-27",
    title: "Backend setup and frontend changes",
    summary:
      "Started the Go backend and adjusted the frontend to sit alongside it, including the first server entrypoint and contest-related UI updates.",
  },
  {
    hash: "d84bfc5373e09fb9e5b781de92125638db25469e",
    date: "2026-03-24",
    title: "Initial frontend",
    summary:
      "Built the first Codexia interface: contest table and timeline, platform filters, and the leaderboard page with placeholder data.",
  },
  {
    hash: "c4c2765d8c70c817ad55f364df66f662b403b44f",
    date: "2026-03-24",
    title: "Create Next App",
    summary:
      "Created the repository from Create Next App, with the App Router, TypeScript, and Tailwind baseline.",
  },
];

export function commitUrl(hash: string): string {
  return `${REPO}/commit/${hash}`;
}
