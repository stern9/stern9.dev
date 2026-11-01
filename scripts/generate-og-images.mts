// Pre-renders the Open Graph cards into public/og/ (run by `npm run build`
// through the "prebuild" script). Plain Node runs this file directly with
// type stripping, so it uses React.createElement instead of JSX and imports
// local modules with their ".ts" extension. Any error exits non-zero, which
// fails the build.
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import React from "react";
import og from "next/og.js";
import { ogCards, type OgCard } from "../lib/og-cards.ts";

const publicDir = join(process.cwd(), "public");
const fontDir = join(publicDir, "og");
const inter = readFileSync(join(fontDir, "Inter-SemiBold.woff"));
const mono = readFileSync(join(fontDir, "JetBrainsMono-Regular.woff"));

const BG = "#07111f";
const ACCENT = "#6fb3cc";

const h = React.createElement;

const card = ({ title, label }: OgCard) => {
  const titleSize = title.length > 70 ? 56 : title.length > 40 ? 66 : 76;
  return h(
    "div",
    {
      style: {
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "72px 80px",
        backgroundColor: BG,
        backgroundImage: `radial-gradient(circle at 85% 0%, rgba(111,179,204,0.18), transparent 55%)`,
        color: "#f4f4f5",
      },
    },
    h(
      "div",
      {
        style: {
          display: "flex",
          alignItems: "center",
          fontFamily: "JetBrains Mono",
          fontSize: 28,
          color: ACCENT,
        },
      },
      h("div", {
        style: {
          width: 14,
          height: 14,
          borderRadius: 999,
          backgroundColor: ACCENT,
          marginRight: 16,
        },
      }),
      "stern9.dev",
      label &&
        h("span", { style: { color: "#71717a", marginLeft: 16 } }, "/ ", label),
    ),
    h(
      "div",
      {
        style: {
          display: "flex",
          fontFamily: "Inter",
          fontSize: titleSize,
          lineHeight: 1.12,
          letterSpacing: "-0.02em",
          maxWidth: 1000,
        },
      },
      title,
    ),
    h(
      "div",
      {
        style: {
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderTop: "1px solid #27272a",
          paddingTop: 28,
          fontFamily: "JetBrains Mono",
          fontSize: 26,
          color: "#a1a1aa",
        },
      },
      h("span", null, "Avram Stern"),
      h("span", { style: { color: ACCENT } }, "Senior Full Stack Engineer"),
    ),
  );
};

const render = async (c: OgCard) => {
  const image = new og.ImageResponse(card(c), {
    width: 1200,
    height: 630,
    fonts: [
      { name: "Inter", data: inter, weight: 600, style: "normal" },
      { name: "JetBrains Mono", data: mono, weight: 400, style: "normal" },
    ],
  });
  const png = Buffer.from(await image.arrayBuffer());
  // ImageResponse streams, so a render error can surface as an empty body.
  if (png.length < 1000 || png.readUInt32BE(0) !== 0x89504e47) {
    throw new Error(`OG image for "${c.title}" did not render a PNG`);
  }
  return png;
};

const started = Date.now();
const cards = ogCards();

// Start clean so renamed or unpublished posts don't leave stale cards.
rmSync(join(publicDir, "og", "blog"), { recursive: true, force: true });
rmSync(join(publicDir, "og", "default.png"), { force: true });

// One at a time keeps peak memory low on the small build server.
for (const c of cards) {
  const file = join(publicDir, c.path);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, await render(c));
}

console.log(
  `Generated ${cards.length} OG images in public/og/ (${Date.now() - started} ms)`,
);
