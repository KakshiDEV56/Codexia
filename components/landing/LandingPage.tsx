"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  Calendar,
  Check,
  Clock3,
  LayoutDashboard,
  Menu,
  Minus,
  Plus,
  ShieldCheck,
  Trophy,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import PlatformIcon from "../PlatformIcon";
import type { Platform } from "../../lib/types";

const BRANDS: { id: Platform; name: string; color: string; ink: string; soft: string }[] = [
  { id: "codeforces", name: "Codeforces", color: "#1F8ACB", ink: "#ffffff", soft: "#E7F4FC" },
  { id: "leetcode", name: "LeetCode", color: "#FFA116", ink: "#1a1a1a", soft: "#FFF4E0" },
  { id: "codechef", name: "CodeChef", color: "#5C4033", ink: "#ffffff", soft: "#F6EFEA" },
  { id: "atcoder", name: "AtCoder", color: "#222222", ink: "#ffffff", soft: "#F2F2F2" },
  { id: "hackerrank", name: "HackerRank", color: "#1BA94C", ink: "#ffffff", soft: "#E7F7ED" },
  { id: "gfg", name: "GeeksforGeeks", color: "#2F8D46", ink: "#ffffff", soft: "#E7F5EB" },
];

function brandFor(name: string) {
  return BRANDS.find((brand) => brand.name === name);
}

const NAV = [
  { href: "#features", label: "Features" },
  { href: "#compare", label: "Compare" },
  { href: "#faq", label: "FAQ" },
  { href: "#reviews", label: "Reviews" },
];

const FEATURE_PLATFORMS = [
  "All platforms",
  "Codeforces",
  "LeetCode",
  "CodeChef",
  "AtCoder",
  "HackerRank",
  "GeeksforGeeks",
] as const;

const COMPARE = [
  ["Upcoming, live, and recent contests", true, false],
  ["One calendar for six platforms", true, false],
  ["Table and timeline views", true, false],
  ["Contest format guides", true, false],
  ["Top ratings with profile photos", true, false],
  ["Open the round on its own site", true, true],
] as const;

const FAQS = [
  {
    q: "Which contests does Codexia track?",
    a: "Codeforces, LeetCode, CodeChef, AtCoder, HackerRank, and GeeksforGeeks. Upcoming rounds, contests that are running, and ones that finished in the last 30 days stay on the calendar.",
  },
  {
    q: "Do I need an account?",
    a: "No. Open the contest list, platform guides, or leaderboard directly. Each round links out to the site where you actually compete.",
  },
  {
    q: "How do I tell weekly rounds from division rounds?",
    a: "The platforms page explains each series: LeetCode weekly and biweekly, Codeforces divisions, AtCoder ABC, ARC, and AGC, and CodeChef Starters, with a link to that series.",
  },
  {
    q: "Where do the ratings come from?",
    a: "The leaderboard shows the current top 25 on Codeforces, LeetCode, CodeChef, and AtCoder, including the profile photo published by that site.",
  },
  {
    q: "What if contest data cannot load?",
    a: "The contests, platforms, and leaderboard sections show a clear message that the data could not be fetched, instead of an empty or broken table.",
  },
];

const NOTES = [
  {
    name: "A contest regular",
    date: "Before a Codeforces round",
    text: "Checking five contest sites the morning of a round is how people miss a starter or a biweekly. One list, sorted by start time, is the whole point.",
  },
  {
    name: "Someone new to rated rounds",
    date: "Choosing a series",
    text: "Division numbers and ABC versus ARC are clearer when the format sits next to the actual upcoming contests, with a link to the round itself.",
  },
  {
    name: "A rating chaser",
    date: "Between contests",
    text: "The leaderboard is the public top of each site, with the face and handle that site already publishes, not a made-up table.",
  },
];

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState(1);
  const [menuOpen, setMenuOpen] = useState(false);
  const [featurePlatform, setFeaturePlatform] = useState<(typeof FEATURE_PLATFORMS)[number]>("All platforms");

  return (
    <div className="landing-root min-h-screen overflow-x-hidden text-slate-900">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[#d9e8ff]" />
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top,_#7eb6ff_0%,_#d7e6ff_42%,_#eef4ff_100%)]" />
      <div className="dot-field pointer-events-none fixed inset-0 -z-10 opacity-70" />

      <div className="mx-auto w-full max-w-[90rem] px-3 py-3 sm:px-5 lg:px-6">
        <header className="relative z-30 rounded-2xl bg-gradient-to-r from-[#3b82f6] to-[#2563eb] px-3 py-2.5 text-white shadow-lg shadow-blue-500/20 sm:px-5">
          <div className="flex items-center justify-between gap-3">
            <Link href="/" className="text-lg font-semibold tracking-tight">
              Codexia
            </Link>
            <nav className="hidden items-center gap-6 text-sm text-white/90 lg:flex">
              {NAV.map((item) => (
                <a key={item.href} href={item.href} className="hover:text-white">
                  {item.label}
                </a>
              ))}
            </nav>
            <div className="flex items-center gap-2">
              <Link
                href="/contests"
                className="saas-press inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-2 text-sm font-semibold text-blue-600 shadow-sm sm:gap-2 sm:px-4"
              >
                <span className="sm:hidden">Open</span>
                <span className="hidden sm:inline">Open app</span>
                <ArrowUpRight className="h-4 w-4" />
              </Link>
              <button
                type="button"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/15 lg:hidden"
                aria-label={menuOpen ? "Close menu" : "Open menu"}
                aria-expanded={menuOpen}
                onClick={() => setMenuOpen((open) => !open)}
              >
                {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
          {menuOpen ? (
            <nav className="mt-3 flex flex-col gap-1 rounded-xl bg-white p-2 text-slate-900 lg:hidden">
              {NAV.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="rounded-lg px-3 py-3 text-sm font-medium hover:bg-slate-100"
                >
                  {item.label}
                </a>
              ))}
            </nav>
          ) : null}
        </header>

        <section className="relative mt-4 overflow-hidden rounded-[1.75rem] bg-gradient-to-b from-[#3b82f6] via-[#3b82f6] to-[#60a5fa] px-4 pb-0 pt-8 text-center text-white shadow-lg shadow-blue-500/15 sm:px-8 sm:pt-10 lg:px-12">
          <div className="dot-field pointer-events-none absolute inset-0 opacity-40" />
          <div className="relative mx-auto max-w-3xl">
            <div className="flex flex-wrap justify-center gap-2">
              {["Six platforms", "Live schedules", "Past 30 days"].map((label) => (
                <span
                  key={label}
                  className="inline-flex items-center gap-1.5 rounded-full bg-blue-700/50 px-3 py-1 text-[11px] font-semibold tracking-wide"
                >
                  <ShieldCheck className="h-3.5 w-3.5" />
                  {label}
                </span>
              ))}
            </div>
            <h1 className="mt-6 text-3xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Never miss a coding contest
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-blue-50 sm:text-base">
              One calendar for every major contest site, with each series explained and the public leaderboards beside it.
            </p>
            <div className="mx-auto mt-6 flex max-w-3xl flex-wrap justify-center gap-2">
              {BRANDS.map((brand) => (
                <span
                  key={brand.id}
                  className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-sm font-semibold shadow-sm"
                  style={{ color: brand.color }}
                >
                  <PlatformIcon platform={brand.id} className="h-5 w-5" />
                  {brand.name}
                </span>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <a
                href="#features"
                className="saas-press rounded-full border border-white/70 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/10"
              >
                Explore features
              </a>
              <Link
                href="/contests"
                className="saas-press rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-blue-600 shadow-md"
              >
                Browse contests
              </Link>
            </div>
          </div>

          <div className="relative mx-auto mt-12 max-w-4xl">
            <div className="overflow-hidden rounded-t-2xl border border-white/30 bg-white text-left text-slate-900 shadow-2xl">
              <div className="flex items-center gap-1.5 border-b border-slate-200 bg-slate-100 px-4 py-2">
                <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
                <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
              </div>
              <div className="grid min-h-72 md:grid-cols-2">
                <div className="p-5 sm:p-8">
                  <p className="text-xs font-semibold text-blue-600">This week</p>
                  <h2 className="mt-3 text-2xl font-bold leading-tight sm:text-3xl">
                    Find the next round{" "}
                    <span className="rounded-md bg-blue-600 px-1.5 text-white">before</span> it starts
                  </h2>
                  <p className="mt-3 text-sm text-slate-500">
                    Weekly, biweekly, division, and beginner contests, with start time and a link to the actual round.
                  </p>
                  <Link
                    href="/contests"
                    className="saas-press mt-6 inline-flex rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                  >
                    Open calendar
                  </Link>
                </div>
                <div className="relative bg-slate-950 p-6 text-white">
                  <p className="text-xs uppercase tracking-[0.16em] text-slate-400">Upcoming</p>
                  <LiveContestList />
                  <span className="float-chip absolute right-3 top-4 hidden rounded-xl bg-white px-3 py-2 text-xs font-semibold text-slate-900 shadow-lg sm:inline-flex">
                    Live rounds included
                  </span>
                  <span className="float-chip-delay absolute bottom-4 right-3 hidden rounded-xl bg-white px-3 py-2 text-xs font-semibold text-slate-900 shadow-lg sm:inline-flex">
                    Table and timeline
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <Reveal>
        <section id="compare" className="saas-section scroll-mt-24 relative mt-4 rounded-3xl border border-transparent bg-white px-4 py-12 sm:px-8 sm:py-16 lg:px-12">
          <div className="dot-field-soft pointer-events-none absolute left-0 top-10 h-48 w-48 opacity-80" />
          <div className="relative text-center">
            <span className="rounded-full border border-blue-200 px-3 py-1 text-[11px] font-semibold tracking-[0.14em] text-blue-600">
              WHY CODEXIA
            </span>
            <h2 className="mt-4 text-3xl font-bold sm:text-4xl">
              Why one calendar beats
              <span className="block text-blue-600">opening every site</span>
            </h2>
          </div>
          <div className="relative mt-10 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_24px_70px_rgba(37,99,235,0.12)]">
            <div className="hidden grid-cols-[minmax(0,1.6fr)_160px_180px] items-center border-b border-slate-100 bg-slate-50 px-4 py-3 text-sm font-semibold md:grid lg:grid-cols-[minmax(0,1.6fr)_200px_220px]">
              <span className="text-slate-500">What you get</span>
              <span className="text-center text-blue-700">Codexia</span>
              <span className="text-center text-slate-500">Each site alone</span>
            </div>
            <ul>
              {COMPARE.map(([label, ours, theirs], index) => (
                <li
                  key={label}
                  className={cn(
                    "saas-row grid gap-3 px-4 py-4 md:grid-cols-[minmax(0,1.6fr)_160px_180px] md:items-center md:gap-0 md:py-0 lg:grid-cols-[minmax(0,1.6fr)_200px_220px]",
                    index > 0 && "border-t border-slate-100"
                  )}
                >
                  <div className="flex items-center gap-3 text-sm font-medium text-slate-800 md:h-16 md:px-1">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                      <Calendar className="h-4 w-4" />
                    </span>
                    {label}
                  </div>
                  <div className="flex items-center justify-between rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 px-3 py-2 text-white md:h-16 md:justify-center md:rounded-none md:bg-gradient-to-b md:from-blue-500 md:to-blue-700 md:py-0">
                    <span className="text-xs font-semibold md:hidden">Codexia</span>
                    {ours ? <Check className="h-5 w-5" /> : <X className="h-5 w-5" />}
                  </div>
                  <div className="flex items-center justify-between px-3 py-2 text-slate-400 md:h-16 md:justify-center md:py-0">
                    <span className="text-xs font-semibold md:hidden">Each site</span>
                    {theirs ? <Check className="h-5 w-5 text-slate-600" /> : <X className="h-5 w-5" />}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>
        </Reveal>

        <section id="features" className="saas-section scroll-mt-24 mt-4 rounded-3xl border border-transparent bg-white px-4 py-12 sm:px-8 sm:py-16 lg:px-12">
          <div className="text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-1 text-[11px] font-semibold tracking-[0.14em] text-slate-600">
              <LayoutDashboard className="h-3.5 w-3.5" />
              BUILT FOR CONTEST WEEK
            </span>
            <h2 className="mx-auto mt-5 max-w-3xl text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
              The tools that keep your{" "}
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 align-middle text-blue-600 sm:h-11 sm:w-11">
                <Trophy className="h-5 w-5" />
              </span>{" "}
              contest week moving
            </h2>
            <div className="mx-auto mt-8 flex max-w-full gap-2 overflow-x-auto pb-1">
              {FEATURE_PLATFORMS.map((platform) => {
                const brand = brandFor(platform);
                const selected = featurePlatform === platform;
                return (
                  <button
                    key={platform}
                    type="button"
                    onClick={() => setFeaturePlatform(platform)}
                    className={cn(
                      "saas-press inline-flex shrink-0 items-center gap-2 rounded-full px-3.5 py-1.5 text-sm font-medium",
                      !brand && (selected ? "bg-slate-900 text-white" : "border border-slate-200 bg-white text-slate-600")
                    )}
                    style={
                      brand
                        ? {
                            backgroundColor: brand.soft,
                            color: brand.color,
                            border: `1.5px solid ${selected ? brand.color : "transparent"}`,
                          }
                        : undefined
                    }
                  >
                    {brand ? <PlatformIcon platform={brand.id} className="h-4 w-4" /> : null}
                    {platform}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <Reveal delay={0}>
            <ToolCard
              index="1"
              title="Contest calendar"
              text={
                featurePlatform === "All platforms"
                  ? "Upcoming, live, and recent rounds from every site, with filters for platform, status, and date."
                  : `Upcoming, live, and recent ${featurePlatform} rounds, with status and a link to the real contest.`
              }
              href="/contests"
            >
              <CalendarPreview platform={featurePlatform} />
            </ToolCard>
            </Reveal>
            <Reveal delay={120}>
            <ToolCard
              index="2"
              title="Format guides"
              text={
                featurePlatform === "All platforms"
                  ? "Weekly, biweekly, division, and beginner series, explained next to the rounds that are actually scheduled."
                  : `How ${featurePlatform} names its rounds, and which of those series are coming up.`
              }
              href="/platforms"
            >
              <GuidePreview platform={featurePlatform} />
            </ToolCard>
            </Reveal>
            <Reveal delay={240}>
            <ToolCard
              index="3"
              title="Leaderboard"
              text={
                featurePlatform === "All platforms" || featurePlatform === "HackerRank" || featurePlatform === "GeeksforGeeks"
                  ? "The public top 25 on Codeforces, LeetCode, CodeChef, and AtCoder, with the photos those sites publish."
                  : `The current top handles on ${featurePlatform}, with the profile photo that site already shows.`
              }
              href="/leaderboard"
            >
              <BoardPreview />
            </ToolCard>
            </Reveal>
          </div>
        </section>

        <section id="reviews" className="saas-section scroll-mt-24 mt-4 rounded-3xl border border-transparent bg-white px-4 py-12 sm:px-8 sm:py-16 lg:px-12">
          <div className="text-center">
            <span className="rounded-full border border-blue-200 px-3 py-1 text-[11px] font-semibold tracking-[0.14em] text-blue-600">
              IN PRACTICE
            </span>
            <h2 className="mt-4 text-3xl font-bold sm:text-4xl">
              Why people keep a <span className="text-blue-600">single contest list</span>
            </h2>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {NOTES.map((note, index) => (
              <Reveal key={note.name} delay={index * 100}>
              <article className="saas-card h-full rounded-2xl border border-transparent bg-[#f4f7ff] p-5 text-left">
                <h3 className="font-semibold">{note.name}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">{note.text}</p>
                <p className="mt-6 inline-flex items-center gap-2 text-xs text-slate-400">
                  <Clock3 className="h-3.5 w-3.5" />
                  {note.date}
                </p>
              </article>
              </Reveal>
            ))}
          </div>
        </section>

        <section id="start" className="saas-section scroll-mt-24 relative mt-4 overflow-hidden rounded-3xl border border-transparent bg-white px-4 py-12 sm:px-8 sm:py-16 lg:px-12">
          <div className="dot-field-soft pointer-events-none absolute bottom-0 right-0 h-64 w-64" />
          <div className="relative text-center">
            <span className="rounded-full border border-blue-200 px-3 py-1 text-[11px] font-semibold tracking-[0.14em] text-blue-600">
              START
            </span>
            <h2 className="mt-4 text-3xl font-bold sm:text-4xl">
              Open the part you need <span className="text-blue-600">right now</span>
            </h2>
          </div>
          <div className="relative mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <StartCard title="Contests" label="Calendar" href="/contests" points={["Upcoming, live, and recent", "Filter by platform and date", "Table or timeline"]} featured={false} />
            <StartCard title="Leaderboard" label="Rankings" href="/leaderboard" points={["Top 25 per site", "Profile photos", "Links to each handle"]} featured />
            <StartCard title="Platforms" label="Formats" href="/platforms" points={["Weekly and biweekly", "Divisions and ABC, ARC, AGC", "Links into each round"]} featured={false} />
          </div>
        </section>

        <Reveal>
        <section id="faq" className="saas-section scroll-mt-24 mt-4 rounded-3xl border border-transparent bg-white px-4 py-12 sm:px-8 sm:py-16 lg:px-12">
          <h2 className="text-center text-3xl font-bold sm:text-4xl">
            Everything you <span className="text-blue-600">need to know</span>
          </h2>
          <div className="mx-auto mt-10 max-w-3xl space-y-3">
            {FAQS.map((item, index) => {
              const open = openFaq === index;
              return (
                <button
                  key={item.q}
                  type="button"
                  onClick={() => setOpenFaq(open ? -1 : index)}
                  className={cn(
                    "w-full rounded-2xl px-5 py-4 text-left transition duration-200 hover:-translate-y-0.5 hover:shadow-md",
                    open ? "border border-blue-500 bg-white shadow-sm" : "bg-[#eef3ff]"
                  )}
                >
                  <span className="flex items-center justify-between gap-4">
                    <span className={cn("font-medium", open && "text-blue-600")}>{item.q}</span>
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-slate-700 shadow-sm">
                      {open ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                    </span>
                  </span>
                  {open ? <p className="mt-3 pr-10 text-sm leading-6 text-slate-600">{item.a}</p> : null}
                </button>
              );
            })}
          </div>
        </section>
        </Reveal>

        <p className="py-8 text-center text-sm text-slate-500">© 2026 Codexia Labs. All rights reserved.</p>
      </div>
    </div>
  );
}

const CONTEST_SLIDES: { id: Platform; name: string; meta: string }[][] = [
  [
    { id: "leetcode", name: "Weekly Contest", meta: "Sunday · 1.5h" },
    { id: "codeforces", name: "Div. 2 Round", meta: "2 hours" },
    { id: "atcoder", name: "Beginner Contest", meta: "Saturday · 100m" },
  ],
  [
    { id: "codeforces", name: "Educational Round", meta: "2 hours" },
    { id: "leetcode", name: "Biweekly Contest", meta: "Saturday · 1.5h" },
    { id: "codechef", name: "Starters", meta: "Wednesday · 2h" },
  ],
  [
    { id: "atcoder", name: "Regular Contest", meta: "120 minutes" },
    { id: "gfg", name: "Weekly Coding", meta: "2 hours" },
    { id: "hackerrank", name: "Public contest", meta: "Scheduled" },
  ],
];

function LiveContestList() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    let fadeTimer = 0;
    const timer = window.setInterval(() => {
      setVisible(false);
      fadeTimer = window.setTimeout(() => {
        setIndex((current) => (current + 1) % CONTEST_SLIDES.length);
        setVisible(true);
      }, 280);
    }, 3800);
    return () => {
      window.clearInterval(timer);
      window.clearTimeout(fadeTimer);
    };
  }, []);

  const slide = CONTEST_SLIDES[index];

  return (
    <ul
      className={cn(
        "mt-4 space-y-3 text-sm transition-opacity duration-300",
        visible ? "opacity-100" : "opacity-0"
      )}
    >
      {slide.map((contest) => (
        <li
          key={contest.id}
          className="flex items-center justify-between gap-3 rounded-lg bg-white/5 px-3 py-2 transition hover:bg-white/10"
        >
          <span className="inline-flex min-w-0 items-center gap-2">
            <PlatformIcon platform={contest.id} className="h-5 w-5 shrink-0" />
            <span className="truncate">{contest.name}</span>
          </span>
          <span className="shrink-0 text-slate-400">{contest.meta}</span>
        </li>
      ))}
    </ul>
  );
}

function Reveal({
  children,
  delay = 0,
}: {
  children: ReactNode;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  useEffect(() => {
    const node = ref.current;
    if (!node || shown) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          observer.disconnect();
        }
      },
      { threshold: 0.16 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [shown]);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={cn("reveal", shown && "is-visible")}
    >
      {children}
    </div>
  );
}

function ToolCard({
  index,
  title,
  text,
  href,
  children,
}: {
  index: string;
  title: string;
  text: string;
  href: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className="saas-card flex min-h-0 flex-col rounded-[28px] border border-slate-200 bg-[#f6f7f9] p-4 sm:min-h-[420px] sm:p-5"
    >
      <div className="flex items-start gap-3">
        <span className="text-sm font-semibold text-slate-400">{index}</span>
        <div>
          <h3 className="text-xl font-semibold tracking-tight">{title}</h3>
          <p className="mt-2 text-sm leading-6 text-slate-500">{text}</p>
        </div>
      </div>
      <div className="widget-shift relative mt-6 flex flex-1 items-end justify-center">{children}</div>
    </Link>
  );
}

function CalendarPreview({ platform }: { platform: string }) {
  const rows =
    platform === "LeetCode"
      ? ([["leetcode", "Weekly Contest", "Sun · 1.5h"], ["leetcode", "Biweekly Contest", "Sat · 1.5h"]] as const)
      : platform === "Codeforces"
        ? ([["codeforces", "Div. 2 Round", "2 hours"], ["codeforces", "Educational Round", "2 hours"]] as const)
        : platform === "All platforms"
          ? ([["codeforces", "Div. 2 Round", "2 hours"], ["leetcode", "Weekly Contest", "1.5 hours"], ["atcoder", "ABC", "100 min"]] as const)
          : ([[brandFor(platform)?.id ?? "codechef", "Next rated round", "This week"], [brandFor(platform)?.id ?? "codechef", "Follow-up round", "Next week"]] as const);
  const accent = brandFor(platform)?.color ?? "#1F8ACB";
  return (
    <div className="relative w-full max-w-xs pb-4">
      <div className="overflow-hidden rounded-2xl bg-white shadow-[0_16px_40px_rgba(15,23,42,0.08)]">
        <div className="h-1.5" style={{ backgroundColor: accent }} />
        <div className="p-4">
          <p className="text-sm font-medium text-slate-800">On the calendar</p>
          <ul className="mt-3 space-y-2">
            {rows.map(([id, name, meta]) => (
              <li key={`${id}-${name}`} className="flex items-center justify-between gap-2 text-sm">
                <span className="inline-flex min-w-0 items-center gap-2 text-slate-700">
                  <PlatformIcon platform={id as Platform} className="h-4 w-4 shrink-0" />
                  <span className="truncate">{name}</span>
                </span>
                <span className="shrink-0 text-slate-400">{meta}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <span className="absolute -right-1 -top-3 inline-flex items-center gap-1 rounded-full bg-emerald-500 px-2.5 py-1 text-xs font-semibold text-white shadow">
        Live
      </span>
    </div>
  );
}

function GuidePreview({ platform }: { platform: string }) {
  const brand = brandFor(platform);
  const series =
    platform === "LeetCode"
      ? ["Weekly", "Biweekly"]
      : platform === "AtCoder"
        ? ["ABC", "ARC", "AGC"]
        : platform === "Codeforces"
          ? ["Div. 1", "Div. 2", "Div. 3"]
          : ["Weekly", "Division", "Beginner"];
  return (
    <div className="relative h-40 w-full max-w-xs overflow-hidden">
      {series.map((name, index) => (
        <div
          key={name}
          className="absolute left-6 right-8 flex items-center gap-2 rounded-2xl border border-slate-100 bg-white px-4 py-3 text-sm font-medium shadow-[0_12px_30px_rgba(15,23,42,0.08)]"
          style={{ top: 12 + index * 36, zIndex: series.length - index, color: brand?.color }}
        >
          {brand ? <PlatformIcon platform={brand.id} className="h-4 w-4" /> : null}
          {name}
        </div>
      ))}
    </div>
  );
}

function BoardPreview() {
  const rows = [
    ["1", "tourist", "3797"],
    ["2", "Benq", "3676"],
  ];
  return (
    <div className="relative w-full max-w-xs">
      <div className="rounded-2xl bg-white p-4 shadow-[0_16px_40px_rgba(15,23,42,0.08)]">
        <p className="text-sm font-medium">Top of the board</p>
        <p className="mt-1 text-xs text-slate-400">Public rating, with the site profile photo</p>
        <ul className="mt-3 space-y-2">
          {rows.map(([, handle, rating]) => (
            <li key={handle} className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold">
                  {handle.slice(0, 1)}
                </span>
                {handle}
              </span>
              <span className="font-medium tabular-nums">{rating}</span>
            </li>
          ))}
        </ul>
      </div>
      <span className="absolute -bottom-2 right-2 rounded-xl bg-slate-900 px-3 py-2 text-xs font-semibold text-white shadow">
        Open leaderboard
      </span>
    </div>
  );
}

function StartCard({
  title,
  label,
  href,
  points,
  featured,
}: {
  title: string;
  label: string;
  href: string;
  points: string[];
  featured: boolean;
}) {
  return (
    <article
      className={cn(
        "saas-card flex flex-col rounded-2xl bg-white p-6 shadow-sm",
        featured ? "border-2 border-blue-500" : "border border-slate-200"
      )}
    >
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold">{title}</h3>
        <span className="rounded-full border border-slate-200 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-slate-500">
          {label}
        </span>
      </div>
      <ul className="mt-6 space-y-2 text-sm text-slate-600">
        {points.map((point) => (
          <li key={point} className="flex items-center gap-2">
            <Check className="h-4 w-4 text-blue-600" />
            {point}
          </li>
        ))}
      </ul>
      <Link
        href={href}
        className={cn(
          "mt-8 rounded-full px-4 py-2.5 text-center text-sm font-semibold",
          featured ? "bg-blue-600 text-white hover:bg-blue-700" : "border border-slate-300 text-slate-800 hover:border-blue-400"
        )}
      >
        Open
      </Link>
    </article>
  );
}
