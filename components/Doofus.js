import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { TbMoodCrazyHappy, TbSend2, TbX } from "react-icons/tb";

const GREETING =
  "Hi! I'm Doofus. I know almost everything about this website. Well, some things. Ask me anything!";

// Turn site paths Doofus mentions (/blog, /contact, ...) into links.
const PATHS = /(\/(?:blog|portfolio|about|contact)\b)/g;
const linkify = (text) =>
  text.split(PATHS).map((part, i) =>
    i % 2 ? (
      <Link
        key={i}
        href={part}
        className="font-medium text-accent underline underline-offset-2 dark:text-accent-light"
      >
        {part}
      </Link>
    ) : (
      part
    ),
  );

const Doofus = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "assistant", content: GREETING },
  ]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const listRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, [messages, open]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  const send = async (e) => {
    e.preventDefault();
    const question = input.trim();
    if (!question || busy) return;

    // The greeting is UI-only; the API conversation starts with the visitor.
    const history = [...messages, { role: "user", content: question }];
    setMessages([...history, { role: "assistant", content: "" }]);
    setInput("");
    setBusy(true);

    const appendToReply = (text) =>
      setMessages((prev) => {
        const next = [...prev];
        const last = next.at(-1);
        next[next.length - 1] = { ...last, content: last.content + text };
        return next;
      });

    try {
      const res = await fetch("/api/doofus", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history.slice(1) }),
      });
      if (!res.ok || !res.body) throw new Error();
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        appendToReply(decoder.decode(value, { stream: true }));
      }
    } catch {
      appendToReply("Uh oh. I tripped over a cable. Try again?");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-3 sm:bottom-6 sm:right-6">
      {open && (
        <section
          role="dialog"
          aria-label="Chat with Doofus"
          className="flex h-[28rem] max-h-[calc(100vh-7rem)] w-[min(22rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-2xl shadow-zinc-900/10 dark:border-zinc-800 dark:bg-zinc-950 dark:shadow-black/40"
        >
          <header className="flex items-start justify-between border-b border-zinc-200 px-4 py-3 dark:border-zinc-800">
            <div>
              <p className="flex items-center gap-1.5 text-sm font-semibold">
                <TbMoodCrazyHappy className="h-4 w-4 text-accent dark:text-accent-light" />
                Doofus
              </p>
              <p className="mt-0.5 font-mono text-[11px] text-zinc-500 dark:text-zinc-400">
                Doofus-1 · 0.1B params · confidently wrong since 2026
              </p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close chat"
              className="rounded-md p-1 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-900 dark:hover:text-zinc-100"
            >
              <TbX className="h-4 w-4" />
            </button>
          </header>

          <div
            ref={listRef}
            aria-live="polite"
            className="flex-1 space-y-3 overflow-y-auto px-4 py-4 text-sm leading-relaxed"
          >
            {messages.map((m, i) => (
              <p
                key={i}
                className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-3.5 py-2 ${
                  m.role === "user"
                    ? "ml-auto rounded-br-md bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                    : "rounded-bl-md bg-zinc-100 text-zinc-800 dark:bg-zinc-900 dark:text-zinc-200"
                }`}
              >
                {m.content ? (
                  m.role === "assistant" ? (
                    linkify(m.content)
                  ) : (
                    m.content
                  )
                ) : (
                  <span
                    className="inline-flex gap-1"
                    aria-label="Doofus is thinking"
                  >
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-400 [animation-delay:-0.3s]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-400 [animation-delay:-0.15s]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-400" />
                  </span>
                )}
              </p>
            ))}
          </div>

          <form
            onSubmit={send}
            className="flex items-center gap-2 border-t border-zinc-200 p-3 dark:border-zinc-800"
          >
            <label htmlFor="doofus-input" className="sr-only">
              Ask Doofus
            </label>
            <input
              ref={inputRef}
              id="doofus-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              maxLength={500}
              autoComplete="off"
              placeholder="Ask me anything (results may vary)"
              className="min-w-0 flex-1 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm placeholder:text-zinc-400 focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-secondary/30 dark:border-zinc-700 dark:bg-zinc-900 dark:placeholder:text-zinc-500"
            />
            <button
              type="submit"
              disabled={busy || !input.trim()}
              aria-label="Send"
              className="rounded-lg bg-zinc-900 p-2 text-white transition-colors hover:bg-zinc-700 disabled:opacity-40 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
            >
              <TbSend2 className="h-4 w-4" />
            </button>
          </form>
        </section>
      )}

      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label={open ? "Close Doofus" : "Chat with Doofus"}
        className="group flex items-center gap-2 rounded-full border border-zinc-200 bg-white py-2 pl-2.5 pr-3.5 text-sm font-medium shadow-lg shadow-zinc-900/10 transition-all hover:-translate-y-0.5 hover:shadow-xl dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-black/40"
      >
        <TbMoodCrazyHappy className="h-5 w-5 text-accent transition-transform group-hover:rotate-12 dark:text-accent-light" />
        {open ? "Bye Doofus" : "Ask Doofus"}
      </button>
    </div>
  );
};

export default Doofus;
