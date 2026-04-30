import Link from "next/link";
import { getBlogPosts } from "@/lib/blog";

export const dynamic = "force-static";

export const metadata = {
  title: "Blog · Sypher",
  description: "Notes from the workshop. Posts about the tools, the build, and what's working.",
  alternates: { canonical: "https://sypher.in/blog" },
};

function formatDate(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

export default async function BlogIndex() {
  const posts = await getBlogPosts();

  return (
    <article className="post-shell">
      <header className="mb-10">
        <p className="post-kicker">
          <Link href="/">← sypher.in</Link>
        </p>
        <h1 className="post-page-title">Blog</h1>
        <p className="post-lede">
          Notes from the workshop. Posts about the tools, the build, and what&rsquo;s working.
        </p>
      </header>

      {posts.length === 0 ? (
        <p className="post-meta">No posts yet. The first one&rsquo;s being written.</p>
      ) : (
        <ul className="post-list">
          {posts.map((post) => (
            <li key={post.slug} className="post-list-item">
              <Link href={`/blog/${post.slug}`} className="post-list-link">
                <h2 className="post-list-title">{post.title}</h2>
                {post.description && (
                  <p className="post-list-description">{post.description}</p>
                )}
                <p className="post-meta">
                  {formatDate(post.date)} &middot; {post.readingMinutes} min read
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}
