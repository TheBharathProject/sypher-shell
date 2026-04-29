/**
 * sypher-shell — app/robots.ts
 *
 * Generates robots.txt for the apex. Disallows app surfaces across all tools
 * via wildcard patterns. Tool repos may add their own /robots.txt but the
 * shell-served one is what Google sees for sypher.in.
 */

import type { MetadataRoute } from 'next';
import { tools } from '@/lib/tools-registry';

const BASE = 'https://sypher.in';

export default function robots(): MetadataRoute.Robots {
  const disallowedPaths: string[] = [
    '/account',
    '/api/',
    '/auth/callback',
  ];

  for (const tool of tools) {
    disallowedPaths.push(`/${tool.slug}/dashboard/`);
    disallowedPaths.push(`/${tool.slug}/api/`);
    // /<slug>/r/ is private results — uncomment if results should not be indexed
    // disallowedPaths.push(`/${tool.slug}/r/`);
  }

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: disallowedPaths,
      },
    ],
    sitemap: `${BASE}/sitemap.xml`,
    host: BASE,
  };
}
