# VM service deploy pattern

How services that run on the OCI VM (currently `sypher-api`; future tool-pipeline workers) are built, published, and deployed. **The VM never clones a git repo. It pulls Docker images from GHCR.**

## Flow

```
git push main
  │
  ▼
GitHub Actions (sypher-api/.github/workflows/ci.yml)
  ├─ lint + import-check + amd64 docker build (PR + main, doesn't push)
  └─ multi-arch build (amd64 + arm64) + push to GHCR (main only)
       │
       ▼
ghcr.io/thebharathproject/<service>:latest
ghcr.io/thebharathproject/<service>:sha-<commit>
       │
       ▼
On the VM:  bash ~/services/<service>/deploy.sh
  ├─ docker login ghcr.io  (idempotent, caches in ~/.docker/config.json)
  ├─ docker pull <service>:latest
  ├─ docker run --rm <service> migrate    (one-shot, applies pending SQL)
  ├─ docker stop + docker rm <service>    (replace running container)
  ├─ docker run -d <service>              (start new container)
  └─ curl /health                         (probe; rollback if unhealthy)
```

## Why packages are private

Public packages are simpler (no auth needed for `docker pull`), but for sypher we keep packages **private** even when their parent repo is public. Reasons:

- Image tags include build dates and commit SHAs — useful internally, marginal value to expose
- A future image might bake in non-secret-but-not-broadcast config (allowed origins, internal endpoints, default copy)
- Zero-cost defense in depth: an attacker who gets a foothold can't trivially enumerate which images we run

The repo itself stays public so the source is auditable and CI runs without surprise costs.

## Authentication: classic PAT, not fine-grained

GHCR predates fine-grained PATs and **does not honor fine-grained tokens for private packages**. You need a **classic** PAT scoped only to `read:packages`. This is the only place in our stack where classic tokens are used; everything else (raw API calls, gh CLI) uses fine-grained.

Create at https://github.com/settings/tokens/new with:
- **Note:** `<vm-name>-ghcr-pull` (e.g., `sypher-vm-ghcr-pull`)
- **Expiration:** 1 year (set a calendar reminder)
- **Scopes:** only `read:packages` — nothing else

Store on the VM at `~/.ghcr-auth`:

```
GHCR_USERNAME=<your-github-username>
GHCR_TOKEN=ghp_<the-token>
```

`chmod 600 ~/.ghcr-auth`. Never commit this file. `deploy.sh` sources it.

## Why GHCR over alternatives

| | Why we use it / don't |
|---|---|
| GHCR | ✓ Free, integrated with the repo, GHA auth via `GITHUB_TOKEN`, multi-arch supported |
| Docker Hub | Pull rate limits on free tier; another account to manage |
| Self-hosted registry | Adds infra to maintain; defeats the "ship fast" goal |
| ECR / GCR / ACR | Cloud-vendor lock-in; we're not on AWS/GCP/Azure |

## Multi-arch builds (required for ARM VMs)

The OCI Always Free VM is `aarch64`. GitHub Actions runners are `amd64` by default. So the workflow must:

```yaml
- uses: docker/setup-qemu-action@v3
- uses: docker/setup-buildx-action@v3
- uses: docker/build-push-action@v6
  with:
    platforms: linux/amd64,linux/arm64
    cache-from: type=gha
    cache-to: type=gha,mode=max
```

QEMU emulation makes the arm64 build slow (~3-4 min from cold cache, ~90s with cache). Acceptable for a backend service that ships once a day, not OK for hot iteration. If we ever need faster ARM builds, switch to GitHub's native `ubuntu-22.04-arm` runners (free for public repos as of 2025) — same Dockerfile, much faster.

## Image structure expectations

Every service that follows this pattern bundles three things in its image:

1. **Source** — `app/` or equivalent
2. **Migrations** — `migrations/*.sql`, idempotent (CREATE ... IF NOT EXISTS)
3. **Entrypoint** — branches on first arg between `serve` (default) and `migrate` (one-shot)

`deploy.sh` exploits the entrypoint dispatch:

```bash
# One-shot migration container
docker run --rm <image> migrate

# Long-running server container
docker run -d <image>            # default arg = serve
```

Migrations land **before** the new container starts, so a release that depends on a schema change deploys atomically.

## Restart policy + persistence

Server containers always run with:

```
--restart unless-stopped
--network sypher-net
-p 127.0.0.1:<host-port>:8000
```

- Restarts on host reboot, but not if you `docker stop` it manually
- `--network sypher-net` puts the container on the shared internal Docker network. It reaches Postgres at hostname `postgres` (alias on `sypher-postgres`). See `self-hosted-postgres.md` for why this beats the older `--add-host=host.docker.internal:host-gateway` approach.
- `-p 127.0.0.1:<host-port>:8000` binds the container's port to the host's loopback only. Caddy proxies the public traffic from `:443` to that loopback port. Container is never publicly reachable.

For one-off jobs (migrations, ad-hoc scripts), use `--rm` instead of `-d` and reuse `--network sypher-net` so they can also see Postgres:

```
docker run --rm --network sypher-net <image> migrate
```

## When to break this pattern

You shouldn't, for any service that needs to be reachable from the public-facing apex (`api.sypher.in`). The pattern is the convention.

Exceptions:
- **Tool pipelines that don't expose HTTP** (e.g., a worker that polls a queue and writes to Postgres) — same image flow, but no Caddy vhost, no `-p` flag exposing a port. They run as headless containers on the VM.
- **One-off scripts** — just `docker run --rm <image> python -m my.script`. No deploy needed.

## Decisions log

| Date | Decision | Reason |
|---|---|---|
| 2026-05-04 | Image-only deploys (no `git clone` on the VM) | One-line deploy, atomic image swap, easy rollback to any SHA tag |
| 2026-05-04 | GHCR over Docker Hub | Free, integrated auth, no rate limits |
| 2026-05-04 | Private packages even for public repos | Defense in depth at zero cost |
| 2026-05-04 | Classic PAT for GHCR auth | Fine-grained PATs don't yet support private GHCR packages |
| 2026-05-04 | Multi-arch builds (amd64 + arm64) | OCI Always Free VM is aarch64 |
| 2026-05-04 | Migrations bundle in the image, dispatched via entrypoint arg | Keeps schema + code in lockstep; no separate migrations repo |
