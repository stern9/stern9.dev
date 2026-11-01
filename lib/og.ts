// Open Graph cards are pre-rendered at build time by
// scripts/generate-og-images.ts into public/og/. This file is safe to import
// from client code; og-cards.ts is the server-only side.

/** Site-relative path of the card for a post slug, or the site-wide card. */
export const ogImagePath = (slug?: string) =>
  slug ? `/og/blog/${slug}.png` : "/og/default.png";
