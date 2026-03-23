"use client";

import Link from "next/link";
import { Search, Moon, Sun, Menu } from "lucide-react";
import { useEffect } from "react";
import { useThemeStore } from "../store/themeStore";

export default function Navbar() {
  const { isDarkMode, toggleTheme } = useThemeStore();

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  return (
    <nav className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-black text-gray-900 dark:text-white px-6 py-4 flex items-center justify-between sticky top-0 z-50 rounded-2xl mx-4 mt-4 shadow-sm">
      <div className="flex items-center gap-8">
        <Link href="/" className="text-2xl font-bold bg-linear-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
          Codexia
        </Link>
        
        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-500 dark:text-gray-400">
          <Link href="/contests" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            Contests
          </Link>
          <Link href="/platforms" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            Platforms
          </Link>
          <Link href="/leaderboard" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            Leaderboard
          </Link>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search platforms..." 
            className="bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-full py-2 pl-10 pr-4 text-sm text-gray-800 dark:text-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500 w-64"
          />
        </div>

        <button 
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 transition-colors"
        >
          {isDarkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
        </button>

        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold text-white">
          JD
        </div>
      </div>
    </nav>
  );
}
