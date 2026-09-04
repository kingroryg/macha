#!/usr/bin/env python3
"""Fail when benchmark claims, source data, skill, or chart drift apart."""

from __future__ import annotations

import hashlib
import json
from pathlib import Path

import tiktoken


ROOT = Path(__file__).resolve().parents[1]
CORPUS = ROOT / "benchmarks" / "output-pairs.json"
SKILL = ROOT / "skills" / "macha" / "SKILL.md"
CHART = ROOT / "skills" / "macha" / "assets" / "token-savings.png"
README = ROOT / "README.md"
EVIDENCE = ROOT / "benchmarks" / "evidence.json"


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def main() -> None:
    evidence = json.loads(EVIDENCE.read_text(encoding="utf-8"))
    expected_hashes = {
        "corpus_sha256": CORPUS,
        "skill_sha256": SKILL,
        "chart_sha256": CHART,
    }
    for key, path in expected_hashes.items():
        if evidence[key] != sha256(path):
            raise SystemExit(f"stale evidence: {path.relative_to(ROOT)} changed")

    cases = json.loads(CORPUS.read_text(encoding="utf-8"))
    skill_text = SKILL.read_text(encoding="utf-8")
    readme = README.read_text(encoding="utf-8")
    for name, expected in evidence["stats"].items():
        encoding = tiktoken.get_encoding(name)
        actual = {
            "normal": sum(len(encoding.encode(case["normal_output"])) for case in cases),
            "macha": sum(len(encoding.encode(case["macha_output"])) for case in cases),
            "skill": len(encoding.encode(skill_text)),
        }
        if actual != expected:
            raise SystemExit(f"stale evidence: {name} expected {expected}, got {actual}")
        reduction = (actual["normal"] - actual["macha"]) / actual["normal"] * 100
        if f"{reduction:.1f}%" not in readme:
            raise SystemExit(f"README missing {name} reduction {reduction:.1f}%")

    skill_range = sorted(item["skill"] for item in evidence["stats"].values())
    if f"{skill_range[0]}–{skill_range[-1]} tokens" not in readme:
        raise SystemExit("README skill-token range is stale")
    print("Benchmark evidence is fresh.")


if __name__ == "__main__":
    main()
