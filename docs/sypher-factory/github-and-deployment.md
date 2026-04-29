# GitHub and Deployment

## GitHub organization layout

Create a GitHub organization (recommended) named `sypher` (or your preferred handle). All repos live there. Solo dev works from a personal account is fine too — just keep repos consistently namespaced.

## Per-repo settings (apply to shell + every tool repo)

### Branches

- Default branch: `main`
- Branch protection rule on `main`:
  - Require pull request before merging
  - Require status checks to pass before merging
    - Required checks: `ci / typecheck`, `ci / lint`, `ci / test`, `ci / build`
  - Require branches to be up to date before merging
  - Restrict who can push to matching branches: only you (and a Claude Code service account if you set one up)
  - Allow force pushes: NO
  - Allow deletions: NO

The "no direct push to main" rule is what makes "if it's merged, it's deployed" safe.

### Required GitHub Actions secrets

Per repo:

```
VERCEL_TOKEN                  # Vercel deploy token (only if you do deploys via GH Actions)
SUPABASE_ACCESS_TOKEN         # For running migrations in CI
SUPABASE_DB_URL               # Direct DB URL for migrations
NPM_TOKEN                     # If pulling private @sypher/* packages
```

Most projects won't need to deploy from GitHub Actions because Vercel deploys directly from GitHub. The CI workflow just needs to typecheck/lint/test/build.

### Required GitHub Actions variables (non-secret)

```
NEXT_PUBLIC_SUPABASE_URL      # Public, but useful as a variable
NEXT_PUBLIC_SYPHER_BASE_URL
```

## CI workflow (every repo)

Use `examples/github-workflow-ci.yml` as the template. It runs on every PR and every push to `main`:

```
ci:
  - checkout
  - install pnpm
  - install deps
  - typecheck
  - lint
  - test
  - build
```

Build is included because Next.js catches a class of bugs (bad metadata exports, broken dynamic routes) only at build time.

**Cache strategy:** cache `node_modules` and `.next/cache` keyed on `pnpm-lock.yaml` to keep CI under 2 minutes.

## Deployment pipeline

### Shell repo

```
PR opened
  → GitHub Actions CI runs (typecheck/lint/test/build)
  → Vercel automatically creates a preview deployment
  → Preview URL posted as a check
  → You manually visit the preview, smoke test
  → Merge to main
  → Vercel automatically deploys to production (sypher.in)
  → Cloudflare cache purge runs (optional, only if heavy edge caching)
```

### Tool repo

Same flow as shell, but production deployment is at `sypher-tool-<slug>.vercel.app` (the rewrite target). The shell already points its rewrite at this Vercel project's production domain, so a successful deploy is immediately live at `sypher.in/<slug>`.

**Important:** the shell's rewrite target is the **production domain** (`sypher-tool-reel-hooks.vercel.app`), not a preview URL. This means tool deploys to main are immediately live. Tool preview deploys (from PRs) are NOT visible at `sypher.in/<slug>` — they're visible at their own preview URL like `sypher-tool-reel-hooks-git-feat-x.vercel.app`. You test there, not on the apex.

### Database migrations

Migrations are owned by the repo that owns the table. Shared tables (`subscriptions`, `profiles`) live in the shell repo's `supabase/migrations/`. Per-tool tables live in the tool repo's `supabase/migrations/`.

Migration deploy:

```
Option A (recommended for solo dev): run migrations manually via Supabase CLI
  $ supabase migration up

Option B (automated): GitHub Actions step runs migrations on merge to main
  - Not recommended initially — irreversible mistakes can corrupt prod data
  - Add later once you have a staging Supabase project
```

If you take Option B, add a `supabase` job to CI that runs `supabase db push` on merge to main. Gate it on the `test` job passing.

### Rollback procedure

| Scenario | Action |
|---|---|
| Bad shell deploy | Vercel dashboard → Deployments → previous green deploy → "Promote to Production" |
| Bad tool deploy | Same, but on the tool's Vercel project |
| Bad migration | `supabase migration down` (only if it's reversible) OR restore from PITR backup (Supabase Pro feature) |
| Stripe webhook misfire | Stripe dashboard → Events → Resend webhook |

Pin a runbook for these in the shell repo's `RUNBOOK.md` once you're past MVP.

## PR template

Drop this into `.github/pull_request_template.md` in every repo:

```markdown
## What changed

<!-- 1-2 sentences -->

## Why

<!-- Link to issue, brief context -->

## Test plan

- [ ] Manually tested in preview deploy
- [ ] No new TODOs / no commented-out code
- [ ] Lighthouse mobile score still > 90 on changed marketing routes
- [ ] Migration is reversible (if applicable)
- [ ] Env vars updated in Vercel (if applicable)

## Screenshots

<!-- For UI changes -->
```

## Issue / project tracking

For a solo factory, GitHub Issues + a single Project board across all repos works. Columns: `Backlog`, `Next`, `In Progress`, `Review`, `Done`.

The roadmap of *new tools to build* lives in `tools-roadmap.md` in the shell repo, not as issues. Issues are for bugs and features within an already-shipped tool.

## Vercel project settings (per project)

For each Vercel project (shell + each tool):

- **Root directory:** repo root (or `apps/web` if you split)
- **Framework preset:** Next.js
- **Node version:** 20.x or 22.x (lock it via `.nvmrc` in the repo)
- **Install command:** `pnpm install`
- **Build command:** `pnpm build` (or `next build`)
- **Output directory:** auto
- **Environment variables:** copy from `.env.example`, set Production + Preview values
- **Git integration:** connect the GitHub repo, auto-deploy main + previews on PRs
- **Domains:**
  - Shell project only: `sypher.in`, `www.sypher.in` (with redirect to non-www or www, your call)
  - Tool projects: keep the default `<project-name>.vercel.app`
- **Edge config / KV / Blob:** none required initially

## Why deploys are gated by CI but not directly tied to it

Vercel deploys when GitHub merges. GitHub merges are gated by branch protection requiring CI to pass. CI runs the same `pnpm build` Vercel will run. So if CI passes, Vercel's build will too — and if Vercel fails anyway, it's a config drift you fix once.

This is the simplest "tests pass → it's deployed" loop. No GitHub Actions deploy step needed.

## Service accounts and credentials hygiene

- Use GitHub fine-grained PATs, not classic tokens.
- Rotate secrets every 6 months minimum.
- Never commit `.env*` files. Use `.env.example` (committed) + `.env.local` (gitignored).
- Vercel + Supabase tokens scoped to specific projects, not org-wide.
- Stripe restricted keys for any non-webhook usage.

## What "ship fast with Claude" actually looks like end-to-end

```
1. You: "Claude, add a CSV export button to reel-hooks dashboard"
2. Claude opens a branch, edits files, commits
3. Claude pushes branch, opens PR
4. CI runs (typecheck/lint/test/build)
5. Vercel posts preview URL on the PR
6. You click the preview URL, manually test the export button
7. If it works: merge → Vercel deploys to prod → live at sypher.in/reel-hooks
8. If broken: tell Claude what's wrong, repeat
```

The friction points worth investing in:
- A `pnpm test:smoke` that hits the dev server with Playwright on critical paths — Claude can run this before claiming "done"
- Pre-commit hook that runs `pnpm typecheck` so Claude catches type errors before pushing
- A `verify-preview.ts` script that takes a preview URL and asserts the homepage 200s, runs Lighthouse, etc.
