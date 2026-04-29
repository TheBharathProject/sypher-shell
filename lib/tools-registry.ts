/**
 * Single source of truth for tools in the sypher factory.
 * Used by: homepage, sitemap, robots.txt, middleware, pricing page.
 *
 * When you ship a new tool:
 *   1. Add an entry below
 *   2. Add the matching rewrite in next.config.ts
 *   3. Flip status from 'coming-soon' → 'live' once production-ready
 */

export type ToolStatus =
  | "idea"
  | "planned"
  | "building"
  | "coming-soon"
  | "beta"
  | "live"
  | "sunset";

export interface Tool {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  rewriteTarget?: string;
  status: ToolStatus;
  priceInr?: number;
  launchHint?: string;
  stripeProductId?: string;
  seoKeywords?: string[];
}

export const tools: Tool[] = [
  {
    slug: "reel-hooks",
    name: "Reel Hooks",
    tagline: "Decode any creator's top reels.",
    description:
      "Track 2 Instagram creators. Get their top 10 reels every week — with transcripts, hook breakdowns, and three reel concepts written in your voice, ready to post.",
    status: "coming-soon",
    priceInr: 99,
    launchHint: "launching this month",
    seoKeywords: ["instagram reel transcription", "hook analyzer"],
  },
];

export type ToolSlug = (typeof tools)[number]["slug"];

export const liveTools = () => tools.filter((t) => t.status === "live" || t.status === "beta");
export const upcomingTools = () =>
  tools.filter((t) => t.status === "coming-soon" || t.status === "building" || t.status === "planned");
