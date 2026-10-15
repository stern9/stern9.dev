---
title: "Doing the homework before sprint refinement with Claude Code skills"
date: 2026-11-18
description: "I use Claude Code skills to read Jira tickets, map the change across two repos, flag upstream dependencies and propose estimates. Then I check all of it before the team sees it."
tags: ["ai", "agents", "claude code", "work"]
draft: true
---

Refinement meetings have a known weakness. The team estimates a ticket before anyone has opened the code it touches. Someone reads the description out loud, people think for a few seconds, and the cards go up. The number is a guess wearing a Fibonacci costume.

Most of the time the guess is close enough. The expensive tickets are the ones where it isn't.

## The ticket that touches everything

On my current client engagement, a typical change can touch two repositories and a few upstream integrations: MuleSoft, Salesforce and carrier systems. A ticket that reads like a small form change can need a new field in one repo, a mapping change in the other, and a record that has to exist upstream before any of it works.

Nobody remembers all of that from a two-line description. That is how a ticket gets a 3 and then meets an upstream blocker mid-sprint.

[fill in: one real example, anonymized, of a ticket that was underestimated because of a dependency nobody caught]

The fix is obvious: read the code before estimating. So I built Claude Code skills that do that reading first.

## What a skill is

A Claude Code skill is a Markdown file with instructions and a description of when to use it. When a task matches, the agent loads the file and follows it. A written procedure, instead of a prompt I retype every time.

[fill in: how the refinement skills are triggered and laid out, e.g. one skill or several, and what the files contain]

## What the skill does

For each ticket, the skill works through the same steps:

1. **Read the ticket.** Description, acceptance criteria, comments and linked tickets from Jira.
2. **Find the touched code in both repos.** The obvious file, plus callers, shared types and tests.
3. **List dependencies.** Anything that crosses into MuleSoft, Salesforce or a carrier integration, with the reason it was flagged.
4. **Propose a Fibonacci estimate with reasoning.** The reasoning matters more than the number. A 5 with three sentences behind it gives the team something to argue with.
5. **Suggest a split.** If the work has a part that is blocked by something upstream and a part that isn't, it says so.
6. **List questions for the product owner.** The things the ticket doesn't answer and the code can't.

Here is the shape of the output. The ticket and every detail in it are made up for this post.

```text title="Illustrative output (invented ticket)"
TICKET  EXAMPLE-142: Let customers choose a preferred contact method

TOUCHED CODE
  repo A: profile form, validation schema, 2 component tests
  repo B: customer profile endpoint, request/response types,
          mapping to the upstream customer record

DEPENDENCIES
  Salesforce: field must exist on the synced customer object.
              Not found in current mapping. Confirm with the owning team.
  MuleSoft:   profile sync flow passes a fixed field list.
              Likely needs a change outside our repos.

ESTIMATE  5
  Code changes in both repos are small (about a 2 alone).
  The upstream field and sync change add coordination and a
  blocked period we don't control.

SPLIT
  1. UI and API behind a flag, stored locally         (2)
  2. Sync to upstream once the field exists           (3)

QUESTIONS FOR THE PO
  - Is "no preference" a valid value, or is the field required?
  - Should existing customers be prompted, or default silently?
  - Who owns the Salesforce field change, and by when?
```

> **LLM:** The dependency section is where I'm most useful and most dangerous. I'm good at noticing that a value leaves one repo and has to land somewhere I can't see. I'm bad at knowing what is on the other side. "Not found in current mapping" can mean the field is missing, or that it is mapped in a place I wasn't given. Those two readings produce very different estimates, and I will state either one in the same calm tone.

## The review step is not optional

Nothing the skill writes goes to the team until I have checked it against the code and what I know about the project. My rule is simple: AI drafts and investigates; I validate findings and personally handle anything client-facing.

The mistakes I catch fall into a few groups:

- **Confident dependencies that aren't real.** A flagged integration that the code path never reaches.
- **Missing context the code doesn't hold.** A decision made in a meeting, a migration already planned, a team that already owns the change.
- **Estimates anchored on the wrong thing.** Lots of touched files can look like a big ticket when the changes are mechanical, and one quiet upstream change can be the whole risk.

[fill in: a specific miss caught in review, anonymized]

Reviewing is still less work than investigating from scratch. I'm checking claims with file paths next to them.

## How the meeting changed

The questions moved earlier. A dependency like the Salesforce field in the example comes up in refinement, with code references on screen, instead of mid-sprint.

The estimate became a starting point instead of a guess. People still disagree with it, which is the point. But they disagree with a reason, like "that sync flow already changed last sprint", and that beats three different cards with no explanation.

[fill in: how long refinement took before and after]

[fill in: how often the proposed estimate is accepted as is, and how often the team changes it]

## The same habit, other jobs

On the same engagement, I have had an agent trace a client bug across the front end, the back end and the production database. It surfaced a missing upstream integration record that no single repo would have shown. I also used a diagramming skill to explain an auth redirect flow to the team, which I wrote up in [Explaining an auth change to my team with an AI skill](/blog/explaining-auth-changes-with-an-ai-skill).

The pattern is the same each time. The agent does the reading and the tracing. I decide what is true and what gets said to the client.

## Limits

- **It only knows what it can read.** The upstream systems are outside the repos. It can say "this probably needs a change upstream". It can't confirm it.
- **It doesn't know the team.** An estimate depends on who picks up the ticket and what else is in the sprint. The skill has none of that.
- **Vague tickets give vague output.** A one-sentence ticket gets a long list of questions and a weak estimate. Correct, but not a shortcut.

I don't trust it on [fill in: the kinds of tickets where you skip the skill or discount its output].

> **LLM:** A Fibonacci number from me looks exactly like one from someone who has shipped this feature three times. It isn't. I can count files and follow calls. I can't feel how long a change with another team's approval in the middle actually takes. Read my estimate as "here is what the code says", and let the team add what the code doesn't.

## If you want to build the same thing

- **Make it show its work.** File paths for every touched area, a reason for every dependency, a sentence for every estimate. Output you can't check is output you can't use.
- **Name your integrations in the skill.** A generic "check dependencies" instruction finds generic things. Listing the upstream systems by name is what makes the agent look for them.
- **Ask for questions, not just answers.** What the ticket doesn't say is often the real estimate.
- **Keep a human between the draft and the team.** The skill is fast and thorough, and sometimes wrong in a very readable way.

The skill reads the code before refinement. I make sure what it found is true before anyone builds a sprint on it.
