import Link from "next/link";
import { notFound } from "next/navigation";
import { getBlogPost, getBlogPosts, findPostFile } from "@/lib/blog";

export const dynamic = "force-static";

export async function generateStaticParams() {
  const posts = await getBlogPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  if (!post) return {};
  return {
    title: `${post.title} · Sypher`,
    description: post.description,
    alternates: { canonical: `https://sypher.in/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.description,
      url: `https://sypher.in/blog/${post.slug}`,
      publishedTime: post.date,
    },
  };
}

function formatDate(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  const file = findPostFile(slug);

  if (!post || !file) notFound();

  // Dynamic import of the MDX file. Filename is sanitized via findPostFile (only matches actual files).
  const Post = (await import(`@/content/blog/${file}`)).default;

  return (
    <article className="post-shell">
      <header className="mb-8">
        <p className="post-kicker">
          <Link href="/blog">← all posts</Link>
        </p>
        <h1 className="post-page-title">{post.title}</h1>
        {post.description && <p className="post-lede">{post.description}</p>}
        <p className="post-meta">
          {formatDate(post.date)} &middot; {post.readingMinutes} min read
          {post.tags.length > 0 && (
            <>
              {" "}
              &middot;{" "}
              {post.tags.map((tag, i) => (
                <span key={tag}>
                  <span className="post-tag">{tag}</span>
                  {i < post.tags.length - 1 && " "}
                </span>
              ))}
            </>
          )}
        </p>
      </header>

      <div className="post-prose">
        <Post />
      </div>

      <footer className="post-footer">
        <Link href="/blog" className="post-back">
          ← all posts
        </Link>
      </footer>
    </article>
  );
}
