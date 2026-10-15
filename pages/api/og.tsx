import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { NextApiRequest, NextApiResponse } from "next";
import { ImageResponse } from "next/og";
import { site } from "../../lib/site";
import { getAllPosts } from "../../lib/posts";

// Runs on the default Node.js runtime so it works under the custom server
// (server.js). Fonts are read once from public/og/.
const fontDir = join(process.cwd(), "public", "og");
const inter = readFileSync(join(fontDir, "Inter-SemiBold.woff"));
const mono = readFileSync(join(fontDir, "JetBrainsMono-Regular.woff"));

const BG = "#07111f";
const ACCENT = "#6fb3cc";

const clean = (value: string | string[] | undefined, max: number) =>
  (Array.isArray(value) ? value[0] : value ?? "").trim().slice(0, max);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "GET" && req.method !== "HEAD") {
    res.setHeader("Allow", "GET, HEAD");
    return res.status(405).end();
  }

  // Only render titles this site actually has, so nobody can put their own
  // words on a card that carries this domain.
  const known = new Set([site.title, ...getAllPosts().map((p) => p.title)]);
  const requested = clean(req.query.title, 200);
  const title = known.has(requested) ? requested : site.title;
  const label = title === site.title ? "" : "blog";
  const titleSize = title.length > 70 ? 56 : title.length > 40 ? 66 : 76;

  const image = new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          backgroundColor: BG,
          backgroundImage: `radial-gradient(circle at 85% 0%, rgba(111,179,204,0.18), transparent 55%)`,
          color: "#f4f4f5",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            fontFamily: "JetBrains Mono",
            fontSize: 28,
            color: ACCENT,
          }}
        >
          <div
            style={{
              width: 14,
              height: 14,
              borderRadius: 999,
              backgroundColor: ACCENT,
              marginRight: 16,
            }}
          />
          stern9.dev
          {label && (
            <span style={{ color: "#71717a", marginLeft: 16 }}>
              / {label}
            </span>
          )}
        </div>
        <div
          style={{
            display: "flex",
            fontFamily: "Inter",
            fontSize: titleSize,
            lineHeight: 1.12,
            letterSpacing: "-0.02em",
            maxWidth: 1000,
          }}
        >
          {title}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "1px solid #27272a",
            paddingTop: 28,
            fontFamily: "JetBrains Mono",
            fontSize: 26,
            color: "#a1a1aa",
          }}
        >
          <span>Avram Stern</span>
          <span style={{ color: ACCENT }}>Senior Full Stack Engineer</span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: "Inter", data: inter, weight: 600, style: "normal" },
        { name: "JetBrains Mono", data: mono, weight: 400, style: "normal" },
      ],
    },
  );

  const png = Buffer.from(await image.arrayBuffer());
  res.setHeader("Content-Type", "image/png");
  res.setHeader("Content-Length", png.length);
  res.setHeader(
    "Cache-Control",
    "public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400",
  );
  return res.status(200).send(req.method === "HEAD" ? undefined : png);
}
