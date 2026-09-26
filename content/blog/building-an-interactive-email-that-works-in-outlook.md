---
title: "Building an interactive email that still works in Outlook"
date: 2026-09-25
description: "A look back at a personalized, interactive email I built for a card-member campaign: a CSS-only carousel, AMPscript personalization and a fallback for every inbox."
tags: ["email", "html", "css", "case study"]
draft: false
---

Most web developers never have to think about Outlook's rendering engine. For a big part of my career, I did. This post looks back at one project I'm still proud of: an interactive, personalized email I built in late 2020 for American Express Business Gold Card Members while working with Digitas.

It was me against the clock. After a lot of planning, I told our project manager the interactive version was possible, and it got sold to the client with more promised than the timeline really allowed. Building the email was only half the job. For every client that couldn't handle the interactive parts, I also had to work out what it should show instead, and then propose those fallbacks so everyone could sign off on them. Ugh, email.

## The brief

The goal was education: help Card Members understand how to earn more Membership Rewards points with their card, and where those points could go. That meant a lot of content: several reward categories, each with its own visuals, in a single email that had to feel personal and look polished everywhere.

It went out to a large list of Card Members, and a lot of people had a say in it. On the agency side it was me, a creative designer, a copywriter and a project manager. On the client side there was another PM, a scrum master, the product team, the art director lead and the legal team. Every one of them had to be happy with how the email looked and behaved in every inbox, not just the best one.

## Constraint #1: no JavaScript, anywhere

In an inbox, JavaScript doesn't run. At all. So the obvious way to fit lots of content into a small space (a carousel or tabs) is off the table... unless you build it with CSS alone.

The trick is a set of hidden radio buttons and the `:checked` selector. Each "slide" button is a `<label>` pointing at a radio input, and CSS shows the slide that matches the checked input:

```html title="Simplified CSS-only carousel"
<input type="radio" name="slides" id="slide1" checked style="display:none">
<input type="radio" name="slides" id="slide2" style="display:none">

<div class="carousel">
  <div class="slide slide1">…first panel…</div>
  <div class="slide slide2">…second panel…</div>
  <label for="slide1">1</label>
  <label for="slide2">2</label>
</div>
```

```css
.slide { display: none; }
#slide1:checked ~ .carousel .slide1,
#slide2:checked ~ .carousel .slide2 { display: block; }
```

Clients that support this (Apple Mail, iOS Mail, some webmail) get a real interactive carousel. Everyone else needs something just as good, which leads to the harder part.

## Constraint #2: every inbox is a different browser

Email clients are wildly inconsistent. The same HTML goes to Outlook on Windows (which renders with Microsoft Word's engine), Gmail on the web, the Gmail app, Apple Mail, Yahoo and more. The final build ended up with:

- **Tables for layout.** Around a hundred nested tables. Flexbox and grid aren't an option when Outlook is in the audience.
- **Outlook-only code paths.** Dozens of conditional comments (`<!--[if mso]>`) to give Outlook its own markup, and a static fallback layout that replaces the carousel when Outlook's own interactivity kicks in.
- **Client-specific fixes.** Rules scoped to the Gmail app's wrapper (`#MessageViewBody`), resets for Apple's automatic link detection on numbers and dates, and a Yahoo workaround.
- **Graceful media.** An animated GIF hero with a static JPG fallback, and separate mobile images below a 619px breakpoint.

```html title="Outlook gets its own markup"
<!--[if mso]>
  <table role="presentation" width="600"><tr><td>
    Static version for Outlook
  </td></tr></table>
<![endif]-->
<!--[if !mso]><!-->
  <div class="carousel">Interactive version for everyone else</div>
<!--<![endif]-->
```

The rule I followed: **the interactive version is a bonus, never a requirement.** Every reader had to get the full message, whatever opened it.

## Constraint #3: make it personal

The email was sent through Salesforce Marketing Cloud, which uses a templating language called AMPscript. Personalization started with the subject line, which greeted each Card Member by first name, with a safe fallback when the data was missing or looked wrong:

```text title="AMPscript (simplified)"
SET @firstname = IIF(EMPTY(@name), "Card Member", PROPERCASE(@name))
SET @subject = CONCAT(@firstname, ", get the most from your card.")
```

That fallback matters more than it looks. Personalization that fails ("Hi , ...") is worse than none at all.

And it went well beyond the subject line. Each email was built for its recipient, with content pulled from the client's Salesforce data, so the interactive experience was personal as well as clickable. Because that meant handling real Card Member data, the integration also had to pass a security audit, and it did.

## How we tested it

Nothing reached a real Card Member until it had cleared three gates:

1. **Internal QA** on the agency side: previews in Litmus and Email on Acid, plus a bunch of real phones, tablets and desktops.
2. **A client review pass.**
3. **Dogfooding**: the stakeholders themselves received the email on their own devices before the real send, Windows machines running desktop Outlook included.

That last one mattered. Previews are useful, but nothing humbles you like desktop Outlook on a real Windows PC, still rendering email with Word's layout engine.

Each round was a chance to catch a client that rendered something differently, or a fallback that didn't hold up.

## Results

I don't have send numbers to share, but the project did what it set out to do. The Salesforce integration and the security audit went through cleanly, the email passed every QA round, and the stakeholders loved it. The client was happy, and so was I, given where the timeline started.

## What I took away

Email development taught me habits I still use building software and working in huge codebases:

- **Progressive enhancement for real.** Start with something that works everywhere, then layer on the fancy parts.
- **Test on the actual targets.** Assumptions about "how browsers work" don't survive contact with Outlook.
- **Fallbacks are features.** The empty-name case, the no-GIF case, the no-interactivity case: that's where quality shows.

I like solving problems, and I have a hard time accepting "no" or "it can't be done" as an answer. This project was a good reminder of why. If you're determined and willing to keep trying, you can usually find a way.

It's also a reminder of how different writing code was not long ago. There was no ChatGPT, Codex or Claude Code to lean on, just a client deadline and Stack Overflow: old posts, and whatever the community had already figured out. Test it, break it, test it again. That loop came with a sense of accomplishment I think we've lost a little of today. Overall, it was a great experience, and one of the projects I'm proudest of.

Work with real ones: professionals who don't take "it can't be done" for an answer. If you need one, you know where to [find me](/contact). 😉
