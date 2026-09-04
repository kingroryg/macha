# South-Indian-English patterns for Machan

Research note, 2026-09-04. This is a candidate set for approval, not an edit to the skill.

Project decision: the user approved the recommended output patterns and prefers the spelling `saama` in Machan output. Corpus citations below retain attested spellings such as `semma`. Machan applies only to model output, never to user input.

## Bottom line

The evidence supports **one strong new productive pattern**: a short declarative or predicate followed by Tamil-influenced `ah?` for a recoverable yes/no confirmation, e.g. `Release ready ah?`. A broader, less locally marked alternative is the bare declarative question `Release ready?`.

Most Tamil words add identity, rapport, or emotional nuance rather than reducing model tokens. They can shorten a long source sentence, but usually lose to the shortest plain-English equivalent (`Fine.`, `Questions?`, `Correct?`). Machan should therefore get most of its savings from ellipsis and direct syntax, with a small amount of approved Tamil vocabulary for voice.

## Scope and evidence

“South Indian English” is not one uniform register. The strongest corpus evidence here separates:

- **Tamil-coded English/C.M.C.**: `da`, `machan`, and confirmatory `la` occur as indigenous elements in English-dominant student chats. The researchers describe `da` as a close-peer solidarity form and `machan` as “dude/buddy”; their `machan` example is from Sri Lanka, while `da` and `la` are in the India sample. [Shakir & Deuber 2024](https://doi.org/10.1075/eww.23068.sha)
- **Tamil grammar transferred into English**: Tamil makes a polar question with clitic `-aa`; it does not need English-style subject–auxiliary inversion. [Schiffman, *A Reference Grammar of Spoken Tamil* companion material](https://ccat.sas.upenn.edu/~haroldfs/dravling/clitics/clitics.html), [University of Pennsylvania Tamil course](https://ccat.sas.upenn.edu/plc/tamilweb/conv/conv2.html)
- **Broader Indian English**: bare declarative questions, invariant `no?/na?`, `what to do?`, and presentational `only/itself` are pan-Indian rather than Tamil-specific. [Sailaja 2009](https://doi.org/10.3366/edinburgh/9780748625949.001.0001), [Fuchs 2026, “English in India”](https://www.cambridge.org/core/books/new-cambridge-history-of-the-english-language/english-in-india/B708AB3814A582335F5403D586152584)
- **Other South Indian languages have their own forms**. For example, Telugu uses invariant `kadaa` as a tag, while Malayalam has its own interrogative/tag system. These should not be blended into a purportedly Tamil voice without explicit approval. [Srikanth, Telugu tag questions](https://linguistics.uok.edu.in/Files/f6ec3740-422d-4ac1-9f52-ddfe2cffcb28/Journal/ab5bda6f-9bc8-4a94-8e0d-267784542c2c.pdf), [Hindi–Malayalam contrastive grammar](https://www.languageinindia.com/sep2002/chap4.html)

The public DravidianCodeMix corpus confirms that Romanized Tamil-English writing is real and variable, but it consists of YouTube comments, not assistant prose. It is useful for attestation, not as a style guide. Its paper reports roughly 44,000 Tamil-English comments. [Dataset](https://github.com/bharathichezhiyan/DravidianCodeMix-Dataset), [corpus paper](https://pmc.ncbi.nlm.nih.gov/articles/PMC9388449/)

Token judgments below are directional. I checked examples with OpenAI's `o200k_base` and `cl100k_base`; other assistants tokenize differently. The important comparison is against the **shortest clear alternative**, not against a deliberately verbose sentence.

## Shortlist worth approval

| ID | Candidate and provenance | Meaning and pragmatic constraints | Normal → compact | Ambiguity / safety risk | Likely token saving? |
|---|---|---|---|---|---|
| A1 | **Bare declarative yes/no question** (broader Indian English; also ordinary global informal English) | Ask for confirmation when actor, tense, and modality are obvious. Keep `?`. | `Do you want the patch?` → `You want the patch?`; `Did tests pass?` → `Tests passed?` | Do not use when inversion distinguishes statement from question or when modality matters. | **Yes, usually 1–2 tokens.** Strong, natural, globally legible. |
| A2 | **Predicate + `ah?`** (Tamil-specific adaptation of polar `-aa`) | Informal yes/no confirmation only; the proposition must be fully recoverable. Keep it final. | `Is the release ready?` → `Release ready ah?`; `Is this a regression?` → `Regression ah?`; `Are both checks green?` → `Both green ah?` | Never turn `Should I retry?` into `Retry ah?`: that loses actor and modality. In Romanized Tamil, `-ah` can also be adverbial, so position and `?` matter. | **Sometimes.** Saves 1–2 tokens versus the full question, but `Release ready?` is one token shorter still. Approve for voice, not maximal economy. |
| A3 | **`just` as a compact request softener** (standard Indian English) | Informal, low-stakes request where a direct imperative would sound too sharp. Sailaja reports `just` as a common Indian-English politeness marker. | `Could you move this?` → `Just move this.`; `Would you check once more?` → `Just check once.` | Can still sound impatient cross-culturally. Avoid authority-sensitive, conflict, and safety contexts. | **Small: often 1 token.** |
| A4 | **`prepone`** (broader Indian English) | Move an event to an earlier time/date; usable in professional writing in India. | `Move the meeting to an earlier date.` → `Prepone the meeting.` | Some global readers will not know it. Never use for changing task priority rather than time. [Cambridge Dictionary](https://dictionary.cambridge.org/us/dictionary/english/prepone), [Merriam-Webster](https://www.merriam-webster.com/wordplay/prepone) | **Mixed.** Beats verbose wording, but ties `Move meeting earlier.` in the tested tokenizers. Approve for compact semantics/voice. |
| A5 | **`timepass`** (broader Indian English) | Aimless or low-value activity; light entertainment without a serious purpose. | `This is just something to pass the time.` → `Just timepass.` | Can mean merely casual entertainment or negatively “waste of time”; poor fit for technical conclusions. [Oxford Advanced Learner’s Dictionary](https://www.oxfordlearnersdictionaries.com/us/definition/english/timepass_2) | **Mixed.** Saves against a long explanation, but `pastime`/`idle` may be shorter and clearer. Examples-only is safer than a general rewrite rule. |

### Recommended wording for A2

> For an informal, fully recoverable yes/no confirmation, `X ah?` may replace an auxiliary-led question: `Release ready ah?`, `Regression ah?`, `Both green ah?`. Preserve the subject, tense, negation, and modality whenever omitting them could change the answer.

## Authentic candidates to defer or reject

| ID | Candidate and provenance | Meaning and pragmatic constraints | Normal → compact | Ambiguity / safety risk | Likely token saving? | Recommendation |
|---|---|---|---|---|---|---|
| D1 | **`la?`** (Tamil-coded English-chat tag) | Affirm/confirm: roughly `right?` or `isn't it?`; directly attested in an India student chat. [Shakir & Deuber 2024](https://doi.org/10.1075/eww.23068.sha) | `She said 15 minutes, right?` → `15 minutes la?` | Relies on shared bilingual knowledge; may be confused with Singlish `lah`; polarity is opaque. | **No versus `right?`; worse than bare `?`.** | Reject as a productive rule; perhaps retain one cultural example only. |
| D2 | **`paravala` / `parava illa`** (Tamil-coded) | `Never mind`, `doesn't matter`, `it's not bad`; meaning depends on context. McAlpin lists these distinct senses. [McAlpin Tamil vocabulary, entry 682](https://dsal.uchicago.edu/dictionaries/mcalpin/McAlpin_Tamil.pdf) | `Never mind; it doesn't matter.` → `Paravala.` | Spelling varies; can understate a real problem or sound dismissive. Avoid serious and high-stakes contexts. | **No against `Fine.` or `Never mind.`** `Paravala.` was 4 tokens in both tested encodings. | Examples-only or reject. |
| D3 | **`paavam`** (Tamil-coded) | `Alas`, `poor thing`, `it's a pity`; attested embedded in English chat. [Shakir & Deuber 2024](https://doi.org/10.1075/eww.23068.sha), [McAlpin entry 713](https://dsal.uchicago.edu/dictionaries/mcalpin/McAlpin_Tamil.pdf) | `That's a pity.` → `Paavam.` | Person-directed pity can sound patronizing; not for serious bad news. | **No.** Ties or loses to `Pity.` | Reject as compression primitive; optional characterful example only. |
| D4 | **`summa`** (Tamil-coded; cognate/shared forms occur elsewhere in Dravidian languages) | `Idly`, `just for fun`, `without reason`, `just because`. | `I only tried it for no particular reason.` → `Summa tried.` | Highly polysemous; may imply purposelessness, joking, randomness, or dismissal. [Tamil Virtual Academy dictionary](https://www.tamilvu.org/slet/pmdictionary/ldttamls.jsp?next=30854&x=30404&y=31447) | **No against `Just tried.`** | Reject: too much semantic loss. |
| D5 | **`semma`** (colloquial Tamil intensifier/evaluation) | Roughly `excellent`, `awesome`, or intensifying `very`; common in the public Tamil-English corpus but register-specific. | `That's excellent.` → `Semma.` | Hype-heavy; semantic polarity may be sarcastic in social-media data; weaker lexicographic evidence than the items above. | **No.** `Semma.` was 3 tokens versus 2 for `Great.` | Defer pending native-speaker approval and a stronger dictionary source. |
| D6 | **`podhum` / `pothum`** (Tamil-coded) | `Enough` / `be sufficient`. [McAlpin entry 775](https://dsal.uchicago.edu/dictionaries/mcalpin/McAlpin_Tamil.pdf) | `One example is enough.` → `One example podhum.` | Code-switch sounds forced in English-led technical prose. | **No.** The tested sentences tied at 5 tokens. | Reject. |
| D7 | **`illa` / `ille`** (Tamil negative/existential) | `No`, `not`, `absent`, or `does not exist`; related negative forms are widespread across Dravidian languages. [Shakir & Deuber 2024](https://doi.org/10.1075/eww.23068.sha) | `No cache entry exists.` → `Cache entry illa.` | Loses tense and sometimes scope; a dangerous substitution around requirements or failures. | **Unreliable.** At best 1 token in one tokenizer, none in another; `No entry.` is shorter. | Reject. |
| D8 | **`one doubt` / `Any doubt?`** (broader Indian English) | `A question` / request for clarification. | `Do you have any questions?` → `Any doubt?` | Outside Indian English, `doubt` means uncertainty or disbelief, not a neutral question. | **No against `Questions?`** | Reject. |
| D9 | **Reduced numeric range** (broader informal Indian English) | Juxtaposed numerals express an approximate range. Sailaja gives `two-three minutes`. | `We need two or three options.` → `Need two-three options.` | Hyphen can be read as subtraction or a malformed range, especially in code/specs. | **Sometimes 1–2 tokens**, but a standard en dash (`2–3 options`) is shorter and clearer. | Use standard numeric ranges instead; reject dialect rule. |
| D10 | **Presentational `only` / `itself`** (pan-Indian) | Non-contrastive focus or exact-time emphasis; not always the exclusive/reflexive meanings used elsewhere. [Lange 2007](https://doi.org/10.1075/eww.28.1.05lan), [Fuchs 2026](https://www.cambridge.org/core/books/new-cambridge-history-of-the-english-language/english-in-india/B708AB3814A582335F5403D586152584) | `Do it today, not later.` → `Do it today itself.` | Scope and urgency are easy to misread; often **adds** a word. | **Usually no.** | Keep only the skill's existing narrow, unambiguous rule. |
| D11 | **Entreaty `no`** (pan-Indian) | In commands, `no` can mean `please` and convey persuasion or exasperation. [Sailaja 2009](https://doi.org/10.3366/edinburgh/9780748625949.001.0001) | `Please try again.` → `Try again, no?` | Tone depends on voice; can sound pressuring. | **No:** tested example grew by 1 token. | Keep `no?` for confirmation only, not politeness compression. |
| D12 | **Rhetorical `where`** (broader Indian English) | A `where` question can imply that the event is not happening at all (`Where is he coming?`). [Sailaja 2009](https://doi.org/10.3366/edinburgh/9780748625949.001.0001) | `He isn't fixing it at all.` → `Where is he fixing?` | Extremely easy for global readers and models to misunderstand literally. | Irrelevant due semantic risk. | Reject. |

## Audit of already-approved forms

- **`seri`** is well supported: the Tamil lexicon gives `correct`, `O.K.`, `alright`, `fine`, and `yes`. It works as acknowledgment, not as proof that a technical claim is correct. [McAlpin entry 418](https://dsal.uchicago.edu/dictionaries/mcalpin/McAlpin_Tamil.pdf)
- **`aiyo`** is supported, but it can express sorrow, distress, sympathy, surprise, or concern—not merely “this is bad.” Keep the existing sensitive-context guardrail. [McAlpin entry 241](https://dsal.uchicago.edu/dictionaries/mcalpin/McAlpin_Tamil.pdf)
- **`da/dai`** needs a stricter relationship rule. Corpus evidence supports `da` among close peers for solidarity, but Tamil address morphology also marks age/status and is masculine-coded. Use only with an established high-rapport user who already uses it or explicitly requests it. [Shakir & Deuber 2024](https://doi.org/10.1075/eww.23068.sha), [University of Chicago Tamil course](https://tamilcourse.uchicago.edu/node/30)
- **`machan`** is not a neutral universal synonym for “friend.” Its literal lexicon senses are male kin terms; colloquial use extends it to a male friend/dude. Treat it as intimate and masculine-coded. [University of Madras Tamil Lexicon](https://dsal.uchicago.edu/cgi-bin/app/tamil-lex_query.py?qs=%E0%AE%AE%E0%AE%9A%E0%AF%8D%E0%AE%9A%E0%AE%BE%E0%AE%A9%E0%AF%8D&searchhws=yes&matchtype=exact), [Shakir & Deuber 2024](https://doi.org/10.1075/eww.23068.sha)
- **`no scene`** has weak Tamil-specific support. The attested Tamil-English form is often `scene illa`, and its meanings vary; I found no strong primary source establishing `no scene` as Tamil-English for “no problem.” Downgrade or remove until the user supplies/approves the intended community usage.
- **`what to do?`**, bare declarative questions, and invariant `no?` are well described as broader Indian English. They should not be labeled specifically Tamil or specifically South Indian. [Sailaja 2009](https://doi.org/10.3366/edinburgh/9780748625949.001.0001)

## Proposed approval ballot

1. **Approve A1**: productive bare declarative questions.
2. **Approve A2**: tightly bounded `X ah?`, with the modality/negation guardrail.
3. **Approve A3**: `just` for low-stakes compact requests.
4. **Approve A4 and A5 only as vocabulary examples**, not universal rewrites.
5. **Reject D1–D12 as productive compression rules.** They may be authentic, but most are ambiguous or token-neutral.
6. **Tighten `da/dai/machan`; reconsider `no scene`.**

This ballot expands the number of examples while keeping the actual rule set small enough to serve Machan's context-reduction goal.
