import Link from "next/link";
import type { Category } from "@/lib/blog";

interface Props {
  categories: Category[];
  activeTag?: string;
}

export function TopicPills({ categories, activeTag }: Props) {
  if (categories.length === 0) return null;

  return (
    <nav className="topic-pills" aria-label="Topics">
      <Link
        href="/blog"
        className={`topic-pill ${!activeTag ? "topic-pill-active" : ""}`}
      >
        All
      </Link>
      {categories.map((cat) => (
        <Link
          key={cat.tag}
          href={`/blog/topic/${cat.tag}`}
          className={`topic-pill ${activeTag === cat.tag ? "topic-pill-active" : ""}`}
        >
          {cat.tag}
          <span className="topic-pill-count">{cat.count}</span>
        </Link>
      ))}
    </nav>
  );
}
