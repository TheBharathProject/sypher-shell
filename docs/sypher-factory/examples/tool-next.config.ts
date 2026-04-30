/**
 * Per-tool repo — next.config.ts (example for sypher-tool-reel-hooks)
 *
 * basePath is the load-bearing line. Without it, Next.js generates asset
 * URLs like /_next/static/..., the browser fetches them from sypher.in
 * (which doesn't have them), and CSS/JS never loads. With basePath,
 * EVERYTHING (pages, /_next/static/..., API routes) gets the /<slug>
 * prefix, so the shell's /<slug>/:path+ rewrite catches it all.
 *
 * Pages live at app/page.tsx, app/dashboard/page.tsx, etc. — DO NOT nest
 * routes under app/<slug>/. basePath adds the prefix automatically.
 *
 * Verified end-to-end with sypher-tool-hello on 2026-04-30.
 */

import type { NextConfig } from "next";

const config: NextConfig = {
  basePath: "/reel-hooks",
  reactStrictMode: true,

  images: {
    remotePatterns: [
      { protocol: "https", hostname: "*.r2.cloudflarestorage.com" },
      { protocol: "https", hostname: "*.supabase.co" },
    ],
  },

  async headers() {
    return [
      {
        // Source paths here are relative to the basePath — i.e., /dashboard/*
        // resolves to /reel-hooks/dashboard/* in the URL.
        source: "/dashboard/:path*",
        headers: [
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
          { key: "Cache-Control", value: "private, no-cache, no-store, must-revalidate" },
        ],
      },
      {
        source: "/api/:path*",
        headers: [
          { key: "X-Robots-Tag", value: "noindex" },
          { key: "Cache-Control", value: "private, no-cache" },
        ],
      },
    ];
  },
};

export default config;
