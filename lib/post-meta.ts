// Server-only: post frontmatter without the Markdown pipeline, so build
// scripts and next.config.ts can list posts without loading unified/Shiki.
// Relative imports of this file use the ".ts" extension so plain Node (type
// stripping) can load it too.
import fs from "fs";
import path from "path";
import matter from "gray-matter";

const POSTS_DIR = path.join(process.cwd(), "content", "blog");
const WORDS_PER_MINUTE = 230;

// Drafts are visible while running `npm run dev`, hidden in production builds.
export const showDrafts = process.env.NODE_ENV !== "production";

export type PostMeta = {
  slug: string;
  title: string;
  date: string; // YYYY-MM-DD
  description: string;
  tags: string[];
  draft: boolean;
  readingTime: number; // minutes
};

const toISODate = (value: unknown, file: string) => {
  const date = value instanceof Date ? value : new Date(String(value));
  if (Number.isNaN(date.getTime())) {
    throw new Error(`${file}: invalid or missing "date" in frontmatter`);
  }
  return date.toISOString().slice(0, 10);
};

export const readPostFile = (
  file: string,
): { meta: PostMeta; content: string } => {
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

export const postFiles = () =>
  fs.existsSync(POSTS_DIR)
    ? fs.readdirSync(POSTS_DIR).filter((file) => file.endsWith(".md"))
    : [];

export function getAllPosts(): PostMeta[] {
  return postFiles()
    .map((file) => readPostFile(file).meta)
    .filter((post) => showDrafts || !post.draft)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}
