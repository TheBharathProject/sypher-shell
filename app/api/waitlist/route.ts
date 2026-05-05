import { NextResponse } from "next/server";

// Forward signups from sypher.in's homepage form to api.sypher.in/waitlist.
// The browser only ever talks to /api/waitlist (same-origin, no CORS).
// The shared secret stays in Vercel's server-side env vars — never shipped
// to the client.

const API_URL = process.env.SYPHER_API_URL ?? "https://api.sypher.in";
const API_KEY = process.env.WAITLIST_API_KEY;

interface ForwardBody {
  email?: unknown;
  source?: unknown;
  hp?: unknown;
}

export async function POST(req: Request) {
  if (!API_KEY) {
    // Fail loudly on the server; opaque message to the client.
    console.error("waitlist route: WAITLIST_API_KEY is not set on Vercel");
    return NextResponse.json(
      { ok: false, error: "config_error", message: "service unavailable" },
      { status: 503 },
    );
  }

  let payload: ForwardBody;
  try {
    payload = (await req.json()) as ForwardBody;
  } catch {
    return NextResponse.json(
      { ok: false, error: "bad_json", message: "invalid request" },
      { status: 400 },
    );
  }

  // Light client-side checks so obvious garbage doesn't burn quota
  // (the Go service validates again — defense in depth).
  if (typeof payload.email !== "string" || payload.email.length > 254) {
    return NextResponse.json(
      { ok: false, error: "bad_email", message: "invalid email" },
      { status: 400 },
    );
  }

  const upstream = await fetch(`${API_URL}/waitlist`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": API_KEY,
    },
    body: JSON.stringify({
      email: payload.email,
      source: typeof payload.source === "string" ? payload.source : "homepage",
      hp: typeof payload.hp === "string" ? payload.hp : undefined,
      referrer: req.headers.get("referer") ?? undefined,
    }),
    // Don't let a slow upstream hang the user's browser forever.
    signal: AbortSignal.timeout(8000),
  }).catch((err) => {
    console.error("waitlist forward failed", err);
    return null;
  });

  if (!upstream) {
    return NextResponse.json(
      { ok: false, error: "upstream_unreachable", message: "service unavailable" },
      { status: 503 },
    );
  }

  const data = await upstream.json().catch(() => ({}));
  // Mirror upstream's status — keeps the contract uniform with the Go
  // service so the form can switch on the same shapes.
  return NextResponse.json(data, { status: upstream.status });
}
