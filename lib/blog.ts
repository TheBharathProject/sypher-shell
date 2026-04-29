/**
 * Blog post loader stub. Replace with real MDX loading once content/blog/ exists.
 */

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string; // ISO 8601
  tags: string[];
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  return [];
}
