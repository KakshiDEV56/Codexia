import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SiteChrome from "../components/SiteChrome";

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
      className={`${geistSans.variable} ${geistMono.variable} h-full scroll-smooth antialiased dark`}
    >
  <body className="min-h-full flex flex-col bg-gray-50 text-gray-900 dark:bg-zinc-950 dark:text-zinc-100 font-sans">
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}
