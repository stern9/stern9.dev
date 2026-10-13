export type Project = {
  title: string;
  year: number;
  // Card cover: a screenshot, or terminal/code text for tools with no UI.
  image?: string;
  terminal?: string;
  previewURL: string | null;
  codeURL: string;
  description: string;
  stack?: string[];
};

export const projects: Project[] = [
  {
    title: "jev-bench",
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
      "Benchmarks TypeSafe's Jev, a System One model, against Claude on fast structured decisions: accuracy, latency, calibration and cost.",
    stack: ["Python", "Jev", "Claude"],
  },
  {
    title: "dirsize",
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
      "Shows which directories and files are using your disk space, as a sorted tree.",
    stack: ["Rust", "CLI"],
  },
  {
    title: "dupes",
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
      "Finds duplicate files and shows how much space they waste. It only reports, it never deletes.",
    stack: ["Rust", "CLI"],
  },
  {
    title: "typed-env",
    year: 2026,
    terminal: `export const env = loadEnv({
  PORT: port({ default: 3000 }),
  DEBUG: bool({ default: false }),
  DATABASE_URL: url(),
  NODE_ENV: oneOf(["development", "production", "test"]),
  SENTRY_DSN: str({ optional: true }),
});

// env.PORT: number
// env.SENTRY_DSN: string | undefined`,
    previewURL: null,
    codeURL: "https://github.com/stern9/typed-env",
    description:
      "Validates environment variables against a schema and returns a fully typed config object. Zero dependencies.",
    stack: ["TypeScript"],
  },
  {
    title: "Digitas Holidays Site",
    year: 2018,
    image: "/img/project_6.jpg",
    previewURL: "https://digitas-unicorn-landing.netlify.app/",
    codeURL: "https://github.com/stern9/digitas-unicorn-landing",
    description:
      "Holiday landing page that uses location and the OpenWeather API to show a personalized unicorn.",
    stack: ["OpenWeather API"],
  },
  {
    title: "eCommerce App",
    year: 2021,
    image: "/img/project_2.jpg",
    previewURL: "https://stern9-eshop.onrender.com/",
    codeURL: "https://github.com/stern9/stern9-eshop",
    description:
      "Full stack MERN ecommerce app with payments handled through PayPal.",
    stack: ["React", "Node.js", "Express", "MongoDB"],
  },
  {
    title: "PlayStation Offers",
    year: 2019,
    image: "/img/project_5.jpg",
    previewURL: "https://playstation-thanksgiving.netlify.app/",
    codeURL: "https://github.com/stern9/playstation-work-example",
    description:
      "Thanksgiving landing page for PlayStation games with an interactive quiz, also shipped as an email.",
  },
  {
    title: "Anime App",
    year: 2021,
    image: "/img/project_3.jpg",
    previewURL: null, // demo offline: Jikan API v3 retired
    codeURL: "https://github.com/stern9/anime-app",
    description:
      "Search MyAnimeList data through the Jikan API, with a fan-favorite animation on every new render.",
    stack: ["React", "Jikan API"],
  },
  {
    title: "Amex Landing Page",
    year: 2020,
    image: "/img/project_4.jpg",
    previewURL: null, // demo offline: Netlify site removed
    codeURL: "https://github.com/stern9/amex-work-example",
    description:
      "Informative landing page for American Express card holders that personalizes content from user information.",
  },
  {
    title: "Code Snippets CRUD",
    year: 2021,
    image: "/img/project_1.jpg",
    previewURL: null, // demo offline: FaunaDB shut down
    codeURL: "https://github.com/stern9/nextjs-code-snippets",
    description:
      "A CRUD interface to document and keep track of commonly used snippets. Data stored in FaunaDB.",
    stack: ["Next.js", "Tailwind CSS", "FaunaDB"],
  },
];
