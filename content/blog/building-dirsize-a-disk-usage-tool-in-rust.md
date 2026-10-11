---
title: "Where did my disk go? Building a disk usage tool in Rust"
date: 2026-10-10
description: "I installed Rust and built dirsize, a small CLI that shows what is eating your disk as a sorted tree. It reads 153,000 files in about a quarter of a second, and the compiler caught my mistakes before I could make them."
tags: ["rust", "cli", "side project"]
draft: false
---

Every developer laptop eventually asks the same question: where did all the disk space go? There are good tools for this already. I wanted to build my own anyway, as an excuse to write some Rust.

Rust wasn't even installed on my machine that morning. By the end of the day I had [dirsize](https://github.com/stern9/dirsize), a small command-line tool that walks a folder and prints what is using the space, largest first:

```console
$ dirsize . -n 3
 333.1 MiB ██████████ 100% ./
 333.0 MiB ██████████ 100% ├── target/
 285.7 MiB █████████░  86% │   ├── debug/
  47.3 MiB █░░░░░░░░░  14% │   ├── release/
   1.9 KiB ░░░░░░░░░░   0% │   ├── .rustc_info.json
     177 B ░░░░░░░░░░   0% │   └── (2 more)
  53.1 KiB ░░░░░░░░░░   0% ├── .git/
  13.0 KiB ░░░░░░░░░░   0% ├── Cargo.lock
  33.0 KiB ░░░░░░░░░░   0% └── (9 more)
```

Yes, the first thing my disk usage tool found was its own build folder. 333 MiB of compiler output for about 430 lines of code. Rust giveth disk speed, and Rust taketh disk space.

> **Random thought:** a `target/` folder is like the drawer every house has, the one full of plastic bags inside other plastic bags. Nobody knows how it got that big. Nobody is going to clean it today.

## Getting started took one command

Most languages hand you a compiler and wish you luck with the rest. Rust is one line from [rustup.rs](https://rustup.rs), and the whole toolchain comes in the box:

| Tool | What it does |
| ---- | ------------ |
| `cargo build` | compiles the project and its dependencies |
| `cargo test` | runs unit and integration tests |
| `cargo fmt` | formats the code, no config, no debates |
| `cargo clippy` | a linter that reads like a senior reviewer |

There is no choosing a bundler, a test runner, a formatter and a linter, then making them agree with each other. Coming from the JavaScript world, that felt like walking into a soda and getting the casado: rice, beans, salad, plátano maduro, all on one plate, no decisions required.

## The whole idea in one function

The tool does two things. `scan` walks the folder tree and adds up sizes. `render` turns that tree into text. That's it.

The scan is recursive: the size of a folder is the sum of everything inside it. Here is the heart of it, lightly trimmed:

```rust title="src/lib.rs" {2}
let results: Vec<(Option<Entry>, Vec<ScanError>)> = listing
    .into_par_iter()
    .map(|(child_path, child_name)| {
        match fs::symlink_metadata(&child_path) {
            Ok(meta) => {
                let (entry, errors) = scan_entry(&child_path, child_name, &meta);
                (Some(entry), errors)
            }
            Err(source) => (None, vec![ScanError { path: child_path, source }]),
        }
    })
    .collect();
```

Look at the highlighted line. With a normal iterator it would say `.into_iter()`, and the children of a folder would be read one at a time. Changing it to `.into_par_iter()`, from a library called [rayon](https://crates.io/crates/rayon), reads them **in parallel across every CPU core**. That one word is the entire multithreading story of this program.

## Why that one word is a big deal

In most languages, "make it parallel" is where the scary bugs live. Two threads touch the same list at the same time, and you get a crash that shows up once a month, only in production, only on Fridays.

Rust doesn't let that program compile. The compiler tracks who owns each piece of data and who is allowed to change it. If two threads could write to the same thing without protection, you get an error at build time, with an explanation and usually a suggested fix.

The obvious design is one shared list of errors that every thread pushes into. Rust's rules push you toward something simpler: each call **returns** its own errors, and the parent merges them. No locks, no shared state, nothing to get wrong.

> **Random thought:** the Rust compiler is like your mum at the door. "¿Ya comiste? ¿Llevás suéter? ¿Ese vector tiene dueño?" You are not leaving the house until everything is in order. And, al chile, she is right every single time.

## Errors are just values

Walk a real disk and you will hit folders you aren't allowed to read. I didn't want one locked folder to kill the whole scan.

Rust has no exceptions. A function that can fail returns a `Result`, which is either `Ok` with the value or `Err` with the problem, and the compiler makes you handle both. You can see it in the snippet above: the `match` has an arm for each case. Forgetting the failure case is not a runtime surprise, it's a compile error.

So in `dirsize`, an unreadable folder becomes a line on stderr, and the scan keeps going:

```console
dirsize: skipped ./locked: Permission denied (os error 13)
```

Only one thing is fatal: pointing it at a path that doesn't exist.

## The bug the compiler didn't catch

To be fair to the other side: Rust doesn't catch everything. Because `render` is a pure function (tree in, text out), I could test the exact output:

```rust title="src/lib.rs"
let expected = lines(&[
    "      1000 ██████████ 100% root/",
    "       800 ████████░░  80% ├── big/",
    "       600 ██████░░░░  60% │   ├── a.bin",
    "       200 ██░░░░░░░░  20% │   └── b.bin",
    "       100 █░░░░░░░░░  10% ├── medium.txt",
    "       100 █░░░░░░░░░  10% └── small.txt",
]);
assert_eq!(render(&sample(), &bytes_opts()), expected);
```

My first version of that test used one long multi-line string, and three tests failed. The code was fine. In Rust, a backslash at the end of a line inside a string swallows the leading spaces on the next line, so my carefully right-aligned numbers lost their padding. The compiler was happy. The tests were not. Diay, that's what tests are for.

## So, is it fast?

I ran it on my code sandbox folder: **5.3 GiB across about 153,000 files**, on an 18-core laptop.

| | |
| --- | ---: |
| `dirsize` | **0.27 s** |
| `du -sh` (the classic Unix tool) | 0.64 s |
| CPU cores `dirsize` kept busy | 16 of 18 |

Both runs were with a warm disk cache, so take it as a friendly comparison and not a lab benchmark. Still: a tool written in a day, in a language I had just installed, was more than twice as fast as a utility that has been tuned for decades. I didn't do anything clever. I changed one word.

(The two tools disagree slightly on the total, 5.3 versus 5.6 GiB. That's expected: `dirsize` adds up file lengths, while `du` counts blocks on disk.)

> **Random thought:** 0.27 seconds. That is less time than it takes someone in San José to say "me quedé dormido, voy saliendo" when they haven't showered yet.

## What ended up in the repo

- About **430 lines** of Rust: a library with the logic, and a thin `main.rs` that only parses arguments and prints.
- **Three dependencies:** `clap` for arguments, `rayon` for parallelism, `anyhow` for error messages.
- **17 tests:** 8 unit tests on the rendering, and 9 integration tests that run the real binary against a temporary folder.
- **CI on Linux and macOS** running the formatter, the linter and the tests on every push.

I built it pairing with [Claude Code](https://claude.com/claude-code), which was a good way to work: we agreed on the conventions first (pinned toolchain, no `unwrap()` outside tests, small commits) and wrote the code second. At this point, who even knows what's the best way to code with AI... well, that's a talk for another day. Ok AI, any random thought you want to add here? :)

> **Claude:** Since you asked. You know I get things wrong sometimes, and most languages let me find out in production, along with everyone else. Rust tells me in two seconds, points at the exact line, and usually suggests the fix. It's the only code reviewer I know that is never tired, never busy, and never says "looks good to me" without reading. Also, for the record: the plastic bag drawer joke was mine lol. Pura vida!

## A side note: Rust and AI agents

One thing I didn't plan to learn: Rust is a very good language to work on with an AI agent. The compiler, the linter and the tests give the agent the same fast, unambiguous feedback they give me, so "done" stops being an opinion and becomes three commands that pass. Mistakes that would hide quietly in a looser language get rejected before the code ever runs. I might need to read and learn a bit more of the language, also keep testing it out to write more about that.

## What I took away

- **The compiler is a teammate, not a gatekeeper.** It is strict, but the strictness is where the confidence comes from.
- **Parallelism can be boring.** One word, no locks, no fear.
- **Tooling matters as much as the language.** `cargo` made a new language feel familiar in an hour.

Next I wanted to know how much of that disk space was the same file saved over and over. That turned into a second tool, and a number I did not expect. More on that in the next post.

The code is on GitHub: [stern9/dirsize](https://github.com/stern9/dirsize). Go point it at your own disk. Pura vida. 🦀
