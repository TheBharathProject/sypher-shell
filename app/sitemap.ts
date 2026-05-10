/**
 * sypher-shell — app/sitemap.ts
 *
 * Aggregates URLs across the apex domain. Each tool exposes its own
 * sitemap-fragment via /<slug>/sitemap.xml that the shell can merge in,
 * but for simplicity we statically list the indexable routes here.
 */

import type { MetadataRoute } from 'next';
import { tools } from '@/lib/tools-registry';
import { getBlogPosts, getCategories } from '@/lib/blog';

const BASE = 'https://sypher.in';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${BASE}/`, lastModified: now, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${BASE}/blog`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE}/blog/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE}/privacy`, lastModified: now, changeFrequency: 'yearly', priority: 0.4 },
    { url: `${BASE}/terms`, lastModified: now, changeFrequency: 'yearly', priority: 0.4 },
  ];

  const toolRoutes: MetadataRoute.Sitemap = tools
    .filter((t) => t.status === 'live')
    .map((tool) => ({
      url: `${BASE}/${tool.slug}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    }));

  const publicToolRoutes: MetadataRoute.Sitemap = [
    {
      url: `${BASE}/pegasus/login`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${BASE}/pegasus/community`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.6,
    },
    {
      url: `${BASE}/pegasus/privacy-policy`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];

  const topicRoutes: MetadataRoute.Sitemap = (await getCategories()).map((category) => ({
    url: `${BASE}/blog/topic/${category.tag}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.5,
  }));

  const blogRoutes: MetadataRoute.Sitemap = (await getBlogPosts()).map((post) => ({
    url: `${BASE}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  return [...staticRoutes, ...toolRoutes, ...publicToolRoutes, ...topicRoutes, ...blogRoutes];
}
