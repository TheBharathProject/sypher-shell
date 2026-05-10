import Link from "next/link";
import { BlogHeader } from "../_components/blog-header";

export const dynamic = "force-static";

export const metadata = {
  title: "About the Blog",
  description: "About the Sypher blog and the studio behind it.",
  alternates: { canonical: "https://sypher.in/blog/about" },
};

export default function BlogAbout() {
  return (
    <>
      <BlogHeader active="about" />

      <article className="post-shell">
        <header className="post-head">
          <p className="post-kicker">
            <Link href="/blog">← all posts</Link>
          </p>
          <h1 className="post-page-title">About this blog</h1>
          <p className="post-lede">
            What it&rsquo;s for, who writes it, what to expect.
          </p>
        </header>

        <div className="post-prose">
          <p>
            This is the writing arm of <a href="/">Sypher</a> &mdash; a small
            studio shipping internet things. The studio builds tools across
            niches: creator analytics, trading data, mobile games, and
            whatever else needs a sharp tool.
          </p>

          <h2>What you&rsquo;ll find here</h2>
          <p>
            Three kinds of posts:
          </p>
          <ul>
            <li>
              <strong>Notes from the workshop</strong> &mdash; what&rsquo;s
              being built, what shipped, what didn&rsquo;t work.
            </li>
            <li>
              <strong>Decisions out loud</strong> &mdash; the trade-offs
              behind a price, a stack choice, a feature cut.
            </li>
            <li>
              <strong>Posts I&rsquo;d want to read</strong> &mdash; the kind
              of writing I look for when I&rsquo;m trying to figure something
              out.
            </li>
          </ul>

          <h2>Who writes it</h2>
          <p>
            <strong>Shubham Dixit</strong>. Solo builder. Posts here are
            written, edited, and pushed by hand &mdash; no editorial calendar,
            no SEO content team.
          </p>

          <h2>How to follow</h2>
          <p>
            New posts go live as the work happens. The best ways to keep up:
          </p>
          <ul>
            <li>
              <Link href="/#waitlist">Sypher waitlist</Link> &mdash; one email
              when Tool 01 launches.
            </li>
            <li>
              <a
                href="https://github.com/TheBharathProject"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </a>{" "}
              &mdash; where the work lives.
            </li>
            <li>
              <a href="mailto:buildwithshubham.dixit@gmail.com">Email</a>{" "}
              &mdash; for anything specific.
            </li>
          </ul>
        </div>

        <footer className="post-footer">
          <Link href="/blog" className="post-back">
            ← all posts
          </Link>
        </footer>
      </article>
    </>
  );
}
