import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

const skillPath = new URL("../skills/macha/SKILL.md", import.meta.url);
const skill = readFileSync(skillPath, "utf8");

test("package ships under the MIT license", () => {
  const license = readFileSync(new URL("../LICENSE", import.meta.url), "utf8");
  const packageJson = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8"));

  assert.match(license, /^MIT License/);
  assert.match(license, /Copyright \(c\) 2026 Sarthak Munshi/);
  assert.equal(packageJson.license, "MIT");
});

test("canonical skill has valid identity and discriminating trigger", () => {
  assert.match(skill, /^---\nname: macha\n/);
  assert.match(skill, /entire message is \/macha on/);
  assert.match(skill, /Quoted commands, discussion, and brevity requests do not count/);
});

test("skill defines one mode and an off switch", () => {
  assert.match(skill, /Write new replies in compact/);
  assert.match(skill, /standalone message `\/macha on` activates/);
  assert.match(skill, /`\/macha off` deactivates/);
  assert.match(skill, /Reply `Seri\.` to on and `Okay\.` to off/);
  assert.doesNotMatch(skill, /macha mode|normal mode|respond in Macha|stop macha/);
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
    "Paavam.",
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
  assert.match(skill, /Only the standalone message `\/macha on` activates Macha/);
  assert.match(skill, /Write new replies/);
  assert.match(skill, /Never rewrite input/);
  assert.match(skill, /do not add a second answer/);
  assert.doesNotMatch(skill, /No scene\./);
  assert.doesNotMatch(skill, /\bSemma\b/);
});

test("precision boundaries protect technical and sensitive content", () => {
  for (const requirement of [
    "Preserve negation",
    "exact errors unchanged",
    "security",
    "destructive actions",
    "Persisted artifacts",
    "accent caricature",
  ]) {
    assert.ok(skill.includes(requirement), `missing boundary: ${requirement}`);
  }
});

test("pop-culture responses stay sparse, low-stakes, and informative", () => {
  assert.match(skill, /Film references: casual, low-stakes, max one, never instead of substance/);
  assert.match(skill, /Paapom.*immediate work/);
  assert.match(skill, /Kandippa.*achievable work/);
  assert.match(skill, /One approved flavour marker.*max one per short reply/);
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
  assert.match(readme, /https:\/\/img\.shields\.io\/badge\/dynamic\/json/);
  assert.match(readme, /skills\.sh%2Fapi%2Fsearch%3Fq%3Dkingroryg%252Fmacha/);
  assert.match(readme, /https:\/\/skills\.sh\/kingroryg\/macha\/macha/);
  assert.match(openai, /icon_small: "\.\/assets\/macha-logo\.png"/);
  assert.match(openai, /icon_large: "\.\/assets\/macha-logo\.png"/);
  assert.match(openai, /allow_implicit_invocation: true/);
  const legacySkillPath = new URL(`../skills/${"ma" + "chan"}`, import.meta.url);
  assert.equal(existsSync(legacySkillPath), false);
});

test("README presents every approved phrase as assistant output", () => {
  const readme = readFileSync(new URL("../README.md", import.meta.url), "utf8");
  assert.match(readme, /Send `\/macha on` to turn it on\. Send `\/macha off` to turn it off\./);
  for (const phrase of [
    "What'll you do?", "Why like this?", "Now what?", "What to do?", "Check this?",
    "Thoughts?", "Done ah?", "Same bug, no?", "You want patch?", "Tests passed?",
    "Release ready ah?", "Regression ah?", "Both green ah?", "Correct ah?",
    "Possible ah?", "Same ah?", "Just move this.", "Just check once.", "Done already.",
    "Will do now.", "Will check.", "Can manage.", "No tension.", "No chance.",
    "Leave it.", "Coming.", "Tell.", "One sec.", "No need.", "Not possible.",
    "Seri.", "Aiyo.", "Paavam.", "Super.", "Saama.", "Dai.", "Prepone the meeting.",
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
  const chart = new URL("../skills/macha/assets/token-savings.png", import.meta.url);
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
  assert.ok(existsSync(chart));
  assert.deepEqual([...readFileSync(chart).subarray(0, 8)], [137, 80, 78, 71, 13, 10, 26, 10]);
  assert.match(readme, /skills\/macha\/assets\/token-savings\.png/);
  assert.match(readme, /not a live-model A\/B evaluation/);
  assert.match(readme, /skill-loading cost/);
  assert.match(readme, /983–996 tokens/);
});
