#!/usr/bin/env python3
"""Audit approved Macha phrases against clear plain-English controls."""

from __future__ import annotations

import json
from pathlib import Path

import tiktoken


ROOT = Path(__file__).resolve().parents[1]
PAIRS = ROOT / "benchmarks" / "phrase-pairs.json"
SKILL = ROOT / "skills" / "macha" / "SKILL.md"
ENCODINGS = ("o200k_base", "cl100k_base")


def main() -> None:
    pairs = json.loads(PAIRS.read_text(encoding="utf-8"))
    skill = SKILL.read_text(encoding="utf-8")
    phrases = [item["phrase"] for item in pairs]
    if len(phrases) != len(set(phrases)):
        raise SystemExit("duplicate phrase in phrase-pairs.json")
    missing = [phrase for phrase in phrases if f"`{phrase}`" not in skill]
    if missing:
        raise SystemExit(f"phrases missing from SKILL.md: {missing}")

    failures = []
    print(f"Approved phrases: {len(pairs)}\n")
    print("| Encoding | Compression controls | Token-negative flavour markers | Net flavour delta |")
    print("|---|---:|---:|---:|")
    for name in ENCODINGS:
        encoding = tiktoken.get_encoding(name)
        compression = [item for item in pairs if item["role"] == "compression"]
        flavour = [item for item in pairs if item["role"] == "flavour"]
        for item in compression:
            phrase_tokens = len(encoding.encode(item["phrase"]))
            plain_tokens = len(encoding.encode(item["plain"]))
            if phrase_tokens > plain_tokens:
                failures.append(f"{name}: {item['phrase']} ({phrase_tokens}) > {item['plain']} ({plain_tokens})")
        plain_total = sum(len(encoding.encode(item["plain"])) for item in compression)
        phrase_total = sum(len(encoding.encode(item["phrase"])) for item in compression)
        flavour_deltas = [len(encoding.encode(item["phrase"])) - len(encoding.encode(item["plain"])) for item in flavour]
        token_negative = sum(delta > 0 for delta in flavour_deltas)
        flavour_delta = sum(flavour_deltas)
        reduction = (plain_total - phrase_total) / plain_total * 100
        print(f"| `{name}` | {plain_total} → {phrase_total} ({reduction:.1f}% less) | {token_negative}/{len(flavour)} | {flavour_delta:+d} |")

    if failures:
        raise SystemExit("token-negative compression phrases:\n" + "\n".join(failures))


if __name__ == "__main__":
    main()
