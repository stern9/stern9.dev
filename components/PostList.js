import Link from "next/link";
import { formatDate } from "../lib/format";

const PostList = ({ posts }) => {
  return (
    <ul className="-mx-3">
      {posts.map((post) => (
        <li key={post.slug}>
          <Link
            href={`/blog/${post.slug}`}
            className="group flex flex-col gap-1 rounded-lg px-3 py-4 transition-colors hover:bg-zinc-50 sm:flex-row sm:gap-6 dark:hover:bg-zinc-900/60"
          >
            <time
              dateTime={post.date}
              className="shrink-0 pt-0.5 text-sm tabular-nums text-zinc-500 sm:w-28 dark:text-zinc-400"
            >
              {formatDate(post.date, "short")}
            </time>
            <div className="min-w-0">
              <h3 className="font-medium text-zinc-900 group-hover:text-accent dark:text-zinc-100 dark:group-hover:text-accent-light">
                {post.title}
                {post.draft && <DraftBadge />}
              </h3>
              {post.description && (
                <p className="mt-1 text-[15px] leading-relaxed text-zinc-600 dark:text-zinc-400">
                  {post.description}
                </p>
              )}
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
};

export const DraftBadge = () => (
  <span className="ml-2 inline-block rounded bg-amber-100 px-1.5 py-0.5 align-middle text-[11px] font-medium uppercase tracking-wide text-amber-800 dark:bg-amber-900/40 dark:text-amber-300">
    Draft
  </span>
);

export default PostList;
