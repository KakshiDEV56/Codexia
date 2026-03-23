import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Codexia - Competitive Programming Contests",
  description: "Unified command center for tracking contests",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-gray-50 text-gray-900 dark:bg-black dark:text-gray-100 font-sans">
        <Navbar />
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
        <footer className="border-t border-gray-200 dark:border-gray-800 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
             <p>© 2026 Codexia Labs. All rights reserved.</p>
             <div className="flex justify-center gap-6 mt-4">
                 <a href="#" className="hover:text-gray-900 dark:hover:text-white">Changelog</a>
                 <a href="#" className="hover:text-gray-900 dark:hover:text-white">Documentation</a>
                 <a href="#" className="hover:text-gray-900 dark:hover:text-white">Status</a>
                 <a href="#" className="hover:text-gray-900 dark:hover:text-white">API</a>
             </div>
        </footer>
      </body>
    </html>
  );
}
