"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Navbar from "./Navbar";

export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLanding = pathname === "/";

  if (isLanding) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </main>
      <footer className="border-t border-gray-200 py-8 text-center text-sm text-gray-500 dark:border-zinc-800 dark:text-zinc-400">
        <p>© 2026 Codexia Labs. All rights reserved.</p>
        <div className="mt-4 flex justify-center gap-6">
          <Link href="/changelog" className="hover:text-gray-900 dark:hover:text-zinc-100">
            Changelog
          </Link>
          <a href="#" className="hover:text-gray-900 dark:hover:text-zinc-100">Documentation</a>
          <a href="#" className="hover:text-gray-900 dark:hover:text-zinc-100">Status</a>
          <a href="#" className="hover:text-gray-900 dark:hover:text-zinc-100">API</a>
        </div>
      </footer>
    </>
  );
}
