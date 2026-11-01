// Server-only: simple in-memory rate limiting for public API routes.
// Fine for a single Node process (pm2 fork mode); counts reset on restart.

import { isIPv4, isIPv6 } from "node:net";
import type { NextApiRequest } from "next";

// Most visitors only ever make a few requests, so this is plenty; past it the
// least recently seen visitor is dropped to keep memory bounded.
const MAX_VISITORS = 10_000;

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

// Expands an IPv6 address to its eight 16-bit groups, or null if invalid.
function ipv6Groups(ip: string): number[] | null {
  if (!isIPv6(ip)) return null;
  const [head, tail = ""] = ip.split("::");
  const parse = (part: string) =>
    part
      .split(":")
      .filter(Boolean)
      .flatMap((g) =>
        // An embedded IPv4 tail (e.g. ::ffff:1.2.3.4) counts as two groups.
        g.includes(".")
          ? g.split(".").reduce<number[]>((acc, n, i) => {
              if (i % 2) acc[acc.length - 1] += Number(n);
              else acc.push(Number(n) << 8);
              return acc;
            }, [])
          : [parseInt(g, 16)],
      );
  const front = parse(head);
  const back = ip.includes("::") ? parse(tail) : [];
  return [...front, ...Array(8 - front.length - back.length).fill(0), ...back];
}

// The key a visitor is counted under. A single IPv6 subscriber usually gets a
// whole /64, so IPv6 addresses are grouped by that prefix; otherwise one
// visitor could rotate through endless addresses. IPv4-mapped IPv6 addresses
// (::ffff:1.2.3.4) are treated as the IPv4 address they carry.
export const visitorKey = (ip: string): string => {
  const addr = ip.replace(/%.*$/, ""); // drop any zone id (fe80::1%eth0)
  if (isIPv4(addr)) return addr;
  const groups = ipv6Groups(addr);
  if (!groups) return ip;
  if (groups.slice(0, 5).every((g) => g === 0) && groups[5] === 0xffff) {
    const [hi, lo] = groups.slice(6);
    return [hi >> 8, hi & 255, lo >> 8, lo & 255].join(".");
  }
  return `${groups
    .slice(0, 4)
    .map((g) => g.toString(16))
    .join(":")}::/64`;
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
    const key = visitorKey(ip);
    const now = Date.now();
    const today = new Date().toISOString().slice(0, 10);
    if (today !== day) {
      day = today;
      dayCount = 0;
      visitors.clear();
    }
    if (dayCount >= dailyMax) return false;

    const recent = (visitors.get(key) || []).filter((t) => now - t < windowMs);
    const allowed = recent.length < max;
    if (allowed) {
      recent.push(now);
      dayCount += 1;
    }
    // Re-insert so the Map stays ordered from least to most recently seen,
    // then drop the oldest visitors once it's over the cap.
    visitors.delete(key);
    visitors.set(key, recent);
    for (const oldest of visitors.keys()) {
      if (visitors.size <= MAX_VISITORS) break;
      visitors.delete(oldest);
    }
    return allowed;
  };
}
