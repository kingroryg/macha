import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

const skillPath = new URL("../skills/macha/SKILL.md", import.meta.url);
const skill = readFileSync(skillPath, "utf8");

test("canonical skill has valid identity and discriminating trigger", () => {
  assert.match(skill, /^---\nname: macha\n/);
  assert.match(skill, /Use only when the user explicitly activates/);
  assert.match(skill, /Generic requests for brevity do not activate it/);
});

test("skill defines one mode and an off switch", () => {
  assert.match(skill, /When active, compose each new assistant reply directly in compact/);
  assert.match(skill, /`\/macha off`/);
  assert.doesNotMatch(skill, /\b(?:lite|full|ultra)\b/i);
});

test("approved vocabulary and high-context rewrites are present", () => {
  for (const phrase of [
    "What'll you do?",
    "Dai.",
    "Why like this?",
    "What to do?",
    "Done ah?",
    "Same bug, no?",
    "Tests passed?",
    "Release ready ah?",
    "You want patch?",
    "Correct ah?",
    "Possible ah?",
    "Same ah?",
    "Just move this.",
    "Just check once.",
    "Can manage.",
    "No tension.",
    "No chance.",
    "Leave it.",
    "Coming.",
    "Will check.",
    "Tell.",
    "One sec.",
    "Seri.",
    "Aiyo.",
    "Super.",
    "Saama.",
    "Prepone the meeting.",
    "Just timepass.",
    "Mass.",
    "Paapom.",
    "Appadiya?",
    "Kandippa.",
    "Vera level.",
    "Building strong; basement weak.",
    "Enna koduma idhu?",
    "Vada poche.",
    "Why blood? Same blood.",
    "Aaniye pudunga vendam.",
    "Plan panni pannanum.",
    "Aahaan.",
    "Magizhchi.",
    "`macha`",
    "`da`",
  ]) {
    assert.ok(skill.includes(phrase), `missing approved phrase: ${phrase}`);
  }
});

test("skill is an activated response style, not an input rewriter", () => {
  assert.match(skill, /Remain inactive until the user explicitly says/);
  assert.match(skill, /compose each new assistant reply directly/);
  assert.match(skill, /not a rewriting operation/);
  assert.match(skill, /Never transform user input/);
  assert.match(skill, /style only new assistant replies/);
  assert.doesNotMatch(skill, /No scene\./);
  assert.doesNotMatch(skill, /\bSemma\b/);
});

test("precision boundaries protect technical and sensitive content", () => {
  for (const requirement of [
    "Never lose negation",
    "exact errors unchanged",
    "security warnings",
    "destructive actions",
    "formal artifacts",
    "accent caricature",
  ]) {
    assert.ok(skill.includes(requirement), `missing boundary: ${requirement}`);
  }
});

test("pop-culture responses stay sparse, low-stakes, and informative", () => {
  assert.match(skill, /at most one film reference per reply/);
  assert.match(skill, /only in casual, low-stakes conversation/);
  assert.match(skill, /Never let it replace a concrete result, warning, uncertainty, or next action/);
  assert.match(skill, /Paapom.*immediate inspection or testing/);
  assert.match(skill, /Kandippa.*commitments the assistant can fulfill/);
});

test("assistant manifests point to the canonical skill", () => {
  const gemini = JSON.parse(readFileSync(new URL("../gemini-extension.json", import.meta.url), "utf8"));
  const geminiContext = readFileSync(new URL("../GEMINI.md", import.meta.url), "utf8").trim();
  const claudePlugin = JSON.parse(readFileSync(new URL("../.claude-plugin/plugin.json", import.meta.url), "utf8"));
  const claudeMarketplace = JSON.parse(readFileSync(new URL("../.claude-plugin/marketplace.json", import.meta.url), "utf8"));
  const packageJson = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8"));

  assert.equal(gemini.name, "macha");
  assert.equal(gemini.contextFileName, "GEMINI.md");
  assert.equal(geminiContext, "@./skills/macha/SKILL.md");
  assert.equal(claudePlugin.name, "macha");
  assert.equal(claudePlugin.version, gemini.version);
  assert.equal(claudeMarketplace.name, "macha");
  assert.equal(claudeMarketplace.plugins[0].name, "macha");
  assert.equal(claudeMarketplace.plugins[0].source, "./");
  assert.equal(packageJson.name, "macha-skill");
});

test("README and Codex metadata use the packaged logo", () => {
  const logo = new URL("../skills/macha/assets/macha-logo.png", import.meta.url);
  const readme = readFileSync(new URL("../README.md", import.meta.url), "utf8");
  const openai = readFileSync(new URL("../skills/macha/agents/openai.yaml", import.meta.url), "utf8");

  assert.ok(existsSync(logo));
  assert.deepEqual([...readFileSync(logo).subarray(0, 8)], [137, 80, 78, 71, 13, 10, 26, 10]);
  assert.match(readme, /skills\/macha\/assets\/macha-logo\.png/);
  assert.match(readme, /https:\/\/skills\.sh\/b\/kingroryg\/macha/);
  assert.match(openai, /icon_small: "\.\/assets\/macha-logo\.png"/);
  assert.match(openai, /icon_large: "\.\/assets\/macha-logo\.png"/);
  assert.match(openai, /allow_implicit_invocation: false/);
  const legacySkillPath = new URL(`../skills/${"ma" + "chan"}`, import.meta.url);
  assert.equal(existsSync(legacySkillPath), false);
});

test("README presents every approved phrase as assistant output", () => {
  const readme = readFileSync(new URL("../README.md", import.meta.url), "utf8");
  for (const phrase of [
    "What'll you do?", "Why like this?", "Now what?", "What to do?", "Check this?",
    "Thoughts?", "Done ah?", "Same bug, no?", "You want patch?", "Tests passed?",
    "Release ready ah?", "Regression ah?", "Both green ah?", "Correct ah?",
    "Possible ah?", "Same ah?", "Just move this.", "Just check once.", "Done already.",
    "Will do now.", "Will check.", "Can manage.", "No tension.", "No chance.",
    "Leave it.", "Coming.", "Tell.", "One sec.", "No need.", "Not possible.",
    "Seri.", "Aiyo.", "Super.", "Saama.", "Dai.", "Prepone the meeting.",
    "Just timepass.", "Mass.", "Paapom.", "Appadiya?", "Kandippa.",
    "Vera level.", "Building strong; basement weak.", "Enna koduma idhu?",
    "Vada poche.", "Why blood? Same blood.", "Aaniye pudunga vendam.",
    "Plan panni pannanum.", "Aahaan.", "Magizhchi.",
  ]) {
    assert.ok(readme.includes(phrase), `README missing approved phrase: ${phrase}`);
  }
  assert.match(readme, /replies the model may compose/);
  assert.match(readme, /not transformations of the user's words/);
  assert.match(readme, /at most one per reply/);
});

test("token benchmark is reproducible and documented without overclaiming", () => {
  const cases = JSON.parse(readFileSync(new URL("../benchmarks/output-pairs.json", import.meta.url), "utf8"));
  const readme = readFileSync(new URL("../README.md", import.meta.url), "utf8");
  const ids = new Set(cases.map(({ id }) => id));

  assert.equal(cases.length, 30);
  assert.equal(ids.size, cases.length);
  for (const item of cases) {
    assert.ok(item.intent?.trim());
    assert.ok(item.normal_output?.trim());
    assert.ok(item.macha_output?.trim());
  }

  assert.match(readme, /42\.7%/);
  assert.match(readme, /42\.3%/);
  assert.match(readme, /not a live-model A\/B evaluation/);
  assert.match(readme, /one-time cost of loading the skill/);
});
