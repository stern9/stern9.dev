import { useState } from "react";

const emptyInputs = { fullName: "", email: "", message: "", company: "" };

const inputClass =
  "mt-1.5 block w-full rounded-lg border border-zinc-300 bg-white px-3.5 py-2.5 text-[15px] text-zinc-900 placeholder:text-zinc-400 transition-colors focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-secondary/30 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-zinc-500";

const labelClass = "text-sm font-medium text-zinc-700 dark:text-zinc-300";

const Form = () => {
  const [inputs, setInputs] = useState(emptyInputs);
  // idle | submitting | success | error
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");

  const handleOnChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.id]: e.target.value }));
    if (status === "success" || status === "error") setStatus("idle");
  };

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    setStatus("submitting");
    try {
      const res = await fetch("/api/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(inputs),
      });
      const text = await res.text();
      if (!res.ok) throw new Error(text || "Message not sent.");
      setInputs(emptyInputs);
      setMessage("Thanks! Your message is on its way. I'll reply soon.");
      setStatus("success");
    } catch (error) {
      setMessage(error.message || "Something went wrong. Please try again.");
      setStatus("error");
    }
  };

  return (
    <form onSubmit={handleOnSubmit} className="max-w-xl space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="fullName" className={labelClass}>
            Name
          </label>
          <input
            className={inputClass}
            id="fullName"
            type="text"
            autoComplete="name"
            placeholder="Jane Doe"
            onChange={handleOnChange}
            required
            maxLength={100}
            value={inputs.fullName}
          />
        </div>
        <div>
          <label htmlFor="email" className={labelClass}>
            Email
          </label>
          <input
            className={inputClass}
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            onChange={handleOnChange}
            required
            maxLength={200}
            value={inputs.email}
          />
        </div>
      </div>
      <div>
        <label htmlFor="message" className={labelClass}>
          Message
        </label>
        <textarea
          className={inputClass}
          id="message"
          rows={6}
          onChange={handleOnChange}
          required
          maxLength={5000}
          value={inputs.message}
          placeholder="What would you like to talk about?"
        />
      </div>

      {/* Honeypot: hidden from people, bots tend to fill it in. */}
      <div aria-hidden className="absolute -left-[9999px]">
        <label htmlFor="company">Company</label>
        <input
          id="company"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          onChange={handleOnChange}
          value={inputs.company}
        />
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <button
          className="rounded-lg bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
          type="submit"
          disabled={status === "submitting"}
        >
          {status === "submitting" ? "Sending…" : "Send message"}
        </button>
        <p
          role="status"
          aria-live="polite"
          className={`text-sm ${
            status === "error"
              ? "text-red-600 dark:text-red-400"
              : "text-green-700 dark:text-green-400"
          }`}
        >
          {(status === "success" || status === "error") && message}
        </p>
      </div>
    </form>
  );
};

export default Form;
