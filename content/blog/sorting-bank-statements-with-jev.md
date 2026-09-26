---
title: "Pulling a year of bank statements out of Gmail for one cent"
date: 2026-09-26
description: "I used Jev, TypeSafe's new System One model, to find every bank statement in my inbox and file the PDFs by bank. 305 emails, about 200 ms per decision, and roughly a cent in model costs."
tags: ["ai", "python", "automation", "side project"]
draft: false
---

Every year I end up doing the same chore: digging through Gmail for bank statements. Between checking accounts, credit cards and PayPal, I get statements from several institutions. Each one emails a PDF every month, and each names its files differently. This year I automated it. The script finds every statement email from 2026, downloads the PDFs and files them into a folder per bank.

The interesting part is what decides "is this a statement, and from which bank?" It isn't an LLM. It's [Jev](https://typesafe.ai/blog/introducing-system-one-models-and-jev), a new kind of model from TypeSafe.

## What is Jev?

TypeSafe calls Jev a **System One model**, after the fast, intuitive "System 1" thinking from psychology. It is transformer-based, but it is not autoregressive and it doesn't generate text. You give it some **state** (text or JSON) and a set of typed **questions**, and it returns typed answers:

| Question type | You ask | You get back |
| ------------- | ------- | ------------ |
| `noul` | a yes/no question | a calibrated probability that the answer is yes |
| `choice` | pick one option from a set you define (up to 255) | the option, a probability for every option, and a confidence |
| `score` | rate against 2–10 ordered levels | a weighted score, per-level probabilities, and a confidence |

A few things make this a good fit for plumbing code like mine:

- **The output is always valid.** A `choice` answer is always one of your keys. There's nothing to parse or validate.
- **Probabilities are calibrated**, so a threshold like "save if ≥ 0.80" means something.
- **It's fast and cheap.** Input is priced at **$0.042 per million tokens** and output is free. You can ask many questions about the same state in one request and pay for the state once.

## The flow

```
Gmail search (read-only)
  └─ every 2026 email with a PDF attachment  → 305 emails
      └─ Jev: which bank? is it a statement? what kind of document?
          ├─ one of my banks and p ≥ 0.80   → statements/2026/<Bank>/
          ├─ one of my banks and 0.50–0.80  → statements/2026/_review/
          └─ anything else                  → skipped
```

For each email, Jev sees only the sender, subject, Gmail's preview snippet and the attachment filenames. The PDFs themselves never leave my machine.

Here are the questions, which are just a Python dict:

```python title="statements.py"
# Illustrative: swap in your own institutions and sender domains.
BANKS = {
    "BankA": "Bank A, checking and savings (banka.com)",
    "BankB": "Bank B credit cards (cards.bankb.com)",
    "CardCo": "CardCo, the card issuer formerly known as OldBank",
    "PayPal": "PayPal monthly account statements (paypal.com)",
    "other": "any other sender: utilities, telecom, insurance, stores...",
}

QUESTIONS = {
    "bank": {
        "type": "choice",
        "instructions": "Which bank sent this email? Use the sender address and name first.",
        "criteria": BANKS,
    },
    "is_statement": {
        "type": "noul",
        "instructions": "Is this email delivering a periodic account statement (bank account, "
                        "credit card, brokerage, loan, mortgage, or retirement account)? Receipts, "
                        "invoices, tax forms, promotions, and transaction alerts are NOT statements.",
    },
    "doc_type": {
        "type": "choice",
        "instructions": "What kind of document does this email carry?",
        "criteria": {"statement": "periodic account statement", "tax_form": "1099, W-2...",
                     "receipt_invoice": "receipt, bill, or invoice", "alert": "transaction alert",
                     "marketing": "promotion or newsletter", "other": "anything else"},
    },
}
```

The whole call is one `POST`:

```python
r = requests.post(
    "https://api.typesafe.ai/v1/systemone",
    headers={"Authorization": f"Bearer {api_key}"},
    json={"state": email, "model": "jev-latest", "questions": QUESTIONS},
)
answers = r.json()["answers"]
answers["bank"]["choice"]          # "BankB"
answers["is_statement"]["noul"]    # 0.97
```

Then it's ordinary code: pick a folder, download the attachment, write the file. Files that already exist are skipped, so I can re-run it whenever I want.

## The results

| | |
| --- | ---: |
| Emails with a PDF attachment in 2026 | 305 |
| Statements saved | **57** |
| Emails left for manual review | 0 |

Every statement landed in the right folder, January through September, with checking accounts, credit cards and PayPal all sorted separately.

Jev also filtered out what I didn't want: utility and insurance statements that look a lot like bank statements (same "account statement" wording), and copies I'd forwarded to myself.

## The cost

The real run classified 305 emails with three questions each:

| | |
| --- | ---: |
| Input tokens | 258,024 |
| Tokens per email | ~850 |
| **Model cost for the whole run** | **~$0.011** |
| Cost per 1,000 emails | ~$0.036 |

Including the dry runs and testing, I spent about two cents all day.

## The speed

I timed the same three-question request ten times: **median 211 ms**, ranging from 190 to 285 ms. That's about a minute of Jev time for 305 emails.

The full run took about three minutes, and Jev wasn't the bottleneck. **Gmail was.** Its API has a per-user quota, and fetching 300 full messages in a row hits it. The script backs off and retries, which is where most of the wall-clock time went.

## How easy was it?

From an empty folder to 57 PDFs on disk took about **30 minutes**. Most of that was clicking through Google Cloud to get Gmail API credentials. I built it pairing with [Claude Code](https://claude.com/claude-code), and the script is about 250 lines of Python with three dependencies (`requests` and the two Google client libraries).

The snags were all setup, not model:

- **Gmail API not enabled.** Creating OAuth credentials doesn't turn the API on. That's a separate click.
- **Rate limits**, as above.

My favorite fix came from folder naming. My first version guessed the bank from the sender's display name, which produced folders named after a country-code subdomain or a raw `statements@…` email address. Instead of writing more regexes, I added the `bank` choice question. Jev picked the right institution for every test sender with confidence of 0.98 or higher, and the answer can only ever be one of my folder names.

## Things to know

- **Not every institution attaches the PDF.** Some only send a "your statement is ready" link. The script lists those so I know what to download by hand.
- **Language.** TypeSafe says English is Jev's strongest language. A good share of my statement emails aren't in English, and it still scored real statements at 0.90–0.98.
- **Banks rename themselves.** One of mine was rebranded after an acquisition. Adding "formerly known as…" to the choice description was all it took.

What I like most is that the model does one narrow job, answering "which bank, and is this a statement?", and everything else is plain code I can read. For this kind of classification, a System One model is faster and cheaper than an LLM, and it has no output to parse.
