import Link from "next/link";

interface Props {
  active?: "home" | "about" | "topic";
  topicLabel?: string;
}

export function BlogHeader({ active = "home", topicLabel }: Props) {
  return (
    <header className="blog-header">
      <div className="blog-header-inner">
        <Link href="/blog" className="blog-wordmark">
          <span className="blog-wordmark-text">Sypher</span>
          <span className="blog-wordmark-dot" aria-hidden />
        </Link>

        <nav className="blog-tabs" aria-label="Blog sections">
          <Link
            href="/blog"
            className={`blog-tab ${active === "home" ? "blog-tab-active" : ""}`}
          >
            Home
          </Link>
          {active === "topic" && topicLabel && (
            <span className="blog-tab blog-tab-active">
              <span className="blog-tab-prefix">Topic:</span> {topicLabel}
            </span>
          )}
          <Link
            href="/blog/about"
            className={`blog-tab ${active === "about" ? "blog-tab-active" : ""}`}
          >
            About
          </Link>
          <a href="/" className="blog-tab blog-tab-external">
            sypher.in&nbsp;↗
          </a>
        </nav>
      </div>
    </header>
  );
}
