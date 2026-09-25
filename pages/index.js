import Link from "next/link";
import { HiArrowRight, HiArrowUpRight } from "react-icons/hi2";
import Layout from "../components/Layout";
import CoverArt from "../components/CoverArt";
import Seo from "../components/Seo";
import PostList from "../components/PostList";
import Projects from "../components/Projects";
import { getAllPosts } from "../lib/posts";
import { getCoverCode } from "../lib/cover";
import { site } from "../lib/site";

const SectionHeader = ({ title, href, cta }) => (
  <div className="mb-4 flex items-baseline justify-between">
    <h2 className="text-sm font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
      {title}
    </h2>
    <Link
      href={href}
      className="inline-flex items-center gap-1 text-sm text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
    >
      {cta} <HiArrowRight className="h-3.5 w-3.5" />
    </Link>
  </div>
);

export default function Home({ posts, coverCode }) {
  return (
    <Layout cover={<CoverArt code={coverCode} />}>
      <Seo />
      <section>
        <p className="font-mono text-sm text-accent dark:text-accent-light">
          Full stack developer · Costa Rica
        </p>
        <h1 className="mt-4 text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl">
          Writing code,
          <span className="block text-zinc-400 dark:text-zinc-500">
            and writing about it.
          </span>
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-zinc-700 dark:text-zinc-300">
          I build web applications end to end and learn by creating. This is my
          corner of the web: I write about development and the things I build,
          and keep a collection of projects I&apos;ve shipped over the years.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Link
            href="/blog"
            className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
          >
            Read the blog
          </Link>
          <a
            href={site.resume}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium transition-colors hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:border-zinc-700 dark:hover:bg-zinc-900"
          >
            Resumé <HiArrowUpRight className="h-3.5 w-3.5" />
          </a>
          <Link
            href="/contact"
            className="px-2 py-2 text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
          >
            Get in touch
          </Link>
        </div>
      </section>

      {posts.length > 0 && (
        <section className="mt-20">
          <SectionHeader title="Recent writing" href="/blog" cta="All posts" />
          <PostList posts={posts} />
        </section>
      )}

      <section className="mt-20">
        <SectionHeader
          title="Selected projects"
          href="/portfolio"
          cta="All projects"
        />
        <Projects limit={2} />
      </section>
    </Layout>
  );
}

export async function getStaticProps() {
  return {
    props: {
      posts: getAllPosts().slice(0, 3),
      coverCode: await getCoverCode(),
    },
  };
}
