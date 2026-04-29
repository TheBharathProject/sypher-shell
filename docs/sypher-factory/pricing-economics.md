# Pricing and Unit Economics

## Reference tier: ₹99/month — "Reel Hooks"

Tracks 2 Instagram profiles. Top 10 reels per profile per refresh. Includes transcription, hook analysis, and "how to repurpose for me" suggestions. Weekly auto-refresh.

### Cost breakdown per reel (audio-only pipeline)

| Stage | Service | Cost (USD) | INR |
|---|---|---|---|
| URL discovery / scraping | Apify | $0.0012 | ₹0.10 |
| Audio download | yt-dlp on worker | bandwidth-only | ₹0.01 |
| Transcription (~30s reel) | Deepgram Nova-2 ($0.0043/min) | $0.0022 | ₹0.18 |
| LLM hook analysis (~800 in / 300 out) | Claude Haiku 4.5 | $0.0023 | ₹0.19 |
| LLM repurpose generation (~500 in / 400 out) | Claude Haiku 4.5 | $0.0021 | ₹0.17 |
| DB write + storage amortized | Supabase + R2 | $0.0002 | ₹0.02 |
| **Total per reel** |  | **~$0.0080** | **~₹0.65** |

### Per-user processing cost per month

- 2 profiles × 10 reels = 20 reels per refresh
- Weekly refresh = 4 refreshes/month = 80 reel-slots/month
- BUT most reels stay in the top 10 across weeks — realistically only 30–40 *new* reels need processing per user per month
- Naive cost: 40 × ₹0.65 = ₹26/user/month

### Caching multiplier (the lever that makes this work)

If 50 users all track `@virat.kohli`, you process those reels once and serve all 50 from cache. Realistic cache hit rates by user count:

| Active users | Niche concentration | Cache hit rate | Effective cost/user |
|---|---|---|---|
| 50 | Low | ~10% | ~₹23 |
| 200 | Moderate | ~30% | ~₹18 |
| 500 | Good | ~50% | ~₹13 |
| 1,000 | Strong | ~60% | ~₹10 |

### Fixed infrastructure cost amortization

Fixed cost stays roughly flat from 100 users to 1,000 users:

| Item | Monthly cost |
|---|---|
| Vercel Pro (across team) | ₹1,650 |
| Supabase Pro | ₹2,000 |
| Cloudflare R2 + DNS | ₹100 |
| Sentry, PostHog | ₹2,500 |
| Resend, misc | ₹500 |
| **Total fixed** | **~₹6,750** |

| Active paid users | Fixed cost/user | Variable cost/user | Total COGS | Net (after 3% Stripe) | Margin |
|---|---|---|---|---|---|
| 100 | ₹68 | ₹23 | ₹91 | ₹96 | 5% (break-even) |
| 300 | ₹23 | ₹16 | ₹39 | ₹96 | 59% |
| 500 | ₹14 | ₹13 | ₹27 | ₹96 | 72% |
| 1,000 | ₹7 | ₹10 | ₹17 | ₹96 | 82% |
| 5,000 | ₹1 | ₹8 | ₹9 | ₹96 | 91% |

**Break-even point: ~100 paying users.** Healthy margins at 300+. Excellent at 1,000+.

## Pricing structure recommendation

```
Free            ₹0       1 profile, top 5 reels, monthly refresh, no repurpose
                         (acquisition surface, no fresh-scrape cost beyond cache)

Starter         ₹99      2 profiles, top 10 reels, weekly refresh, repurpose
                         (your declared tier)

Pro             ₹499     10 profiles, top 25 reels, daily refresh, repurpose,
                         CSV export, hashtag tracking, API access
                         (where actual profit lives)

Agency          ₹1,999   50 profiles, multi-seat, white-label reports,
                         priority queue, dedicated support
                         (enterprise upgrade path)
```

The ₹99 tier is your acquisition + "is this worth paying for at all" filter. The ₹499 tier is the load-bearing wall of the business.

## Unit economics for Pro (₹499)

- 10 profiles × 25 reels × ~4 fresh reels/refresh × daily = ~120 fresh reels/month
- With 50% cache: ~60 unique reels processed
- Variable cost: 60 × ₹0.85 (slightly higher per-reel cost for richer analysis) = ₹51
- Net revenue: ₹485 (after Stripe)
- **Gross margin: ~89%** before fixed costs

Pro users are 5× more profitable than Starter users. Ten Pro users beat one hundred Starter users.

## Free-tier abuse prevention

Free tier costs you cache infrastructure but has no marginal cost per user (since cached reels are essentially free to serve). Watch for:

- **Profile-rotation abuse** — user adds and removes profiles to scrape new ones beyond their quota
  - Fix: lock profile selections for 30 days
- **Account farming** — same person creates multiple free accounts
  - Fix: rate-limit signups by IP + email-domain heuristics; require phone verification for 2nd+ signup from same IP
- **API abuse** — automated scraping of your own endpoints
  - Fix: rate-limit per user (e.g., 100 req/hour on free tier); require auth on every endpoint

## Other tools in the factory: ballpark unit economics

These vary wildly by tool. Below assumes audio/text pipelines (no heavy vision):

| Tool concept | Per-use variable cost | Suitable price tier |
|---|---|---|
| YouTube long-form summarizer | ₹2–4 (longer transcription) | ₹199–499/mo |
| Tweet thread → LinkedIn post | ₹0.50 (text only) | ₹49–99/mo |
| Hook generator (no scraping) | ₹0.20 | ₹99/mo + heavy free tier |
| Thumbnail A/B grader (vision) | ₹3–5 per grade | ₹299–499/mo |
| Hashtag research | ₹1–2 per search | ₹99–199/mo |

**Rule of thumb:** if a tool has **per-call AI cost > ₹5**, it doesn't belong in the ₹99 tier. Move it to Pro or sell as a separate ₹499 tool.

## Razorpay vs. Stripe in India

For India-only customer base, Razorpay has lower fees (~2% vs. Stripe's 3%) and supports UPI + netbanking natively without redirects. For global customer base, Stripe is unbeatable.

**Recommendation:** start with Stripe (simpler integration, US-friendly, easier to scale globally). Migrate to Razorpay-as-primary only if >80% of revenue is INR after 6 months and the 1% savings is meaningful.

## When to revisit pricing

- **At 100 paying users:** check actual cache hit rate, actual reels-per-user, churn. Adjust quotas if margins are tight.
- **At 500 paying users:** introduce Pro tier formally. Run a cohort test on willingness to pay.
- **At 1,000 paying users:** consider an annual discount (₹999/year for ₹99/month tier = ~16% discount, locks in retention).
- **When a single API supplier (Apify, Deepgram) is >40% of variable cost:** evaluate self-hosting that piece.

## Watch-out costs not in the basic model

| Cost | When it bites |
|---|---|
| Refunds and chargebacks | Budget 1–2% of revenue |
| Failed payment retries | Stripe handles, but ~5% of subs hit `past_due` monthly |
| Customer support time | Solo founder: assume 1 hour/day for 100+ paying users |
| Marketing/ads | Separate budget — organic-only is slower but profitable from day 1 |
| Third-party API price increases | Anthropic/OpenAI have changed pricing 2× in 2024–2025; build in 20% margin buffer |
| Compliance / legal (privacy policy, terms, GST, etc.) | One-time ~₹15,000–30,000 with a CA + lawyer review |

## Profitability targets to internalize

| Milestone | Definition |
|---|---|
| Break-even | Net revenue ≥ fixed + variable costs in a single month |
| Sustainable | 3 months in a row of break-even |
| Compounding | Organic acquisition > churn (you grow without paid spend) |
| Profitable | Net margin ≥ 30% on a trailing 3-month basis |

For ₹99 SaaS in India, the realistic timeline is 6–12 months from launch to break-even with serious effort, 12–18 months to compounding. Plan accordingly.
