# sypher-factory

Reference scaffold for building a multi-tool SaaS factory under the `sypher.in` domain. Each tool is its own repo, deployed independently, but stitched together at the URL level so SEO authority compounds across every tool you ship.

This folder contains decisions, configs, and templates. Copy it into a new repo (or just into your shell repo's `docs/`) and use it as the source of truth as you build.

## Read these in order

1. [`architecture.md`](./architecture.md) — the core system design (domains, repos, auth, data flow)
2. [`hosting.md`](./hosting.md) — Vercel + Cloudflare + Supabase setup
3. [`self-hosted-postgres.md`](./self-hosted-postgres.md) — Postgres 18 on the Oracle Cloud VM (Reel Hooks, future worker-heavy tools)
4. [`repo-structure.md`](./repo-structure.md) — shell repo + per-tool repos
5. [`github-and-deployment.md`](./github-and-deployment.md) — CI, branch protection, deploy pipeline
6. [`auth-and-billing.md`](./auth-and-billing.md) — Supabase auth + Stripe + subscription gating
7. [`design-system.md`](./design-system.md) — visual language, tokens, component patterns
8. [`seo-checklist.md`](./seo-checklist.md) — what every tool must ship with for SEO
9. [`pricing-economics.md`](./pricing-economics.md) — ₹99 tier unit economics
10. [`new-tool-playbook.md`](./new-tool-playbook.md) — step-by-step for shipping tool N+1
11. [`tools-roadmap.md`](./tools-roadmap.md) — queue of tool ideas

## Reference files

In `examples/`:

- `shell-next.config.ts` — rewrites that stitch each tool into the shell domain
- `shell-middleware.ts` — auth + subscription gating
- `shell-sitemap.ts` — aggregate sitemap across all tools
- `shell-robots.ts` — `robots.txt` generator
- `tool-next.config.ts` — per-tool Next.js config baseline
- `tool-page-metadata.ts` — SEO metadata template (title, description, OG, JSON-LD)
- `github-workflow-ci.yml` — CI workflow template
- `cloudflare-worker-router.js` — alternative routing using CF Workers
- `subscriptions-schema.sql` — Postgres schema for users + subscriptions
- `stripe-webhook-handler.ts` — keeps subscriptions table in sync with Stripe
- `.env.example` — required environment variables

## Bootstrapping a new repo from this scaffold

```bash
# 1. Create a new repo for the shell (the "front door" that stitches tools together)
gh repo create sypher-shell --private
git clone git@github.com:<you>/sypher-shell.git
cd sypher-shell
npx create-next-app@latest . --typescript --app --tailwind --eslint
# copy this whole sypher-factory/ folder into the new repo's docs/

# 2. Set up Supabase project (auth + Postgres)
#    Run examples/subscriptions-schema.sql in Supabase SQL editor

# 3. Set up Stripe
#    Create products per tool. Webhook → /api/stripe/webhook in shell repo.

# 4. Wire DNS
#    Point sypher.in to Cloudflare (proxied), then Cloudflare to Vercel.

# 5. First tool repo
gh repo create sypher-tool-reel-hooks --private
#    Add it to shell's next.config.ts rewrites table.

# 6. Branch protection on main, CI passing required, then ship.
```

Detailed walkthrough lives in `new-tool-playbook.md`.

## Core principles

- **One domain, many tools, infinite SEO compounding.** All tools live at `sypher.in/<slug>`. Subdomains are off the table for marketing-relevant routes.
- **One repo per tool.** Independent deploys, independent failure domains. The shell repo glues them together via rewrites.
- **Shared auth, separate entitlements.** One user record on `sypher.in`. Each tool is gated by its own row in the `subscriptions` table. Paying for one tool does not unlock others.
- **Static-render marketing, dynamic-render app.** Marketing routes are SSG/cached at the edge for SEO + speed. App routes (`/dashboard`, `/account`) are SSR and `noindex`.
- **₹99 entry tier is the price ceiling, not floor.** Unit economics rely on caching across users tracking the same profiles + a healthy free → ₹99 → ₹499 funnel.

## When to deviate from this scaffold

- **A tool needs a non-Next.js stack** (Streamlit, Rails, Python FastAPI service): use a dedicated subdomain like `app-<tool>.sypher.in` for that tool's app surface only. Keep its marketing page on the shell at `sypher.in/<tool>` so SEO still benefits.
- **A tool grows into its own product** (separate brand identity, possibly to be acquired): migrate it to its own apex domain. Set up 301s from `sypher.in/<tool>` to the new domain to preserve link equity.
- **Compliance forces hard data isolation**: spin up a separate Supabase project + Stripe account for that tool. Lose the cross-tool upsell, gain isolation.
