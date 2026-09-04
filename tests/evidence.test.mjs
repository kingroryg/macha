import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import test from "node:test";

const root = new URL("..", import.meta.url);

function runPython(args) {
  return spawnSync("python3", args, {
    cwd: root,
    encoding: "utf8",
  });
}

test("approved compression phrases are token-positive", () => {
  const result = runPython(["scripts/audit_phrase_tokens.py"]);
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /Approved phrases: 51/);
  assert.match(result.stdout, /Token-negative flavour markers/);
});

test("published benchmark evidence matches its inputs and chart", () => {
  const result = runPython(["scripts/check_evidence.py"]);
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /Benchmark evidence is fresh/);
});

test("live benchmark records raw three-arm evidence and detects stale skills", () => {
  const directory = mkdtempSync(join(tmpdir(), "macha-live-test-"));
  const snapshotPath = join(directory, "snapshot.json");
  const exactTerms = "strict equality === parameterized revert git revert HEAD memo useMemo UPDATE RETURNING health check HEALTHCHECK connection ECONNREFUSED 127.0.0.1:5432 major permission Should I retry DROP TABLE users; permanent Summary Testing path";
  const result = runPython([
    "scripts/benchmark_live.py", "run",
    "--model", "fixture-model",
    "--output", snapshotPath,
    "--trials", "1",
    "--", "python3", "-c", `print(${JSON.stringify(exactTerms)})`,
  ]);
  assert.equal(result.status, 0, result.stderr);

  const snapshot = JSON.parse(readFileSync(snapshotPath, "utf8"));
  assert.equal(snapshot.results.length, 12);
  assert.equal(snapshot.quality_reviewed, false);
  assert.equal(snapshot.skill_sha256.length, 64);
  assert.equal(snapshot.prompts_sha256.length, 64);
  for (const row of snapshot.results) {
    assert.deepEqual(Object.keys(row.arms), ["normal", "terse", "macha"]);
    for (const arm of Object.values(row.arms)) {
      assert.deepEqual(arm[0].missing, []);
    }
  }

  snapshot.skill_sha256 = "0".repeat(64);
  const stalePath = join(directory, "stale.json");
  const stale = { ...snapshot };
  writeFileSync(stalePath, JSON.stringify(stale));
  const report = runPython(["scripts/benchmark_live.py", "report", stalePath]);
  assert.notEqual(report.status, 0);
  assert.match(report.stderr, /stale snapshot: SKILL\.md changed/);
});

test("compatibility evidence and CI cover the supported release surface", () => {
  const compatibility = JSON.parse(readFileSync(new URL("../benchmarks/compatibility.json", import.meta.url), "utf8"));
  const workflow = readFileSync(new URL("../.github/workflows/ci.yml", import.meta.url), "utf8");

  assert.equal(compatibility.install_result, "pass");
  assert.equal(compatibility.behavior_result, "not tested");
  for (const profile of ["codex", "claude-code", "gemini-cli", "cursor"]) {
    assert.ok(compatibility.profiles.includes(profile));
  }
  assert.match(workflow, /npm test/);
  assert.match(workflow, /npm run benchmark/);
  assert.match(workflow, /npm run audit:phrases/);
  assert.match(workflow, /npm run check:evidence/);
});
