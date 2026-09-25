import Anthropic from "@anthropic-ai/sdk";
import {
  DOOFUS_MODEL,
  LIMITS,
  checkLimits,
  cleanMessages,
  cannedReply,
  tiredReply,
  systemPrompt,
} from "../../lib/doofus";
import { clientIp } from "../../lib/rateLimit";

const client = process.env.ANTHROPIC_API_KEY ? new Anthropic() : null;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// "Type out" a canned reply so it feels like the real thing.
async function writeSlowly(res, text) {
  for (const word of text.split(/(?<= )/)) {
    res.write(word);
    await sleep(35);
  }
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).send("Method not allowed.");
  }

  const messages = cleanMessages(req.body?.messages);
  if (!messages) {
    return res.status(400).send("Doofus needs a question.");
  }

  res.writeHead(200, {
    "Content-Type": "text/plain; charset=utf-8",
    "Cache-Control": "no-store",
    // Tell Nginx not to buffer, so the reply streams word by word.
    "X-Accel-Buffering": "no",
  });

  if (!client) {
    await writeSlowly(res, cannedReply());
    return res.end();
  }
  if (!checkLimits(clientIp(req))) {
    await writeSlowly(res, tiredReply());
    return res.end();
  }

  const stream = client.messages.stream({
    model: DOOFUS_MODEL,
    max_tokens: LIMITS.maxTokens,
    system: systemPrompt(),
    messages,
  });
  // Stop generating (and paying) if the visitor closes the chat mid-reply.
  res.on("close", () => stream.abort());

  let wroteText = false;
  try {
    for await (const event of stream) {
      if (
        event.type === "content_block_delta" &&
        event.delta.type === "text_delta"
      ) {
        res.write(event.delta.text);
        wroteText = true;
      }
    }
    // e.g. a refusal with no text: never leave the visitor with a blank reply.
    if (!wroteText) await writeSlowly(res, cannedReply());
  } catch (error) {
    if (error instanceof Anthropic.APIUserAbortError) return;
    if (error instanceof Anthropic.APIError) {
      console.error(`Doofus API error ${error.status}:`, error.message);
    } else {
      console.error("Doofus error:", error);
    }
    await writeSlowly(
      res,
      wroteText ? " ...wait, what was I saying?" : cannedReply(),
    );
  }
  res.end();
}
