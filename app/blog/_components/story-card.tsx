import Link from "next/link";
import type { BlogPost } from "@/lib/blog";
import { Thumb } from "./thumb";

function formatDate(iso: string): string {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function StoryCard({ post }: { post: BlogPost }) {
  return (
    <Link href={`/blog/${post.slug}`} className="story-card">
      <div className="story-card-text">
        {post.tags[0] && (
          <p className="story-card-kicker">{post.tags[0]}</p>
        )}
        <h3 className="story-card-title">{post.title}</h3>
        {post.description && (
          <p className="story-card-description">{post.description}</p>
        )}
        <p className="story-card-meta">
          {formatDate(post.date)} &middot; {post.readingMinutes} min read
        </p>
      </div>
      <Thumb seed={post.slug} title={post.title} variant="card" />
    </Link>
  );
}
