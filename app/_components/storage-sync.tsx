"use client";

import { useEffect } from "react";

// StorageSync — mounted once at the layout root. Listens to the browser's
// native `storage` event so a localStorage change made in *another* tab
// (or in another Sypher tool on the same origin, e.g. sypher.in/pegasus
// changing the theme while you're reading sypher.in/blog) propagates here
// without a reload.
//
// Why this is necessary: localStorage's `storage` event fires in every tab
// on the origin EXCEPT the tab that wrote it. Same-tab updates already work
// via direct mutation (the ThemeToggle calls applyTheme directly). This
// component catches the cross-tab / cross-tool gap.

const THEME_KEY = "sypher.theme";

function resolveTheme(pref: "system" | "light" | "dark"): "light" | "dark" {
  if (pref === "light" || pref === "dark") return pref;
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
}

function applyTheme(resolved: "light" | "dark") {
  if (typeof document === "undefined") return;
  document.documentElement.dataset.theme = resolved;
}

function readPref(): "system" | "light" | "dark" {
  if (typeof window === "undefined") return "system";
  try {
    const v = window.localStorage.getItem(THEME_KEY);
    if (v === "light" || v === "dark" || v === "system") return v;
  } catch {}
  return "system";
}

export function StorageSync() {
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      // e.key is null when storage is cleared whole-cloth — re-apply
      // everything so we don't end up half-themed.
      if (e.key === null || e.key === THEME_KEY) {
        applyTheme(resolveTheme(readPref()));
      }
    };
    window.addEventListener("storage", onStorage);

    // Also follow OS-level pref changes while pref is "system".
    const mql = window.matchMedia("(prefers-color-scheme: light)");
    const onMql = () => {
      if (readPref() === "system") applyTheme(resolveTheme("system"));
    };
    mql.addEventListener("change", onMql);

    return () => {
      window.removeEventListener("storage", onStorage);
      mql.removeEventListener("change", onMql);
    };
  }, []);

  return null;
}
