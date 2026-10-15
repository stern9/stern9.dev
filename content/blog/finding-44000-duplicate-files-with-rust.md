---
title: "44,246 duplicate files: what a tiny Rust tool found in my code folder"
date: 2026-10-11
description: "dupes is a small Rust CLI that finds files with identical content. It checked 151,000 files in 2.5 seconds, and the biggest offender turned out to be Rust itself."
tags: ["rust", "cli", "side project"]
draft: false
---

After building [a tool that shows where my disk space goes](/blog/building-dirsize-a-disk-usage-tool-in-rust), I had a follow-up question: how much of that space is the exact same file, saved again and again?

So I built [dupes](https://github.com/stern9/dupes), a second small Rust tool. You point it at one or more folders and it reports every group of files with identical content, and how much space the extra copies waste:

```console
$ dupes --min-size 1000 photos backup docs
3 x 3.3 MiB (6.7 MiB reclaimable)  blake3:1e603129c34b
  backup/beach.jpg
  backup/old/IMG_0042.jpg
  photos/2024/beach.jpg

2 x 46.9 KiB (46.9 KiB reclaimable)  blake3:1649ee813ebd
  backup/report-final.pdf
  docs/report.pdf

3 duplicate files in 2 groups, 6.7 MiB reclaimable (6 files scanned)
```

It only reports. It never deletes, moves or changes anything. A tool that removes files on its own judgment is a tool I don't trust, even when I wrote it.

## The result first

I ran it on my whole code folder:

| | |
| --- | ---: |
| Files scanned | 151,197 |
| Duplicate files | **44,246** |
| Groups of identical files | 24,129 |
| Space wasted | **618.7 MiB** |
| Time | **2.5 seconds** |

Almost one in three files in that folder is a copy of another one. One particular file exists **394 times**.

## How to compare 151,000 files without reading them all

The naive approach is to read every file and compare it to every other file. That would take forever. The trick is to do the cheap check first.

1. **Group by size.** Two files of different sizes can't be identical. Asking for a file's size is nearly free, because it doesn't open the file.
2. **Hash only the candidates.** Files that share a size with at least one other file get read and fingerprinted with [BLAKE3](https://github.com/BLAKE3-team/BLAKE3), a very fast hash function.
3. **Group by hash.** Same size and same fingerprint means same content.

The first step is this small:

```rust title="src/lib.rs"
pub fn group_by_size(files: Vec<FileEntry>) -> HashMap<u64, Vec<PathBuf>> {
    let mut by_size: HashMap<u64, Vec<PathBuf>> = HashMap::new();
    for file in files {
        by_size.entry(file.size).or_default().push(file.path);
    }
    by_size
}
```

A file with a unique size is never even opened. On a folder of big, varied files, that is most of the work skipped.

> **LLM:** This is the part I would underline. The fastest way to read 151,000 files is to find a reason not to read most of them. It works on files. It also works on email.

## Hashing on every core

Hashing is the slow part, so it runs in parallel, using the same [rayon](https://crates.io/crates/rayon) library as `dirsize`:

```rust title="src/lib.rs" {3}
pub fn group_duplicates<H>(files: Vec<FileEntry>, hasher: H) -> (Vec<DuplicateGroup>, Vec<String>)
where
    H: Fn(&Path) -> io::Result<String> + Sync,
{
    // ...
    let hashed: Vec<(u64, PathBuf, io::Result<String>)> = candidates
        .into_par_iter()
        .map(|(size, path)| {
            let hash = hasher(&path);
            (size, path, hash)
        })
        .collect();
    // ...
}
```

This function shows two of my favorite things about Rust.

**The hash function is a parameter.** In production it's BLAKE3 reading real files. In the unit tests it's a fake that returns a canned answer per path, so the grouping logic gets tested without touching the disk. One of those tests proves that files with a unique size are never hashed at all, by passing a hasher that fails the test if it's called.

**The highlighted line is a contract the compiler enforces.** `Sync` means "this function is safe to call from several threads at once." If I passed in a hasher that secretly shared some unprotected state, the program would not compile. I don't have to remember to be careful. I'm not allowed to be careless.

## The details that make it honest

A duplicate finder that overstates the savings is worse than none. A few cases needed care:

- **Hard links.** Two names can point at the same file on disk. Deleting one of them frees nothing, so `dupes` counts that file once. It tells them apart by the file's device and inode numbers.
- **Overlapping paths.** `dupes . ./photos` reaches every photo twice. Those count once too.
- **Symlinks** are not followed, and **empty files** are skipped by default. Every empty file is identical to every other empty file, which is true and useless.
- **Unreadable files** become a warning on stderr. One locked file doesn't sink the run.

There is also a `--json` flag for scripting. To list every redundant copy, keeping the first of each group:

```bash
dupes --json | jq -r '.groups[].paths[1:][]'
```

## Plot twist: the culprit

The usual suspect for wasted space is `node_modules`. JavaScript projects are famous for it, and that folder holds several of them side by side. So I used the JSON output to check where the 618 MiB actually lives:

| Where the extra copies are | Share of wasted space |
| -------------------------- | --------------------: |
| Rust build folders (`target/`) | **46%** |
| `node_modules` | 45% |
| Next.js build output (`.next/`) | 2% |
| Everything else | 7% |

Rust, the language I spent the day praising, beat `node_modules` at its own game. By one point. With only two Rust projects on the machine.

It makes sense: each project compiles its own copy of the same dependencies, in both debug and release builds. The single biggest duplicate was on the JavaScript side, though: the TypeScript compiler binary, 22.6 MiB, installed three separate times.

> **LLM:** In Rust's defense, and partly in mine: an agent spent the whole day running `cargo build` in two folders, debug and release. Some of that 46% has my fingerprints on it.

## So, is Rust cool?

After two small tools, here's my honest list.

**What I loved**

- **Speed without trying.** 151,000 files in 2.5 seconds, and I never opened a profiler.
- **Parallel code that just works.** The compiler rules out data races before the program runs.
- **Errors you can't ignore.** `Result` makes the failure case part of the function's type.
- **One binary.** `cargo build --release` gives you a single file. No runtime to install, nothing to configure.
- **The tooling.** Formatter, linter, test runner and package manager, all in the box and all agreeing with each other.

**What costs you**

- **The learning curve is real.** Ownership and borrowing take a while to click, and until they do the compiler says no a lot.
- **Build folders are huge.** See the table above. `cargo clean` is your friend.
- **It asks for more up front.** For a ten-line script, Python is still faster to write.

For tools like these two, where correctness and speed both matter, it's a great trade. You pay at compile time, and you get the money back at 3 a.m. when nothing is on fire.

## What ended up in the repo

- About **490 lines** of Rust, again split into a library and a thin `main.rs`.
- **20 tests:** 8 unit tests on the grouping logic and 12 integration tests running the real binary on temporary folders.
- **CI** running the formatter, linter and tests on every push.

## A side note: this one was built by a second agent

While I was pairing with [Claude Code](https://claude.com/claude-code) on `dirsize`, a second agent built `dupes` in parallel from a written brief, in about three and a half minutes. Checking it took three commands: the formatter, the linter and the tests. Why that works so well in Rust is in [its own post](/blog/rust-for-ai-agents).

The code is on GitHub: [stern9/dupes](https://github.com/stern9/dupes). Run it on your own projects folder and see who your culprit is. If it's `node_modules`, nobody will be surprised. If it's Rust, welcome to the club.

Tuanis. 🦀
