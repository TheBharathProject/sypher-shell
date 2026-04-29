/**
 * Reusable metadata factory for tool marketing pages.
 *
 * Usage in app/<slug>/page.tsx:
 *
 *   import { buildToolMetadata } from '@/lib/seo';
 *   export const metadata = buildToolMetadata({
 *     slug: 'reel-hooks',
 *     title: 'Reel Hooks — Decode any creator\'s top reels',
 *     description: 'Track 2 Instagram creators...',
 *     keywords: ['instagram reel transcription', ...],
 *   });
 */

import type { Metadata } from 'next';

const BASE = process.env.NEXT_PUBLIC_SYPHER_BASE_URL ?? 'https://sypher.in';

export interface ToolMetadataInput {
  slug: string;
  title: string;
  description: string;
  keywords?: string[];
  ogImagePath?: string; // e.g., '/reel-hooks/og.png'
  pricePerMonthInr?: number;
  ratingValue?: number;
  ratingCount?: number;
}

export function buildToolMetadata(input: ToolMetadataInput): Metadata {
  const url = `${BASE}/${input.slug}`;
  const og = input.ogImagePath ? `${BASE}${input.ogImagePath}` : `${BASE}/og-default.png`;

  return {
    title: input.title,
    description: input.description,
    keywords: input.keywords,
    alternates: { canonical: url },
    openGraph: {
      type: 'website',
      title: input.title,
      description: input.description,
      url,
      siteName: 'Sypher',
      images: [{ url: og, width: 1200, height: 630, alt: input.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: input.title,
      description: input.description,
      images: [og],
    },
    robots: { index: true, follow: true },
  };
}

/**
 * Renders a JSON-LD <script> tag for SoftwareApplication structured data.
 * Drop into the page body, not <head>.
 */
export function buildToolJsonLd(input: ToolMetadataInput): string {
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: input.title.split('—')[0].trim(),
    description: input.description,
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    url: `${BASE}/${input.slug}`,
  };

  if (typeof input.pricePerMonthInr === 'number') {
    schema.offers = {
      '@type': 'Offer',
      price: String(input.pricePerMonthInr),
      priceCurrency: 'INR',
    };
  }

  if (typeof input.ratingValue === 'number' && typeof input.ratingCount === 'number') {
    schema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: input.ratingValue,
      ratingCount: input.ratingCount,
    };
  }

  return JSON.stringify(schema);
}
