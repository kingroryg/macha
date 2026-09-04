#!/usr/bin/env python3
"""Run or inspect a three-arm live-model benchmark for Macha."""

from __future__ import annotations

import argparse
import hashlib
import importlib.metadata
import json
import statistics
import subprocess
import sys
from datetime import datetime, timezone
from pathlib import Path

import tiktoken


ROOT = Path(__file__).resolve().parents[1]
SKILL = ROOT / "skills" / "macha" / "SKILL.md"
PROMPTS = ROOT / "benchmarks" / "live-prompts.json"
HARNESS = Path(__file__).resolve()
ENCODINGS = ("o200k_base", "cl100k_base")
SECRET_FLAGS = {"--api-key", "--key", "--password", "--secret", "--token"}


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def load_prompts() -> list[dict]:
    data = json.loads(PROMPTS.read_text(encoding="utf-8"))
    return data["prompts"]


def arm_prompt(arm: str, task: str, skill: str) -> str:
    if arm == "normal":
        return task
    if arm == "terse":
        return f"Answer concisely while preserving every technical detail.\n\n{task}"
    return f"Follow this response-style skill:\n\n{skill}\n\n/macha\n\n{task}"


def token_counts(text: str) -> dict[str, int]:
    return {
        name: len(tiktoken.get_encoding(name).encode(text))
        for name in ENCODINGS
    }


def run_command(command: list[str], prompt: str, timeout: int) -> str:
    completed = subprocess.run(
        command,
        input=prompt,
        text=True,
        capture_output=True,
        timeout=timeout,
        check=False,
    )
    if completed.returncode:
        raise RuntimeError(
            f"runner exited {completed.returncode}: {completed.stderr.strip()}"
        )
    return completed.stdout.strip()


def runner_version(command: list[str]) -> str:
    try:
        result = subprocess.run(
            [command[0], "--version"],
            text=True,
            capture_output=True,
            timeout=10,
            check=False,
        )
        return (result.stdout or result.stderr).strip()
    except (OSError, subprocess.SubprocessError):
        return "unknown"


def safe_command_metadata(command: list[str]) -> list[str]:
    safe = []
    redact_next = False
    for value in command:
        if redact_next:
            safe.append("[REDACTED]")
            redact_next = False
            continue
        lower = value.lower()
        if lower in SECRET_FLAGS:
            safe.append(value)
            redact_next = True
        elif "=" in value and any(word in lower.split("=", 1)[0] for word in ("key", "token", "secret", "password")):
            safe.append(value.split("=", 1)[0] + "=[REDACTED]")
        else:
            safe.append(value)
    return safe


def run(args: argparse.Namespace) -> None:
    if args.output.exists() and not args.force:
        raise SystemExit(f"output exists: {args.output} (use --force to replace)")
    prompts = load_prompts()
    skill = SKILL.read_text(encoding="utf-8")
    rows = []
    for case in prompts:
        result = {"id": case["id"], "category": case["category"], "prompt": case["prompt"], "must_include": case["must_include"], "must_preserve": case.get("must_preserve", []), "arms": {}}
        for arm in ("normal", "terse", "macha"):
            trials = []
            for trial in range(1, args.trials + 1):
                print(f"{case['id']} | {arm} | {trial}/{args.trials}", file=sys.stderr)
                output = run_command(args.command, arm_prompt(arm, case["prompt"], skill), args.timeout)
                missing = [value for value in case["must_include"] if value.lower() not in output.lower()]
                missing += [value for value in case.get("must_preserve", []) if value not in output]
                trials.append({"output": output, "tokens": token_counts(output), "missing": missing})
            result["arms"][arm] = trials
        rows.append(result)

    snapshot = {
        "schema_version": 1,
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "model": args.model,
        "runner": safe_command_metadata(args.command),
        "runner_version": runner_version(args.command),
        "trials": args.trials,
        "skill_sha256": sha256(SKILL),
        "prompts_sha256": sha256(PROMPTS),
        "harness_sha256": sha256(HARNESS),
        "tiktoken_version": importlib.metadata.version("tiktoken"),
        "quality_reviewed": False,
        "results": rows,
    }
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(snapshot, indent=2) + "\n", encoding="utf-8")
    print(f"Wrote {args.output}")
    report_snapshot(snapshot, check_fresh=True)


def median_tokens(trials: list[dict], encoding: str) -> int:
    return int(statistics.median(item["tokens"][encoding] for item in trials))


def report_snapshot(snapshot: dict, check_fresh: bool) -> None:
    if check_fresh:
        if snapshot["skill_sha256"] != sha256(SKILL):
            raise SystemExit("stale snapshot: SKILL.md changed")
        if snapshot["prompts_sha256"] != sha256(PROMPTS):
            raise SystemExit("stale snapshot: live-prompts.json changed")
        if snapshot["harness_sha256"] != sha256(HARNESS):
            raise SystemExit("stale snapshot: benchmark_live.py changed")

    print("\n| Arm | o200k median total | cl100k median total | Fidelity checks |")
    print("|---|---:|---:|---:|")
    totals = {}
    for arm in ("normal", "terse", "macha"):
        o200k = sum(median_tokens(row["arms"][arm], "o200k_base") for row in snapshot["results"])
        cl100k = sum(median_tokens(row["arms"][arm], "cl100k_base") for row in snapshot["results"])
        totals[arm] = {"o200k_base": o200k, "cl100k_base": cl100k}
        checks = [not trial["missing"] for row in snapshot["results"] for trial in row["arms"][arm]]
        print(f"| {arm} | {o200k} | {cl100k} | {sum(checks)}/{len(checks)} |")

    for name in ENCODINGS:
        normal = totals["normal"][name]
        terse = totals["terse"][name]
        macha = totals["macha"][name]
        vs_normal = (normal - macha) / normal * 100 if normal else 0
        vs_terse = (terse - macha) / terse * 100 if terse else 0
        print(f"{name}: Macha {vs_normal:.1f}% vs normal; {vs_terse:.1f}% vs terse.")

    print("\nToken checks are not a semantic review.")
    if not snapshot.get("quality_reviewed"):
        print("Quality review: pending. Do not publish a causal savings claim from this snapshot.")


def report(args: argparse.Namespace) -> None:
    snapshot = json.loads(args.snapshot.read_text(encoding="utf-8"))
    report_snapshot(snapshot, check_fresh=not args.allow_stale)


def parser() -> argparse.ArgumentParser:
    root = argparse.ArgumentParser(description=__doc__)
    sub = root.add_subparsers(dest="action", required=True)

    run_parser = sub.add_parser("run", help="run all prompts through a one-shot CLI")
    run_parser.add_argument("--model", required=True, help="model identifier recorded in metadata")
    run_parser.add_argument("--output", type=Path, required=True)
    run_parser.add_argument("--trials", type=int, default=3)
    run_parser.add_argument("--timeout", type=int, default=300)
    run_parser.add_argument("--force", action="store_true", help="replace an existing snapshot")
    run_parser.add_argument("command", nargs=argparse.REMAINDER, help="command reading the prompt on stdin")
    run_parser.set_defaults(func=run)

    report_parser = sub.add_parser("report", help="verify and summarize a snapshot")
    report_parser.add_argument("snapshot", type=Path)
    report_parser.add_argument("--allow-stale", action="store_true")
    report_parser.set_defaults(func=report)
    return root


def main() -> None:
    args = parser().parse_args()
    if args.action == "run":
        if args.command and args.command[0] == "--":
            args.command = args.command[1:]
        if not args.command:
            raise SystemExit("runner command required after --")
        if args.trials < 1:
            raise SystemExit("--trials must be positive")
    args.func(args)


if __name__ == "__main__":
    main()
