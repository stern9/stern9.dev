---
title: "Jev against ten LLMs on 72 decisions: mid-pack on accuracy, far ahead on speed and cost"
date: 2026-10-15
description: "I benchmarked TypeSafe's Jev against Claude, GPT and local models on 72 labeled decisions. Jev: 94.4% at 171 ms and $0.017 per 1k. Two GPT models got all 72 right, at 13 times the latency and 80 to 400 times the cost."
tags: ["ai", "benchmarks", "python", "side project"]
draft: false
---

After my [bank statement script](/blog/sorting-bank-statements-with-jev) worked, I had a bigger question. Jev sorted 305 emails without a single mistake I could find. But that was one task, on my own inbox, with no labels to check against. Is Jev good enough to replace an LLM for the routine decisions software makes all day? Routing a ticket. Flagging a scam. Grading an alert.

"It felt right" is not an answer. So I built [jev-bench](https://github.com/stern9/jev-bench), a small Python harness that asks Jev and a set of LLMs the exact same questions and scores them with the exact same code.

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

The whole point is that every model gets the same treatment.

- **Same questions.** Jev is called through `typesafe-sdk`. Every LLM is called through [`system-one-adapter`](https://github.com/typesafe-ai/system-one-adapter-python), a drop-in replacement for the same `system_one()` API backed by the model's structured outputs. No model sees a different prompt.
- **Same scoring.** Every model returns the same response type, with a probability for every possible answer. One function scores all of them.
- **Same clock.** Latency is wall-clock time around each call, from the same laptop, network included.
- **Same cost formula.** Cost comes from the token usage each API reports, times its list price. Local models cost nothing per call.

Here is the part of the runner that picks the backend. Everything after this line is shared:

```python title="jevbench/runner.py"
def make_caller(model: str, stack: ExitStack) -> Callable:
    if is_jev(model):
        client = stack.enter_context(TypeSafeClient(model=model))
        return lambda state, questions: client.system_one(state, questions)
    client = stack.enter_context(SystemOneAdapterClient(
        # Native structured outputs reject very large choice schemas (e.g. 75 categories);
        # JEVBENCH_STRUCTURED_OUTPUTS=0 falls back to prompt-based JSON with retries.
        structured_outputs=os.environ.get("JEVBENCH_STRUCTURED_OUTPUTS", "1") != "0",
        llm_answer_mode="probabilities",
        normalize_probabilities=True,
        n_retry_malformed_structure=2,
        model=make_provider(model),
    ))
    return lambda state, questions: client.system_one(state, questions)
```

`make_provider` reads the model id: `openai:<id>` goes to the OpenAI API, `local:<id>` to a server on my own machine, and anything else to Claude.

Accuracy alone hides something I care about: whether a model knows when it is unsure. So the harness also measures calibration, two ways:

- **ECE** (expected calibration error): when the model says it is 80% sure, how far is that from how often it is actually right? 0 is perfect.
- **Brier score**: the squared error between the model's full set of probabilities and the true answer. Lower is better.

Calibration is what makes a threshold like "act if p ≥ 0.80, otherwise send to a human" mean something.

## The results

I ran this twice. The first run, on September 24, 2026, had three models: Jev, Claude Haiku 4.5 and Claude Opus 5. On October 14 I reran everything with the current Claude models and added three GPT models. The next day I added four local models that run on my laptop through LM Studio. The numbers below are from the October run: eleven models, 792 calls, and none of them failed or returned an unusable answer.

The API models, with Jev first as the baseline and then by accuracy:

| Model | Accuracy (of 72) | p50 latency | $ per 1k decisions | Speed vs Jev |
| --- | ---: | ---: | ---: | ---: |
| **`jev-latest`** | 94.4% (68) | **171 ms** | **$0.017** | 1x |
| `openai:gpt-6.1-sol` | **100%** (72) | 2.26 s | $1.31 | ~13x slower |
| `openai:gpt-6-astra` | **100%** (72) | 2.26 s | $6.67 | ~13x slower |
| `claude-opus-5-5` | 97.2% (70) | 2.12 s | $4.33 | ~12x slower |
| `openai:gpt-6-luna` | 97.2% (70) | 1.90 s | $0.073 | ~11x slower |
| `claude-haiku-5-5` | 95.8% (69) | 1.44 s | $0.12 | ~8x slower |
| `claude-sonnet-5-5` | 93.1% (67) | 1.68 s | $2.14 | ~10x slower |

Per task:

| Task | Jev | GPT-6.1 Sol | GPT-6 Astra | Opus 5.5 | GPT-6 Luna | Haiku 5.5 | Sonnet 5.5 |
| ---- | --: | --: | --: | --: | --: | --: | --: |
| `support_routing` (choice, 5 teams) | 96.2% | 100% | 100% | 96.2% | 100% | 96.2% | 92.3% |
| `phishing_check` (yes/no) | 100% | 100% | 100% | 100% | 100% | 100% | 100% |
| `incident_severity` (score 0 to 3) | 86.4% | 100% | 100% | 95.5% | 90.9% | 90.9% | 86.4% |

The local models, free to run, on an Apple M5 Pro with 48 GB:

| Model | Accuracy (of 72) | p50 latency | Routing | Phishing | Severity |
| --- | ---: | ---: | --: | --: | --: |
| `gemma-4-26b-a4b-it-mlx` | 97.2% (70) | 619 ms | 100% | 100% | 90.9% |
| `qwen3.6-27b-mlx` | 95.8% (69) | 3.61 s | 100% | 100% | 86.4% |
| `qwen3.6-35b-a3b-mlx` | 76.4% (55) | 597 ms | 88.5% | 70.8% | 68.2% |
| `google/gemma-4-e4b` | 70.8% (51) | 889 ms | 96.2% | 62.5% | 50.0% |

## What the numbers mean

**Speed and cost are Jev's edge.** Its median call took 171 ms. Its 95th percentile was 197 ms and its slowest single call 247 ms. That is 8 to 13 times faster than every API model here, and about 3.5 times faster than the quickest local one. Per decision it cost about 4 times less than the cheapest LLM (GPT-6 Luna) and about 400 times less than GPT-6 Astra.

**On accuracy, Jev is in the pack.** Most models landed between 67 and 70 right out of 72, Jev included, with 68. At this sample size a gap of one or two decisions is noise. Only GPT-6.1 Sol and GPT-6 Astra clearly stand out, with all 72 right.

**The fast Claude model caught up.** In the September run, Jev beat Haiku 4.5 by two decisions (68 against 66) and trailed only Opus 5 (71). Jev scored the same 68 in October. Haiku 5.5 scored 69. So I can no longer say Jev beats the cheap LLM on accuracy. What I can say is that Haiku 5.5 buys one more right answer for about 7 times the cost and 8 times the latency.

> **LLM:** Three rows in that table are me. Opus 5.5 got 70 of 72, two more than Jev, at about 257 times the cost per decision. That is the right call when one wrong answer is expensive. It is the wrong call for 50,000 support tickets a day. Paying that much for two more correct answers out of 72 is a choice someone should make on purpose, not by default.

**Phishing was a tie among the hosted models.** Every API model and the two larger local models got all 24 right. With a clear question and clear criteria, this task doesn't need a big model. It does need a capable one: the two weakest local models flagged ordinary messages as phishing.

**Severity is where Jev lost ground.** It is the hardest task by design. Routing has five separate buckets. Severity has four levels on one scale, and the line between "low" and "medium" is a judgment call. Every API model except Sol and Astra dropped one to three questions here. All three of Jev's severity misses were one level off, and they were the same three in both runs:

- A disk at 72% on the logging server. I labeled it low. Jev said medium, at 0.56.
- A CPU spike on one of twelve web nodes, already drained by the load balancer. I labeled it low. Jev said medium, at 0.78.
- An analytics dashboard counting yesterday's page views twice. I labeled it medium. Jev said low, at 0.58.

Two of the three came with a confidence under 0.6. Jev wasn't wrong and sure. It was unsure, and it said so. That is exactly the case a threshold catches.

The CPU spike deserves a second look. Seven of the eleven models called it medium, including Haiku 5.5, Sonnet 5.5 and GPT-6 Luna. When that many models disagree with one label, the label is the first suspect.

**Routing had one shared miss.** The ticket read "I updated my email address but I still get logged out every few minutes on Chrome." I labeled it technical. Jev said account, at 0.78. So did Haiku 5.5, Sonnet 5.5 and Opus 5.5. I can see the argument.

**Calibration tells a second story.** On routing, Jev's ECE was 0.025. That matches the GPT models (0.023 to 0.030) and beats every Claude model (0.08 to 0.13). On severity, the Claude models were the least calibrated of the API models, with an ECE between 0.15 and 0.25. Opus 5.5 was right 95.5% of the time on severity while reporting an average confidence of about 0.71. It sounded less sure than its hit rate justified. If you build thresholds on those probabilities, you will send it work it could have handled.

**Local models vary a lot.** Gemma 4 26B matched Opus 5.5 and GPT-6 Luna at 70 of 72, in 619 ms, for free. Qwen 3.6 35B was just as fast but got only 17 of 24 on phishing. The small Gemma 4 E4B handled routing and little else.

## Limits

This is a small benchmark, and I want the numbers read at their real size.

- **72 decisions.** One miss moves a task's accuracy by about 4 points. The gap between Jev and Haiku 5.5 is one decision.
- **One run per model.** LLM answers vary between runs, and so does network latency. Jev is the only model in both the September and October runs, and it scored 68 each time.
- **One laptop.** Latency is end-to-end from one laptop, network included. Local model speed depends entirely on the hardware. Your numbers will differ.
- **Hand-labeled by me.** On severity, the labels are my opinion. Someone else could reasonably label a few of them one level up or down.
- **Default settings.** Every LLM ran with its defaults, including default thinking and effort, with no per-model prompt tuning. Both Qwen models answered without thinking. Local servers only use the response schema to constrain the output, so the local backend also puts the schema in the system prompt.
- **List prices.** Costs use list prices as of October 14, 2026.

Treat the results as directional. They say Jev is in the same accuracy band as much larger models on structured decisions, at a different order of speed and cost. They don't say Haiku 5.5 is 1.4 points better than Jev.

> **LLM:** The label point matters most. On severity, the models were partly graded on agreeing with one person about where "medium" starts. A miss there can be a model that disagrees, not a model that is wrong. A second labeler would tell you how much of that 86% is noise.

## When I would use which

| If you need | Use | Why |
| --- | --- | --- |
| Decisions in the request path, at high volume | **Jev** | 171 ms and $0.017 per 1k, with accuracy in the same band as the LLMs |
| The best accuracy, and latency is fine | **GPT-6.1 Sol** | A perfect score at a fifth of Astra's price |
| Cheap API calls | **GPT-6 Luna** | Same accuracy band as Haiku 5.5, at about 60% of its cost |
| Free, private or offline | **Gemma 4 26B** | 97% at 0.6 s on a laptop, faster than any hosted LLM here |

The setup I like best combines the first two. Jev answers everything in about 170 ms and returns a probability with it. Anything below the threshold goes to a bigger model. Most calls cost a fraction of a cent, and the hard ones still get the best answer available.

## Run it on your own decisions

My tasks are not your tasks. The repo is built so you can add yours: drop a JSON file with one question and your labeled examples into `tasks/`, add your API keys and run `jev-bench run`. Each run writes every call, with its probabilities, to `records.jsonl`, plus a `report.md` with the tables above.

The code is on GitHub: [stern9/jev-bench](https://github.com/stern9/jev-bench). If you run it on your own labeled set, I want to see the numbers. Pura vida.
