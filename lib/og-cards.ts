// Server-only: the fixed set of Open Graph cards (the site card plus one per
// published post). Used by scripts/generate-og-images.ts and next.config.ts,
// so imports keep the ".ts" extension for plain Node.
import { getAllPosts } from "./post-meta.ts";
import { ogImagePath } from "./og.ts";
import { site } from "./site.ts";

export type OgCard = {
  /** Site-relative URL, also the file path under public/. */
  path: string;
  title: string;
  /** Shown after "stern9.dev /" in the card header; empty for the site card. */
  label: string;
};

export const ogCards = (): OgCard[] => [
  { path: ogImagePath(), title: site.title, label: "" },
  ...getAllPosts()
    .filter((post) => !post.draft)
    .map((post) => ({
      path: ogImagePath(post.slug),
      title: post.title,
      label: "blog",
    })),
];

const escapeRegExp = (value: string) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/**
 * Redirects for the old on-demand route (/api/og?title=...&label=...), whose
 * URLs social networks may still have cached. A known post title goes to that
 * post's card; anything else got the site card before, and still does.
 */
export const legacyOgRedirects = () => [
  ...ogCards()
    .filter((card) => card.label)
    .map((card) => ({
      source: "/api/og",
      has: [
        { type: "query" as const, key: "title", value: escapeRegExp(card.title) },
      ],
      destination: card.path,
      permanent: true,
    })),
  { source: "/api/og", destination: ogImagePath(), permanent: true },
];
