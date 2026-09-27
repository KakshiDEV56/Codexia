import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "userpic.codeforces.org" },
      { protocol: "https", hostname: "assets.leetcode.com" },
      { protocol: "https", hostname: "img.atcoder.jp" },
      { protocol: "https", hostname: "cdn.codechef.com" },
    ],
  },
};

export default nextConfig;
