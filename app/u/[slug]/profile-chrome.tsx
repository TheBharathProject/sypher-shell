"use client";

// Tiny client island for the public profile page. Reads the JWT from
// localStorage (same key Pegasus uses, same origin) and decides which CTA
// to show in the page header:
//
//   - Anonymous → "Sign in to Pegasus →"
//   - Authed, NOT this user's profile → "Open Pegasus →"
//   - Authed, this IS this user's profile → "Edit your profile →" (links into Pegasus)
//
// Ownership check is done by hitting GET /job-tracker/me and comparing the
// returned `profile.slug` (we'd actually need to fetch profile separately)
// — we keep it simple and treat any authed user landing on /u/<slug> as
// "potential owner" and use the "Edit" affordance only when the slug from
// /me's profile matches. Otherwise show the generic "Open Pegasus" CTA.

import { useEffect, useState } from "react";

const TOKEN_KEY = "sypher_jwt";
const API_URL = process.env.NEXT_PUBLIC_SYPHER_API_URL ?? "https://api.sypher.in";

type Status =
  | { kind: "loading" }
  | { kind: "anon" }
  | { kind: "authed-other" }
  | { kind: "authed-owner" };

export function ProfileChrome({ slug }: { slug: string }) {
  const [status, setStatus] = useState<Status>({ kind: "loading" });

  useEffect(() => {
    let token: string | null = null;
    try {
      token = window.localStorage.getItem(TOKEN_KEY);
    } catch {
      // Safari private mode etc. — treat as anon.
    }
    if (!token) {
      setStatus({ kind: "anon" });
      return;
    }

    // Authed: figure out if this slug belongs to the signed-in user.
    // Two requests, both cheap, both required to know what to show:
    //   GET /me            → confirms token is valid
    //   GET /profile/slug  → returns the user's slug + profile URL
    // The slug endpoint already exists today (Settings uses it).
    let cancelled = false;
    Promise.all([
      fetch(`${API_URL}/job-tracker/me`, {
        headers: { Authorization: `Bearer ${token}` }
      }),
      fetch(`${API_URL}/job-tracker/profile/slug`, {
        headers: { Authorization: `Bearer ${token}` }
      })
    ])
      .then(async ([meRes, slugRes]) => {
        if (cancelled) return;
        if (!meRes.ok) {
          // Token expired or revoked — treat as anon for this view, don't
          // bounce the user (they're reading a public page).
          setStatus({ kind: "anon" });
          return;
        }
        const slugBody: { slug?: string } = slugRes.ok ? await slugRes.json() : {};
        if (slugBody.slug && slugBody.slug === slug) {
          setStatus({ kind: "authed-owner" });
        } else {
          setStatus({ kind: "authed-other" });
        }
      })
      .catch(() => {
        if (!cancelled) setStatus({ kind: "anon" });
      });

    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (status.kind === "loading") {
    // Reserve space so the header doesn't reflow when the CTA appears.
    return <span className="text-[12px] text-ink-faint" aria-hidden>&nbsp;</span>;
  }

  if (status.kind === "authed-owner") {
    // Apex-relative — escapes whatever app served this page and lands on
    // the Pegasus profile editor.
    return (
      <a
        href="/pegasus/profile"
        className="inline-flex items-center gap-1 text-[12px] text-ink-muted hover:text-ink underline-offset-4 hover:underline"
      >
        Edit your profile →
      </a>
    );
  }

  if (status.kind === "authed-other") {
    return (
      <a
        href="/pegasus/dashboard"
        className="inline-flex items-center gap-1 text-[12px] text-ink-muted hover:text-ink underline-offset-4 hover:underline"
      >
        Open Pegasus →
      </a>
    );
  }

  return (
    <a
      href="/pegasus/login"
      className="inline-flex items-center gap-1 text-[12px] text-ink-muted hover:text-ink underline-offset-4 hover:underline"
    >
      Sign in to Pegasus →
    </a>
  );
}
