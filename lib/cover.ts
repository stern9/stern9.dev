// Server-only: highlights the code shown in the home page cover.
import { codeToHtml } from "shiki";

const snippets = [
  `import { embed, cosineSimilarity } from "@/lib/ai";

export async function search(query: string, docs: Doc[]) {
  const q = await embed(query);

  return docs
    .map((doc) => ({ doc, score: cosineSimilarity(q, doc.vector) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);
}`,
  // The one in the middle is meant to be read.
  `let bugs = 99; // little bugs in the code

while (bugs > 0) {
  takeOneDown();
  patchItAround();
  bugs += 28; // 127 little bugs in the code
}`,
  `export default async function handler(req, res) {
  const { messages } = req.body;
  const stream = await llm.stream({ messages });

  for await (const chunk of stream) {
    res.write(chunk.text);
  }
  res.end();
}`,
];

export async function getCoverCode() {
  return Promise.all(
    snippets.map((code) =>
      codeToHtml(code, { lang: "ts", theme: "github-dark-dimmed" }),
    ),
  );
}
