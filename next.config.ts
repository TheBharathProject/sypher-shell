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

import createMDX from '@next/mdx';
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
  pageExtensions: ['ts', 'tsx', 'mdx'],

  async rewrites() {
    // Two rules per tool:
    //   1) exact /<slug>      → matches the bare prefix without adding a trailing slash
    //   2) /<slug>/:path+     → matches one-or-more deeper segments
    // Using a single /<slug>/:path* (zero-or-more) interpolates to ".../<slug>/" when the
    // path is empty, which Next.js 308s to remove the trailing slash, causing a loop.
    return tools.flatMap((tool) => [
      {
        source: `/${tool.slug}`,
        destination: `${tool.rewriteTarget}/${tool.slug}`,
      },
      {
        source: `/${tool.slug}/:path+`,
        destination: `${tool.rewriteTarget}/${tool.slug}/:path+`,
      },
    ]);
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

const withMDX = createMDX({
  // Plugin paths as strings — Turbopack/webpack serializer requires this.
  options: {
    remarkPlugins: [['remark-gfm', {}]],
    rehypePlugins: [['rehype-slug', {}]],
  },
});

export default withMDX(config);
