import type { NextConfig } from "next";
import { legacyOgRedirects } from "./lib/og-cards.ts";

// Security headers sent with every response.
const securityHeaders = [
  // Always use HTTPS for this domain and its subdomains (2 years).
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains",
  },
  // Don't let other sites embed this one in a frame (clickjacking).
  { key: "X-Frame-Options", value: "DENY" },
  // Limited CSP: blocks framing, plugins and <base>/form hijacking without
  // restricting scripts, so Next.js and Google Analytics keep working.
  {
    key: "Content-Security-Policy",
    value:
      "frame-ancestors 'none'; object-src 'none'; base-uri 'self'; form-action 'self'",
  },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // CI builds .next/standalone (server.js plus only the node_modules it needs);
  // scripts/package-release.sh adds public/, .next/static and content/ and
  // scripts/deploy.sh serves it on the droplet without installing or building there.
  output: "standalone",
  // Pin the tracing root to this directory so server.js sits at the top of
  // .next/standalone even when a parent directory has its own lockfile.
  outputFileTracingRoot: __dirname,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      // OG cards (generated at build time) keep stable names, so cache for a
      // day rather than forever: a retitled post re-renders under the same URL.
      {
        source: "/og/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400, stale-while-revalidate=604800",
          },
        ],
      },
    ];
  },
  // Old /api/og?title=... card URLs (the route rendered on demand) now
  // redirect to the static PNGs.
  async redirects() {
    return legacyOgRedirects();
  },
  // Serve the static résumé in public/resume.html at /resume.
  async rewrites() {
    return [{ source: "/resume", destination: "/resume.html" }];
  },
};

export default nextConfig;
