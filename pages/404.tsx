import Link from "next/link";
import Layout from "../components/Layout";
import Seo from "../components/Seo";

const links = [
  { href: "/", label: "Home" },
  { href: "/blog", label: "Blog" },
  { href: "/portfolio", label: "Projects" },
];

export default function NotFound() {
  return (
    <Layout>
      <Seo
        title="Page not found"
        description="This page does not exist on stern9.dev."
        noindex
      />
      <p className="font-mono text-sm uppercase tracking-wider text-zinc-500">
        404
      </p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
        Page not found
      </h1>
      <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
        The page you asked for does not exist or has moved.
      </p>
      <ul className="mt-8 flex flex-wrap gap-3">
        {links.map(({ href, label }) => (
          <li key={href}>
            <Link
              href={href}
              className="inline-block rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-900 transition-colors hover:border-zinc-300 hover:text-accent dark:border-zinc-800 dark:text-zinc-100 dark:hover:border-zinc-700 dark:hover:text-accent-light"
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </Layout>
  );
}
