---
title: "Markdown style guide"
date: 2026-09-24
description: "A reference post showing every formatting feature the blog supports. Copy it to start a new post."
tags: ["meta", "markdown"]
draft: true
---

This post is a **draft**, so it only shows up when running `npm run dev`. Delete the `draft: true` line (or set it to `false`) and a post goes live on the next build.

## Writing a new post

Create a file in `content/blog/`. The file name becomes the URL, so `my-first-post.md` is served at `/blog/my-first-post`. Every post starts with frontmatter:

```yaml title="content/blog/my-first-post.md"
---
title: "My first post"
date: 2026-09-24
description: "One or two sentences shown in the post list, RSS and link previews."
tags: ["javascript", "career"]
---
```

Only `title` and `date` are required.

## Text formatting

Regular paragraphs, **bold**, _italic_, ~~strikethrough~~, `inline code` and [links](https://stern9.dev). Line length and spacing are tuned for comfortable reading.

> Blockquotes work well for callouts or quoting someone else.

### Lists

- Unordered lists
- With a few items
  - And nesting

1. Ordered lists
2. Work too

- [x] Task lists (GitHub style)
- [ ] Are supported as well

## Code

Syntax highlighting adapts to light and dark mode. Add a title and highlight lines with `{…}`:

```js title="lib/greet.js" {2}
export function greet(name) {
  return `Hello, ${name}!`;
}
```

```bash
npm run dev
```

## Tables

| Feature        | Supported |
| -------------- | :-------: |
| GFM tables     |    ✅     |
| Code titles    |    ✅     |
| Heading anchors|    ✅     |

## Images

Put images in `public/blog/<post-slug>/` and reference them with an absolute path:

```md
![Alt text describing the image](/blog/my-first-post/screenshot.png)
```

---

That's it. Write, commit, deploy.
