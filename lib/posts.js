// Server-only: import this from getStaticProps / getServerSideProps only.
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeStringify from "rehype-stringify";

const POSTS_DIR = path.join(process.cwd(), "content", "blog");
const WORDS_PER_MINUTE = 230;

// Drafts are visible while running `npm run dev`, hidden in production builds.
const showDrafts = process.env.NODE_ENV !== "production";

const toISODate = (value, file) => {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) {
    throw new Error(`${file}: invalid or missing "date" in frontmatter`);
  }
  return date.toISOString().slice(0, 10);
};

const readPostFile = (file) => {
  const slug = file.replace(/\.md$/, "");
  const raw = fs.readFileSync(path.join(POSTS_DIR, file), "utf8");
  const { data, content } = matter(raw);

  if (!data.title) {
    throw new Error(`${file}: missing "title" in frontmatter`);
  }

  const words = content.trim().split(/\s+/).filter(Boolean).length;

  return {
    meta: {
      slug,
      title: data.title,
      date: toISODate(data.date, file),
      description: data.description ?? "",
      tags: data.tags ?? [],
      draft: Boolean(data.draft),
      readingTime: Math.max(1, Math.round(words / WORDS_PER_MINUTE)),
    },
    content,
  };
};

const postFiles = () =>
  fs.existsSync(POSTS_DIR)
    ? fs.readdirSync(POSTS_DIR).filter((file) => file.endsWith(".md"))
    : [];

export function getAllPosts() {
  return postFiles()
    .map((file) => readPostFile(file).meta)
    .filter((post) => showDrafts || !post.draft)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

const processor = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkRehype)
  .use(rehypeSlug)
  .use(rehypeAutolinkHeadings, {
    behavior: "wrap",
    properties: { className: ["anchor"] },
  })
  .use(rehypePrettyCode, {
    theme: { light: "github-light", dark: "github-dark-dimmed" },
    keepBackground: true,
    defaultLang: "plaintext",
  })
  .use(rehypeStringify);

export async function getPostBySlug(slug) {
  const file = `${slug}.md`;
  if (!postFiles().includes(file)) return null;

  const { meta, content } = readPostFile(file);
  if (meta.draft && !showDrafts) return null;

  const html = String(await processor.process(content));
  return { ...meta, html };
}
