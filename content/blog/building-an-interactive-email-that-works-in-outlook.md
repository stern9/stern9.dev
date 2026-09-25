---
title: "Building an interactive email that still works in Outlook"
date: 2026-09-25
description: "A look back at a personalized, interactive email I built for a card-member campaign: a CSS-only carousel, AMPscript personalization and a fallback for every inbox."
tags: ["email", "html", "css", "case study"]
draft: true
---

<!--
  TODO before publishing (delete this comment when done):
  - Fill in every "TODO" below with your own details.
  - Check you're comfortable naming the client/agency (and that your agreement allows it).
    If not, swap the names for "a major credit card company" / "the agency I worked at".
  - Optional: add a screenshot with logos/card art blurred, in public/blog/building-an-interactive-email-that-works-in-outlook/
-->

Most web developers never have to think about Outlook's rendering engine. For a big part of my career, I did. This post looks back at one project I'm still proud of: an interactive, personalized email I built in late 2020 for American Express Business Gold Card Members while working at **TODO: company (Prodigious? and the agency, if any)**.

**TODO:** one or two sentences on your role (e.g. "I was the lead developer on the email team...") and who you worked with.

## The brief

The goal was education: help Card Members understand how to earn more Membership Rewards points with their card, and where those points could go. That meant a lot of content: several reward categories, each with its own visuals, in a single email that had to feel personal and look polished everywhere.

**TODO:** anything else about the goal, the audience or the constraints (timeline, send volume, number of variants).

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

**TODO:** any other personalization (dynamic content blocks per segment, and so on) you remember.

## How we tested it

**TODO:** your testing process, e.g. Litmus or Email on Acid previews, seed lists, device labs, QA rounds, and how many client/device combinations you checked.

## Results

**TODO:** anything you can share: engagement, click rate compared with the static version, awards, stakeholder feedback. If you can't share numbers, say what went well and what you'd do differently.

## What I took away

Email development taught me habits I still use building for the web:

- **Progressive enhancement for real.** Start with something that works everywhere, then layer on the fancy parts.
- **Test on the actual targets.** Assumptions about "how browsers work" don't survive contact with Outlook.
- **Fallbacks are features.** The empty-name case, the no-GIF case, the no-interactivity case: that's where quality shows.

**TODO:** a closing thought in your own voice, and maybe a line inviting people to [get in touch](/contact).
