# Codexia

Codexia tracks competitive programming contests from several sites in one place. It lists upcoming, running, and recent rounds, shows how each platform schedules them, and ranks the top contestants.

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=nextdotjs&logoColor=white)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-149ECA?logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Go](https://img.shields.io/badge/Go-1.25-00ADD8?logo=go&logoColor=white)](https://go.dev)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql&logoColor=white)](https://www.postgresql.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![License](https://img.shields.io/badge/license-All%20rights%20reserved-lightgrey)](#license)

## What it does

- Lists contests from Codeforces, LeetCode, CodeChef, AtCoder, HackerRank, and GeeksforGeeks.
- Filters by platform, status, and start date, in a table or a timeline.
- Describes each platform's contest format and links to the live rounds.
- Shows the top 25 rated users on Codeforces, LeetCode, CodeChef, and AtCoder, with profile photos and profile links.

## Run it

From the repository root:

```bash
make run
```

That starts Postgres, the API on http://localhost:8080, and the web app on http://localhost:3001. `Ctrl-C` stops the API and the web app. `make down` stops Postgres.

## Tech stack

| Layer | Tools |
| --- | --- |
| Web | Next.js 16, React 19, TypeScript, Tailwind CSS 4, Zustand |
| API | Go 1.25, Gin |
| Data | PostgreSQL 16, in-memory store when `DATABASE_URL` is unset |
| CI | GitHub Actions: frontend lint and build, backend `gofmt`, `go vet`, `staticcheck`, and `go test` |

## Backend architecture

The API lives in `backend/` and follows a handler, service, repository split. HTTP handlers do not call platform sites. A poller does that on a timer and writes through the service.

```
cmd/server
  wires config, storage, pollers, and the router

internal/handler
  GET /api/contests
  GET /api/leaderboard?platform=

internal/service
  sorts contests, computes upcoming / ongoing / past, and replaces a platform ranking

internal/repository
  ContestRepository and LeaderboardRepository
  memory     used when DATABASE_URL is empty
  postgres   used when DATABASE_URL is set

internal/poller
  refreshes every source, then repeats on POLL_INTERVAL (default 15 minutes)

internal/source
  platforms that publish JSON or GraphQL
  LeetCode contests and global ranking
  Codeforces contest list and rated users
  CodeChef contest list and global ratings
  HackerRank upcoming and archived contests
  GeeksforGeeks contest events

internal/crawler
  pages that do not publish an API
  AtCoder contest calendar
  AtCoder ranking, plus each user's profile photo

internal/board
  the same source idea for leaderboards
```

A finished contest stays in the catalog for 30 days. Status is calculated when a contest is read, from its start and end time, so stored rows do not go stale between polls.

Profile photos come from the ranking payload when the platform includes them (Codeforces, LeetCode). AtCoder and CodeChef photos are read from each user's public profile page during the leaderboard poll.

## API

`GET /api/contests` returns an array the web app renders directly:

```json
{
  "id": "leetcode-weekly-contest-522",
  "platform": "leetcode",
  "title": "Weekly Contest 522",
  "startTime": "2026-10-04T02:30:00Z",
  "endTime": "2026-10-04T04:00:00Z",
  "duration": 1.5,
  "status": "upcoming",
  "url": "https://leetcode.com/contest/weekly-contest-522"
}
```

`duration` is hours. `GET /api/leaderboard?platform=codeforces` returns the top standings for `codeforces`, `leetcode`, `codechef`, or `atcoder`. `GET /health` reports that the process is up.

## Project layout

```
app/                 Next.js routes
components/          contest table, timeline, filters, navbar
lib/                 API client and shared types
backend/cmd/server   process entrypoint
backend/internal     handlers, services, repositories, pollers, sources, crawlers
backend/migrations   SQL for contests and the leaderboard
```

## License

No license file is included. All rights are reserved until one is added.
