import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("quality documentation and configuration share one coverage contract", async () => {
  const [packageJson, jestConfig, readme, contributing, workflow] = await Promise.all([
    readFile(new URL("../package.json", import.meta.url), "utf8"),
    readFile(new URL("../jest.config.js", import.meta.url), "utf8"),
    readFile(new URL("../README.md", import.meta.url), "utf8"),
    readFile(new URL("../CONTRIBUTING.md", import.meta.url), "utf8"),
    readFile(new URL("../.github/workflows/ci.yml", import.meta.url), "utf8"),
  ]);

  const packageData = JSON.parse(packageJson);
  assert.equal(packageData.scripts["patch-hygiene"], "git diff --check");
  assert.match(packageData.scripts.quality, /^npm run patch-hygiene &&/);
  assert.match(packageData.scripts.quality, /test:coverage/);
  assert.match(packageData.scripts.security, /repository-contract\.test\.mjs/);
  for (const [metric, floor] of [
    ["statements", 20],
    ["branches", 15],
    ["functions", 20],
    ["lines", 20],
  ]) {
    assert.match(jestConfig, new RegExp(`${metric}:\\s*${floor}`));
  }

  assert.match(readme, /npm run quality/);
  assert.match(readme, /20% statements/);
  assert.match(readme, /15% branches/);
  assert.match(readme, /20% functions/);
  assert.match(readme, /20% lines/);
  assert.match(contributing, /20% statements/);
  assert.match(contributing, /15% branches/);
  assert.match(contributing, /20% functions/);
  assert.match(contributing, /20% lines/);
  assert.match(readme, /npm run patch-hygiene/);
  assert.match(workflow, /name: Check patch hygiene[\s\S]*run: git diff --check/);
});


test("README documents the runtime security boundaries", async () => {
  const readme = await readFile(new URL("../README.md", import.meta.url), "utf8");

  for (const heading of ["## Architecture and runtime boundaries", "## Project Structure", "## Security", "## Troubleshooting"]) {
    assert.match(readme, new RegExp(heading.replace(/[.*+?^{}()|[\]\\]/g, "\\$&")));
  }
  assert.match(readme, /nonce-backed CSP/);
  assert.match(readme, /same-origin public static and model assets/);
  assert.match(readme, /rejects API, HTML, credentialed/);
  assert.match(readme, /browser-only WebGL\/UI/);
});
