import Link from "next/link";
import { notFound } from "next/navigation";
import { getBlogPost, getBlogPosts, findPostFile } from "@/lib/blog";
import { BlogHeader } from "../_components/blog-header";

export const dynamic = "force-static";

export async function generateStaticParams() {
  const posts = await getBlogPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  if (!post) return {};
  return {
    title: post.title,
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
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  const file = findPostFile(slug);

  if (!post || !file) notFound();

  const Post = (await import(`@/content/blog/${file}`)).default;

  // Article JSON-LD for richer search + LLM cite-ability.
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.date,
    author: { "@type": "Person", name: "Shubham Dixit" },
    publisher: {
      "@type": "Organization",
      name: "Sypher",
      url: "https://sypher.in",
    },
    mainEntityOfPage: `https://sypher.in/blog/${post.slug}`,
    keywords: post.tags.join(", "),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <BlogHeader />

      <article className="post-shell">
        <header className="post-head">
          <p className="post-kicker">
            <Link href="/blog">← all posts</Link>
          </p>
          <h1 className="post-page-title">{post.title}</h1>
          {post.description && (
            <p className="post-lede">{post.description}</p>
          )}
          <p className="post-meta">
            {formatDate(post.date)} &middot; {post.readingMinutes} min read
          </p>
          {post.tags.length > 0 && (
            <p className="post-tags-row">
              {post.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/blog/topic/${tag}`}
                  className="post-tag-link"
                >
                  {tag}
                </Link>
              ))}
            </p>
          )}
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
    </>
  );
}
