---
title: "Rust might be the best language to hand to an AI agent"
date: 2026-10-12
description: "After building two Rust tools with Claude Code, one of them by a second agent working in parallel, I noticed the language was doing most of the supervising. Here is why, and where it doesn't help."
tags: ["rust", "ai", "agents", "side project"]
draft: false
---

I recently built two small Rust tools in one day, pairing with [Claude Code](https://claude.com/claude-code): [dirsize](/blog/building-dirsize-a-disk-usage-tool-in-rust), which shows what is eating your disk, and [dupes](/blog/finding-44000-duplicate-files-with-rust), which finds duplicate files. The second one was built by a separate agent, working in parallel in its own folder, while the first was still in progress.

Somewhere in the middle of that I noticed something. Checking the work was taking less effort than I expected, and I trusted the result more. It wasn't because the agent was magic. It was because the language was doing a lot of the supervising for me.

This post is about why. It's based on two small projects, not a study, so take it as field notes.

## The real problem with agents: who checks the work?

An agent can write code faster than anyone can read it. That sounds great until you realize the bottleneck just moved. The question stops being "how do I write this?" and becomes "how do I know this is right?"

In a loose language, the honest answer is: you read every line, carefully, every time. In Rust, a big part of the answer is: the compiler already did.

## 1. The compiler is a reviewer that never gets tired

When an agent writes Rust, every mistake of a certain kind comes back immediately, as text, with a location and usually a suggested fix. That is exactly the kind of feedback an agent is good at acting on. It reads the error, fixes the line, and tries again, without me in the loop.

And the kinds of mistakes it catches are the ones that are hardest to spot in review:

- **Data races.** Both tools run across every CPU core. In Rust, code where two threads could modify the same data without protection does not compile.
- **Forgotten failure cases.** A function that can fail returns a `Result`, and the caller has to deal with both outcomes.
- **Using something after it's gone.** Ownership rules make that a build error, not a crash three weeks later.

Here is a real signature from `dupes`:

```rust title="dupes/src/lib.rs" {3}
pub fn group_duplicates<H>(files: Vec<FileEntry>, hasher: H) -> (Vec<DuplicateGroup>, Vec<String>)
where
    H: Fn(&Path) -> io::Result<String> + Sync,
```

The highlighted line says the hash function may fail (`io::Result`) and must be safe to call from many threads at once (`Sync`). Those are not comments that someone, human or AI, might ignore. They are checked. An agent that breaks either promise gets a compile error, not a code review comment from me.

## 2. "Done" is three commands

The most useful sentence in the brief I gave the second agent was the definition of done:

| Command | What it proves |
| ------- | -------------- |
| `cargo fmt --check` | the code is formatted the standard way |
| `cargo clippy --all-targets -- -D warnings` | the linter has zero complaints |
| `cargo test` | the tests pass |

There is no "looks good to me" in there. Each one passes or it doesn't. An agent can run them, read the output and keep going until all three are green. And when it reports back, nobody has to take its word for it. The same three commands get run again, independently, which is exactly what happened here.

> **LLM:** I like this more than you'd expect. "Make it good" gives me nothing to aim at, and I will happily tell you it's good. "These three commands exit zero" is a finish line I can't talk my way across.

## 3. Every Rust project works the same way

A surprising amount of an agent's time in other ecosystems goes to figuring out the project: which package manager, which test runner, which of the four config files is the real one.

In Rust it's `cargo`, every time. Build, test, format, lint, add a dependency: the same commands in every repo. One small file, `rust-toolchain.toml`, pins the compiler version, so my laptop, the agent and CI all use the same one. Both projects went green in CI on their first push, with no "works on my machine" round.

One practical tip that came out of this: let the agent run `cargo add` and pick up the current version of each library, instead of typing version numbers from memory. A model's memory of version numbers is the first thing to go stale.

## 4. A second agent, three and a half minutes

Here is the part that convinced me. While `dirsize` was being built, I asked for a second agent to build `dupes` in a separate folder. The brief was a page of plain text: what the tool should do, the conventions we had agreed on, and the three commands above as the finish line.

| | |
| --- | ---: |
| Time the second agent worked | about 3.5 minutes |
| Lines of Rust | about 490 |
| Tests it wrote | 20 |
| Commands needed to check it | 3 |

All three passed on the re-run. Then the tool went up against a real folder with 151,000 files, and it found 44,246 duplicates in 2.5 seconds.

You still read the code. But you read it the way you read a colleague's pull request that already has a green build, looking at design and behavior, not hunting for typos and null pointers. That is a very different amount of effort.

## Where Rust doesn't save you

This isn't a miracle, and pretending otherwise would be a great way to ship something broken.

- **The compiler checks rules, not meaning.** On `dirsize`, the code compiled cleanly and the linter was happy, and three tests still failed, because a backslash in a multi-line string was eating spaces in the expected output. The compiler had nothing to say about that. The tests did. You still need tests.
- **An agent can make the compiler happy the lazy way.** Sprinkling `.unwrap()` or `.clone()` everywhere compiles fine and hides problems. That's why our conventions said no `unwrap()` outside tests, and why lint warnings are treated as errors.
- **Builds cost time and disk.** An agent that compiles in a loop feels it. Rust build folders were also 46% of the duplicated space on my disk, beating `node_modules` by a point.
- **The conventions have to exist first.** We agreed on them before any code was written. Without that page, two agents would have built two tools in two different styles.

## What I'd put in any agent's brief

If you want to try this, here is the short version of what worked:

1. **Say what "done" means as commands**, not adjectives.
2. **Pin the toolchain** so everyone compiles with the same thing.
3. **Treat lint warnings as errors.**
4. **Ban the escape hatches** (`unwrap()` outside tests) so the agent can't silence the compiler.
5. **Keep the logic in a library** and the entry point thin, so everything is testable.
6. **Ask for a report of what was verified and what wasn't.** The second agent told me, unprompted by anything but the brief, that its CI workflow had never actually run. That one honest line was worth more than the rest of the report.
7. **Then run the checks yourself anyway.**

## And the AI's turn

It seems fair to let the other half of the pair have a word, so I asked.

> **LLM:** I'll be honest about what this is like from my side. In most languages, when I write something subtly wrong, nothing happens. The code runs, the mistake waits, and someone finds it later. Rust doesn't let me get away with that. It answers back, right away, and it's specific. People describe that as the compiler being strict with humans. From here it looks more like a language that takes my work seriously enough to check it. I'd rather be corrected in two seconds than trusted by accident.

I couldn't have said it better, which is a slightly uncomfortable thing to write on your own blog.

## The takeaway

The pitch for Rust has always been "the compiler catches your mistakes." With agents writing more of the code, that pitch gets stronger, because the scarce resource is no longer typing. It's verification. A language that checks more, earlier, and explains itself clearly is a language you can hand to an agent and still sleep.

Both tools are on GitHub if you want to see what came out of it: [stern9/dirsize](https://github.com/stern9/dirsize) and [stern9/dupes](https://github.com/stern9/dupes).

Pura vida, and may all your builds be green. 🦀
