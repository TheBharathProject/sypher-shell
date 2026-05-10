import {
  getBlogPosts,
  getCategories,
  getFeaturedPost,
} from "@/lib/blog";
import { BlogHeader } from "./_components/blog-header";
import { FeaturedCard } from "./_components/featured-card";
import { TopicPills } from "./_components/topic-pills";
import { StoryCard } from "./_components/story-card";

export const dynamic = "force-static";

export const metadata = {
  title: "Blog",
  description:
    "Notes from the workshop. Posts about the tools, the build, and what's working.",
  alternates: { canonical: "https://sypher.in/blog" },
};

export default async function BlogIndex() {
  const featured = await getFeaturedPost();
  const stories = await getBlogPosts(); // featured post still appears here
  const categories = await getCategories();

  return (
    <>
      <BlogHeader active="home" />

      <main className="blog-main">
        <section className="blog-hero">
          <h1 className="blog-hero-title">Notes from the workshop.</h1>
          <p className="blog-hero-lede">
            Posts about the tools, the build, and what&rsquo;s working.
          </p>
        </section>

        {featured && (
          <section className="blog-section">
            <h2 className="blog-section-title">Featured</h2>
            <FeaturedCard post={featured} />
          </section>
        )}

        {categories.length > 0 && (
          <section className="blog-section">
            <h2 className="blog-section-title">Topics</h2>
            <TopicPills categories={categories} />
          </section>
        )}

        <section className="blog-section">
          <h2 className="blog-section-title">All stories</h2>
          {stories.length === 0 ? (
            <p className="blog-empty">
              No posts yet. The first one is being written.
            </p>
          ) : (
            <ul className="story-list">
              {stories.map((post) => (
                <li key={post.slug}>
                  <StoryCard post={post} />
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </>
  );
}
