import Layout from "../../components/Layout";
import Seo from "../../components/Seo";
import PostList from "../../components/PostList";
import { getAllPosts, type PostMeta } from "../../lib/posts";

export default function Blog({ posts }: { posts: PostMeta[] }) {
  const years = [...new Set(posts.map((post) => post.date.slice(0, 4)))];

  return (
    <Layout>
      <Seo
        title="Blog"
        description="Writing on software engineering, the things I build, and working with AI agents."
      />
      <header className="mb-12">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Blog
        </h1>
        <p className="mt-3 text-lg text-zinc-600 dark:text-zinc-400">
          Writing on software engineering, the things I build, and working with
          AI agents.
        </p>
      </header>

      {posts.length === 0 ? (
        <p className="text-zinc-500 dark:text-zinc-400">
          No posts yet. Check back soon.
        </p>
      ) : (
        <div className="space-y-12">
          {years.map((year) => (
            <section key={year}>
              <h2 className="mb-2 text-sm font-medium text-zinc-400 dark:text-zinc-500">
                {year}
              </h2>
              <PostList
                posts={posts.filter((post) => post.date.startsWith(year))}
              />
            </section>
          ))}
        </div>
      )}
    </Layout>
  );
}

export async function getStaticProps() {
  return { props: { posts: getAllPosts() } };
}
