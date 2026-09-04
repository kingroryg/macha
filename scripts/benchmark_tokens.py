#!/usr/bin/env python3
"""Measure output-token savings on Macha's fixed paired-response corpus."""

from __future__ import annotations

import json
from pathlib import Path

import tiktoken


ROOT = Path(__file__).resolve().parents[1]
CASES_PATH = ROOT / "benchmarks" / "output-pairs.json"
ENCODINGS = ("o200k_base", "cl100k_base")


def reduction(before: int, after: int) -> float:
    return (before - after) / before * 100


def main() -> None:
    cases = json.loads(CASES_PATH.read_text(encoding="utf-8"))
    if not cases:
        raise SystemExit("benchmark corpus is empty")

    ids = [case["id"] for case in cases]
    if len(ids) != len(set(ids)):
        raise SystemExit("benchmark case IDs must be unique")

    print(f"Cases: {len(cases)} paired assistant responses\n")
    print("| Measure | Normal | Macha | Reduction |")
    print("|---|---:|---:|---:|")

    for name in ENCODINGS:
        encoding = tiktoken.get_encoding(name)
        normal = sum(len(encoding.encode(case["normal_output"])) for case in cases)
        macha = sum(len(encoding.encode(case["macha_output"])) for case in cases)
        print(f"| `{name}` tokens | {normal} | {macha} | {reduction(normal, macha):.1f}% |")

    normal_words = sum(len(case["normal_output"].split()) for case in cases)
    macha_words = sum(len(case["macha_output"].split()) for case in cases)
    print(f"| Whitespace-delimited words | {normal_words} | {macha_words} | {reduction(normal_words, macha_words):.1f}% |")


if __name__ == "__main__":
    main()
