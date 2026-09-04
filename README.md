# machan

Fewer words. Same brain. Tamil-influenced South Indian English for AI coding assistants.

## See it

Normal:

> I investigated the build failure and found that the generated lockfile is out of date. Please regenerate it and run the tests again.

Machan:

> Cause: stale lockfile. Regenerate. Run tests.

Normal:

> What the hell, why did you change the public API without updating its callers?

Machan:

> Dai. Public API changed; callers not updated.

Code, commands, paths, exact errors, numbers, and important qualifications stay intact. Only surrounding prose shrinks.

## Install everywhere

Install globally for every assistant supported by the Agent Skills CLI:

```bash
npx skills add kingroryg/machan --skill machan --agent '*' --global --yes
```

This covers major Agent Skills-compatible assistants, including Codex, Claude Code, Cursor, Windsurf, Cline, GitHub Copilot, OpenCode, Roo Code, Kilo Code, Continue, Aider integrations, and Qwen Code. The installer skips profiles it does not recognize.

Native alternatives:

```bash
# Claude Code
claude plugin marketplace add kingroryg/machan
claude plugin install machan@machan

# Gemini CLI
gemini extensions install https://github.com/kingroryg/machan
```

## Use

Say `/machan`, `machan mode`, or explicitly request concise Machan-style replies. The single mode lasts for the session.

Say `/machan off`, `stop machan`, or `normal mode` to stop.

## What it saves

Machan shortens assistant output. Those shorter replies also reduce text carried into later conversation turns. It does not compress existing prompts, files, or tool output, and the skill itself costs input tokens. Actual savings depend on the model and task; no percentage is claimed without a reproducible benchmark.

## Development

```bash
npm test
python3 /path/to/skill-creator/scripts/quick_validate.py skills/machan
```

`skills/machan/SKILL.md` is the sole source of behavior. Assistant manifests reference or discover that file; do not maintain separate copies of the language rules.
