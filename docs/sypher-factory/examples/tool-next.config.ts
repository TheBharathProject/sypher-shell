/**
 * Per-tool repo — next.config.ts (example for sypher-tool-reel-hooks)
 *
 * Tool repos serve their pages under /<slug>/* paths to match the shell's
 * rewrites. No basePath is used (it's simpler to just put everything under
 * app/<slug>/ in the file system).
 */

import type { NextConfig } from 'next';

const config: NextConfig = {
  reactStrictMode: true,

  // The tool's content lives under /reel-hooks/* paths, so /favicon.ico,
  // /og.png etc. live under public/reel-hooks/ as well.
  images: {
    remotePatterns: [
      // If you serve thumbnails from R2 / Supabase storage:
      { protocol: 'https', hostname: '*.r2.cloudflarestorage.com' },
      { protocol: 'https', hostname: '*.supabase.co' },
    ],
  },

  async headers() {
    return [
      {
        source: '/reel-hooks/dashboard/:path*',
        headers: [
          { key: 'X-Robots-Tag', value: 'noindex, nofollow' },
          { key: 'Cache-Control', value: 'private, no-cache, no-store, must-revalidate' },
        ],
      },
      {
        source: '/reel-hooks/api/:path*',
        headers: [
          { key: 'X-Robots-Tag', value: 'noindex' },
          { key: 'Cache-Control', value: 'private, no-cache' },
        ],
      },
    ];
  },
};

export default config;
