# Auth and Billing

## Auth: Supabase, cookie scoped to `.sypher.in`

Auth lives in the shell repo. Every tool reads the same auth cookie via `@sypher/auth` and trusts it.

### Why cookie scope matters

Cookies set on `.sypher.in` (with leading dot) are sent to:
- `sypher.in/*`
- `sypher.in/reel-hooks/*` (which rewrites to the tool's Vercel project, but the browser sees the apex domain so the cookie ships)
- Any future subdomain like `app.sypher.in/*`

That's why the rewrite-based architecture works — the rewrite happens server-side, the browser only ever sees `sypher.in`, so cookies behave as if everything is one app.

### Supabase auth flow

```
User clicks "Login" on sypher.in/reel-hooks
  → Redirected to sypher.in/login?redirect=/reel-hooks/dashboard
  → User enters email
  → Supabase sends magic link
  → User clicks link → hits sypher.in/auth/callback?code=...
  → Callback exchanges code for session, sets cookies on .sypher.in
  → Redirects to ?redirect= destination (sypher.in/reel-hooks/dashboard)
  → Tool's middleware reads the cookie, validates, renders
```

### Required Supabase config

In your Supabase project's Auth settings:

- Site URL: `https://sypher.in`
- Redirect URLs allowlist:
  - `https://sypher.in/auth/callback`
  - `http://localhost:3000/auth/callback`
- JWT expiry: default (1 hour) is fine
- Refresh tokens: enabled

In the Supabase client config (in `@sypher/auth`):

```ts
createBrowserClient(url, anonKey, {
  cookies: {
    domain: process.env.NEXT_PUBLIC_COOKIE_DOMAIN ?? '.sypher.in',
    sameSite: 'lax',
    secure: true,
    path: '/',
  },
});
```

For local dev, set `NEXT_PUBLIC_COOKIE_DOMAIN=` (empty) so the browser uses the host-only default.

## Subscriptions: shared table, gated by middleware

### Schema (full SQL in `examples/subscriptions-schema.sql`)

```sql
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tool_slug TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('active', 'past_due', 'canceled', 'trialing')),
  stripe_subscription_id TEXT UNIQUE,
  stripe_price_id TEXT,
  current_period_end TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, tool_slug)
);

CREATE INDEX subscriptions_user_id_idx ON subscriptions(user_id);
CREATE INDEX subscriptions_active_lookup ON subscriptions(user_id, tool_slug)
  WHERE status IN ('active', 'trialing');

ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users see own subscriptions" ON subscriptions
  FOR SELECT USING (auth.uid() = user_id);
```

`UNIQUE(user_id, tool_slug)` enforces "one subscription per (user, tool)." The webhook handler upserts on this constraint.

### Subscription gate in `@sypher/auth`

```ts
// @sypher/auth/server.ts
export async function requireSubscription(toolSlug: string) {
  const supabase = createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login?redirect=' + encodeURIComponent(currentPath()));

  const { data: sub } = await supabase
    .from('subscriptions')
    .select('status')
    .eq('user_id', user.id)
    .eq('tool_slug', toolSlug)
    .single();

  const isActive = sub && ['active', 'trialing'].includes(sub.status);
  if (!isActive) redirect(`/${toolSlug}?paywall=1`);

  return { user, subscription: sub };
}
```

Each tool calls this in its dashboard page or middleware. Cleanest pattern: do it in `app/<slug>/dashboard/layout.tsx` so every dashboard route is gated.

### Middleware approach (alternative)

Each tool repo can also add a `middleware.ts` that gates `/<slug>/dashboard/:path*`:

```ts
import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@sypher/auth';

const TOOL_SLUG = 'reel-hooks';

export async function middleware(req: NextRequest) {
  const supabase = createServerClient(req);
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('redirect', req.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  const { data: sub } = await supabase
    .from('subscriptions')
    .select('status')
    .eq('user_id', user.id)
    .eq('tool_slug', TOOL_SLUG)
    .single();

  if (!sub || !['active', 'trialing'].includes(sub.status)) {
    return NextResponse.redirect(new URL(`/${TOOL_SLUG}?paywall=1`, req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/reel-hooks/dashboard/:path*'],
};
```

Middleware runs on every request. For high-traffic apps, cache the subscription lookup in a short-lived edge cache.

## Stripe integration

### Account setup

1. Stripe India account (for INR pricing without conversion fees)
2. Enable UPI, cards, netbanking as payment methods
3. One Product per tool (in Stripe dashboard or via API)
4. One Price per pricing tier per tool

### Checkout flow

```
User on paywall → clicks "Subscribe"
  → POST sypher.in/api/stripe/checkout { tool: 'reel-hooks', priceId: 'price_...' }
  → Server creates Stripe Customer (if first purchase) and stores on auth.users.user_metadata.stripe_customer_id
  → Server creates Checkout Session
    - mode: subscription
    - line_items: [{ price: 'price_reel_hooks_99_monthly_inr', quantity: 1 }]
    - success_url: https://sypher.in/account?success=1
    - cancel_url: https://sypher.in/reel-hooks
    - metadata: { user_id, tool_slug }
  → Returns URL → client redirects
```

### Webhook handler

The webhook is the source of truth for subscription state. See `examples/stripe-webhook-handler.ts` for the full handler.

```
POST sypher.in/api/stripe/webhook
  → Verify signature with STRIPE_WEBHOOK_SECRET
  → Switch on event.type:
    - customer.subscription.created
    - customer.subscription.updated
    - customer.subscription.deleted
    - invoice.payment_failed
  → For each: extract user_id and tool_slug from subscription metadata
  → Upsert into subscriptions table with current status, period_end, etc.
  → Return 200
```

### Customer portal

Stripe's hosted portal handles cancellations, plan changes, payment method updates, invoices.

```
GET sypher.in/api/stripe/portal
  → Reads user's stripe_customer_id
  → Creates BillingPortal.Session
    - return_url: https://sypher.in/account
  → Redirects to portal URL
```

Link this from `sypher.in/account/billing`.

## Reconciliation cron

Webhooks can be missed (Stripe retries, but not infinitely). Run a nightly job that:

1. Lists all active subscriptions in Stripe
2. Compares against `subscriptions` table
3. Reconciles drift (mark canceled subs as canceled, etc.)

Vercel Cron + a simple `/api/cron/reconcile-subscriptions` route is sufficient. Authenticate it with a `CRON_SECRET` header.

## Multi-tool purchase considerations

A user can subscribe to multiple tools. Each is its own Stripe Subscription, its own row in `subscriptions`. They appear as separate line items on the user's billing portal.

If you later introduce a "Sypher All-Access" bundle:

- Bundle = its own Stripe Product
- When user has an active "all-access" subscription, the gate logic checks for that *or* a tool-specific sub
- Easy to add later without a schema change

```ts
const isActive =
  ['active', 'trialing'].includes(sub?.status) ||
  ['active', 'trialing'].includes(allAccessSub?.status);
```

## Free tier handling (optional)

If you want a free tier per tool (e.g., 5 free analyses per month):

- Add a `usage` table: `(user_id, tool_slug, period_start, count)`
- Increment on each use; check against tool-specific free limit
- When limit hit, redirect to paywall

Don't gate signup behind payment — friction kills the funnel. Free tier or trial is the standard.

## Security checklist

- All `subscriptions` table access goes through RLS — never use the service role key from the browser
- Webhook handler verifies Stripe signature before any DB write
- Webhook handler is idempotent (Stripe can retry; double-processing must be safe)
- Customer portal is only accessible to the logged-in customer (verified by Stripe Customer ID matching)
- No tool repo gets the Stripe secret key; only the shell does
- API routes that write to `subscriptions` don't exist outside the webhook — tools never write subs directly
- Auth callback validates the `state` parameter to prevent CSRF (Supabase handles this if configured correctly)
