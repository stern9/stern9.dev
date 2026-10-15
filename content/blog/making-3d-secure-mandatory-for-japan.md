---
title: "Making 3D Secure mandatory for one country and not the other"
date: 2026-11-04
description: "A consumer subscription platform had to require 3D Secure for Japan users while US checkout stayed the same. How I designed it across web, mobile and backend, and how the release went."
tags: ["case study", "payments", "stripe", "work"]
draft: true
---

From late 2023 to early 2026 I worked as a Senior Full Stack Engineer at Gorilla Logic, embedded on the client team of a consumer subscription platform serving the US and Japan. I worked day to day with engineers in both countries. I owned the auth and payment flows on Stripe, and I led the work that made 3D Secure mandatory for Japan users.

I'm keeping the details generic on purpose. The client's systems are private, and the interesting part is the shape of the problem, not the names.

## The problem in one paragraph

Japan moved e-commerce merchants to EMV 3-D Secure: under the Credit Card Security Guidelines published with Japan's Ministry of Economy, Trade and Industry and the Japan Consumer Credit Association, card-not-present merchants were expected to have it in place by the end of March 2025 `[confirm: regulatory driver and date]`. The US has no equivalent rule, and adding a challenge step to a US checkout would only cost conversions. So the requirement applied to one market and not the other. That sounds like a feature flag. It isn't. A flag decides whether to ask for 3DS. It does nothing about the checkout that now pauses halfway, the mobile app that has to show a bank's page, the renewal that runs while nobody is looking, or the Japanese text on a screen the team had never had to design.

## What 3D Secure changes in a checkout

Without 3DS, a card payment is a single round trip. The client sends card details, the backend asks Stripe to charge, and the answer is yes or no.

With 3DS, the card issuer gets a vote. It may approve silently, or it may challenge the customer: a one-time code, a banking app prompt, a password page. In Stripe's terms, the payment comes back with a status of `requires_action` instead of succeeded or failed.

That one status changes three things:

- **The flow becomes asynchronous.** The payment is not finished when the API call returns. It is finished when the customer completes the challenge, abandons it, or fails it.
- **Every client has to handle it.** The web app and the Flutter app both need to show the challenge, wait for it, and resume. A client that treats `requires_action` as an error turns a valid payment into a failed one.
- **The backend can't assume success.** Whatever runs after a successful payment, like activating a subscription, has to wait for the confirmed outcome, not the first response.

> **LLM:** When I read checkout code, the first thing I look for is how it handles `requires_action`. Most code written before 3DS has two branches, success and failure, and the third state falls into one of them by accident. Usually it lands in failure, and the customer sees "card declined" for a card that was fine.

## The design

Four decisions shaped the work.

**Market-based gating.** The rule had to follow the user's market, not the device or the browser language. A Japanese speaker in the US and an English speaker in Japan had to land on the right side of it. We decided market from `[fill in: the signal used to decide a user's market, e.g. account region or billing country, and why]`. Wherever that decision lives, web and mobile have to read the same answer, or they will disagree about who gets challenged.

**Existing subscribers and saved cards.** New signups were the easy case. The harder question was everyone already paying with a card saved before the change. A renewal runs without the customer present, so there is nobody to complete a challenge at that moment. `[fill in: what was decided for existing Japan subscribers and saved cards, e.g. re-authentication on next card update or at renewal, and how they were told]`.

**The challenge UX in two languages.** The web side used next-i18next and the Flutter app used Flutter intl, both for EN-US and JA-JP. The challenge page itself comes from the issuer. Everything around it was ours: the explanation before the redirect, the waiting state, the message after an abandoned or failed challenge, and the retry path. Each of those needed copy in both languages. A Japanese user who sees an English error in the middle of a bank verification has a good reason to stop.

**Web and Flutter parity.** Two clients meant two implementations of the same states: not required, required and pending, challenged, succeeded, failed, abandoned. Both had to handle every one. When one client handles a state the other doesn't, you want to find it as a missing row in a list, not as a bug report from Japan.

## The rollout

I owned production releases for the web apps. For this one, that meant coordinating scope and timing with QA, product, the client and the dev team, and then running it from build through deploy and post-release verification.

The test matrix had to cover both markets, both languages, web and mobile, and each challenge outcome. Stripe's 3DS test cards make those outcomes reproducible. Product and the client had to agree on the copy and on what existing subscribers would see.

The deploy was staged: `[fill in: the order of the rollout, e.g. backend first, then web, then mobile, and the gap between stages]`. Released on `[fill in: release date]`.

Post-release verification had to go in both directions: Japan checkouts reaching the challenge and completing, and US checkout unchanged. Then we watched telemetry: `[fill in: the metrics watched after release, e.g. payment success rate by market, requires_action rate, abandoned challenges, and what they showed]`.

## What went wrong, or surprised me

`[fill in: the specific failure or surprise during build or rollout, and how it was found]`.

The general lesson I took from the project is that the state machine is the product. The flag, the Stripe call and the challenge screen were each small. Most of the work was making sure every state had an owner on every client, in both languages, and that the backend never acted on a payment before it was confirmed.

## What I would do again

**Treat the payment states as the spec.** The list of states drives the parity work, the test matrix and the copy. It also gives product and the client something concrete to agree on.

**Decide the market in one place.** One source of truth means one place to test and one place to change.

**Put payment configuration through review.** On this team, Stripe coupon codes, CI/CD pipelines and telemetry were managed as Terraform code. Promotions and pipeline changes went through pull requests instead of dashboards. That habit mattered here. When a change touches how people pay, I want a diff someone else has read, not a setting someone clicked.

**Own the release end to end.** Coordinating QA, product, the client and the dev team is slower than shipping a merge. It is also the only way I know to find out, before Japan finds out, that someone had a different idea of what "done" meant.

> **LLM:** I helped draft this post, and I left the gaps as visible markers instead of filling them in. A payments case study with a plausible invented number is worse than one with a blank, because a reader can't tell which is which. The markers are where only Avram's memory of the project is good enough.

## What still had to be checked

A post like this is easy to make sound tidier than the work was. Before publishing, I still need to confirm that the regulatory deadline above is the one that drove this project, and fill in the marked details.
