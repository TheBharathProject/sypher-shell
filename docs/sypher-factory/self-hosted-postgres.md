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
| `reel-downloader` Python API | `127.0.0.1:8001` | Docker container `reel-api`, uvicorn inside container |
| Caddy reverse proxy | `:80`, `:443` (public) | Fronts the above; will also front the future sypher API |
| Postgres 18 (sypher) | `127.0.0.1:5432` | This setup |

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

## Connection string

```
postgresql://sypher:<password>@127.0.0.1:5432/sypher
```

Stored on the VM at `~/.pg-secret` (mode `0600`). When a service running on this VM needs DB access, source the secret file or copy `DATABASE_URL` into its env. **Never paste the password into committed code, .env files in git, or shared config.**

## Verify health

```bash
docker exec sypher-postgres pg_isready -U sypher
docker exec sypher-postgres psql -U sypher -d sypher \
  -c "SELECT current_user, current_database(), version();"
```

Expected: `accepting connections`, then a row showing user `sypher`, database `sypher`, PostgreSQL 18 on aarch64.

## Public access (intentional non-decision)

**Postgres port 5432 is not exposed publicly. We will not expose it.** Direct DB access over the internet is not on the roadmap.

When Vercel-hosted code (e.g., the Reel Hooks dashboard rendering live data) needs to read from this Postgres, the architecture is:

```
Vercel  →  https://api.sypher.in  →  Caddy on the VM  →  internal API service  →  Postgres
                                       (already running)    (FastAPI/Node)         (localhost)
```

The internal API service is a small adapter that runs on the VM, in the same network namespace as Postgres, exposes business endpoints (not raw SQL), and has rate-limiting + auth at the Caddy layer. We add this when we have a real consumer — i.e., when Reel Hooks ships its first dashboard.

For now, all DB writes happen from workers running **on this VM** (e.g., `reel-downloader`), which means no public path is needed at all.

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

Apps **on the VM** (workers like the future Reel Hooks pipeline next to `reel-downloader`):

```python
import os, asyncpg
conn = await asyncpg.connect(os.environ["DATABASE_URL"])
```

DATABASE_URL is sourced from the container's env file, which is generated from `~/.pg-secret`.

Apps **on Vercel** (e.g., dashboards) **never connect directly to Postgres**. They call the internal API service we'll build (small FastAPI/Node adapter on the VM) which proxies queries. The DB stays behind Caddy + the API service; secrets stay off the edge.

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
