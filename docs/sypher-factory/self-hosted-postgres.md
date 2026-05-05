# Self-hosted Postgres on Oracle Cloud

For tools that need a database where Supabase isn't the right fit — typically heavy worker pipelines that should keep data close to the worker (low latency, no egress fees) — we run Postgres on an Oracle Cloud Always Free VM.

**Reel Hooks is the first consumer of this DB.** Future tools may use Supabase instead if they're Vercel-native and don't have a heavy worker; pick per tool.

## VM context

| | |
|---|---|
| Provider | Oracle Cloud Infrastructure (Always Free tier) |
| Region | India West (Mumbai) — `bom1` adjacent, sub-30ms to Vercel |
| Instance | `instance-20260228-0043-n8n` (originally provisioned for n8n) |
| OS | Ubuntu 22.04.5 LTS |
| Arch | aarch64 (Ampere A1 ARM) |
| Resources | 1 vCPU · 6 GB RAM · 45 GB disk |
| Public IP | `144.24.97.242` |
| Default user | `ubuntu` |

## What else runs on this VM

The VM is shared with existing workloads. **Do not disturb these:**

| Service | Port | Notes |
|---|---|---|
| n8n (workflow automation) | `127.0.0.1:5678` | Docker container `n8n-n8n-1`, owned by `opc` user |
| `reel-downloader` Python API | `127.0.0.1:8001` | Docker container `reel-api`, uvicorn inside container — legacy, candidate for decommissioning when Reel Hooks ships in Go |
| Caddy reverse proxy | `:80`, `:443` (public) | Fronts everything; provisions Let's Encrypt certs automatically |
| Postgres 18 (sypher) | `127.0.0.1:5432` | This setup |
| `sypher-api` (Go) | `127.0.0.1:8002` | Live since 2026-05-06; behind Caddy at `https://api.sypher.in` |

## Postgres install

Postgres 18 in Docker. Image: `postgres:18-alpine` (ARM64 native, smaller footprint than Debian-based).

```bash
# 1. Generate a strong password and save it locally on the VM
PG_PASS=$(openssl rand -base64 24 | tr -d '/+=' | head -c 32)
cat > ~/.pg-secret <<EOF
POSTGRES_PASSWORD=$PG_PASS
DATABASE_URL=postgresql://sypher:$PG_PASS@127.0.0.1:5432/sypher
EOF
chmod 600 ~/.pg-secret

# 2. Data directory (survives container restarts)
mkdir -p ~/pg-data

# 3. Run Postgres 18, bound only to localhost
docker run -d \
  --name sypher-postgres \
  --restart unless-stopped \
  -e POSTGRES_PASSWORD="$PG_PASS" \
  -e POSTGRES_USER=sypher \
  -e POSTGRES_DB=sypher \
  -p 127.0.0.1:5432:5432 \
  -v ~/pg-data:/var/lib/postgresql \
  postgres:18-alpine
```

**Three subtle things future-you needs to know about this command:**

1. **Mount is `/var/lib/postgresql`, NOT `/var/lib/postgresql/data`.** Postgres 18 changed the convention — data now lives in `/var/lib/postgresql/<major>/docker/` inside the container. Mounting at `/var/lib/postgresql/data` like every PG ≤17 will crash-loop with `Error: in 18+, these Docker images are configured to store database data in a format which is compatible with "pg_ctlcluster"`.
2. **Bound to `127.0.0.1:5432`, never to `0.0.0.0`.** Postgres is reachable only from inside the VM. Anything on the public internet will get connection refused. Apps that need to talk to it run on this VM as workers.
3. **Multi-line `\` continuation** in pasted commands sometimes drops a line on certain terminals. After `docker run`, always verify env vars made it through:
   ```bash
   docker inspect sypher-postgres --format '{{range .Config.Env}}{{println .}}{{end}}' | grep POSTGRES
   ```
   You must see `POSTGRES_USER`, `POSTGRES_DB`, `POSTGRES_PASSWORD` — all three. If any is missing, Postgres initializes with defaults and your role/database may not exist.

## Roles + databases

```
postgres   (superuser)  password: same as sypher  use: admin/migrations only
sypher     (app role)   password: in ~/.pg-secret  owns: sypher database
```

If for any reason init runs without `POSTGRES_USER`, the `sypher` role won't exist. Recover without wiping:

```bash
set -a; source ~/.pg-secret; set +a

docker exec sypher-postgres psql -U postgres -c \
  "CREATE ROLE sypher WITH LOGIN PASSWORD '$POSTGRES_PASSWORD';"
docker exec sypher-postgres psql -U postgres -c \
  "ALTER DATABASE sypher OWNER TO sypher;"
docker exec sypher-postgres psql -U postgres -c \
  "GRANT ALL PRIVILEGES ON DATABASE sypher TO sypher;"
```

## Connection strings — two paths, one DB

The Postgres container is bound to `127.0.0.1:5432` on the host (loopback only — never publicly reachable). It's ALSO attached to a Docker network called `sypher-net` with the alias `postgres`. Two paths exist for two different consumers:

| Consumer | Connection string | Why |
|---|---|---|
| Host processes + SSH-tunneled clients (`psql` from Mac, TablePlus, ad-hoc scripts) | `postgresql://sypher:<password>@127.0.0.1:5432/sypher` | Loopback binding stays for SSH-tunneled local dev. The published port is what the host `psql` connects to. |
| Containers on the same VM (sypher-api, future tool workers) | `postgresql://sypher:<password>@postgres:5432/sypher` | Containers join `sypher-net`. Docker resolves the `postgres` alias to the Postgres container's IP on the bridge. No host-gateway hop, no `host.docker.internal` shenanigans. |

The canonical DSN in `~/.pg-secret` uses the `127.0.0.1` form. Container deploy scripts (e.g. `sypher-api/scripts/deploy.sh`) rewrite that string at deploy time — `${DATABASE_URL/127.0.0.1/postgres}` — and pass the result into the container along with `--network sypher-net`.

**Why we do NOT use `host.docker.internal`:**

The earlier pattern was `--add-host=host.docker.internal:host-gateway` + DSN host `host.docker.internal`. That maps to the Docker bridge gateway IP (`172.17.0.1`), which IS the host. But Postgres only binds to `127.0.0.1` — the loopback interface — not to the bridge interface. So the container's connect attempt to `172.17.0.1:5432` returned "no route to host" because nothing was listening there. Verified the failure mode and migrated to `sypher-net` on 2026-05-05.

The `sypher-net` approach is cleaner anyway: explicit container-to-container networking, no host-side firewall edge cases, and Postgres stays bound to localhost (slightly stronger defense in depth).

`~/.pg-secret` lives at mode `0600`. **Never commit the password to code or `.env` files in git.**

## Container networking — `sypher-net`

```bash
# One-time setup (idempotent — deploy scripts re-run this safely)
docker network create sypher-net 2>/dev/null || true
docker network connect --alias postgres sypher-net sypher-postgres 2>/dev/null || true
```

Verify:

```bash
docker network inspect sypher-net --format '{{range .Containers}}{{.Name}} {{end}}'
# Should print: sypher-postgres sypher-api
```

Future tools that need DB access do the same: `docker run --network sypher-net ...`. They all see Postgres at hostname `postgres`.

## Verify health

```bash
docker exec sypher-postgres pg_isready -U sypher
docker exec sypher-postgres psql -U sypher -d sypher \
  -c "SELECT current_user, current_database(), version();"
```

Expected: `accepting connections`, then a row showing user `sypher`, database `sypher`, PostgreSQL 18 on aarch64.

## Public access (intentional non-decision)

**Postgres port 5432 is not exposed publicly. We will not expose it.** Direct DB access over the internet is not on the roadmap.

The live architecture for Vercel-hosted code reaching DB-backed data:

```
Vercel  →  https://api.sypher.in  →  Caddy on the VM  →  sypher-api (Go)  →  Postgres
                                       (TLS, vhost)        (sypher-net)       (sypher-net,
                                                                              alias "postgres")
```

`sypher-api` is the internal API service. It runs on the VM in the `sypher-net` Docker network alongside `sypher-postgres`, exposes business endpoints (not raw SQL), and is the single integration point for Vercel-hosted code. Rate-limiting and auth-key validation happen at the Caddy + Go layers respectively.

This path is live as of 2026-05-06 for `/waitlist`. Future tools that need to surface DB-backed data on `sypher.in` (Reel Hooks dashboards, etc.) add new endpoints in `sypher-api` rather than adding new exposure paths to Postgres.

## Backups — explicit non-decision

**No automated backup is configured.** This is acknowledged tech debt. Risk:
- A corrupt write or VM kernel panic could lose the entire DB
- Tolerable while there's no real user data on it
- Will become unacceptable as soon as paying customers exist

**Action item for the future:** add `pg_dump` to a tar in `~/pg-backups/`, retained for 14 days, run nightly via cron. Push the latest dump to Cloudflare R2 (free 10 GB) for off-VM redundancy. Estimated: ~30 min of work; ~₹0/mo at expected scale. Don't ship paying customers without this.

## Accessing the database

Four paths, in order of how often each gets used.

### A. From inside the VM (admin / ad-hoc)

Already SSH'd in? Skip the network entirely:

```bash
# As app user (preferred for queries)
docker exec -it sypher-postgres psql -U sypher -d sypher

# As superuser (for CREATE ROLE, GRANT, extensions)
docker exec -it sypher-postgres psql -U postgres -d sypher
```

### B. From your Mac via SSH tunnel + psql (daily driver)

Postgres on the VM looks like a local Postgres on your Mac, without exposing port 5432 publicly.

**One-time — install psql on Mac:**

```bash
brew install libpq
echo 'export PATH="/opt/homebrew/opt/libpq/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
psql --version
```

**One-time — add a tunnel to `~/.ssh/config`:**

```
Host sypher-vm
  HostName 144.24.97.242
  User ubuntu
  IdentityFile ~/Downloads/<your-oci-key>.key
  ServerAliveInterval 60
  LocalForward 5432 127.0.0.1:5432
```

The `LocalForward` line forwards `localhost:5432` on your Mac through SSH to `localhost:5432` on the VM.

**Daily use:**

```bash
# Terminal 1 — open the tunnel (just an SSH session; leave it running)
ssh sypher-vm

# Terminal 2 — connect from your Mac
psql "postgresql://sypher:<password>@127.0.0.1:5432/sypher"
```

Closing the SSH session in Terminal 1 closes the tunnel.

### C. From a GUI client (TablePlus / DBeaver / Postico)

GUI clients handle the tunnel automatically — no separate SSH session needed.

**TablePlus → New Connection → PostgreSQL:**

| Field | Value |
|---|---|
| Host | `127.0.0.1` |
| Port | `5432` |
| User | `sypher` |
| Password | (from `~/.pg-secret`) |
| Database | `sypher` |
| **Over SSH** | toggle ON |
| SSH Host | VM's public IP |
| SSH User | `ubuntu` |
| SSH Key | path to OCI private key |

Test → Save → Connect. Same fields work in DBeaver, Postico, pgAdmin.

### D. From application code (the tools themselves)

Apps **on the VM**, running in containers attached to the `sypher-net` network, connect to Postgres via the network alias `postgres`:

```go
// Go (sypher-api uses this exact pattern)
pool, err := pgxpool.New(ctx, os.Getenv("DATABASE_URL"))
// where DATABASE_URL = postgresql://sypher:<pw>@postgres:5432/sypher
```

```python
# Python (legacy reel-Downloader, when migrated to sypher-net)
conn = await asyncpg.connect(os.environ["DATABASE_URL"])
# DATABASE_URL = postgresql://sypher:<pw>@postgres:5432/sypher
```

The `~/.pg-secret` file uses the `127.0.0.1` form (host-local). Container deploy scripts (e.g. `sypher-api/scripts/deploy.sh`) rewrite `127.0.0.1` → `postgres` before injecting `DATABASE_URL` into the container. This keeps one canonical source-of-truth in `~/.pg-secret` while serving both consumer paths.

Apps **on Vercel** (e.g., the homepage waitlist form, future dashboards) **never connect directly to Postgres**. They call `https://api.sypher.in/...` — Caddy proxies to `sypher-api` which proxies to Postgres. The DB stays inside the VM; secrets stay off the edge. Today this is the live path for the `/waitlist` endpoint.

## Inspecting the database

When you connect (any method), useful inspection queries:

```sql
-- Every database on this Postgres cluster
SELECT datname FROM pg_database ORDER BY datname;

-- Every user-created table in the current database (excludes system tables)
SELECT schemaname, tablename, tableowner
FROM pg_tables
WHERE schemaname NOT IN ('pg_catalog', 'information_schema')
ORDER BY schemaname, tablename;

-- Every schema in the current database
SELECT schema_name FROM information_schema.schemata
WHERE schema_name NOT IN ('pg_catalog', 'information_schema', 'pg_toast');

-- Row count per table
SELECT schemaname, relname AS table, n_live_tup AS rows
FROM pg_stat_user_tables ORDER BY n_live_tup DESC;

-- Database size
SELECT pg_size_pretty(pg_database_size('sypher'));

-- All roles + their attributes
SELECT rolname, rolsuper, rolcreatedb, rolcreaterole, rolcanlogin
FROM pg_roles WHERE rolname NOT LIKE 'pg_%';
```

In `psql` shell, the same things via shortcuts: `\l` (databases), `\dt` (tables), `\dn` (schemas), `\du` (roles), `\d <table>` (describe).

In TablePlus, the left sidebar shows tables for the **current connected database only**. To see another database (e.g., `postgres` admin DB), create a separate connection with that database name.

## Schema convention for tools

Each tool that writes to this DB owns its own schema:

```
sypher (database)
├── public            (default; keep mostly empty)
├── reel_hooks        (Tool 01 — owned by sypher-tool-reel-hooks)
│   ├── tracked_profiles
│   ├── reels
│   ├── transcripts
│   └── hook_analyses
└── <future tools each get their own schema>
```

Migrations live in **the tool's repo** (e.g., `sypher-tool-reel-hooks/db/migrations/`), not here. This doc only covers the cluster. Tools manage their own schemas via their own migration tool of choice (`sqitch`, `node-pg-migrate`, raw SQL files, etc.).

## Common ops cheatsheet

```bash
# Tail logs
docker logs -f --tail 50 sypher-postgres

# Restart Postgres without data loss
docker restart sypher-postgres

# Stop + remove container (data persists in ~/pg-data)
docker rm -f sypher-postgres

# Recreate container from existing data — same `docker run` command;
# Postgres skips re-init if ~/pg-data already has files

# Disk usage
du -sh ~/pg-data
docker exec sypher-postgres psql -U sypher -d sypher \
  -c "SELECT pg_size_pretty(pg_database_size('sypher'));"

# Quick sanity test that creates → reads → drops a table
docker exec sypher-postgres psql -U sypher -d sypher -c "
  CREATE TABLE _ping (id serial primary key, at timestamptz default now());
  INSERT INTO _ping DEFAULT VALUES RETURNING *;
  DROP TABLE _ping;
"
```

## Decisions log

| Date | Decision | Reason |
|---|---|---|
| 2026-05-04 | Self-hosted Postgres on existing OCI VM | Reuses paid-for free-tier compute; co-locates with `reel-downloader` for low-latency pipeline writes |
| 2026-05-04 | Postgres 18, not 16 | No reason to start on N-2; PG 18 has async I/O + UUIDv7 + better partitioning. Self-hosted means no provider lag. |
| 2026-05-04 | `postgres:18-alpine` image | ARM64 native, smaller footprint than Debian-based |
| 2026-05-04 | Backups deferred | No real data yet. Re-evaluate before first paid user. |
| 2026-05-04 | DB never exposed publicly | Workers run on the VM; Vercel reaches data via Caddy → internal API only |
| 2026-05-05 | Migrate from `host.docker.internal` to `sypher-net` Docker network | host-gateway path failed because Postgres binds to loopback only, not docker0 bridge. Shared Docker network with `postgres` alias is cleaner, doesn't require firewall rules, and keeps Postgres bound to localhost (slightly stronger defense in depth). |
| 2026-05-06 | `sypher-api` (Go) live behind Caddy at `https://api.sypher.in` | First real consumer of this Postgres. Replaces the never-deployed Python `sypher-api`. |
