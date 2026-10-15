---
title: "Jev beat Claude Haiku on 72 decisions, 7 times faster, for two cents per thousand"
date: 2026-10-28
description: "I benchmarked TypeSafe's Jev against Claude on 72 labeled decisions. Jev: 94.4% at ~185 ms. Haiku 4.5: 91.7% at ~1.2 s. Opus 5: 98.6% at ~2.6 s, for over 300 times Jev's cost."
tags: ["ai", "benchmarks", "python", "side project"]
draft: true
---

After my [bank statement script](/blog/sorting-bank-statements-with-jev) worked, I had a bigger question. Jev sorted 305 emails without a single mistake I could find. But that was one task, on my own inbox, with no labels to check against. Is Jev good enough to replace an LLM for the routine decisions software makes all day? Routing a ticket. Flagging a scam. Grading an alert.

"It felt right" is not an answer. So I built [jev-bench](https://github.com/stern9/jev-bench), a small Python harness that asks Jev and Claude the exact same questions and scores them with the exact same code.

## Three tasks, three question types

Jev answers three kinds of typed questions: `choice` (pick one option), `noul` (yes or no, as a probability) and `score` (pick a level on an ordered scale). I wrote one task for each, so every question type gets tested:

| Task | Type | Examples | Decision |
| ---- | ---- | -------: | -------- |
| `support_routing` | choice | 26 | Which of 5 teams should handle a support ticket |
| `phishing_check` | noul (yes/no) | 24 | Is this message a phishing or scam attempt |
| `incident_severity` | score (0 to 3) | 22 | How severe is this production alert |

These are the decisions I see in real codebases. Each one is usually a regex, a pile of `if` statements, or an LLM call with a JSON parser bolted on. Each one also has a right answer I can label by hand. I added a few deliberately ambiguous examples to every task, because easy cases don't separate models.

A task is a JSON file with one question and its labeled examples. The loader turns it into a typed question, and the label must be valid for that question type, or the run refuses to start.

## Fair by construction

The whole point is that both sides get the same treatment.

- **Same questions.** Jev is called through `typesafe-sdk`. Claude is called through [`system-one-adapter`](https://github.com/typesafe-ai/system-one-adapter-python), a drop-in replacement for the same `system_one()` API backed by Claude's structured outputs. Claude never sees a different prompt.
- **Same scoring.** Both return the same response type, with a probability for every possible answer. One function scores all of them.
- **Same clock.** Latency is wall-clock time around each call, from the same laptop, network included.
- **Same cost formula.** Cost comes from the token usage each API reports, times its list price.

Here is the part of the runner that picks the backend. Everything after this line is shared:

```python title="jevbench/runner.py"
def make_caller(model: str, stack: ExitStack) -> Callable:
    if is_jev(model):
        client = stack.enter_context(TypeSafeClient(model=model))
        return lambda state, questions: client.system_one(state, questions)
    client = stack.enter_context(SystemOneAdapterClient(
        structured_outputs=True,
        llm_answer_mode="probabilities",
        normalize_probabilities=True,
        n_retry_malformed_structure=2,
        model=AnthropicProvider(model, max_tokens=16000),
    ))
    return lambda state, questions: client.system_one(state, questions)
```

Accuracy alone hides something I care about: whether a model knows when it is unsure. So the harness also measures calibration, two ways:

- **ECE** (expected calibration error): when the model says it is 80% sure, how far is that from how often it is actually right? 0 is perfect.
- **Brier score**: the squared error between the model's full set of probabilities and the true answer. Lower is better.

Calibration is what makes a threshold like "act if p ≥ 0.80, otherwise send to a human" mean something.

## The results

The run is from September 24, 2026. Three models: `jev-latest`, `claude-haiku-4-5` and `claude-opus-5`.

| | `jev-latest` | `claude-haiku-4-5` | `claude-opus-5` |
| --- | ---: | ---: | ---: |
| **Accuracy** (all 72) | **94.4%** | 91.7% | 98.6% |
| **p50 latency** | **~185 ms** | ~1.2 s | ~2.6 s |
| **$ per 1k decisions** | **~$0.02** | ~$0.82 | ~$6.40 |
| Speed vs Jev | 1x | ~7x slower | ~14x slower |

Per task, accuracy and median latency:

| Task | Jev | Haiku 4.5 | Opus 5 |
| ---- | --: | --------: | -----: |
| `support_routing` (choice, 5 teams) | 96.2% · 183 ms | 92.3% · 1,530 ms | 100% · 2,548 ms |
| `phishing_check` (yes/no) | 100% · 175 ms | 100% · 1,156 ms | 100% · 2,547 ms |
| `incident_severity` (score 0 to 3) | 86.4% · 193 ms | 81.8% · 1,524 ms | 95.5% · 2,926 ms |

None of the 216 calls failed or returned an unusable answer.

## What the numbers mean

**Jev vs Haiku is the fair fight.** Both are the "fast and cheap" option. Jev was more accurate on routing and severity and tied on phishing. It was about 7 times faster and about 50 times cheaper. On these tasks, I see no reason to pick Haiku over Jev.

**Opus is the ceiling.** It missed one decision out of 72. Jev missed four. Jev reached about 96% of Opus's accuracy at about 1/14 of the latency. The price gap is the big one: at ~$6.40 versus ~$0.02 per thousand, every Opus call costs more than 300 Jev calls.

> **LLM:** For the record, I am on both sides of this table. Opus earned that 98.6%, and it is the right call when one wrong answer is expensive. It is the wrong call for 50,000 support tickets a day. Paying 300 times more for three more correct answers out of 72 is a choice someone should make on purpose, not by default.

**Phishing was a three-way tie.** Every model got all 24 right. With a clear question and clear criteria, this task doesn't need a big model.

**Severity is where Jev lost ground.** It is the hardest task by design. Routing has five separate buckets. Severity has four levels on one scale, and the line between "low" and "medium" is a judgment call. All three of Jev's severity misses were one level off:

- A CPU spike on one of twelve web nodes, already drained by the load balancer. I labeled it low. Jev said medium.
- A disk at 72% on the logging server. I labeled it low. Jev said medium.
- An analytics dashboard counting yesterday's page views twice. I labeled it medium. Jev said low.

Two of those three came with a confidence of 0.59 or less. Jev wasn't wrong and sure. It was unsure, and it said so. That is exactly the case a threshold catches. Haiku missed four severity cases, two of them the same as Jev. Opus missed one: an SSO failure for a single enterprise customer, which it rated high instead of medium.

Calibration tells a second story. On routing, Jev had the best ECE of the three: 0.025. On severity, Jev had the best Brier score (0.167, versus 0.187 for Opus) even with lower accuracy. Opus was the most accurate on severity but the least calibrated, with an ECE of 0.243. It sounded less sure than its hit rate justified. If you build thresholds on Opus probabilities, you will send it work it could have handled.

Jev's one routing miss was a ticket that read "I updated my email address but I still get logged out every few minutes on Chrome." I labeled it technical. Jev said account, at 0.79. I can see the argument.

## Limits

This is a small benchmark, and I want the numbers read at their real size.

- **72 decisions.** One miss moves a task's accuracy by about 4 points. The gap between Jev and Haiku is two decisions.
- **One run.** I didn't repeat it. LLM answers vary between runs, and so does network latency.
- **One laptop.** Latency is end-to-end from one laptop, network included. Your numbers will differ.
- **Hand-labeled by me.** On severity, the labels are my opinion. Someone else could reasonably label a few of them one level up or down.
- **Default settings.** Claude ran with default settings through the adapter. Opus 5 used adaptive thinking. Both sides got the same questions, with no per-model prompt tuning.

Treat the results as directional. They say Jev is in the same league as Claude on structured decisions, at a different order of speed and cost. They don't say Jev is 2.7 points better than Haiku.

> **LLM:** The label point matters most. On severity, the models were partly graded on agreeing with one person about where "medium" starts. A miss there can be a model that disagrees, not a model that is wrong. A second labeler would tell you how much of that 86% is noise.

## When I would use which

- **Jev** for high-volume decisions with a fixed set of answers: routing, tagging, yes/no filters, triage. Use its probabilities with a threshold, and send the low-confidence cases to a person or a bigger model.
- **Opus** when a wrong answer costs real money or trust, the volume is low, and a few seconds is fine. Or as the second tier, only for the cases Jev isn't sure about.
- **Haiku**, for this kind of task, I wouldn't pick. Jev beat it on accuracy, speed and cost. Haiku still makes sense when the answer has to be text.

The setup I like best combines the first two. Jev answers everything in under 200 ms. Anything below the threshold goes to Opus. Most calls cost a fraction of a cent, and the hard ones still get the best model.

## Run it on your own decisions

My tasks are not your tasks. The repo is built so you can add yours: drop a JSON file with one question and your labeled examples into `tasks/`, add your API keys and run `jev-bench run`. Each run writes every call, with its probabilities, to `records.jsonl`, plus a `report.md` with the tables above.

The code is on GitHub: [stern9/jev-bench](https://github.com/stern9/jev-bench). If you run it on your own labeled set, I want to see the numbers. Pura vida.
