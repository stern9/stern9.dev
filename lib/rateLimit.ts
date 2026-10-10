// Server-only: simple in-memory rate limiting for public API routes.
// Fine for a single Node process (pm2 fork mode); counts reset on restart.

import type { NextApiRequest } from "next";

// Behind Nginx, the real client IP is the last X-Forwarded-For entry
// (the one Nginx appends); earlier entries can be spoofed by the client.
export const clientIp = (req: NextApiRequest): string => {
  const forwarded = String(req.headers["x-forwarded-for"] || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  return (
    forwarded.at(-1) ||
    String(req.headers["x-real-ip"] || "") ||
    req.socket.remoteAddress ||
    "unknown"
  );
};

// Allows `max` requests per visitor per `windowMs`, and `dailyMax` in total
// per UTC day. Returns a function: (ip) => true if allowed (and counted).
export function createRateLimiter({
  max,
  windowMs,
  dailyMax,
}: {
  max: number;
  windowMs: number;
  dailyMax: number;
}) {
  const visitors = new Map<string, number[]>();
  let day = "";
  let dayCount = 0;

  return (ip: string) => {
    const now = Date.now();
    const today = new Date().toISOString().slice(0, 10);
    if (today !== day) {
      day = today;
      dayCount = 0;
      visitors.clear();
    }
    if (dayCount >= dailyMax) return false;

    const recent = (visitors.get(ip) || []).filter((t) => now - t < windowMs);
    if (recent.length >= max) {
      visitors.set(ip, recent);
      return false;
    }
    recent.push(now);
    visitors.set(ip, recent);
    dayCount += 1;
    return true;
  };
}
