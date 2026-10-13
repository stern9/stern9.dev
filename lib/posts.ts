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

export type PostMeta = {
  slug: string;
  title: string;
  date: string; // YYYY-MM-DD
  description: string;
  tags: string[];
  draft: boolean;
  readingTime: number; // minutes
};

export type Post = PostMeta & { html: string };

const toISODate = (value: unknown, file: string) => {
  const date = value instanceof Date ? value : new Date(String(value));
  if (Number.isNaN(date.getTime())) {
    throw new Error(`${file}: invalid or missing "date" in frontmatter`);
  }
  return date.toISOString().slice(0, 10);
};

const readPostFile = (file: string): { meta: PostMeta; content: string } => {
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

export function getAllPosts(): PostMeta[] {
  return postFiles()
    .map((file) => readPostFile(file).meta)
    .filter((post) => showDrafts || !post.draft)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

type HastNode = {
  type: string;
  tagName?: string;
  value?: string;
  properties?: Record<string, unknown>;
  children?: HastNode[];
};

const textOf = (node: HastNode): string =>
  node.value ?? (node.children ?? []).map(textOf).join("");

// Asides written by an AI get the same "AI-generated" badge the about page
// uses for the playlist blurb. Mark one in Markdown by opening a blockquote
// with "**LLM:**" (the label is dropped from the page, the badge replaces
// it) or "**Random thought:**" (the label stays).
const AI_ASIDE_LABELS: Record<string, { keepLabel: boolean }> = {
  "LLM:": { keepLabel: false },
  "Random thought:": { keepLabel: true },
};

const rehypeAiBadge = () => (tree: HastNode) => {
  const visit = (node: HastNode) => {
    const paragraphs = (node.children ?? []).filter((c) => c.tagName === "p");
    const first = paragraphs[0]?.children;
    const label = first?.[0];
    const aside =
      node.tagName === "blockquote" && label?.tagName === "strong"
        ? AI_ASIDE_LABELS[textOf(label).trim()]
        : undefined;
    if (!first || !aside) {
      node.children?.forEach(visit);
      return;
    }
    if (!aside.keepLabel) {
      first.shift();
      if (first[0]?.type === "text") {
        first[0].value = (first[0].value ?? "").trimStart();
      }
    }
    // Outside the paragraphs, so it sits below the closing quote mark.
    node.children?.push({
      type: "element",
      tagName: "div",
      properties: { className: ["ai-badge-row"] },
      children: [
        {
          type: "element",
          tagName: "span",
          properties: { className: ["ai-badge"] },
          children: [{ type: "text", value: "AI-generated" }],
        },
      ],
    });
  };
  visit(tree);
};

const processor = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkRehype)
  .use(rehypeSlug)
  .use(rehypeAiBadge)
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

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const file = `${slug}.md`;
  if (!postFiles().includes(file)) return null;

  const { meta, content } = readPostFile(file);
  if (meta.draft && !showDrafts) return null;

  const html = String(await processor.process(content));
  return { ...meta, html };
}
