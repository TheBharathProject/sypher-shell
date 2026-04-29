/**
 * sypher-shell — next.config.ts
 *
 * Stitches every tool repo's Vercel deployment into the apex domain via rewrites.
 * The browser sees sypher.in/<slug>/* throughout. Cookies set on .sypher.in
 * propagate naturally because rewrites are server-side.
 *
 * IMPORTANT: each tool repo must serve its pages at the same prefix
 * (e.g., reel-hooks repo serves /reel-hooks, not /). See docs/sypher-factory/repo-structure.md.
 */

import type { NextConfig } from 'next';

interface ToolRoute {
  slug: string;
  rewriteTarget: string;
}

// Add a tool here once its Vercel project is live.
// Example: { slug: 'reel-hooks', rewriteTarget: 'https://sypher-tool-reel-hooks.vercel.app' }
const tools: ToolRoute[] = [
  { slug: 'hello', rewriteTarget: 'https://sypher-tool-hello.vercel.app' },
];

const config: NextConfig = {
  reactStrictMode: true,

  async rewrites() {
    return tools.map((tool) => ({
      source: `/${tool.slug}/:path*`,
      destination: `${tool.rewriteTarget}/${tool.slug}/:path*`,
    }));
  },

  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ];
  },

  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.sypher.in' }],
        destination: 'https://sypher.in/:path*',
        permanent: true,
      },
    ];
  },
};

export default config;
