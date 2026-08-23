import assert from "node:assert/strict";
import test from "node:test";

import {
  DEFAULT_TIMEOUT_MS,
  parseTimeoutMs,
  runAudit,
} from "../scripts/security-audit.mjs";

test("dependency-audit timeout defaults are positive and configurable", () => {
  assert.equal(parseTimeoutMs(undefined), DEFAULT_TIMEOUT_MS);
  assert.equal(parseTimeoutMs("1250"), 1250);
  assert.throws(() => parseTimeoutMs("0"), /finite positive/);
  assert.throws(() => parseTimeoutMs("not-a-number"), /finite positive/);
});

test("dependency-audit runner terminates a process that exceeds its bound", async () => {
  const exitCode = await runAudit({
    command: process.execPath,
    args: ["-e", "setTimeout(() => {}, 1000)"],
    timeoutMs: 25,
  });

  assert.equal(exitCode, 124);
});
