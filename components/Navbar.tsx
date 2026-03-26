"use client";

import Link from "next/link";
import { Search, Moon, Sun, Menu, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useThemeStore } from "../store/themeStore";
import { useContestStore } from "../store/contestStore";
import { fetchContests } from "../lib/api";
import { format } from "date-fns";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { isDarkMode, toggleTheme } = useThemeStore();
  const {
    contests,
    setContests,
    setViewMode,
    setFilters,
    setSearchTargetContestId,
  } = useContestStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const searchWrapperRef = useRef<HTMLDivElement>(null);

  const navLinks = useMemo(
    () => [
      { href: "/contests", label: "Contests" },
      { href: "/platforms", label: "Platforms" },
      { href: "/leaderboard", label: "Leaderboard" },
    ],
    []
  );

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  useEffect(() => {
    async function ensureContestsLoaded() {
      if (!pathname?.startsWith("/contests") || contests.length > 0) return;

      setIsSearchLoading(true);
      try {
        const data = await fetchContests();
        setContests(data);
      } finally {
        setIsSearchLoading(false);
      }
    }

    ensureContestsLoaded();
  }, [pathname, contests.length, setContests]);

  useEffect(() => {
    const onClickOutside = (event: MouseEvent) => {
      if (!searchWrapperRef.current) return;
      if (!searchWrapperRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const searchResults = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return contests.slice(0, 20);

    return contests
      .filter((contest) =>
        `${contest.title} ${contest.platform}`.toLowerCase().includes(query)
      )
      .slice(0, 30);
  }, [searchQuery, contests]);

  const selectContestFromSearch = (contestId: string) => {
    setFilters({
      search: "",
      platforms: [],
      status: "all",
      startDate: null,
    });
    setViewMode("table");
    setSearchTargetContestId(contestId);

    setSearchQuery("");
    setIsSearchOpen(false);
    setIsMobileMenuOpen(false);

    router.push(`/contests?focus=${contestId}`);
  };

  return (
    <nav className="sticky top-0 z-50 mx-3 mt-3 rounded-2xl border border-gray-200 bg-white/80 px-3 py-3 text-gray-900 shadow-sm backdrop-blur-md sm:mx-4 sm:mt-4 sm:px-4 md:px-5 dark:border-gray-800 dark:bg-black/80 dark:text-white">
      <div className="flex w-full items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-4 sm:gap-8">
          <Link href="/" className="shrink-0 text-xl font-bold bg-linear-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent sm:text-2xl">
            Codexia
          </Link>

          <div className="hidden md:flex items-center gap-5 text-sm font-medium text-gray-500 dark:text-gray-400">
            {navLinks.map((link) => {
              const active = pathname?.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={active ? "text-blue-600 dark:text-blue-400" : "hover:text-blue-600 dark:hover:text-blue-400 transition-colors"}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <div ref={searchWrapperRef} className="relative hidden lg:block">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-zinc-500" />
            <input
              value={searchQuery}
              onChange={(event) => {
                setSearchQuery(event.target.value);
                setIsSearchOpen(true);
              }}
              onFocus={() => setIsSearchOpen(true)}
              type="text"
              placeholder="Search contests..."
              className="w-48 xl:w-72 rounded-full border border-gray-200 bg-gray-100 py-2 pl-10 pr-4 text-sm text-gray-800 focus:outline-none focus:ring-1 focus:ring-blue-500 md:w-60 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300"
            />

            {isSearchOpen && (
              <div className="fixed inset-x-0 top-24 z-70 flex justify-center px-4">
                <div className="w-full max-w-xl overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-xl dark:border-zinc-800 dark:bg-zinc-950">
                  <Command shouldFilter={false}>
                    <CommandInput
                      value={searchQuery}
                      onValueChange={setSearchQuery}
                      placeholder="Search contest title or platform..."
                    />
                    <CommandList className="max-h-80">
                      <CommandEmpty>
                        {isSearchLoading ? "Loading contests..." : "No contest found."}
                      </CommandEmpty>
                      <CommandGroup heading="Contest Results">
                        {searchResults.map((contest) => (
                          <CommandItem
                            key={contest.id}
                            value={`${contest.title} ${contest.platform} ${contest.status}`}
                            onSelect={() => selectContestFromSearch(contest.id)}
                            className="items-start py-2"
                          >
                            <div className="flex w-full flex-col gap-1">
                              <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                                {contest.title}
                              </span>
                              <span className="text-xs text-zinc-500 dark:text-zinc-400">
                                {contest.platform.toUpperCase()} • {contest.status.toUpperCase()} • {format(new Date(contest.startTime), "MMM d, p")}
                              </span>
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="rounded-full p-2 text-gray-500 transition-colors hover:bg-gray-100 dark:text-zinc-400 dark:hover:bg-zinc-900"
          >
            {isDarkMode ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
          </button>
          <button
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            aria-label="Toggle navigation menu"
            className="inline-flex rounded-full p-2 text-gray-600 transition-colors hover:bg-gray-100 md:hidden dark:text-zinc-300 dark:hover:bg-zinc-900"
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="mt-3 w-full border-t border-gray-200 pt-3 md:hidden dark:border-zinc-800">
          <div className="mb-4 space-y-1">
            {navLinks.map((link) => {
              const active = pathname?.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={active
                    ? "block rounded-lg bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-600 dark:bg-blue-950/40 dark:text-blue-400"
                    : "block rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-blue-600 dark:text-zinc-300 dark:hover:bg-zinc-900 dark:hover:text-blue-400"}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          <div className="space-y-4 rounded-xl bg-zinc-50 p-3 dark:bg-zinc-900/50">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                type="text"
                placeholder="Search contests..."
                className="w-full rounded-full border border-gray-200 bg-white py-2 pl-10 pr-4 text-sm text-gray-800 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300"
              />
            </div>

            {searchQuery.trim() && (
              <div className="max-h-64 overflow-y-auto pr-1">
                {searchResults.length === 0 ? (
                  <p className="px-2 py-4 text-center text-sm text-zinc-500">No contest found.</p>
                ) : (
                  <div className="space-y-1 pb-2">
                    {searchResults.map((contest) => (
                      <button
                        key={contest.id}
                        onClick={() => selectContestFromSearch(contest.id)}
                        className="block w-full rounded-lg px-3 py-2 text-left transition-colors hover:bg-white dark:hover:bg-zinc-900"
                      >
                        <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 leading-tight mb-1">{contest.title}</p>
                        <p className="text-[10px] uppercase tracking-wider text-zinc-500 dark:text-zinc-400 font-semibold">{contest.platform} • {contest.status}</p>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
