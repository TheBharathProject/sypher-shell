# Onboarding — adding a new tool to Sypher

> Front-door doc. Read this first. Every other file in `docs/sypher-factory/` is a deeper dive into one box on the map below.

You're here because you want to ship a new tool inside the Sypher factory. This doc covers what's already wired, the conventions every tool follows, and the few decisions that branch by tool shape. It tries to be the one reference you can hand to future-you (or a new collaborator) without spelunking through commit history.

---

## Table of contents

| Doc | Covers |
|---|---|
| **`onboarding.md`** *(this file)* | The big picture, tool patterns, conventions, where to start |
| [`architecture.md`](./architecture.md) | High-level diagram of shell + tools + APIs + DB |
| [`repo-structure.md`](./repo-structure.md) | Why `sypher-shell` + per-tool repos; basePath rules |
| [`hosting.md`](./hosting.md) | DNS, Vercel team layout, R2, Stripe, costs |
| [`new-tool-playbook.md`](./new-tool-playbook.md) | Phase-by-phase checklist for shipping a Lite tool |
| [`vm-deploy-pattern.md`](./vm-deploy-pattern.md) | Backend tools on the OCI VM (Pegasus pattern) |
| [`self-hosted-postgres.md`](./self-hosted-postgres.md) | Postgres-on-OCI setup |
| [`auth-and-billing.md`](./auth-and-billing.md) | Supabase auth + Stripe webhook flow (Lite tools) |
| [`design-system.md`](./design-system.md) | Tokens, type, spacing, motion |
| [`pricing-economics.md`](./pricing-economics.md) | Unit-economics rule for ₹99 vs ₹499 tools |
| [`seo-checklist.md`](./seo-checklist.md) | Per-tool SEO setup |
| [`github-and-deployment.md`](./github-and-deployment.md) | CI/CD, branch protection, secrets |

---

## The Sypher factory at a glance

```
                          sypher.in (apex)
                                │
                          ┌─────┴──────┐
                          │ sypher-shell │  ← Vercel, owns the apex
                          └─────┬──────┘    Marketing landing, /blog,
                                │           /privacy, /terms, /u/<slug>,
                                │           tool registry, rewrites
                                │
              ┌─────────────────┼─────────────────┐
              ▼                 ▼                 ▼
  sypher.in/pegasus/*   sypher.in/<tool-N>/*   sypher.in/<tool-M>/*
  (basePath /pegasus,   (basePath /<slug>)     (basePath /<slug>)
   served via shell
   rewrite to a Vercel
   project per tool)
              │
              ▼
       api.sypher.in
       (sypher-api, OCI VM,
        Postgres + R2 + LLM)
```

Three pieces. **The shell** owns the apex. **Tool repos** own product surfaces under `/<slug>/*`. **The API** sits behind `api.sypher.in` for tools that need it.

---

## The two tool patterns

Every tool falls into one of two shapes. Pick yours before you start; the rest of the wiring follows.

### Pattern A — Lite tool (Vercel-only)

A small focused tool whose backend fits inside Vercel + Supabase. **Reel Hooks** is the prototype.

- **Auth:** Supabase magic-link / OAuth. Cookies scoped to `.sypher.in`.
- **Data:** Supabase Postgres. RLS-isolated per user.
- **Files:** Cloudflare R2 (S3-compatible).
- **Pricing:** Stripe subscription, ₹99 or ₹499 tier.
- **Deploy:** Vercel project `sypher-tool-<slug>`. Auto-deploy from `main`.
- **Reference:** Follow [`new-tool-playbook.md`](./new-tool-playbook.md) end-to-end.

### Pattern B — Backend-heavy tool (Vercel + OCI VM)

A bigger product backed by `sypher-api` (Go modular monolith). **Pegasus** is the prototype.

- **Auth:** Google OAuth handled by sypher-api → JWT in `localStorage["sypher_jwt"]` → `Authorization: Bearer` header on every API call.
- **Data:** Postgres on the OCI VM (`postgres:5432` on `sypher-net` Docker network).
- **Files:** Cloudflare R2 with signed PUT URLs.
- **Pricing:** Free or freemium. AI usage metered server-side.
- **Deploy:** Frontend = Vercel project `sypher-tool-<slug>`. Backend = a new package inside `sypher-api/internal/<tool>/` (or stays generic). Image rebuilds via GHCR; `deploy.sh` on the VM swaps the running container.
- **Reference:** Follow this doc + [`vm-deploy-pattern.md`](./vm-deploy-pattern.md) + [`self-hosted-postgres.md`](./self-hosted-postgres.md).

---

## Conventions every tool follows (regardless of pattern)

These are the shared rules. They make tools feel like one product, not a bag of unrelated apps.

### 1. Repo naming

```
TheBharathProject/sypher-tool-<slug>     (or just <slug> for legacy, e.g. pegasus)
```

Slug is **kebab-case, one concept, single segment**. The same slug becomes:

- The path under sypher.in (`sypher.in/<slug>`)
- The Vercel project name (`sypher-tool-<slug>` — must match the rewrite target)
- The image tag (`ghcr.io/thebharathproject/sypher-tool-<slug>:latest` if you ship one)
- The `tools-registry.ts` entry's `slug` field

### 2. basePath, not nested folders

```ts
// next.config.ts in EVERY tool repo
const nextConfig = { basePath: '/<slug>' };
```

Pages stay at `app/page.tsx`, `app/dashboard/page.tsx`, etc. Next prefixes routes, `_next/static/*` URLs, and `<Link>` hrefs with `/<slug>` automatically. **Do not nest pages under `app/<slug>/` instead of basePath** — `_next/static/*` won't get the prefix and assets break. Verified failure mode 2026-04-30, see [`repo-structure.md`](./repo-structure.md).

To link out to the apex (sypher.in/blog, /privacy, etc.) use **plain `<a href="/blog">`**, not `<Link>`. `<Link>` would prepend the basePath and route inside the tool.

### 3. Apex paths are owned by the shell

These never live in a tool repo:

- `/` (apex landing, lists tools)
- `/blog/*`
- `/privacy`, `/terms`, `/about`
- `/u/<slug>` (public profiles — public read of sypher-api)

If your tool has its own marketing landing, that's `/<slug>` (which becomes `/<slug>` after basePath, → sypher.in/<slug>). Never duplicate apex paths inside the tool — it forks copy and legal.

### 4. Shell registry entry

Add the tool to `sypher-shell/lib/tools-registry.ts` and a rewrite to `sypher-shell/next.config.ts`:

```ts
// tools-registry.ts
{
  slug: "<slug>",
  name: "<Display Name>",
  tagline: "<one line>",
  description: "<paragraph>",
  rewriteTarget: "https://sypher-tool-<slug>.vercel.app",
  status: "live", // or "coming-soon"
  seoKeywords: [...],
}

// next.config.ts — add to the tools array
{ slug: '<slug>', rewriteTarget: 'https://sypher-tool-<slug>.vercel.app' }
```

The shell's rewrite turns the apex traffic into a server-side fetch of the tool's vercel.app URL. The browser only ever sees `sypher.in`.

### 5. Theme system — single source of truth

Every tool reads and writes `localStorage["sypher.theme"]` (values: `"system"`, `"light"`, `"dark"`). Same key, same origin, so the user's choice follows them between tools.

**Required in every tool's `app/layout.tsx`:**

```tsx
const themeBootScript = `
try {
  var pref = localStorage.getItem('sypher.theme') || 'system';
  var resolved = pref === 'system'
    ? (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark')
    : pref;
  document.documentElement.dataset.theme = resolved;
} catch (e) {
  document.documentElement.dataset.theme = 'dark'; // or 'light' for shell
}
`;

return (
  <html data-theme="dark" lang="en">
    <head>
      <script dangerouslySetInnerHTML={{ __html: themeBootScript }} />
    </head>
    ...
  </html>
);
```

The script runs **before first paint** to avoid a flash of the wrong theme. Without it, the page renders in the default theme for one frame, then snaps.

**Required in every tool's CSS:**

```css
:root { /* default tokens */ }
[data-theme="light"] { /* light overrides */ }
[data-theme="dark"]  { /* dark overrides */ }
```

The shared semantic tokens across all tools (use these names; values differ per tool's aesthetic):

| Semantic | Light value | Dark value |
|---|---|---|
| paper / bg | `#f5f1eb` | `#1a1a1a` |
| paper-deep / bg-soft | `#ede8df` | `#1f1f1f` |
| card / surface | `#fdfcf9` | `#232323` |
| ink / text | `#1a1a1a` | `#ececea` |
| ink-muted / text-soft | `#5a5a5a` | `#b3b1ab` |
| ink-faint / text-faint | `#8a8a8a` | `#7d7c76` |
| hairline / border | `#e0dbd1` | `#2e2e2e` |
| accent (saffron) | `#e85d04` | `#f08544` |

Existing implementations:
- Sypher-shell: `app/globals.css` `@theme` block + `[data-theme="dark"]` overrides + `app/_components/theme-toggle.tsx`
- Pegasus: `app/globals.css` `:root` + `[data-theme="light"]` overrides + Settings page picker

### 6. Cross-tab / cross-tool storage sync

Each app mounts a `<StorageSync />` client component once at the layout root. It listens to the native `storage` event and re-applies state when localStorage changes from another tab or another tool on the same origin.

- Sypher-shell: `app/_components/storage-sync.tsx`
- Pegasus: `components/storage-sync.tsx`

When you ship a new tool, copy whichever shape fits and extend its `switch` to handle any keys the tool stores. Established keys:

| Key | Owner | Purpose |
|---|---|---|
| `sypher.theme` | every tool + shell | Theme preference (system/light/dark) |
| `sypher_jwt` | tools that use sypher-api | Pegasus auth JWT |
| `nc.sidebar-collapsed` | Pegasus | Sidebar collapse state |
| `nc.notes-pending` | Pegasus | Unsaved notes draft |
| `nc.device-id` | Pegasus | Stable client id |

**Convention:** prefix shared keys with `sypher.`, prefix tool-private keys with `<slug>.`. Older `nc.*` keys exist in Pegasus from its pre-rebrand era and stay (renaming would wipe user state); don't follow that prefix in new tools.

### 7. Auth — pick one path per tool, document it

**Pattern A (Lite tools):** Supabase. Cookie scoped to `.sypher.in` so it's shared across the apex and every tool. See [`auth-and-billing.md`](./auth-and-billing.md).

**Pattern B (sypher-api tools):** JWT in `localStorage["sypher_jwt"]`. The OAuth handshake is owned by sypher-api:

```
User → sypher.in/<tool>/login → click "Sign in with Google"
     → redirected to api.sypher.in/auth/google
     → Google OAuth dance
     → api.sypher.in/auth/google/callback receives code, mints JWT
     → 302 to FRONTEND_LOGIN_REDIRECT_URL (=sypher.in/<tool>/auth/callback?token=…)
     → callback page reads token from URL, writes to localStorage, router.replace('/dashboard')
```

To add a new sypher-api tool, register its callback URL in two places:

1. Google Cloud Console → OAuth client → Authorized redirect URIs (must include `https://api.sypher.in/auth/google/callback`)
2. The API's `FRONTEND_LOGIN_REDIRECT_URL` env var on the VM (currently single — change-needed when N tools share the same auth, see "Future work" below)

### 8. Apex linking from inside a tool

Inside Pegasus, footer / navbar links to /blog, /privacy, /terms use **plain `<a href="/blog">`**, not `<Link>`. Reason: `<Link>` auto-prefixes basePath, so `<Link href="/blog">` would resolve to `/<slug>/blog` (which doesn't exist). `<a href="/blog">` escapes the basePath and lands on the apex. Documented in `repo-structure.md` and enforced in Pegasus's `MarketingFrame` footer.

---

## What lives where (decision matrix)

When you're not sure whether something belongs in the tool repo or the shell:

| Surface | Where it lives | Why |
|---|---|---|
| Apex landing (`/`) | sypher-shell | Shell owns the apex |
| Tool marketing landing (`/<slug>`) | tool repo `app/page.tsx` | basePath puts it at `/<slug>` |
| Blog (`/blog`, `/blog/<slug>`) | sypher-shell `content/blog/*.mdx` | Single canonical journal across the factory |
| Privacy / Terms | sypher-shell | One legal voice for the platform |
| Public profile (`/u/<slug>`) | sypher-shell | Apex URL, public, cacheable |
| Tool dashboard / app | tool repo `app/dashboard/*` etc. | Behind auth, basePath-prefixed |
| Subscription billing UI | sypher-shell `/account/billing` | Stripe webhooks land here, single source of truth |
| Tool-specific docs | tool repo `docs/` | Lives next to the code |
| Cross-cutting docs | sypher-shell `docs/sypher-factory/` | This folder |
| Migrations (Pattern B) | `sypher-api/migrations/` | One Postgres, one migration set |
| Tool-private DB tables | `sypher-api/internal/<tool>/` | Prefix tables `<slug>_` per `repo-structure.md` |

---

## New-tool checklist (paste this at the top of your kickoff issue)

```
- [ ] Decide pattern: Lite (Vercel-only) or Backend (sypher-api)
- [ ] Pick slug, write tagline + 3 SEO queries
- [ ] Add to tools-roadmap.md with status: planned
- [ ] (Pattern B) Add migrations to sypher-api/migrations/00NN_<slug>.sql
- [ ] (Pattern B) Add handlers under sypher-api/internal/<slug>/
- [ ] gh repo create sypher-tool-<slug> --private
- [ ] Bootstrap Next 14+, set basePath: '/<slug>'
- [ ] Copy theme boot script + tokens (see Convention #5 above)
- [ ] Copy <StorageSync /> from sypher-shell or pegasus
- [ ] Add tool entry to sypher-shell/lib/tools-registry.ts
- [ ] Add rewrite to sypher-shell/next.config.ts (both `/<slug>` and `/<slug>/:path+`)
- [ ] Create Vercel project named exactly sypher-tool-<slug>
- [ ] Set NEXT_PUBLIC_API_BASE_URL=https://api.sypher.in (Pattern B only)
- [ ] (Pattern B) Add tool's auth callback URL to Google OAuth + sypher-api env
- [ ] (Pattern B) On VM, update ~/.pg-secret if new env vars are needed
- [ ] (Pattern B) curl raw deploy.sh from main onto VM, run it
- [ ] Push shell rewrite + registry entry to main → shell auto-deploys
- [ ] Smoke test in this order:
  - [ ] sypher.in (lists new tool)
  - [ ] sypher.in/<slug> (marketing — proves rewrite + basePath)
  - [ ] sypher.in/<slug>/login (Pattern B) → Google → callback → dashboard
  - [ ] Cross-tool: change theme on sypher.in/blog, reopen sypher.in/<slug> — theme persists
- [ ] Flip status: live in tools-registry + tools-roadmap
```

---

## Common gotchas

- **Asset 404s after deploy.** Almost always means basePath is missing or set wrong in the tool repo's `next.config.*`. The Vercel deployment URL must serve at `/<slug>`, not at `/`.
- **`<Link href="/blog">` from inside a tool 404s.** Use `<a href="/blog">` to escape basePath; only the shell serves apex paths.
- **OAuth callback redirects to a 404.** `FRONTEND_LOGIN_REDIRECT_URL` on the API doesn't include the tool's basePath. Should be `https://sypher.in/<slug>/auth/callback`, not `https://sypher.in/auth/callback`.
- **Theme flashes wrong color on first paint.** The boot script isn't in `<head>` (must be inline, runs before React mounts).
- **localStorage doesn't sync across tabs.** Same-origin tabs sync via the native `storage` event automatically — but only if `<StorageSync />` (or equivalent listener) is mounted. Without it, the other tab keeps its old state until reload.
- **CI fails on `go mod tidy` step.** New direct imports landed without running `go mod tidy` locally. Run it, commit `go.mod` / `go.sum`, push.

---

## Future work this doc tracks

These aren't done yet — written down so the conventions evolve cleanly:

1. **Per-tool OAuth redirect.** Today `FRONTEND_LOGIN_REDIRECT_URL` on sypher-api is a single value, hardcoded to Pegasus's callback. When tool #2 needs auth via the same API, the API needs to read the originating tool's slug from the OAuth state and redirect accordingly. Sketch: pass `?next=/<slug>/auth/callback` through the OAuth state, validate against the tool registry, redirect there.
2. **Public-profile base** in sypher-api currently strips host from `FRONTEND_LOGIN_REDIRECT_URL`. Split into its own env (`PUBLIC_PROFILE_BASE_URL=https://sypher.in/u/`) so the two URLs evolve independently.
3. **Shared UI primitives.** `@sypher/ui` is sketched in `repo-structure.md` but not yet a real package. Lift the things every tool re-implements (modal shell, button, toast) into a private GitHub package.
4. **Migration ownership for sypher-api tools.** Today migrations are pooled in `sypher-api/migrations/`. When tool #2 ships, decide: keep pooled (ordering is unambiguous) or move to per-tool subdirectories (cleaner ownership). Lean toward keeping pooled until the count gets unwieldy.

---

## When in doubt

Read [`architecture.md`](./architecture.md) for the high-level diagram and [`repo-structure.md`](./repo-structure.md) for why each piece is where it is. The "why" notes in those two files are the most opinionated text in the docs folder; if you find yourself disagreeing with a convention, that's where to start the conversation.
