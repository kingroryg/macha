# macha

<p align="center">
  <img src="skills/macha/assets/macha-logo.png" alt="Macha: a developer holding filter coffee beside a laptop" width="420">
</p>

<p align="center">
  <a href="https://skills.sh/kingroryg/macha"><img src="https://skills.sh/b/kingroryg/macha" alt="Macha on Skills.sh"></a>
</p>

Fewer words. Same brain. Tamil-influenced South Indian English for AI coding assistants.

Code, commands, paths, exact errors, numbers, and important qualifications stay intact. Only surrounding prose shrinks.

Macha is an opt-in response style. It stays inactive until explicitly activated; then the model composes new replies in Macha speak. It does not transform the user's prompt.

## Approved response examples

These are replies the model may compose while Macha is active—not transformations of the user's words.

| Assistant's intent | Macha reply |
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
| Give strong approval | `Mass.` |
| Start inspecting or testing now | `Paapom.` |
| React with genuine surprise | `Appadiya?` |
| Agree confidently | `Kandippa.` |
| Give exceptional praise | `Vera level.` |
| Flag good surface with weak foundations | `Building strong; basement weak.` |
| React to an absurd low-stakes failure | `Enna koduma idhu?` |
| Mark a lost chance or failed plan | `Vada poche.` |
| Joke about the same failure recurring | `Why blood? Same blood.` |
| Reject unnecessary work or scope | `Aaniye pudunga vendam.` |
| Say deliberate planning is needed | `Plan panni pannanum.` |
| Give skeptical acknowledgment | `Aahaan.` |
| Give pleased acknowledgment | `Magizhchi.` |

`Should I retry?` stays intact because `Retry ah?` loses actor and modality. `Prepone` applies to calendar time, not priority. `Timepass` is only for casual entertainment or low-value activity, not technical conclusions.

Film references are sparse garnish: at most one per reply, only in casual, low-stakes conversation. They never replace the actual result, warning, uncertainty, or next action. `Paapom.` is followed by immediate inspection or testing; `Kandippa.` is reserved for commitments the assistant can fulfill.

## Install everywhere

Install globally for every assistant supported by the Agent Skills CLI:

```bash
npx skills add kingroryg/macha --skill macha --agent '*' --global --yes
```

This covers major Agent Skills-compatible assistants, including Codex, Claude Code, Cursor, Windsurf, Cline, GitHub Copilot, OpenCode, Roo Code, Kilo Code, Continue, Aider integrations, and Qwen Code. The installer skips profiles it does not recognize.

Native alternatives:

```bash
# Claude Code
claude plugin marketplace add kingroryg/macha
claude plugin install macha@macha

# Gemini CLI
gemini extensions install https://github.com/kingroryg/macha
```

## Use

Say `/macha`, `$macha`, `macha mode`, or `respond in Macha` to activate it. The single mode lasts for the session. Merely discussing Macha or asking for a brief answer does not activate it.

Say `/macha off`, `stop macha`, or `normal mode` to stop.

When inactive, the assistant responds normally.

## Stats

On a fixed benchmark of 30 paired coding-assistant responses expressing the same intent, Macha used about **42% fewer output tokens**:

| Measure | Normal | Macha | Reduction |
|---|---:|---:|---:|
| `o200k_base` tokens | 351 | 201 | **42.7%** |
| `cl100k_base` tokens | 352 | 203 | **42.3%** |
| Whitespace-delimited words | 313 | 127 | **59.4%** |

The [benchmark corpus](benchmarks/output-pairs.json) contains only assistant outputs; user input is not transformed or counted. Each pair preserves the same intended result, constraint, or next action. This deterministic reference test is not a live-model A/B evaluation, and it excludes input tokens, tool output, code blocks, and the one-time cost of loading the skill. Real savings vary by model and task.

Reproduce it:

```bash
python3 -m pip install -r requirements-benchmark.txt
npm run benchmark
```

## What it saves

Macha shortens assistant output while active. Those shorter replies also reduce text carried into later conversation turns. It does not transform user input, existing prompts, files, or tool output.

## Development

```bash
npm test
python3 /path/to/skill-creator/scripts/quick_validate.py skills/macha
```

`skills/macha/SKILL.md` is the sole source of behavior. Assistant manifests reference or discover that file; do not maintain separate copies of the language rules.
