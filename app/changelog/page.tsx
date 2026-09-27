import Link from "next/link";
import { CHANGELOG, commitUrl } from "../../lib/changelog";

export default function ChangelogPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl dark:text-zinc-100">
          Changelog
        </h1>
        <p className="max-w-2xl text-base text-gray-500 dark:text-zinc-400">
          What landed in Codexia, newest first. Each entry links to the commit on GitHub.
        </p>
      </div>

      <ol className="space-y-4">
        {CHANGELOG.map((entry) => (
          <li
            key={entry.hash}
            className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950"
          >
            <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-zinc-100">
                {entry.title}
              </h2>
              <time className="text-sm text-gray-500 dark:text-zinc-400" dateTime={entry.date}>
                {entry.date}
              </time>
            </div>
            <p className="mt-3 text-sm leading-6 text-gray-600 dark:text-zinc-400">
              {entry.summary}
            </p>
            <Link
              href={commitUrl(entry.hash)}
              target="_blank"
              className="mt-4 inline-flex items-center text-sm font-medium text-blue-600 hover:underline dark:text-blue-400"
            >
              {entry.hash.slice(0, 7)}
            </Link>
          </li>
        ))}
      </ol>
    </div>
  );
}
