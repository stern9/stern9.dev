import { getAllPosts } from "../lib/posts";
import { site } from "../lib/site";

const staticPaths = ["", "/blog", "/portfolio", "/about", "/contact"];

export async function getServerSideProps({ res }) {
  const posts = getAllPosts().filter((post) => !post.draft);

  const urls = [
    ...staticPaths.map((path) => `  <url><loc>${site.url}${path}</loc></url>`),
    ...posts.map(
      (post) =>
        `  <url><loc>${site.url}/blog/${post.slug}</loc><lastmod>${post.date}</lastmod></url>`,
    ),
  ].join("\n");

  res.setHeader("Content-Type", "application/xml; charset=utf-8");
  res.setHeader(
    "Cache-Control",
    "public, s-maxage=3600, stale-while-revalidate=86400",
  );
  res.end(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`);

  return { props: {} };
}

export default function Sitemap() {
  return null;
}
