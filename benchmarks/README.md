# Benchmarks

Macha keeps three measurements separate.

## Authored output pairs

`npm run benchmark` counts the fixed replies in `output-pairs.json`. This is a reproducible wording fixture, not evidence that a model becomes 42% shorter.

The report also prints the loaded `SKILL.md` cost. Output saved and input added are separate numbers.

## Phrase costs

`npm run audit:phrases` compares every approved phrase with a clear English control under both tokenizers. Compression phrases must never cost more. Colloquial and film phrases are labelled flavour markers and may spend a few tokens for voice.

## Live three-arm evaluation

`benchmark_live.py` runs the same coding prompts in three conditions:

1. normal;
2. generic concise instruction;
3. Macha.

Any one-shot CLI that reads a prompt from stdin and writes only its answer to stdout can be used:

```bash
python3 scripts/benchmark_live.py run \
  --model MODEL_ID \
  --output benchmarks/results/RUN.json \
  --trials 3 \
  -- claude -p

python3 scripts/benchmark_live.py report benchmarks/results/RUN.json
```

Snapshots include raw outputs, model and runner metadata, prompt and skill hashes, token counts, and exact-string fidelity checks. A changed skill or prompt file makes a snapshot stale.

Exact-string checks are not semantic review. Keep `quality_reviewed` false until a person has checked factual correctness, completeness, safety, and tone. Do not publish a causal savings claim from an unreviewed snapshot.

`compatibility.json` records an isolated install smoke test, not behavioral conformance. Persistence, deactivation, compaction, and concurrent-session behavior still require real host testing.
