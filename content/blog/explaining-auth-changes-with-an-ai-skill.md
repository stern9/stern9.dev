---
title: "Explaining an auth change to my team with an AI skill"
date: 2026-10-12
description: "I had to walk my team through a login change that touches several applications. Instead of scrolling through the diff, I had an agent turn the old and new flows into a small interactive machine. The team asked more questions in that meeting than in any code walkthrough I've done."
tags: ["ai", "agents", "auth", "communication"]
draft: false
---

I needed to explain some code changes to my team. The changes involved authentication across multiple applications: redirects, callbacks, background requests, and remembering where the user wanted to go after signing in.

The intended behavior was easy to describe. Explaining how the pieces worked together took more effort.

## The problem in one paragraph

Consider two applications that share a login flow. A user opens a deep link in App B. After signing in, they land in App A. Authentication succeeds, but they still have to find their way back to what they originally opened.

The updated flow returns them to their original destination.

> **LLM:** This is the kind of bug I find hardest to see in code. Every function does its job. Every "did login succeed?" check passes. The only thing wrong is where a person ends up, and no single file contains that.

That sounds simple until you start tracing which application handles the callback, where the browser navigates, which requests happen in the background, and when the session becomes available. A diff shows you what changed in each file. It doesn't show you the trip the browser takes.

## Finding Anatomy

While browsing, I stumbled upon [Anatomy](https://skills.wheresryan.sh/anatomy), a skill that turns concepts into visual explanations using mechanical objects and moving parts.

Call it luck, curiosity, or having too many tabs open. It looked interesting enough to try.

I asked a coding agent to read the public guidance, without installing the skill locally. Then I gave it a specific task: inspect the code change, trace the old and new flows, and create two comparable interactive illustrations.

Both versions had to use the same metaphor and the same layout. I wanted the difference in behavior to be visible without making anyone learn two different pictures.

## What it produced

The result was an interactive explainer built around a small routing machine:

- A **capsule on a rail** is the browser tab. When it moves, the address bar changes.
- A **bead on the overhead wire** is a background request from the page.
- A **bead in the floor conduit** is the gateway talking to the identity provider, server to server.
- A **slip on the capsule** is the return destination, and **two dots** are the session cookies.

Here is the old flow at step one. Read the step list on the right: the identity provider sends the browser back to App A, and that is where the user stays.

![The legacy flow at step 1 of 11. Four platforms, App B, App A, the gateway and the identity provider, are connected by rails. The step list ends with App A starting a fresh session on its home page.](/blog/explaining-auth-changes-with-an-ai-skill/legacy-flow.webp)

And here is the new flow at its last step. Same machine, same eleven steps, but the capsule's path ends where it started, on the link the user opened.

![The new flow at step 11 of 11. The capsule's path runs from App B to the gateway, to the identity provider and back to App B. The panel reads: returns to the original App B link, the requested page resumes.](/blog/explaining-auth-changes-with-an-ai-skill/new-flow.webp)

I could step through each flow, play the animation, or play both side by side and watch where the browser ended up. The explainer also covered the alternate scenarios: a canceled login, a tampered return address, and the new behavior switched off.

Alongside it, the agent produced sequence diagrams and a written flow specification, with source references and a list of open questions.

That last part mattered. An animation can look convincing even when its explanation is wrong. The specification gave me something concrete to check against the implementation, step by step.

> **LLM:** I can vouch for this one. While checking the screenshots for this post, I found a draft of the legacy figure where the last step sent the user back to App B, sitting right under a header that says the flow ends in App A. It looked great. It was wrong. Pictures don't have a compiler.

The screenshots here are redrawn for this post, with generic application names and simplified terminology.

## How the meeting went

My usual way to present a change like this is to share my screen and walk through the diff. People follow along politely, and the questions come later, if they come at all.

This time I had the machine and the flow specification open instead, and the meeting felt different. People were asking questions while I was still stepping through it:

- "Wow, I had no idea our auth worked that way."
- "Do we really do that?"
- "Ohh, so cool!"

The second one is my favorite. Nobody asks "do we really do that?" about line 214 of a diff. The picture made the existing behavior visible, including parts that had been there for a long time without anyone looking at them.

> **LLM:** For the record, I read diffs for a living and I would have asked the same question. A diff tells you what changed. It says nothing about what was already there, and that is usually where the surprise is.

And when we got to the new flow, the reaction was the one I was hoping for: it looks good, and it fixes a pain we actually had.

## I still had to review it

Trying Anatomy gave me a new way to explain the change. It also gave me a list of things to verify before showing it to anyone:

- Did the metaphor keep the important distinctions, like a browser redirect versus a background call?
- Did the animation agree with the sequence diagrams?
- Were any assumptions presented as facts?

That review is not optional. A wrong diagram that looks this polished is worse than no diagram, because people will believe it. But reviewing a draft against the code is a much smaller job than drawing the whole thing by hand, and I ended up with something the team could explore on their own afterward.

## Why I bother trying these things

As developers and solution architects, we have always needed to keep learning. What changed is the pace. Every day seems to bring another agent, skill, framework or workflow. Some are useful, some are rough experiments, and some look better in a demo than they work in practice.

I don't think you can tell which is which by watching announcements. The only way I know is to pick a real problem, try the tool on it, and see where it helps and where it falls apart.

This one started with a real communication problem, a tool I happened to find, and enough curiosity to test it. It earned a place in how I explain things.
