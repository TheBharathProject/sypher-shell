import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  readingMinutes: number;
  featured: boolean;
}

export interface Category {
  tag: string;
  count: number;
}

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

function readingMinutesOf(text: string): number {
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 220));
}

function readPost(filename: string): BlogPost {
  const slug = filename.replace(/\.mdx?$/, "").replace(/^\d{4}-\d{2}-\d{2}-/, "");
  const filePath = path.join(BLOG_DIR, filename);
  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);

  return {
    slug,
    title: String(data.title ?? slug),
    description: String(data.description ?? ""),
    date: String(data.date ?? ""),
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    readingMinutes: readingMinutesOf(content),
    featured: Boolean(data.featured),
  };
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  if (!fs.existsSync(BLOG_DIR)) return [];
  const files = fs.readdirSync(BLOG_DIR).filter((f) => /\.mdx?$/.test(f));
  return files
    .map(readPost)
    .sort((a, b) => (b.date > a.date ? 1 : -1));
}

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  const posts = await getBlogPosts();
  return posts.find((p) => p.slug === slug) ?? null;
}

/**
 * Most-recent featured post (post with featured: true), or fall back
 * to the latest post overall if nothing is marked featured.
 */
export async function getFeaturedPost(): Promise<BlogPost | null> {
  const posts = await getBlogPosts();
  if (posts.length === 0) return null;
  return posts.find((p) => p.featured) ?? posts[0];
}

/**
 * Posts excluding the featured one — for the "Stories" list.
 */
export async function getNonFeaturedPosts(): Promise<BlogPost[]> {
  const posts = await getBlogPosts();
  const featured = await getFeaturedPost();
  if (!featured) return posts;
  return posts.filter((p) => p.slug !== featured.slug);
}

/**
 * Unique tags with post counts, sorted by count desc.
 */
export async function getCategories(): Promise<Category[]> {
  const posts = await getBlogPosts();
  const counts = new Map<string, number>();
  for (const post of posts) {
    for (const tag of post.tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }
  return Array.from(counts.entries())
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}

/**
 * Posts that include a given tag.
 */
export async function getPostsByTag(tag: string): Promise<BlogPost[]> {
  const posts = await getBlogPosts();
  return posts.filter((p) => p.tags.includes(tag));
}

/**
 * Returns the source filename (with date prefix) for a slug,
 * so the page can dynamically import the matching .mdx file.
 */
export function findPostFile(slug: string): string | null {
  if (!fs.existsSync(BLOG_DIR)) return null;
  const files = fs.readdirSync(BLOG_DIR).filter((f) => /\.mdx?$/.test(f));
  const match = files.find(
    (f) => f.replace(/\.mdx?$/, "").replace(/^\d{4}-\d{2}-\d{2}-/, "") === slug,
  );
  return match ?? null;
}
