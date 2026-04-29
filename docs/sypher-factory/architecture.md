# Architecture

## High-level diagram

```
                            +-------------------+
                            |   sypher.in (DNS) |
                            +---------+---------+
                                      |
                                      v
                            +-------------------+
                            |   Cloudflare      |
                            |   (proxy + CDN)   |
                            +---------+---------+
                                      |
                                      v
                            +-------------------+
                            |  Shell Vercel     |
                            |  Project          |
                            |  (sypher-shell)   |
                            |                   |
                            |  - Marketing home |
                            |  - /login         |
                            |  - /account       |
                            |  - /api/auth/*    |
                            |  - /api/stripe/*  |
                            |  - rewrites for   |
                            |    every tool     |
                            +----+----------+---+
                                 |          |
                                 |          | (rewrite)
                                 |          v
                                 |   +-------------------+
                                 |   | Tool Vercel       |
                                 |   | Project           |
                                 |   | (reel-hooks)      |
                                 |   |                   |
                                 |   | - /reel-hooks     |
                                 |   |   marketing       |
                                 |   | - /reel-hooks/    |
                                 |   |   dashboard (app) |
                                 |   | - /api/...        |
                                 |   +-------------------+
                                 |
                                 | (rewrite)
                                 v
                          +-------------------+
                          | Tool Vercel       |
                          | Project           |
                          | (yt-summarizer)   |
                          +-------------------+

                    +---------------------------+
                    | Supabase                  |
                    | - users (auth.users)      |
                    | - subscriptions           |
                    | - per-tool tables         |
                    +---------------------------+

                    +---------------------------+
                    | Stripe                    |
                    | - One Customer per user   |
                    | - One Product per tool    |
                    | - Webhooks → shell        |
                    +---------------------------+
```

## URL structure

```
sypher.in/                          Main landing (lists all tools)
sypher.in/login                     Shared auth (handled by shell)
sypher.in/signup                    Shared signup (handled by shell)
sypher.in/account                   Account, subscriptions, billing portal
sypher.in/account/billing           Stripe customer portal redirect
sypher.in/blog                      Content marketing (handled by shell)
sypher.in/blog/<slug>               Individual posts
sypher.in/sitemap.xml               Aggregate sitemap (all tools)
sypher.in/robots.txt                Robots config

sypher.in/reel-hooks                Tool 1 marketing (SEO indexed)
sypher.in/reel-hooks/dashboard      Tool 1 app (auth + sub gated, noindex)
sypher.in/reel-hooks/r/<id>         Result page (per-tool semantics)

sypher.in/yt-summarizer             Tool 2 marketing
sypher.in/yt-summarizer/dashboard   Tool 2 app
```

Behind the scenes, `sypher.in/reel-hooks/*` requests are rewritten by the shell to a separate Vercel deployment for the `reel-hooks` repo. The browser sees `sypher.in` throughout. Google indexes `sypher.in` URLs.

## Why subdirectories, not subdomains

Decided: subdirectories. Rationale:

- **SEO authority compounds** across all tools (subdomains are treated as separate sites by Google in practice — Moz, HubSpot, and others have measured 20–60% traffic gains migrating off them).
- **Cookie scope is trivial** — one cookie on `.sypher.in` covers everything, including the auth gates that span tools.
- **Time to rank a new tool drops from months to weeks** as the root domain accumulates authority.

The cost is one-time rewrite plumbing in the shell, which the `examples/shell-next.config.ts` template handles.

## Why one repo per tool, not a monorepo

Decided: separate repos. Rationale:

- **Independent failure domains.** A bad deploy on `reel-hooks` cannot break `yt-summarizer`.
- **Independent deploy cadence.** Ship a hotfix on one tool without redeploying every tool.
- **Independent stacks possible.** A tool that needs Python or a different framework can have its own setup; only the shell needs to know how to rewrite to it.
- **Cleaner ownership / handoff.** Selling, open-sourcing, or extracting a single tool later is straightforward.

Tradeoff accepted: shared code (UI components, auth helpers) needs a strategy — published npm package or git submodule. See `repo-structure.md`.

## Data flow: a typical user journey

```
1. Anonymous user lands on sypher.in/reel-hooks (organic search)
   → Static HTML served from edge cache. Sub-100ms LCP.

2. Clicks "Try free"
   → Redirects to sypher.in/login
   → Supabase Auth (magic link or OAuth)
   → Cookie set on .sypher.in

3. Redirected to sypher.in/reel-hooks/dashboard
   → Shell rewrites to reel-hooks-app.vercel.app/dashboard
   → Reel-hooks tool reads the auth cookie, validates session
   → Checks subscriptions table: does user have active sub for "reel-hooks"?
   → No → renders paywall + Stripe Checkout button
   → Yes → renders dashboard

4. User clicks Subscribe → Stripe Checkout
   → Returns to sypher.in/account?success=1
   → Stripe webhook fires → shell's /api/stripe/webhook
   → Webhook upserts subscriptions(user_id, "reel-hooks", "active", ...)

5. User uses tool. App calls its own /api endpoints, which call:
   → Supabase (DB writes/reads, scoped by user_id)
   → External APIs (Apify, Deepgram, Anthropic, etc.)

6. User visits sypher.in/yt-summarizer
   → Already logged in (cookie scoped to .sypher.in)
   → No "yt-summarizer" subscription → paywall
   → CTA: "You already have an account, just add this tool"
```

## Shared vs per-tool concerns

| Concern | Where it lives |
|---|---|
| Auth (signup, login, session) | Shell repo |
| User profile, account settings | Shell repo |
| Stripe webhooks, subscription sync | Shell repo |
| Billing portal entrypoint | Shell repo |
| `sitemap.xml`, `robots.txt` | Shell repo (aggregates across tools) |
| Marketing home, blog | Shell repo |
| Brand UI primitives (buttons, layout) | Shared package: `@sypher/ui` |
| Shared types (User, Subscription) | Shared package: `@sypher/types` |
| Auth client, subscription gate hook | Shared package: `@sypher/auth` |
| Tool-specific marketing page | Tool repo |
| Tool-specific app + API routes | Tool repo |
| Tool-specific DB tables | Supabase, owned by tool repo's migrations |

## Failure modes and how they're handled

| Failure | Impact | Mitigation |
|---|---|---|
| Tool repo's deploy is broken | That tool's routes return 502; shell + other tools unaffected | Status page + per-tool fallback page in shell |
| Shell repo's deploy is broken | All tools effectively down (no auth, no rewrites) | Branch protection + required CI on shell. Roll back instantly via Vercel. |
| Supabase down | Auth + DB calls fail across all tools | Display friendly error; consider read replica for critical tools |
| Stripe webhook missed | Subscription state can drift from truth | Reconciliation cron: re-pulls active subs from Stripe and rewrites table nightly |
| Cookie domain misconfigured | SSO breaks across tools | Lock cookie domain in shared `@sypher/auth` package; integration test on every PR |
| Rewrite target moves URL | 502 until rewrite updated | Use stable Vercel project domains as rewrite targets, not preview URLs |

## Decisions deferred

- **Whether to use Cloudflare Workers or Vercel rewrites** for the routing layer. Both work. Vercel rewrites is simpler if everything is on Vercel; Cloudflare is more powerful if you need to host non-Vercel tools later. Default: Vercel rewrites until you need otherwise.
- **Whether shared packages are npm-published or git submodules.** Default: npm-published private packages via GitHub Packages. Submodules add Git friction.
- **Self-hosted Whisper vs. Deepgram for transcription.** API-based until volume justifies a GPU box (~500K reels/month). See `pricing-economics.md`.
