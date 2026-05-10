import { notFound } from "next/navigation";
import { getCategories, getPostsByTag } from "@/lib/blog";
import { BlogHeader } from "../../_components/blog-header";
import { TopicPills } from "../../_components/topic-pills";
import { StoryCard } from "../../_components/story-card";

export const dynamic = "force-static";

export async function generateStaticParams() {
  const cats = await getCategories();
  return cats.map((c) => ({ tag: c.tag }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tag: string }>;
}) {
  const { tag } = await params;
  return {
    title: `Topic: ${tag}`,
    description: `Posts tagged "${tag}" on Sypher.`,
    alternates: { canonical: `https://sypher.in/blog/topic/${tag}` },
  };
}

export default async function TopicPage({
  params,
}: {
  params: Promise<{ tag: string }>;
}) {
  const { tag } = await params;
  const posts = await getPostsByTag(tag);
  const categories = await getCategories();

  if (posts.length === 0) notFound();

  return (
    <>
      <BlogHeader active="topic" topicLabel={tag} />

      <main className="blog-main">
        <section className="blog-hero">
          <p className="blog-hero-kicker">Topic</p>
          <h1 className="blog-hero-title">{tag}</h1>
          <p className="blog-hero-lede">
            {posts.length} {posts.length === 1 ? "post" : "posts"} in this
            topic.
          </p>
        </section>

        <section className="blog-section">
          <h2 className="blog-section-title">Topics</h2>
          <TopicPills categories={categories} activeTag={tag} />
        </section>

        <section className="blog-section">
          <h2 className="blog-section-title">Stories</h2>
          <ul className="story-list">
            {posts.map((post) => (
              <li key={post.slug}>
                <StoryCard post={post} />
              </li>
            ))}
          </ul>
        </section>
      </main>
    </>
  );
}
