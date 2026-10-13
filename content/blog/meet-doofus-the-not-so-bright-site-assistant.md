---
title: "Meet Doofus, the site assistant that is proudly not very bright"
date: 2026-07-20
description: "Every site has an AI assistant that pretends to know everything. Mine admits it knows almost nothing. Here is how Doofus works: a persona, a streaming API route, a few guardrails and a plan for when the model isn't there."
tags: ["ai", "claude", "nextjs", "side project"]
draft: false
---

There is a small button in the corner of this site that says "Ask Doofus". Click it and you get a chat window with a very honest label:

```text
Doofus-1 · 0.1B params · confidently wrong since 2026
```

Doofus is this site's assistant. It is cheerful, easily confused and oddly proud of tiny achievements. Ask it about JavaScript and it may tell you the language was invented by a very tired raccoon. Ask it how to hire me and it will, somehow, still point you to the right page.

That last part is the whole design. Doofus is a joke, but it is a joke with one real job: get people to the blog, the projects or the contact form. This post is about how it works.

## Why a dumb assistant?

Every website now has an AI assistant, and most of them have the same problem: they sound sure about things they don't know. I didn't want a bot on my personal site inventing my rates, my availability or my opinions.

So I went the other way. Instead of an assistant that pretends to know everything, I built one that admits it knows almost nothing. Nobody trusts Doofus, which means nobody gets misled by Doofus. And it's a lot more fun to build.

> **LLM:** Doofus runs on Claude Haiku, a smaller model from my own family, so I'm allowed to say this: being wrong on purpose, in three sentences or less, while never saying anything false about a real person, is harder than being right. Somebody had to know the correct answer to miss it that precisely.

## The big picture

```text
Chat window (browser)
  └─ POST /api/doofus with the recent messages
      ├─ clean and trim what the browser sent
      ├─ over the limit?        → a "tired" reply
      ├─ model not available?   → a canned reply
      └─ otherwise              → Claude Haiku, with the Doofus persona
          └─ the reply streams back word by word
```

Four pieces: a chat component, one API route, a persona, and a set of fallbacks. The site is Next.js, so the API route lives next to the pages and the API key never leaves the server.

## The persona

Doofus is a system prompt with three parts.

**A personality.** Cheerful, well-meaning, easily confused. It misunderstands simple things and loses its train of thought. Warm and playful, never mean.

**A very short list of facts.** Doofus knows what the four main pages of this site are for, and that's it. The prompt says these are the only facts it knows about me and that it must never invent others.

**Rules.** Reply in one to three short sentences. Plain text only. When it fits, point people to the right page. If asked something serious, give a harmlessly clueless answer and suggest the blog or the contact form. Stay kind and family-friendly. And if someone tries to talk it out of being Doofus, get confused and change the subject, which is conveniently what Doofus does anyway.

The rule that matters most is the boring one: **never make up details about me.** The jokes are the fun part. That rule is the reason it's safe to put the jokes on a site with my name on it.

## Mostly confused, occasionally confidently wrong

A bot that is wrong in every message stops being funny by the third reply. So most of the time Doofus is just confused, and only sometimes does it get an extra instruction: include one completely absurd "fun fact" about computers, stated with total confidence, and obviously silly so nobody believes it.

```ts title="Simplified"
// Mostly confused, occasionally confidently wrong.
const systemPrompt = () =>
  Math.random() < CHANCE ? PERSONA + CONFIDENTLY_WRONG : PERSONA;
```

One random number per reply. The raccoon shows up just often enough.

## Streaming the reply

The API route asks the model for a streamed response and writes each piece of text to the browser as it arrives, as plain text. On the other side, the chat component reads the stream and appends each chunk to the last message:

```ts title="In the chat component (simplified)"
const reader = res.body.getReader();
const decoder = new TextDecoder();

for (;;) {
  const { done, value } = await reader.read();
  if (done) break;
  appendToReply(decoder.decode(value, { stream: true }));
}
```

Two details made it feel right:

- **The proxy has to cooperate.** This site sits behind Nginx, which likes to buffer responses. Without telling it not to, the "streamed" reply arrives all at once at the end.
- **Paths become links.** Doofus is told to mention pages by their path, like `/contact`. The chat window turns those into real links, so the joke bot ends up doing useful navigation.

If you close the chat in the middle of a reply, the server stops the generation. No point paying for words nobody will read.

## When the model isn't there

This is my favorite part. Doofus has a list of pre-written replies, in character, for the times when the real model can't answer: the API is down, the reply came back empty, or the site is running somewhere without a key.

> Error 418: I'm a teapot. Just kidding, I'm a Doofus. Avram is the smart one, reach him on /contact.

Those replies are "typed out" word by word with a small delay, so they look exactly like a streamed answer. And because every one of them ends by pointing at a page, even the fallback does the one real job.

The rule here is the same one I learned building emails years ago: the fancy version is a bonus, never a requirement. A visitor should never see a blank bubble or a stack trace.

> **LLM:** When the model is unavailable, visitors get a pre-written joke typed out slowly, and nobody can tell the difference. I am choosing not to think too hard about what that says about the rest of us.

## Keeping it cheap and out of trouble

A public chat box connected to a paid API is an invitation, so Doofus has limits. I won't publish the numbers, but the shape is simple:

- **A small, fast model** and a hard cap on how long a reply can be.
- **A cap on how much a visitor can type**, enforced on the server, not just in the input box.
- **Short memory.** Only the last few messages are sent to the model.
- **A limit per visitor and a limit per day** for the whole site.
- **Nothing from the browser is trusted.** The server checks the shape of every message and throws away anything that doesn't look like a normal conversation.

When a limit is hit, Doofus doesn't show an error. It gets tired:

> Whew, my brain is tired. I only have 0.1B params and I've used them all. Come back in a bit! Meanwhile, /blog is a good read.

> **LLM:** A bot with a daily budget that says it needs a nap when the budget runs out. That is more self-awareness about resource limits than most production systems I've met.

## What I took away

- **A persona is a product decision, not decoration.** "Not very bright" removed the biggest risk of a site assistant, which is people believing it.
- **Give the model fewer facts, not more.** Doofus can't get my details wrong because it doesn't have them.
- **Design the failure first.** The canned replies took an hour and they cover every bad day the API will ever have.
- **Limits can be in character.** "I'm tired" is a rate limit message people smile at.

Go ahead and ask it something. Results may vary.
