// Server-only: highlights the code shown in the home page cover.
// Every snippet comes from one of the projects on this site, shortened to fit.
import { codeToHtml } from "shiki";

const snippets = [
  // jev-bench, jevbench/runner.py, shortened to fit.
  {
    lang: "python",
    code: `def make_caller(model: str, stack: ExitStack) -> Callable:
    if is_jev(model):
        client = stack.enter_context(TypeSafeClient(model=model))
        return lambda state, questions: client.system_one(state, questions)
    client = stack.enter_context(SystemOneAdapterClient(
        structured_outputs=True,
        llm_answer_mode="probabilities",
        model=AnthropicProvider(model, max_tokens=16000),
    ))
    return lambda state, questions: client.system_one(state, questions)`,
  },
  // The one in the middle is meant to be read: the pii-gate quickstart.
  {
    lang: "ts",
    code: `import { mask, unmask } from "pii-gate";

const { masked, vault } = mask(
  "Insured: John Doe, DOB: 01/01/1980.",
);
// "Insured: {{PERSON_1}}, DOB: {{DOB_1}}."

const reply = await callYourModel(masked);
const { text } = unmask(reply, vault);`,
  },
  // dirsize, src/lib.rs.
  {
    lang: "rust",
    code: `pub fn scan(root: &Path) -> io::Result<Scan> {
    let meta = fs::metadata(root)?;
    let (root, errors) = scan_entry(root, root.display().to_string(), &meta);
    Ok(Scan { root, errors })
}

fn sort_largest_first(entries: &mut [Entry]) {
    entries.sort_by(|a, b| b.size.cmp(&a.size).then_with(|| a.name.cmp(&b.name)));
}`,
  },
];

export async function getCoverCode() {
  return Promise.all(
    snippets.map(({ code, lang }) =>
      codeToHtml(code, { lang, theme: "github-dark-dimmed" }),
    ),
  );
}
