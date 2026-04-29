# New Tool Playbook

The end-to-end checklist for shipping tool N+1. Target: a new tool live at `sypher.in/<slug>` within a week of starting (faster once you've shipped 2–3 and the muscle memory is there).

## Phase 0: Decide it's worth building (1 hour)

Before any code:

- [ ] Pick a slug (kebab-case, single concept, not too generic)
- [ ] Write the one-line value prop ("Decode any creator's top reels.")
- [ ] Write 3 search queries you'd want to rank for (Google's SERP for those queries tells you the SEO competition)
- [ ] Write the pricing tier (default: ₹99/month — see `pricing-economics.md` if it should be Pro-tier)
- [ ] Identify the highest-cost API call (the unit economics test from `pricing-economics.md`)
- [ ] Decide: free tier limit + paid tier quotas

If unit economics don't pencil out at the price tier you want, stop. Either change the scope (less expensive pipeline) or change the price (push to Pro tier).

Add this to `tools-roadmap.md`:

```yaml
- slug: my-new-tool
  status: planned
  one-liner: ...
  primary-keyword: ...
  price-tier: ₹99 / ₹499
  variable-cost-per-use: ₹...
  pipeline: [Apify → Deepgram → Anthropic → ...]
```

## Phase 1: Bootstrap the repo (30 minutes)

```bash
# 1. Create repo
gh repo create sypher-tool-<slug> --private --clone

# 2. Scaffold Next.js
cd sypher-tool-<slug>
npx create-next-app@latest . --typescript --app --tailwind --eslint --use-pnpm

# 3. Add shared packages
pnpm add @sypher/auth @sypher/ui @sypher/types @sypher/analytics

# 4. Move app folder under tool slug
mkdir -p app/<slug>
mv app/page.tsx app/layout.tsx app/<slug>/
# Update layout to wrap correctly

# 5. Copy .env.example from the shell repo, fill in tool-specific keys

# 6. Copy github-workflow-ci.yml from sypher-factory/examples/

# 7. Copy tool-next.config.ts as next.config.ts; tweak

# 8. Initial commit
git add -A
git commit -m "Bootstrap sypher-tool-<slug>"
git push -u origin main
```

## Phase 2: Wire it into the shell (15 minutes)

In the `sypher-shell` repo:

1. Add to `lib/tools-registry.ts`:

```ts
{
  slug: 'my-new-tool',
  name: 'My New Tool',
  tagline: '...',
  rewriteTarget: 'https://sypher-tool-my-new-tool.vercel.app',
  status: 'beta',
  // ...
}
```

2. Add the rewrite to `next.config.ts`:

```ts
{
  source: '/my-new-tool/:path*',
  destination: 'https://sypher-tool-my-new-tool.vercel.app/my-new-tool/:path*',
}
```

3. Open PR on shell. Merge. Shell deploys to prod, rewrite is live.

The tool's marketing page is now reachable at `sypher.in/my-new-tool` (currently a stub from Phase 1).

## Phase 3: Ship the marketing page (2–4 hours)

Before any backend work — get the SEO surface live.

- [ ] `app/<slug>/page.tsx`: hero, value prop, demo (static screenshot or GIF is fine), pricing, FAQ
- [ ] All metadata fields populated (`tool-page-metadata.ts` factory)
- [ ] OG image generated and committed at `/<slug>/og.png`
- [ ] JSON-LD `SoftwareApplication` schema present
- [ ] At least one outbound internal link
- [ ] Marketing page passes Lighthouse mobile ≥ 90
- [ ] "Join waitlist" or "Get notified" form if not ready to sell yet
- [ ] Blog post drafted: "Introducing <tool>: <what it does>"

Push to main. Tool is now indexable.

## Phase 4: Build the pipeline (variable, 1–5 days)

For an audio-only pipeline like Reel Hooks:

```
1. Worker that takes a job: { profile_url, refresh_id }
2. Apify call: list top 10 reels by engagement
3. For each reel:
   - yt-dlp to extract audio
   - Deepgram for transcription
   - Anthropic Claude Haiku for hook analysis
   - Anthropic Claude Haiku for repurpose suggestions
   - Write to reel_hooks_reels + reel_hooks_analyses tables
4. Update job status to 'complete'
```

Run this as a Vercel function (if quick) or a Vercel Background Function / external worker (Railway, Fly.io) if it takes >60s. Most "factory" tools fit in serverless limits.

Caching layer:

- Before processing a reel, check if it's already in `reel_hooks_reels` (keyed by `instagram_url`)
- If yes and analyzed within last 7 days, skip and link to existing analysis
- This is your unit-economics savings

## Phase 5: Build the dashboard (1–2 days)

- [ ] `app/<slug>/dashboard/page.tsx` — list view of user's tracked profiles
- [ ] `app/<slug>/dashboard/projects/[id]/page.tsx` — detail view of analysis
- [ ] Subscription gate: `requireSubscription('<slug>')` in layout
- [ ] Onboarding flow: ask for user's niche on first dashboard visit
- [ ] Free-tier paywall: handle `?paywall=1` query param, show Stripe Checkout button

## Phase 6: Wire Stripe (1 hour)

In Stripe dashboard:

1. Create Product: "Sypher <Tool Name>"
2. Create Price: ₹99/month, INR
3. Add Price ID to `tools-registry.ts` for the tool

In the tool repo or shell:

- Paywall button POSTs to `/api/stripe/checkout` with `tool: '<slug>'`
- Shell's existing checkout handler creates Checkout Session
- Webhook handler already knows what to do (extracts `tool_slug` from metadata)

Test: subscribe with Stripe test card, verify `subscriptions` row appears, verify gate opens.

## Phase 7: Launch checklist (30 minutes)

- [ ] Sitemap includes new tool URLs (auto, via shell registry)
- [ ] `robots.txt` excludes `/<slug>/dashboard/*` and `/<slug>/r/*` if private
- [ ] Lighthouse mobile ≥ 90 on marketing page
- [ ] Manually purchase end-to-end as a real user (not test card)
- [ ] Refund yourself
- [ ] Submit URL to Google Search Console for indexing
- [ ] Submit to Bing Webmaster Tools
- [ ] Post launch announcement: Product Hunt, IndieHackers, X, relevant subreddits
- [ ] Blog post live at `/blog/<tool-slug>-launch`
- [ ] Tool's status in registry updated from `beta` to `live`
- [ ] Add cross-links from at least 2 other tool pages (sibling tools section)
- [ ] Set up 1 alert: Sentry error spike on `/<slug>/api/*`

## Phase 8: First-month iteration (ongoing)

After launch:

- [ ] Add analytics events for funnel: visit → signup → trial start → first action → first paid action
- [ ] Track top user feedback (Crisp, Intercom, or just `feedback@sypher.in`)
- [ ] Ship 1 SEO content piece per week for the first month
- [ ] Programmatic SEO consideration: 5–10 templated landing pages for variants

## Common pitfalls

| Pitfall | Symptom | Fix |
|---|---|---|
| Forgot to add `/<slug>/` prefix to tool's app routes | 404 when accessing via shell rewrite | Move pages under `app/<slug>/` and update internal links |
| Cookie domain misconfigured | Login on shell doesn't propagate to tool dashboard | Set cookie domain to `.sypher.in` in `@sypher/auth` config |
| Webhook handler doesn't know about new tool | User pays, subscription not created | Webhook's metadata extractor must read `tool_slug` from session metadata |
| Rewrite target points at preview URL | 502 when preview is rebuilt | Use the production `*.vercel.app` URL, not a Git-branch preview |
| Tool's metadata generic | Page doesn't rank | Re-do per-page metadata, primary keyword in `<title>` |
| No internal links in/out | Tool ranks slowly | Add to homepage, sibling-tool footer, blog post mentions |

## Time budget for tool #2 onward

Once the shell + shared packages are in place and you've shipped tool #1:

| Phase | Tool #1 | Tool #2 | Tool #5 |
|---|---|---|---|
| 0. Validate | 1 hr | 30 min | 15 min |
| 1. Bootstrap repo | 30 min | 15 min | 5 min (template script) |
| 2. Wire to shell | 15 min | 5 min | 5 min |
| 3. Marketing page | 4 hr | 2 hr | 1 hr |
| 4. Pipeline | 5 days | 2–3 days | 1–2 days |
| 5. Dashboard | 2 days | 1 day | 0.5 day |
| 6. Stripe | 1 hr | 30 min | 15 min |
| 7. Launch | 30 min | 30 min | 30 min |
| **Total** | **~7 days** | **~3–4 days** | **~1.5–2 days** |

The factory works because the per-tool incremental work shrinks as your shared infrastructure matures.

## Automation script: `scripts/new-tool.ts` (to build in shell repo)

```
$ pnpm new-tool reel-hooks --name "Reel Hooks" --tagline "..."

Creates:
  ✓ Empty repo at github.com/sypher/sypher-tool-reel-hooks
  ✓ Adds entry to tools-registry.ts
  ✓ Adds rewrite to next.config.ts
  ✓ Generates blog post stub at content/blog/reel-hooks-launch.mdx
  ✓ Opens PR on shell with the registry + rewrite changes
```

Don't build this until you've shipped 2–3 tools manually. By then you know what should be templated.
