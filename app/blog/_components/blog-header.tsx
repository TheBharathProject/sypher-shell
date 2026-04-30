import Link from "next/link";

interface Props {
  active?: "home" | "about" | "topic";
  topicLabel?: string;
}

/**
 * Two-row publication-style header.
 *   Row 1: wordmark + a single line of context
 *          (tagline by default; "Topic — <name> ×" when filtering)
 *   Row 2: tab nav, with the external sypher.in link pushed right.
 *
 * Active tab uses a 2px underline that visually merges with the
 * header's bottom rule.
 */
export function BlogHeader({ active = "home", topicLabel }: Props) {
  const onTopic = active === "topic" && Boolean(topicLabel);

  return (
    <header className="blog-header" role="banner">
      <div className="blog-header-inner">
        <div className="blog-header-brand">
          <Link href="/blog" className="blog-wordmark" aria-label="Sypher Blog — home">
            <span className="blog-wordmark-text">Sypher</span>
            <span className="blog-wordmark-mark" aria-hidden>
              {/* tiny printer's-mark style ornament */}
              <svg viewBox="0 0 24 24" width="20" height="20">
                <circle cx="12" cy="12" r="11" fill="none" stroke="currentColor" strokeWidth="1.25" />
                <path
                  d="M8 14.5c.6 1 1.9 1.7 3.4 1.7 1.9 0 3.2-.9 3.2-2.3 0-1.5-1.4-1.9-3.1-2.3-1.5-.4-2.6-.7-2.6-2 0-1.1 1.1-1.9 2.6-1.9 1.2 0 2.2.5 2.7 1.3"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.25"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </Link>

          {onTopic ? (
            <p className="blog-header-context" aria-live="polite">
              <span className="blog-header-context-eyebrow">Topic</span>
              <span className="blog-header-context-rule" aria-hidden />
              <span className="blog-header-context-value">{topicLabel}</span>
              <Link
                href="/blog"
                className="blog-header-context-clear"
                aria-label="Clear topic filter"
              >
                <span aria-hidden>×</span>
              </Link>
            </p>
          ) : (
            <p className="blog-header-tagline">
              <em>A small studio&rsquo;s writing.</em>
            </p>
          )}
        </div>

        <nav className="blog-tabs" aria-label="Blog sections">
          <Link
            href="/blog"
            className={`blog-tab${active === "home" ? " blog-tab-active" : ""}`}
            aria-current={active === "home" ? "page" : undefined}
          >
            Home
          </Link>
          <Link
            href="/blog/about"
            className={`blog-tab${active === "about" ? " blog-tab-active" : ""}`}
            aria-current={active === "about" ? "page" : undefined}
          >
            About
          </Link>
          <a
            href="/"
            className="blog-tab blog-tab-external"
          >
            <span>sypher.in</span>
            <span className="blog-tab-arrow" aria-hidden>↗</span>
          </a>
        </nav>
      </div>
    </header>
  );
}
