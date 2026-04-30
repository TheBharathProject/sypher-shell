import Link from "next/link";
import type { BlogPost } from "@/lib/blog";
import { Thumb } from "./thumb";

function formatDate(iso: string): string {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function FeaturedCard({ post }: { post: BlogPost }) {
  return (
    <Link href={`/blog/${post.slug}`} className="featured-card">
      <Thumb seed={post.slug} title={post.title} variant="featured" />
      <div className="featured-card-body">
        <h2 className="featured-card-title">{post.title}</h2>
        {post.description && (
          <p className="featured-card-description">{post.description}</p>
        )}
        <p className="featured-card-meta">
          {formatDate(post.date)} &middot; {post.readingMinutes} min read
        </p>
      </div>
      <span className="featured-card-arrow" aria-hidden>
        ↗
      </span>
    </Link>
  );
}
