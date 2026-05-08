"use client";

import { useEffect, useState } from "react";

// Theme picker — three states (system / light / dark), persisted to
// localStorage["sypher.theme"]. Same key Pegasus uses, so the choice
// follows the user across every Sypher tool on the same origin.

type ThemePref = "system" | "light" | "dark";
const KEY = "sypher.theme";

function read(): ThemePref {
  if (typeof window === "undefined") return "system";
  try {
    const v = window.localStorage.getItem(KEY);
    if (v === "light" || v === "dark" || v === "system") return v;
  } catch {}
  return "system";
}

function resolve(pref: ThemePref): "light" | "dark" {
  if (pref === "light" || pref === "dark") return pref;
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
}

function apply(resolved: "light" | "dark") {
  if (typeof document === "undefined") return;
  document.documentElement.dataset.theme = resolved;
}

export function ThemeToggle() {
  const [pref, setPref] = useState<ThemePref>("system");

  useEffect(() => {
    setPref(read());
  }, []);

  // Follow OS changes only while in "system" mode.
  useEffect(() => {
    if (pref !== "system" || typeof window === "undefined") return;
    const mql = window.matchMedia("(prefers-color-scheme: light)");
    const handler = () => apply(resolve("system"));
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, [pref]);

  // Cycle: system → light → dark → system.
  const cycle = () => {
    const next: ThemePref =
      pref === "system" ? "light" : pref === "light" ? "dark" : "system";
    setPref(next);
    try {
      window.localStorage.setItem(KEY, next);
    } catch {}
    apply(resolve(next));
  };

  const label =
    pref === "system" ? "Theme: system" : pref === "light" ? "Theme: light" : "Theme: dark";

  return (
    <button
      type="button"
      onClick={cycle}
      aria-label={label}
      title={label}
      className="size-8 inline-flex items-center justify-center rounded-full border border-hairline text-ink-muted hover:text-ink hover:border-ink/40 transition-colors"
    >
      {pref === "system" ? <MonitorIcon /> : pref === "light" ? <SunIcon /> : <MoonIcon />}
    </button>
  );
}

function SunIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.4 1.4M17.6 17.6 19 19M5 19l1.4-1.4M17.6 6.4 19 5" />
    </svg>
  );
}
function MoonIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
    </svg>
  );
}
function MonitorIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="3" y="4" width="18" height="12" rx="2" />
      <path d="M8 20h8M12 16v4" />
    </svg>
  );
}
