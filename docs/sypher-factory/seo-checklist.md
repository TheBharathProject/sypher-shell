# SEO Checklist

Every tool ships with these. Bake them into the tool template so it's automatic.

## On every marketing page

### 1. Server-rendered HTML

```ts
// app/<slug>/page.tsx
export const dynamic = 'force-static';
// or, if data needed:
export const revalidate = 3600; // ISR every hour
```

No client-only React for content the search engine needs to see. Use Server Components for marketing.

### 2. Metadata via Next.js metadata API

```ts
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Reel Hooks — Decode any creator\'s top reels',
  description: 'Track 2 Instagram creators. Get the top 10 reels with transcripts, hook breakdowns, and how-to-repurpose suggestions. ₹99/month.',
  keywords: ['instagram reel transcription', 'reel hook analyzer', 'instagram content research'],
  alternates: {
    canonical: 'https://sypher.in/reel-hooks',
  },
  openGraph: {
    type: 'website',
    title: 'Reel Hooks',
    description: 'Decode any creator\'s top reels.',
    url: 'https://sypher.in/reel-hooks',
    images: [
      {
        url: 'https://sypher.in/reel-hooks/og.png',
        width: 1200,
        height: 630,
        alt: 'Reel Hooks',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Reel Hooks',
    description: 'Decode any creator\'s top reels.',
    images: ['https://sypher.in/reel-hooks/og.png'],
  },
};
```

See `examples/tool-page-metadata.ts` for a reusable factory.

### 3. JSON-LD structured data

```tsx
const schema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Reel Hooks',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  offers: {
    '@type': 'Offer',
    price: '99',
    priceCurrency: 'INR',
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.8',
    ratingCount: '127',
  },
};

<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
/>
```

Add `aggregateRating` only when you have real reviews. Faking it is a Google guideline violation.

### 4. Single H1, semantic heading hierarchy

```tsx
<h1>Decode any creator's top Instagram reels</h1>
<h2>How it works</h2>
<h3>Track 2 creators</h3>
<h2>Pricing</h2>
```

Linters like `eslint-plugin-jsx-a11y` catch hierarchy violations.

### 5. Descriptive image alt text on every `<img>`

Not "logo" — "Reel Hooks logo." Not "screenshot" — "Reel Hooks dashboard showing top 10 reels for @virat.kohli."

### 6. Internal linking

Every tool's marketing page must:
- Link back to `sypher.in` ("Sypher" wordmark in header)
- Link to 2–3 sibling tools at the bottom ("Related tools")
- Link to relevant blog posts ("Read: How we analyze hooks")

The `lib/tools-registry.ts` in the shell repo makes "show 3 random sibling tools" a one-liner.

### 7. Canonical URL set explicitly

Always `https://sypher.in/<slug>`, never the underlying `*.vercel.app` URL.

## On every app/dashboard page

### 1. `noindex`

```ts
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};
```

### 2. Add to `robots.txt` disallow as a backup

```
Disallow: /reel-hooks/dashboard
Disallow: /reel-hooks/r/
Disallow: /account
Disallow: /api
```

(Generated automatically by `examples/shell-robots.ts`.)

## Sitemap

The shell aggregates a single `sitemap.xml` for the entire domain. See `examples/shell-sitemap.ts`.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://sypher.in/</loc><priority>1.0</priority></url>
  <url><loc>https://sypher.in/reel-hooks</loc><priority>0.9</priority></url>
  <url><loc>https://sypher.in/reel-hooks/how-it-works</loc><priority>0.7</priority></url>
  <url><loc>https://sypher.in/reel-hooks/examples</loc><priority>0.7</priority></url>
  <url><loc>https://sypher.in/yt-summarizer</loc><priority>0.9</priority></url>
  <url><loc>https://sypher.in/blog/reel-hooks-launch</loc><priority>0.6</priority></url>
</urlset>
```

Submit `https://sypher.in/sitemap.xml` to:
- Google Search Console
- Bing Webmaster Tools

## Blog (under `/blog`)

Every tool gets at least one launch post + a "how X works" tutorial. Blog posts are MDX files in the shell repo's `content/blog/`.

Each post must have:

```yaml
---
title: How we analyze Instagram reel hooks at Sypher
description: A look under the hood at the transcription + LLM pipeline.
slug: how-we-analyze-reel-hooks
date: 2026-05-01
tags: ['reel-hooks', 'product', 'engineering']
heroImage: /blog/reel-hooks-pipeline.png
---
```

Posts are SSG'd at build time. Tags become category pages (`/blog/tags/reel-hooks`) — more SEO surfaces for cheap.

## Programmatic SEO (high leverage, optional)

For each tool, generate landing pages for high-intent variants:

```
sypher.in/reel-hooks/transcribe/instagram-reels
sypher.in/reel-hooks/transcribe/youtube-shorts
sypher.in/reel-hooks/transcribe/tiktok
sypher.in/reel-hooks/for/fitness-creators
sypher.in/reel-hooks/for/finance-creators
```

Same UI, different metadata + headline. Each variant is a row in a content data file:

```ts
// app/reel-hooks/[variant]/page.tsx + generateStaticParams
```

This is how Zapier ranked for "X to Y integration" across thousands of pages. Don't do it for tool #1 — do it once you've nailed your first few tool launches.

## Lighthouse budget

Every PR that touches marketing routes runs Lighthouse CI:

```yaml
# .github/workflows/lighthouse.yml
- uses: treosh/lighthouse-ci-action@v11
  with:
    urls: |
      https://sypher.in/
      https://sypher.in/reel-hooks
    budgetPath: ./lighthouse-budget.json
```

`lighthouse-budget.json`:

```json
[{
  "path": "/*",
  "resourceSizes": [
    { "resourceType": "script", "budget": 200 },
    { "resourceType": "total", "budget": 500 }
  ],
  "timings": [
    { "metric": "interactive", "budget": 3000 },
    { "metric": "largest-contentful-paint", "budget": 2500 }
  ]
}]
```

Mobile Lighthouse score must stay ≥ 90 on Performance, Accessibility, Best Practices, SEO.

## Per-tool launch checklist

When shipping a new tool, verify:

- [ ] Page renders server-side (`view-source` shows real content, not just an empty div)
- [ ] `<title>` and `<meta name="description">` are unique and keyword-targeted
- [ ] Canonical URL is the apex (`sypher.in/<slug>`)
- [ ] OG image exists at `/<slug>/og.png` (1200×630)
- [ ] JSON-LD `SoftwareApplication` schema present
- [ ] Single H1 with primary keyword
- [ ] At least one outbound internal link (to blog or another tool)
- [ ] Lighthouse mobile ≥ 90 on all four scores
- [ ] Tool added to `lib/tools-registry.ts` (so it appears in homepage + sitemap)
- [ ] Sitemap visited at `/sitemap.xml` includes the new URL
- [ ] Submitted URL to Google Search Console for indexing
- [ ] At least one blog post written about it (drives initial traffic + internal links)

## Long-term SEO compounding strategy

1. **Tool count.** Each tool = new keyword cluster. 10 tools = 10 keyword clusters.
2. **Blog volume.** 1 post per tool launch + 1 evergreen tutorial per tool per quarter. After year 1, you have ~40 posts; each linking to relevant tools.
3. **Programmatic pages.** After tool 5–6, layer in /for/<niche> and /vs/<competitor> templated pages.
4. **Backlink earning.** Each tool launch = a Product Hunt + IndieHackers + Reddit + Twitter post. Consistent launches build domain authority.
5. **Internal linking discipline.** Every new piece of content links to 2–3 existing pieces. The graph compounds.
