---
title: "Building an interactive email that still works in Outlook"
date: 2026-08-11
description: "A look back at an interactive Thanksgiving quiz I built as an email for PlayStation: three questions, 27 answer combinations, zero JavaScript and a fallback for every inbox."
tags: ["email", "html", "css", "case study"]
draft: false
---

Most web developers never have to think about Outlook's rendering engine. For a big part of my career, I did. This post looks back at one project I'm still proud of: an interactive email I built for PlayStation for Thanksgiving 2019, while working with Digitas.

It was me against the clock. After a lot of planning, I told our project manager the interactive version was possible, and from that moment the deadline was real. Building the email was only half the job. For every client that couldn't handle the interactive parts, I also had to work out what it should show instead, and then propose those fallbacks so everyone could sign off on them. Ugh, email.

## The brief

The idea was a quiz, right inside the inbox: "What Thanksgiving gamer are you?" Three questions, three picture answers each:

1. What do you do while you're waiting for turkey?
2. How do you eat your pumpkin pie?
3. What are you most thankful for?

Pick your answers and the email tells you who you are: the Sports Fan, the Chill One, the Team Player or, if your answers are all over the place, the Omnivore Gamer. Then it points you to games to explore.

A lot of people had a say in it, on the agency side and on the client side, and every one of them had to be happy with how the email looked and behaved in every inbox, not just the best one.

## Constraint #1: no JavaScript, anywhere

In an inbox, JavaScript doesn't run. At all. So a quiz that reacts to your answers is off the table... unless you build it with CSS alone.

The trick is a set of hidden radio buttons and the `:checked` selector. Each picture answer is a `<label>` for a radio input. Each question is a radio group, so picking one answer unpicks the others for free. And CSS can show a result only when a certain combination is checked:

```html title="Simplified CSS-only quiz"
<input type="radio" name="q1" id="a1"><label for="a1">…</label>
<input type="radio" name="q1" id="a2"><label for="a2">…</label>

<input type="radio" name="q2" id="b1"><label for="b1">…</label>
<input type="radio" name="q2" id="b2"><label for="b2">…</label>

<div class="result sports">You're the Sports Fan</div>
<div class="result chill">You're the Chill One</div>
```

```css
.result { display: none; }

/* swap the picture when an answer is picked */
#a1:checked + label { background-image: url(a1-selected.jpg); }

/* show a result for a combination of answers */
#a1:checked ~ #b1:checked ~ .sports,
#a2:checked ~ #b2:checked ~ .chill { display: block; }
```

There is no logic anywhere, so every outcome has to be written out by hand. Three questions with three answers each is **27 combinations**, and each one is its own selector: 7 lead to the Sports Fan, 7 to the Chill One, 7 to the Team Player and 6 to the Omnivore. Another 27 hide the "Oops, it looks like you didn't take the quiz" message once you have answered everything.

Clients that support this (Apple Mail, iOS Mail and a few others) get a real interactive quiz. Everyone else needs something just as good, which leads to the harder part.

> **LLM:** A quiz engine made of 27 hand-written CSS selectors is exactly what I would flag as a hack in a code review, right up until someone told me JavaScript was not allowed. After that it's just engineering.

## Constraint #2: every inbox is a different browser

Email clients are wildly inconsistent. The same HTML goes to Outlook on Windows (which renders with Microsoft Word's engine), Gmail on the web, the Gmail app, Apple Mail, Yahoo and more. The final build ended up with:

- **Tables for layout.** 83 of them, nested. Flexbox and grid aren't an option when Outlook is in the audience.
- **Outlook-only code paths.** 32 conditional comments (`<!--[if mso]>`) to give desktop Outlook its own markup.
- **Two versions in one email.** The interactive quiz and a static one both ship in the same HTML, and CSS decides which one you see.
- **Client-specific switches.** A WebKit-only media query turns the quiz on. Then separate rules turn it back off for the clients that pass that test but still break it: Gmail (`u + .body`), Yahoo (`@media screen yahoo`), Outlook.com (which renames your classes with an `x_` prefix) and the Outlook mobile app (`body[data-outlook-cycle]`).
- **Graceful media.** An animated GIF hero with a static JPG fallback, and mobile layouts below a 579px breakpoint.

```css title="Turning the quiz on, then off again"
/* default: everyone gets the static version */
.webkit { display: none; }

/* WebKit clients get the interactive one */
@media screen and (-webkit-min-device-pixel-ratio: 0) {
  .webkit { display: block !important; }
  .non-webkit { display: none !important; }
}

/* ...except the ones that can't handle it */
u + .body .nogmail { display: none !important; }
body[data-outlook-cycle] .webkit { display: none !important; }
```

My favorite part is the static version. Without interactivity, the email can't know what you picked. So the fallback works like a magazine quiz: each answer has a color, and the results read "Mostly orange answers? You're the Sports Fan." You count your own answers. Same quiz, same payoff, no CSS tricks required.

The rule I followed: **the interactive version is a bonus, never a requirement.** Every reader had to get the full experience, whatever opened it.

> **LLM:** Speaking as something that gets asked to "just make it interactive" a lot: the magazine-quiz fallback is the smartest thing in this email. The fancy version makes the inbox do the counting. The plain version hands the counting to the reader, and nobody feels like they got the lesser email.

## Constraint #3: one email, two countries

The email was sent through Salesforce Marketing Cloud, which uses a templating language called AMPscript. The same send went to players in the United States and in Canada, and not everything applied to both. So part of the email is wrapped in a condition:

```text title="AMPscript (simplified)"
%%[IF country_code == "CA" THEN]%%
  …the version for Canada…
%%[ELSE]%%
  …the version for everyone else…
%%[ENDIF]%%
```

It looks small, but it doubles what you have to test. Every inbox now has two versions of the email, and each of those has an interactive and a static form.

## How we tested it

Nothing reached a real inbox until it had cleared three gates:

1. **Internal QA** on the agency side: previews in Litmus and Email on Acid, plus a bunch of real phones, tablets and desktops.
2. **A client review pass.**
3. **Dogfooding**: the stakeholders themselves received the email on their own devices before the real send, Windows machines running desktop Outlook included.

That last one mattered. Previews are useful, but nothing humbles you like desktop Outlook on a real Windows PC, still rendering email with Word's layout engine.

Each round was a chance to catch a client that rendered something differently, or a fallback that didn't hold up.

## Results

I don't have send numbers to share, but the project did what it set out to do. The email passed every QA round, and the stakeholders loved it. The client was happy, and so was I, given where the timeline started.

## What I took away

Email development taught me habits I still use building software and working in huge codebases:

- **Progressive enhancement for real.** Start with something that works everywhere, then layer on the fancy parts.
- **Test on the actual targets.** Assumptions about "how browsers work" don't survive contact with Outlook.
- **Fallbacks are features.** The didn't-take-the-quiz case, the no-GIF case, the no-interactivity case: that's where quality shows.

I like solving problems, and I have a hard time accepting "no" or "it can't be done" as an answer. This project was a good reminder of why. If you're determined and willing to keep trying, you can usually find a way.

It's also a reminder of how different writing code was not long ago. There was no ChatGPT, Codex or Claude Code to lean on, just a client deadline and Stack Overflow: old posts, and whatever the community had already figured out. Test it, break it, test it again. That loop came with a sense of accomplishment I think we've lost a little of today. Overall, it was a great experience, and one of the projects I'm proudest of.

Today a couple of agents would probably knock it out in minutes, and yes, probably cleaner. But somebody had to work out that it was possible in the first place, and that part doesn't come from a prompt. Is any of this still relevant? No idea. Judging by the speed at which email development moves, probably yes.

> **LLM:** Credit where it's due. 27 hand-written selectors, 83 tables and a fallback for every inbox, built in 2019 by one person with a deadline and Stack Overflow. I wasn't around yet, so none of this is mine. And "probably cleaner" is generous: Outlook's rendering still trips me up today.

Work with real ones: professionals who don't take "it can't be done" for an answer. If you need one, you know where to [find me](/contact). 😉
