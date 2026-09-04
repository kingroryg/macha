import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const skillPath = new URL("../skills/machan/SKILL.md", import.meta.url);
const skill = readFileSync(skillPath, "utf8");

test("canonical skill has valid identity and discriminating trigger", () => {
  assert.match(skill, /^---\nname: machan\n/);
  assert.match(skill, /Use for \/machan/);
  assert.match(skill, /not for generic brevity alone/);
});

test("skill defines one mode and an off switch", () => {
  assert.match(skill, /Reply in one compact mode/);
  assert.match(skill, /`\/machan off`/);
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
    "Seri.",
    "Aiyo.",
    "No scene.",
    "`macha`",
    "`machan`",
    "`da`",
  ]) {
    assert.ok(skill.includes(phrase), `missing approved phrase: ${phrase}`);
  }
});

test("precision boundaries protect technical and sensitive content", () => {
  for (const requirement of [
    "Never lose negation",
    "exact error messages unchanged",
    "security warnings",
    "destructive actions",
    "formal artifacts",
    "accent caricature",
  ]) {
    assert.ok(skill.includes(requirement), `missing boundary: ${requirement}`);
  }
});

test("assistant manifests point to the canonical skill", () => {
  const gemini = JSON.parse(readFileSync(new URL("../gemini-extension.json", import.meta.url), "utf8"));
  const geminiContext = readFileSync(new URL("../GEMINI.md", import.meta.url), "utf8").trim();
  const claudePlugin = JSON.parse(readFileSync(new URL("../.claude-plugin/plugin.json", import.meta.url), "utf8"));
  const claudeMarketplace = JSON.parse(readFileSync(new URL("../.claude-plugin/marketplace.json", import.meta.url), "utf8"));

  assert.equal(gemini.name, "machan");
  assert.equal(gemini.contextFileName, "GEMINI.md");
  assert.equal(geminiContext, "@./skills/machan/SKILL.md");
  assert.equal(claudePlugin.name, "machan");
  assert.equal(claudePlugin.version, gemini.version);
  assert.equal(claudeMarketplace.plugins[0].source, "./");
});
