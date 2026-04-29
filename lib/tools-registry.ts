/**
 * Single source of truth for tools in the sypher factory.
 * Used by: homepage, sitemap, robots.txt, middleware, pricing page.
 *
 * When you ship a new tool:
 *   1. Add an entry below
 *   2. Add the matching rewrite in next.config.ts
 */

export type ToolStatus = 'idea' | 'planned' | 'building' | 'beta' | 'live' | 'sunset';

export interface Tool {
  slug: string;
  name: string;
  tagline: string;
  rewriteTarget: string;
  status: ToolStatus;
  priceInr?: number;
  stripeProductId?: string;
  seoKeywords?: string[];
}

export const tools: Tool[] = [
  // Example (uncomment + edit when reel-hooks ships):
  // {
  //   slug: 'reel-hooks',
  //   name: 'Reel Hooks',
  //   tagline: "Decode any creator's top reels.",
  //   rewriteTarget: 'https://sypher-tool-reel-hooks.vercel.app',
  //   status: 'live',
  //   priceInr: 99,
  //   seoKeywords: ['instagram reel transcription', 'hook analyzer'],
  // },
];

export type ToolSlug = (typeof tools)[number]['slug'];
