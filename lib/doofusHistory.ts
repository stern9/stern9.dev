// Shared by the Doofus chat widget and its API route, so keep it free of
// server-only imports.

export const HISTORY_LIMITS = {
  maxInputChars: 500, // per message
  maxHistory: 6, // messages sent to the model (user + assistant)
};

type Turn = { role: "user" | "assistant"; content: string };

// The part of the conversation worth sending: the last few turns, starting
// with a visitor message, each cut to the length the server keeps anyway.
// Sending the whole session would eventually hit the route's body size limit.
export function recentHistory<T extends Turn>(messages: T[]): Turn[] {
  const recent = messages.slice(-HISTORY_LIMITS.maxHistory);
  while (recent.length && recent[0].role !== "user") recent.shift();
  return recent.map(({ role, content }) => ({
    role,
    content: content.slice(0, HISTORY_LIMITS.maxInputChars),
  }));
}
