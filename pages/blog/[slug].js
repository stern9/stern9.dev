import Link from "next/link";
import { HiArrowLeft } from "react-icons/hi";
import Layout from "../../components/Layout";
import Seo from "../../components/Seo";
import { DraftBadge } from "../../components/PostList";
import { getAllPosts, getPostBySlug } from "../../lib/posts";
import { formatDate } from "../../lib/format";

export default function Post({ post, newer, older }) {
  return (
    <Layout>
      <Seo
        title={post.title}
        description={post.description || undefined}
        type="article"
        date={post.date}
      />
      <article>
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-sm text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
        >
          <HiArrowLeft className="h-3.5 w-3.5" /> All posts
        </Link>

        <header className="mb-10 mt-8">
          <h1 className="text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
            {post.title}
            {post.draft && <DraftBadge />}
          </h1>
          <p className="mt-4 text-sm text-zinc-500 dark:text-zinc-400">
            <time dateTime={post.date}>{formatDate(post.date)}</time>
            <span aria-hidden> · </span>
            {post.readingTime} min read
          </p>
          {post.tags.length > 0 && (
            <ul className="mt-4 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <li
                  key={tag}
                  className="rounded-full border border-zinc-200 px-2.5 py-0.5 text-xs text-zinc-600 dark:border-zinc-800 dark:text-zinc-400"
                >
                  {tag}
                </li>
              ))}
            </ul>
          )}
        </header>

        <div
          className="prose prose-zinc max-w-none dark:prose-invert prose-headings:font-semibold prose-headings:tracking-tight prose-img:rounded-xl sm:prose-lg"
          dangerouslySetInnerHTML={{ __html: post.html }}
        />
      </article>

      {(newer || older) && (
        <nav
          aria-label="More posts"
          className="mt-16 grid gap-4 border-t border-zinc-200 pt-8 sm:grid-cols-2 dark:border-zinc-800"
        >
          {older ? <PostNavLink post={older} label="Previous" /> : <span />}
          {newer && <PostNavLink post={newer} label="Next" alignRight />}
        </nav>
      )}
    </Layout>
  );
}

const PostNavLink = ({ post, label, alignRight }) => (
  <Link
    href={`/blog/${post.slug}`}
    className={`group rounded-lg border border-zinc-200 p-4 transition-colors hover:border-zinc-300 dark:border-zinc-800 dark:hover:border-zinc-700 ${
      alignRight ? "sm:text-right" : ""
    }`}
  >
    <span className="text-xs uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
      {label}
    </span>
    <span className="mt-1 block font-medium text-zinc-900 group-hover:text-accent dark:text-zinc-100 dark:group-hover:text-accent-light">
      {post.title}
    </span>
  </Link>
);

export async function getStaticPaths() {
  return {
    paths: getAllPosts().map((post) => ({ params: { slug: post.slug } })),
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const post = await getPostBySlug(params.slug);
  if (!post) return { notFound: true };

  const posts = getAllPosts();
  const index = posts.findIndex((p) => p.slug === post.slug);
  const pick = (p) => (p ? { slug: p.slug, title: p.title } : null);

  return {
    props: {
      post,
      newer: pick(posts[index - 1]),
      older: pick(posts[index + 1]),
    },
  };
}
