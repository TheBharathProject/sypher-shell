# Hosting and Domains

## Service map

| Concern | Service | Notes |
|---|---|---|
| DNS + CDN | Cloudflare | Free tier, proxy enabled |
| App hosting | Vercel | Hobby tier OK to start; Pro needed when traffic grows |
| Database + Auth | Supabase | Free tier covers MVP, includes Postgres + Auth + storage |
| Object storage | Cloudflare R2 | 10 GB free, no egress fees (vs. S3 which charges egress) |
| Payments | Stripe | India support via Stripe India |
| Transactional email | Resend | Or Supabase's built-in for auth emails initially |
| Analytics | PostHog | Free tier generous, self-host option later |
| Error tracking | Sentry | Free tier OK |

## DNS configuration on Cloudflare

```
Type    Name              Content                                Proxy
A       sypher.in         76.76.21.21 (Vercel anycast)           Proxied
CNAME   www               sypher.in                              Proxied
TXT     sypher.in         <Vercel domain verification>           DNS only
MX      sypher.in         <your email provider>                  DNS only
TXT     sypher.in         v=spf1 include:_spf.<provider> ~all    DNS only
CNAME   _dmarc            <your DMARC record>                    DNS only
```

The Vercel-recommended `A` record value may change — get the current one from Vercel's domain settings panel. Cloudflare proxy mode is required for Worker-based routing if you ever add it.

## Vercel project layout

You will have **multiple Vercel projects under one Vercel team**, one per repo:

```
Vercel team: sypher
├── sypher-shell          (handles sypher.in root + auth + rewrites)
├── sypher-tool-reel-hooks
├── sypher-tool-yt-summarizer
├── sypher-tool-thumbnail-grader
└── ...
```

**Domain assignments:**
- `sypher.in` and `www.sypher.in` → attached to `sypher-shell` project only
- Tool projects keep their default `*.vercel.app` domains as their public URL — these are the rewrite targets the shell points at

The reason tool projects don't get `sypher.in/<slug>` directly attached to them: Vercel only allows a domain to be attached to one project at a time, and the shell needs to own the apex. Rewrites are how tools "appear" under the apex.

## How rewrites stitch tools into the shell

The shell's `next.config.ts` declares a rewrites table:

```ts
async rewrites() {
  // Two rules per tool — exact /<slug> + /<slug>/:path+ for deeper paths.
  // (A single /<slug>/:path* rule loops on the bare prefix; see
  //  examples/shell-next.config.ts for the explanation.)
  return [
    { source: '/reel-hooks',           destination: 'https://sypher-tool-reel-hooks.vercel.app/reel-hooks' },
    { source: '/reel-hooks/:path+',    destination: 'https://sypher-tool-reel-hooks.vercel.app/reel-hooks/:path+' },
    { source: '/yt-summarizer',        destination: 'https://sypher-tool-yt-summarizer.vercel.app/yt-summarizer' },
    { source: '/yt-summarizer/:path+', destination: 'https://sypher-tool-yt-summarizer.vercel.app/yt-summarizer/:path+' },
  ];
}
```

Critical detail: tool projects must serve their pages **at the same path** the shell rewrites to. So the `reel-hooks` repo's marketing page is at `/reel-hooks` (not `/`), and its app is at `/reel-hooks/dashboard`. This keeps internal links, canonical URLs, and Next.js asset paths consistent.

See `examples/shell-next.config.ts` for the full template.

## Supabase setup

1. Create a Supabase project at supabase.com
2. Region: closest to your users (likely `ap-south-1` Mumbai for India-focused launch)
3. Run `examples/subscriptions-schema.sql` in the SQL editor
4. Enable RLS (Row Level Security) on all user-data tables
5. Configure Auth:
   - Site URL: `https://sypher.in`
   - Additional redirect URLs: `https://sypher.in/auth/callback`, `http://localhost:3000/auth/callback`
   - Enable Magic Link provider
   - Optionally enable Google OAuth
6. Cookie configuration:
   - In your Supabase client config, set `cookieOptions.domain` to `.sypher.in` so cookies span all tool subdirectories

## Cloudflare R2 setup

```
Bucket: sypher-uploads-prod
Bucket: sypher-uploads-dev
```

Each tool gets a prefix: `r2://sypher-uploads-prod/reel-hooks/<user_id>/<file>`.

Lifecycle policies:
- Audio files: delete after 90 days unless on a paid plan that retains
- Generated reports: keep indefinitely

Bind R2 to your Vercel projects via API tokens (R2 has S3-compatible auth so any S3 SDK works).

## Stripe setup

1. Create Stripe account, switch to India entity
2. Create one **Product** per tool: e.g., "Sypher Reel Hooks"
3. Each Product has Prices:
   - `price_reel_hooks_99_monthly_inr` = ₹99/month
   - `price_reel_hooks_999_yearly_inr` = ₹999/year (optional discount tier)
4. Webhook endpoint: `https://sypher.in/api/stripe/webhook`
5. Subscribe to events: `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.payment_failed`
6. Save webhook signing secret to shell repo's env vars as `STRIPE_WEBHOOK_SECRET`

See `auth-and-billing.md` for the subscription flow + webhook handler details.

## Environment hierarchy

```
Local dev          → .env.local (per repo, gitignored)
Vercel preview     → Vercel project env vars, scope: Preview
Vercel production  → Vercel project env vars, scope: Production
```

`examples/.env.example` lists every required variable.

**Secrets that must be set on every repo:**
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (server-only, not `NEXT_PUBLIC_`)
- `STRIPE_SECRET_KEY` (only the shell needs this — tools shouldn't talk to Stripe directly)
- `STRIPE_WEBHOOK_SECRET` (shell only)
- `NEXT_PUBLIC_SYPHER_BASE_URL` = `https://sypher.in` in prod, `http://localhost:3000` in dev
- Tool-specific API keys (Deepgram, Anthropic, Apify, etc.)

## Cost estimate at MVP scale (first 6 months)

| Item | Monthly cost (USD) | INR |
|---|---|---|
| Vercel Hobby (free) | $0 | ₹0 |
| Supabase Free tier | $0 | ₹0 |
| Cloudflare (DNS only) | $0 | ₹0 |
| Cloudflare R2 (under 10GB) | $0 | ₹0 |
| Stripe fees (~3% of revenue) | variable | variable |
| Domain (.in, ~₹800/year) | $0.80 | ₹65 |
| Resend (free tier 100/day) | $0 | ₹0 |
| PostHog (free tier 1M events) | $0 | ₹0 |
| Sentry (free tier) | $0 | ₹0 |
| **Total fixed cost** | **~$1** | **~₹65** |
| API costs per reel processed | $0.005–0.008 | ₹0.40–0.65 |

You can run this entire factory at <₹100/month fixed cost until you cross meaningful traffic.

## Cost estimate at scale (1,000 paying users)

| Item | Monthly cost (USD) | INR |
|---|---|---|
| Vercel Pro (across team) | $20 | ₹1,650 |
| Supabase Pro | $25 | ₹2,000 |
| Cloudflare (DNS, R2 ~50GB) | $1 | ₹80 |
| Sentry, PostHog (paid tiers) | $30 | ₹2,500 |
| API costs (assume 100 reels/user/month, 50% cache hits) | $250 | ₹20,000 |
| **Total** | **~$326** | **~₹26,000** |

Revenue at 1,000 × ₹99 = ₹99,000/month → comfortable margins.
