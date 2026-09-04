# machan

<p align="center">
  <img src="skills/machan/assets/machan-logo.png" alt="Machan: a developer holding filter coffee beside a laptop" width="420">
</p>

Fewer words. Same brain. Tamil-influenced South Indian English for AI coding assistants.

## See it

When the assistant finds a stale generated lockfile, it replies:

> Cause: stale lockfile. Regenerate. Run tests.

When the assistant finds an uncoordinated public API change during an established casual exchange, it may reply:

> Dai. Public API changed; callers not updated.

Code, commands, paths, exact errors, numbers, and important qualifications stay intact. Only surrounding prose shrinks.

Machan is an opt-in response style. It stays inactive until explicitly activated; then the model composes new replies in Machan speak. It does not transform the user's prompt.

## Approved response examples

These are replies the model may compose while Machan is active—not transformations of the user's words.

| Assistant's intent | Machan reply |
|---|---|
| Ask what the user will do | `What'll you do?` |
| Question the approach | `Why like this?` |
| Ask what happens next | `Now what?` |
| Express resignation | `What to do?` |
| Request a check | `Check this?` |
| Invite an opinion | `Thoughts?` |
| Ask whether work is complete | `Done ah?` |
| Confirm it is the same bug | `Same bug, no?` |
| Offer to make a patch | `You want patch?` |
| Ask whether tests passed | `Tests passed?` |
| Ask whether a release is ready | `Release ready ah?` |
| Check for a regression | `Regression ah?` |
| Confirm both checks are green | `Both green ah?` |
| Confirm correctness, possibility, or sameness | `Correct ah?` / `Possible ah?` / `Same ah?` |
| Make a low-stakes request | `Just move this.` / `Just check once.` |
| Report completed or immediate work | `Done already.` / `Will do now.` |
| Promise a check | `Will check.` |
| Say the task is manageable | `Can manage.` |
| Reassure | `No tension.` |
| Reject a possibility | `No chance.` |
| Recommend dropping something | `Leave it.` |
| Say the assistant is joining or arriving | `Coming.` |
| Invite the user to speak | `Tell.` |
| Ask for a moment | `One sec.` |
| Say something is unnecessary or impossible | `No need.` / `Not possible.` |
| Acknowledge | `Seri.` |
| React with distress, approval, or strong praise | `Aiyo.` / `Super.` / `Saama.` |
| Give a playful rebuke after casual rapport | `Dai.` |
| Move an event earlier | `Prepone the meeting.` |
| Describe casual, purposeless activity | `Just timepass.` |

`Should I retry?` stays intact because `Retry ah?` loses actor and modality. `Prepone` applies to calendar time, not priority. `Timepass` is only for casual entertainment or low-value activity, not technical conclusions.

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

Say `/machan`, `$machan`, `machan mode`, or `respond in Machan` to activate it. The single mode lasts for the session. Merely discussing Machan or asking for a brief answer does not activate it.

Say `/machan off`, `stop machan`, or `normal mode` to stop.

When inactive, the assistant responds normally.

## What it saves

Machan shortens assistant output while active. Those shorter replies also reduce text carried into later conversation turns. It does not transform user input, existing prompts, files, or tool output, and the skill itself costs input tokens. Actual savings depend on the model and task; no percentage is claimed without a reproducible benchmark.

## Development

```bash
npm test
python3 /path/to/skill-creator/scripts/quick_validate.py skills/machan
```

`skills/machan/SKILL.md` is the sole source of behavior. Assistant manifests reference or discover that file; do not maintain separate copies of the language rules.
