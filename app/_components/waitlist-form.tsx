"use client";

import { type FormEvent, useState } from "react";

type State = "idle" | "submitting" | "success" | "error";

interface Props {
  source?: string; // logged on the row so we know which page captured the signup
}

export function WaitlistForm({ source = "homepage_closing_cta" }: Props) {
  const [state, setState] = useState<State>("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorMessage("");
    setState("submitting");

    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email") ?? "").trim();
    const hp = String(fd.get("hp") ?? "");

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source, hp }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setState("error");
        setErrorMessage(
          typeof data?.message === "string" && data.message
            ? data.message
            : "Something went wrong. Try again?",
        );
        return;
      }

      setState("success");
    } catch {
      setState("error");
      setErrorMessage("Network error. Check your connection and retry.");
    }
  }

  if (state === "success") {
    return (
      <div
        className="mt-6 max-w-[440px] mx-auto rounded-md border border-hairline bg-card p-5 text-center"
        role="status"
        aria-live="polite"
      >
        <p className="text-[15px] text-ink">
          Got it. <span className="t-display-italic text-saffron">We&rsquo;ll email when the next tool ships.</span>
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="mt-6 max-w-[440px] mx-auto flex flex-col sm:flex-row gap-2"
      aria-label="Waitlist signup"
      noValidate
    >
      <label htmlFor="email" className="sr-only">
        Email
      </label>
      <input
        id="email"
        name="email"
        type="email"
        required
        placeholder="you@inbox.in"
        className="input-line"
        autoComplete="email"
        disabled={state === "submitting"}
      />

      {/* Honeypot — hidden from users, attractive to dumb bots. The Go
          service silently no-ops if this is non-empty. */}
      <input
        type="text"
        name="hp"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute -left-[10000px] top-0 w-px h-px"
      />

      <button
        type="submit"
        className="btn btn-primary shrink-0"
        disabled={state === "submitting"}
      >
        {state === "submitting" ? (
          "Sending…"
        ) : (
          <>
            Notify me
            <span className="arrow" aria-hidden>
              →
            </span>
          </>
        )}
      </button>

      {state === "error" && (
        <p
          className="sm:basis-full mt-2 text-[13px] text-saffron text-left"
          role="alert"
          aria-live="assertive"
        >
          {errorMessage}
        </p>
      )}
    </form>
  );
}
