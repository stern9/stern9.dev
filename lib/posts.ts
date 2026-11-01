// Server-only: import this from getStaticProps / getServerSideProps only.
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeStringify from "rehype-stringify";
import {
  postFiles,
  readPostFile,
  showDrafts,
  type PostMeta,
} from "./post-meta.ts";

export { getAllPosts, type PostMeta } from "./post-meta.ts";

export type Post = PostMeta & { html: string };

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
