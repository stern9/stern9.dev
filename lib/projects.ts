export type ProjectGroup = "recent" | "client" | "archive";

export type Project = {
  title: string;
  // recent: 2026 tools and libraries; client: agency work 2018 to 2020;
  // archive: 2021 learning projects, rendered as a compact list.
  group: ProjectGroup;
  year: number;
  // Card cover: a screenshot, or terminal/code text for tools with no UI.
  image?: string;
  terminal?: string;
  previewURL: string | null;
  previewLabel?: string; // defaults to "Live site"
  codeURL: string;
  description: string;
  stack?: string[];
};

export const projects: Project[] = [
  // Recent, in display order. The home page shows the first two.
  {
    title: "pii-gate",
    group: "recent",
    year: 2026,
    terminal: `input   Claim from Maria Lopez, SSN 123-45-6789.
masked  Claim from {{PERSON_1}}, SSN {{SSN_1}}.

reply   {{PERSON_1}}'s claim is open for review.
user    Maria Lopez's claim is open for review.

audit   PERSON x1, SSN x1 masked, values not logged`,
    previewURL: null,
    codeURL: "https://github.com/stern9/pii-gate",
    description:
      "Sits between an app and an LLM API: masks names, SSNs, card numbers and other PII with typed placeholders, then restores the real values in the reply and tool calls. Per-category mask, block or allow policy, an audit log that never stores values, and zero runtime dependencies.",
    stack: ["TypeScript", "Anthropic SDK"],
  },
  {
    title: "jev-bench",
    group: "recent",
    year: 2026,
    terminal: `Results (2026-09-24) · 72 labeled decisions

                  jev       haiku-4.5   opus-5
accuracy          94.4%     91.7%       98.6%
p50 latency       ~185 ms   ~1.2 s      ~2.6 s
$ per 1k calls    ~$0.02    ~$0.82      ~$6.40

support_routing   96.2%     92.3%       100%
phishing_check    100%      100%        100%
incident_severity 86.4%     81.8%       95.5%`,
    previewURL: null,
    codeURL: "https://github.com/stern9/jev-bench",
    description:
      "Benchmarks TypeSafe's Jev against Claude Haiku 4.5 and Opus 5 on 72 labeled decisions, with the same questions and scoring code for every model. Jev scored 94.4% at ~185 ms and ~$0.02 per 1k calls; the report also covers calibration (ECE, Brier).",
    stack: ["Python", "Jev", "Claude"],
  },
  {
    title: "dirsize",
    group: "recent",
    year: 2026,
    terminal: `$ dirsize . -n 3
 333.1 MiB ██████████ 100% ./
 333.0 MiB ██████████ 100% ├── target/
 285.7 MiB █████████░  86% │   ├── debug/
  47.3 MiB █░░░░░░░░░  14% │   ├── release/
   1.9 KiB ░░░░░░░░░░   0% │   ├── .rustc_info.json
     177 B ░░░░░░░░░░   0% │   └── (2 more)
  53.1 KiB ░░░░░░░░░░   0% ├── .git/
  13.0 KiB ░░░░░░░░░░   0% ├── Cargo.lock
  33.0 KiB ░░░░░░░░░░   0% └── (9 more)`,
    previewURL: null,
    codeURL: "https://github.com/stern9/dirsize",
    description:
      "Shows disk usage as a sorted tree, scanning in parallel. Scans 153,000 files in 0.27 s, against 0.64 s for du.",
    stack: ["Rust", "CLI"],
  },
  {
    title: "dupes",
    group: "recent",
    year: 2026,
    terminal: `$ dupes --min-size 1000 photos backup docs
3 x 3.3 MiB (6.7 MiB reclaimable)
  backup/beach.jpg
  backup/old/IMG_0042.jpg
  photos/2024/beach.jpg

2 x 46.9 KiB (46.9 KiB reclaimable)
  backup/report-final.pdf
  docs/report.pdf`,
    previewURL: null,
    codeURL: "https://github.com/stern9/dupes",
    description:
      "Finds duplicate files by size, then BLAKE3 hash, and reports the space they waste without deleting anything. Found 44,246 duplicates across 151,197 files in 2.5 s.",
    stack: ["Rust", "CLI"],
  },
  {
    title: "typed-env",
    group: "recent",
    year: 2026,
    terminal: `import { loadEnv, port, bool, url, oneOf, str } from "@stern9/typed-env";

export const env = loadEnv({
  PORT: port({ default: 3000 }),
  DEBUG: bool({ default: false }),
  DATABASE_URL: url(),
  NODE_ENV: oneOf(["development", "production", "test"]),
  SENTRY_DSN: str({ optional: true }),
});

// env.PORT: number
// env.SENTRY_DSN: string | undefined`,
    previewURL: "https://www.npmjs.com/package/@stern9/typed-env",
    previewLabel: "npm",
    codeURL: "https://github.com/stern9/typed-env",
    description:
      "Validates environment variables against a schema and returns a typed, frozen config, with one error that lists every problem. Zero dependencies, published as @stern9/typed-env.",
    stack: ["TypeScript"],
  },
  {
    title: "tennis-reservation",
    group: "recent",
    year: 2026,
    terminal: `[23:58:00] signed in, waiting for midnight
[00:00:00] window open, 2 requests in flight
[00:00:00] Court 1, Tue 06:00  SUCCESS
[00:00:00] Court 2, Tue 07:00  SUCCESS
[00:00:00] done in 497 ms
[00:00:01] confirmation sent via Resend`,
    previewURL: null,
    codeURL: "https://github.com/stern9/tennis-reservation",
    description:
      "Books tennis courts the moment the reservation window opens at midnight, in about 500 ms, 12x faster than the browser-automation version it replaced. Runs on cron and emails a confirmation.",
    stack: ["TypeScript", "Node.js", "cron", "Resend"],
  },

  // Client work.
  {
    title: "PlayStation Offers",
    group: "client",
    year: 2019,
    image: "/img/project_5.jpg",
    previewURL: "https://playstation-thanksgiving.netlify.app/",
    codeURL: "https://github.com/stern9/playstation-work-example",
    description:
      "Thanksgiving offers page for PlayStation with a CSS-only quiz, also shipped as an interactive email that falls back to a static version in Outlook.",
    stack: ["HTML email", "CSS", "AMPscript"],
  },
  {
    title: "Amex Landing Page",
    group: "client",
    year: 2020,
    image: "/img/project_4.jpg",
    previewURL: null, // demo offline: Netlify site removed
    codeURL: "https://github.com/stern9/amex-work-example",
    description:
      "Landing page for American Express card holders that personalizes its content from customer data.",
  },
  {
    title: "Digitas Holidays Site",
    group: "client",
    year: 2018,
    image: "/img/project_6.jpg",
    previewURL: "https://digitas-unicorn-landing.netlify.app/",
    codeURL: "https://github.com/stern9/digitas-unicorn-landing",
    description:
      "Holiday landing page that uses the visitor's location and the OpenWeather API to show a personalized unicorn.",
    stack: ["OpenWeather API"],
  },

  // Archive: 2021 learning projects.
  {
    title: "eCommerce App",
    group: "archive",
    year: 2021,
    image: "/img/project_2.jpg",
    previewURL: null, // demo offline: Render service unreachable (2026-10)
    codeURL: "https://github.com/stern9/stern9-eshop",
    description: "MERN store with PayPal checkout.",
    stack: ["React", "Node.js", "Express", "MongoDB"],
  },
  {
    title: "Anime App",
    group: "archive",
    year: 2021,
    image: "/img/project_3.jpg",
    previewURL: null, // demo offline: Jikan API v3 retired
    codeURL: "https://github.com/stern9/anime-app",
    description: "React search for MyAnimeList data through the Jikan API.",
    stack: ["React", "Jikan API"],
  },
  {
    title: "Code Snippets CRUD",
    group: "archive",
    year: 2021,
    image: "/img/project_1.jpg",
    previewURL: null, // demo offline: FaunaDB shut down
    codeURL: "https://github.com/stern9/nextjs-code-snippets",
    description: "Next.js app for saving code snippets, backed by FaunaDB.",
    stack: ["Next.js", "Tailwind CSS", "FaunaDB"],
  },
];
