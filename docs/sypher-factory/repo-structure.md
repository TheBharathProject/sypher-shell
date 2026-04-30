# Repo Structure

## Three categories of repos

```
sypher organization on GitHub
├── sypher-shell                  # The "front door" — owns sypher.in apex
├── sypher-shared                 # Shared packages: UI, auth, types, utils
└── sypher-tool-<slug>            # One repo per tool (reel-hooks, yt-summarizer, ...)
```

## sypher-shell

The repo that owns `sypher.in`. Handles the marketing home, blog, login, signup, account/billing pages, Stripe webhooks, and the rewrite table that stitches every tool into the apex.

```
sypher-shell/
├── app/
│   ├── (marketing)/
│   │   ├── page.tsx                 # sypher.in (lists all tools)
│   │   ├── pricing/page.tsx
│   │   ├── about/page.tsx
│   │   └── layout.tsx
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   ├── signup/page.tsx
│   │   ├── auth/callback/route.ts   # Supabase auth callback
│   │   └── layout.tsx
│   ├── (account)/
│   │   ├── account/page.tsx
│   │   ├── account/billing/page.tsx
│   │   ├── account/subscriptions/page.tsx
│   │   └── layout.tsx
│   ├── blog/
│   │   ├── page.tsx                 # Blog index
│   │   └── [slug]/page.tsx          # Individual post (MDX)
│   ├── api/
│   │   ├── stripe/
│   │   │   ├── webhook/route.ts     # Stripe → DB sync
│   │   │   ├── checkout/route.ts    # Create Checkout session
│   │   │   └── portal/route.ts      # Customer portal redirect
│   │   └── auth/
│   │       └── ...                  # Auth helpers if needed
│   ├── sitemap.ts                   # Aggregate sitemap
│   ├── robots.ts                    # Robots.txt
│   └── layout.tsx                   # Root layout (font, theme provider)
├── content/
│   └── blog/                        # MDX posts
├── lib/
│   ├── supabase-server.ts
│   ├── supabase-browser.ts
│   ├── stripe.ts
│   └── tools-registry.ts            # Single source of truth: list of all tools
├── middleware.ts                    # Auth gate for /account/*
├── next.config.ts                   # Rewrites for every tool
├── package.json
├── tsconfig.json
└── .env.example
```

**Key file: `lib/tools-registry.ts`**

This is the single source of truth for what tools exist. Used by:
- The homepage (renders cards for each tool)
- The sitemap (includes each tool's marketing URL)
- The middleware (knows which paths to gate)
- The pricing page

```ts
export const tools = [
  {
    slug: 'reel-hooks',
    name: 'Reel Hooks',
    tagline: 'Transcribe and decode any creator\'s top reels.',
    icon: '/icons/reel-hooks.svg',
    rewriteTarget: 'https://sypher-tool-reel-hooks.vercel.app',
    stripeProductId: 'prod_...',
    priceInr: 99,
    seoKeywords: ['instagram reel transcription', 'hook analysis'],
    status: 'live', // 'live' | 'beta' | 'coming-soon'
  },
  {
    slug: 'yt-summarizer',
    name: 'YouTube Summarizer',
    // ...
  },
] as const;

export type ToolSlug = typeof tools[number]['slug'];
```

When you ship a new tool, you add an entry here (and to `next.config.ts` rewrites). Most things flow from this registry automatically.

## sypher-shared

A small repo (or just a private npm package) that hosts code every tool needs.

```
sypher-shared/
├── packages/
│   ├── ui/                          # @sypher/ui — design system primitives
│   │   ├── src/
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   └── ...
│   │   └── package.json
│   ├── auth/                        # @sypher/auth — Supabase client + hooks
│   │   ├── src/
│   │   │   ├── client.ts
│   │   │   ├── server.ts
│   │   │   ├── use-user.ts
│   │   │   └── require-subscription.ts
│   │   └── package.json
│   ├── types/                       # @sypher/types — shared TypeScript types
│   │   ├── src/
│   │   │   ├── user.ts
│   │   │   ├── subscription.ts
│   │   │   └── tool.ts
│   │   └── package.json
│   └── analytics/                   # @sypher/analytics — PostHog wrapper
├── package.json
├── pnpm-workspace.yaml              # pnpm workspaces (or turbo)
└── tsconfig.base.json
```

**Publishing strategy:** GitHub Packages (private). Each package has its own version. Tools install via:

```json
{
  "dependencies": {
    "@sypher/auth": "^1.0.0",
    "@sypher/ui": "^1.0.0",
    "@sypher/types": "^1.0.0"
  }
}
```

Alternative: don't publish, use git submodules. Worse DX, fine for solo dev.

Alternative: combine shell + shared into one Turborepo. Pulls all tools into one mono. Trades the "isolated repos" benefit for simpler shared-code workflow. Don't do this if you actually want repo isolation.

## sypher-tool-\<slug\>

One repo per tool. Standardized structure makes shipping tool N+1 fast.

```
sypher-tool-reel-hooks/
├── app/
│   ├── page.tsx                     # Marketing — basePath adds /reel-hooks
│   ├── how-it-works/page.tsx        # SEO content (→ sypher.in/reel-hooks/how-it-works)
│   ├── examples/page.tsx
│   ├── dashboard/
│   │   ├── page.tsx                 # App entry (auth+sub gated)
│   │   ├── layout.tsx
│   │   └── projects/[id]/page.tsx
│   ├── r/[id]/page.tsx              # Shareable result page
│   └── api/
│       ├── analyze/route.ts
│       ├── results/route.ts
│       └── ...
├── lib/
│   ├── supabase.ts
│   ├── deepgram.ts
│   ├── apify.ts
│   └── analyze.ts
├── components/
│   ├── HookAnalysis.tsx
│   └── ...
├── supabase/
│   └── migrations/
│       └── 0001_create_reels_table.sql
├── middleware.ts                    # Sub gate. matcher: /dashboard/:path* (basePath-relative)
├── next.config.ts                   # basePath: '/reel-hooks' — load-bearing
├── package.json
└── .env.example
```

**Why basePath, not `app/<slug>/` nesting:**

Use `basePath: '/<slug>'` in `next.config.ts` and put pages directly under `app/`. Next.js prefixes EVERYTHING with `/<slug>` automatically — pages, `_next/static/*` assets, API routes, Link `href`s. The shell's `/<slug>/:path+` rewrite then catches all of it, including `_next/static/css/*` requests.

The earlier suggestion to nest pages under `app/<slug>/` without basePath **does not work**. Pages render fine, but `_next/static/*` asset URLs don't include the slug prefix, so the browser fetches them from the shell domain (where they don't exist) and CSS/JS fail to load. Verified the failure mode and fix on 2026-04-30 with `sypher-tool-hello`.

Internal `<Link href="/dashboard">` automatically becomes `/reel-hooks/dashboard` in the browser. To link out to the apex (e.g., back to `sypher.in/`), use a plain `<a href="/">` — `<Link>` would prepend the basePath and route within the tool.

## Naming conventions

| Thing | Convention | Example |
|---|---|---|
| Repo name | `sypher-tool-<slug>` | `sypher-tool-reel-hooks` |
| Vercel project | Same as repo name | `sypher-tool-reel-hooks` |
| Tool slug (URL) | `kebab-case`, single word preferred | `reel-hooks`, `summarizer` |
| Stripe Product | `Sypher <Tool Name>` | `Sypher Reel Hooks` |
| Stripe Price IDs | `price_<slug>_<amount>_<period>_<currency>` | `price_reel_hooks_99_monthly_inr` |
| DB tables (per-tool) | `<slug>_<entity>` | `reel_hooks_reels`, `reel_hooks_analyses` |
| Shared DB tables | unprefixed | `users`, `subscriptions`, `audit_log` |
| Env var (tool-specific) | `<TOOL_SLUG>_<NAME>` | `REEL_HOOKS_DEEPGRAM_KEY` |
| Env var (shared) | unprefixed | `STRIPE_SECRET_KEY`, `SUPABASE_URL` |

Slugs cannot collide with shell-owned routes: `login`, `signup`, `account`, `blog`, `api`, `auth`, `pricing`, `about`, `legal`, `support`, `sitemap.xml`, `robots.txt`. Reserve those.

## Database conventions

```sql
-- Shared tables (managed by shell repo migrations)
auth.users                            -- Supabase auth-managed
public.profiles                       -- Optional: extends auth.users
public.subscriptions                  -- (user_id, tool_slug, status, plan, ...)
public.audit_log                      -- Cross-tool audit trail

-- Per-tool tables (managed by that tool's migrations)
public.reel_hooks_reels
public.reel_hooks_analyses
public.yt_summarizer_videos
public.yt_summarizer_summaries
```

RLS policies are mandatory on every per-tool table. The standard policy:

```sql
CREATE POLICY "users see own data" ON reel_hooks_reels
  FOR SELECT USING (auth.uid() = user_id);
```

See `examples/subscriptions-schema.sql` for the shared-tables baseline.
