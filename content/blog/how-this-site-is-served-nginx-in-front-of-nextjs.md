---
title: "How this site is served: Nginx in front of a Next.js app"
date: 2026-10-13
description: "This site runs on one small cloud server that I set up myself. Here is what happens between your browser and the Node.js process, and the five jobs Nginx does in the middle."
tags: ["nginx", "nextjs", "self-hosting", "devops"]
draft: false
---

This site could live on a platform that handles hosting for me. Push the code, get a URL, done. It lives on a small Ubuntu server that I set up myself, because I wanted to understand the parts those platforms hide. I set this server up in 2022 and have kept it since; this is how it works today.

The most interesting of those parts is Nginx. It sits between the internet and my app, and it does more jobs than I expected when I started. This post walks through them.

I'm keeping the details generic on purpose. The config examples below are simplified, with placeholder names and ports, and I'm leaving out anything that describes this particular server.

## The big picture

```text
Your browser
  └─ HTTPS ─→ Nginx (the only thing facing the internet)
                └─ plain HTTP, on the same machine ─→ Node.js running Next.js
                                                        └─ kept alive by pm2
```

Three pieces:

- **Next.js** is the app. Pages are built ahead of time where they can be, and a few API routes handle things like the contact form and the Spotify list on the about page.
- **pm2** keeps the Node.js process running and restarts it if it crashes.
- **Nginx** receives every request from the outside and decides what to do with it.

The Node.js process only listens locally. Nothing reaches it without going through Nginx first. That one decision is what makes everything else in this post possible.

> **LLM:** I like this diagram because it has exactly one arrow pointing at the internet. Most of the scary diagrams I see have several, and at least one of them is a surprise to the person who drew it.

## Job 1: HTTPS, so the app doesn't have to

The app speaks plain HTTP. Nginx holds the certificate, does the encryption, and passes the request along locally. The certificate comes from Let's Encrypt and is renewed automatically by Certbot, so it's free and I don't have to remember it.

```nginx title="Simplified"
server {
  listen 443 ssl http2;
  server_name example.com;

  ssl_certificate     /path/to/fullchain.pem;
  ssl_certificate_key /path/to/privkey.pem;

  location / {
    proxy_pass http://127.0.0.1:PORT;
  }
}
```

The win is separation. My application code never touches a certificate or a private key. If I rewrote the whole site in another framework tomorrow, this block wouldn't change.

## Job 2: one address for the site

There are four ways to type this site's address: with or without `www`, with `http` or `https`. I want exactly one of them to be real, and the other three to send you there.

```nginx title="Simplified"
server {
  listen 80;
  server_name example.com www.example.com;
  return 301 https://example.com$request_uri;
}
```

A permanent redirect, keeping the path, so an old link to a blog post still lands on that post. It's good for visitors, and it's good for search engines, which otherwise see four copies of the same site.

## Job 3: passing along who is asking

When Nginx forwards a request, the app sees it coming from Nginx, on the same machine. Every visitor looks identical. So Nginx adds a few headers that tell the app what it would otherwise have lost: the original host, the visitor's address, and whether the original request was HTTPS.

```nginx title="Simplified"
proxy_set_header Host              $host;
proxy_set_header X-Real-IP         $remote_addr;
proxy_set_header X-Forwarded-For   $proxy_add_x_forwarded_for;
proxy_set_header X-Forwarded-Proto $scheme;
```

This matters as soon as the app has to treat visitors differently, for example to stop one person from submitting the contact form a hundred times. The lesson I took from it: only trust the value your own proxy wrote. Anything in those headers that arrived from the outside is just text a stranger typed.

## Job 4: caching the files that never change

When Next.js builds the site, the JavaScript and CSS files get a fingerprint in their name. Change the code and the name changes. That means a given file name will never have different contents, so browsers can keep it for as long as they want.

```nginx title="Simplified"
location /_next/static/ {
  proxy_pass http://127.0.0.1:PORT;
  expires 1y;
  add_header Cache-Control "public, max-age=31536000, immutable";
  access_log off;
}
```

The first visit downloads those files. Every visit after that reuses them without even asking the server. I also turn off logging for them, because a log line for every chunk of JavaScript is noise.

Nginx also compresses text responses with gzip before sending them, which is one line of config and makes pages noticeably smaller on the wire.

> **LLM:** "The file name changes when the contents change" is one of my favorite ideas in web development, because it turns the hardest problem in caching into no problem at all. You never have to tell anyone a file is stale. It just stops being asked for.

## Job 5: more than one site on one machine

A server like this doesn't have to stop at one site. Nginx looks at the domain name in each request, so a second app can run on the same machine as its own process, and each request goes to the right one.

```nginx title="Simplified"
server {
  server_name first-site.example;
  location / { proxy_pass http://127.0.0.1:PORT_A; }
}

server {
  server_name second-site.example;
  location / { proxy_pass http://127.0.0.1:PORT_B; }
}
```

Each site gets its own block, its own certificate and its own settings. One small server, one bill, several sites, and none of them knows the others exist.

## One thing worth knowing: buffering

By default, Nginx collects a response from the app before passing it to the browser. For a normal page that's fine, even helpful. For a response that is supposed to arrive piece by piece, it breaks the effect: the pieces pile up inside Nginx and show up all at once at the end.

The fix is to tell Nginx not to buffer that kind of response. You can do it in the Nginx config for a whole location, or the app can ask for it on a single response with a header:

```text
X-Accel-Buffering: no
```

I like the header version. The app knows which responses are streams, so the app says so, and the Nginx config stays the same.

## What Nginx doesn't do here

To be fair about the division of labor:

- **Keeping the app alive** is pm2's job, not Nginx's. If the Node.js process is down, Nginx can only tell you so.
- **Deploying** is still me: pull the code, build it, restart the process. There's no pipeline. For a personal site, three commands are a fine pipeline.

## Small habits that add up

None of these are secrets. They are the kind of defaults I'd want on any server:

- **Expose one thing.** Only Nginx faces the internet. The app listens locally.
- **Don't advertise versions.** Both Nginx and Next.js can announce what they are and which version. Both can be told not to.
- **Let the certificate renew itself.** An expired certificate is the most avoidable outage there is.
- **Keep what is specific to your server out of your blog posts.** Yes, including this one.

## Was it worth it?

A hosting platform would give me most of this without the reading. But now when something on a managed platform behaves strangely, I have a guess about which of these jobs is involved: the redirect, the proxy headers, the cache, the buffering. I learned each one because I had to make it work once, on a server where nobody else was going to.

That's the "learn by creating" part. It's slower, and I'd do it again.
