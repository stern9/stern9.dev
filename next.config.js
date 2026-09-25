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

/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

module.exports = nextConfig;
