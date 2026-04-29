/**
 * sypher-shell — app/sitemap.ts
 *
 * Aggregates URLs across the apex domain. Each tool exposes its own
 * sitemap-fragment via /<slug>/sitemap.xml that the shell can merge in,
 * but for simplicity we statically list the indexable routes here.
 */

import type { MetadataRoute } from 'next';
import { tools } from '@/lib/tools-registry';
import { getBlogPosts } from '@/lib/blog';

const BASE = 'https://sypher.in';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${BASE}/`, lastModified: now, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${BASE}/pricing`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/about`, lastModified: now, changeFrequency: 'yearly', priority: 0.4 },
    { url: `${BASE}/blog`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
  ];

  const toolRoutes: MetadataRoute.Sitemap = tools
    .filter((t) => t.status === 'live')
    .flatMap((tool) => [
      {
        url: `${BASE}/${tool.slug}`,
        lastModified: now,
        changeFrequency: 'weekly' as const,
        priority: 0.9,
      },
      {
        url: `${BASE}/${tool.slug}/how-it-works`,
        lastModified: now,
        changeFrequency: 'monthly' as const,
        priority: 0.6,
      },
      {
        url: `${BASE}/${tool.slug}/examples`,
        lastModified: now,
        changeFrequency: 'monthly' as const,
        priority: 0.6,
      },
    ]);

  const blogRoutes: MetadataRoute.Sitemap = (await getBlogPosts()).map((post) => ({
    url: `${BASE}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  return [...staticRoutes, ...toolRoutes, ...blogRoutes];
}
