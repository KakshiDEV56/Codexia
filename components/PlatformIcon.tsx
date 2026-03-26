import { Platform } from "../lib/types";

interface Props {
  platform: Platform;
  className?: string;
}

export default function PlatformIcon({ platform, className = "w-6 h-6" }: Props) {
  switch (platform) {
    case "codeforces":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
          {/* Three bars: Blue, Red, Orange/Yellow */}
          <rect x="2" y="9" width="6" height="12" rx="2" fill="#3B82F6" />
          <rect x="10" y="5" width="6" height="16" rx="2" fill="#EF4444" />
          <rect x="18" y="9" width="6" height="12" rx="2" fill="#EAB308" />
        </svg>
      );
    case "leetcode":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={`${className} text-yellow-500`} xmlns="http://www.w3.org/2000/svg">
          <path d="M16.1 2H7.9C4.6 2 2 4.6 2 7.9v8.2C2 19.4 4.6 22 7.9 22h8.2c3.3 0 5.9-2.6 5.9-5.9V7.9C22 4.6 19.4 2 16.1 2zm0 0" fill="none" opacity="0"/>
          <path d="M13.4 9.6l-3.3 2.6c-.3.3-.3.8 0 1.1l3.3 2.6c.3.2.7.2 1 .1.2-.1.4-.4.4-.7V14c0-.2-.1-.4-.3-.5l-2.2-1.8 2.2-1.7c.2-.2.3-.4.3-.6v-1.3c0-.3-.2-.5-.4-.7-.3-.1-.7-.1-1 .2z" fill="gray"/>
          {/* Approximate LeetCode hexagon/shape */}
          <path d="M18.8 6.6L16.2 4c-.8-.8-2-1-2.9-.4L9 6.2c-1.3.9-1.3 2.9 0 3.8l1.4 1 1-1.3-1.4-1.1c-.2-.2-.2-.6 0-.8l3.6-2.4c.2-.1.5 0 .6.2l2.6 2.6c.2.2.2.5 0 .7l-3.3 3.3c-.2.2-.5.2-.7 0L10.7 10l-1 1.3 2.1 2.1c1 .9 2.5.9 3.5 0l4.3-4.3c.9-.9.8-2.2-.8-2.5z" fill="#FFA116"/>
          <path d="M11 16l4.2-3.1c.3-.2.3-.7 0-.9-.2-.2-.6-.2-.8 0l-4.2 3.1c-.2.1-.3.4-.3.6v.9c0 .4.4.8.8.8.1 0 .3 0 .4-.1z" fill="gray"/>
        </svg>
      );
    case "codechef":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={`${className} text-orange-700`} xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="10" fill="#5D4037" opacity="0.2"/>
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
          <path d="M8.5 12h7M12 8.5v7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
          <text x="12" y="12" fontSize="60%" textAnchor="middle" dy=".3em" fill="currentColor" fontWeight="bold">CC</text>
        </svg>
      );
    case "atcoder":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={`${className} text-gray-900 dark:text-gray-100`} xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" fill="currentColor" opacity="0.2" />
          <path d="M6 18l6-11 6 11H6z" fill="currentColor"/>
        </svg>
      );
    case "gfg":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={`${className} text-green-600`} xmlns="http://www.w3.org/2000/svg">
           <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" fill="#2E7D32"/>
           <text x="12" y="12" fontSize="10" textAnchor="middle" dy=".35em" fill="white" fontWeight="bold" fontFamily="monospace">G</text>
        </svg>
      );
    case "hackerrank":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
          <path d="M8 3.5h8l4.5 8-4.5 8H8l-4.5-8 4.5-8z" fill="#00EA64"/>
          <path d="M9.5 8h2v2.5h1V8h2v8h-2v-3h-1v3h-2V8z" fill="#0B0F19"/>
        </svg>
      );
    default:
      return <div className={`border rounded-full ${className} bg-gray-200`} />;
  }
}
