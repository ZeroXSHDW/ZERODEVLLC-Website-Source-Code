import { execFile } from "node:child_process";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";

const execFileAsync = promisify(execFile);
const projectRoot = path.join(
  fileURLToPath(new URL(".", import.meta.url)),
  "..",
);
const textExtensions = new Set([
  ".cjs",
  ".css",
  ".html",
  ".js",
  ".json",
  ".jsx",
  ".md",
  ".mjs",
  ".ts",
  ".tsx",
  ".txt",
  ".xml",
  ".yaml",
  ".yml",
]);
const textBasenames = new Set([
  ".env",
  ".env.example",
  ".env.local",
  ".env.production",
  ".npmrc",
  ".pypirc",
  "dockerfile",
]);
const patterns = [
  { label: "private key", pattern: /-----BEGIN [A-Z ]*PRIVATE KEY-----/ },
  {
    label: "GitHub token",
    pattern: new RegExp(
      `\\b(?:${["ghp", "gho", "ghu", "ghs", "ghr"].join("|")})_[A-Za-z0-9_]{20,}\\b`,
    ),
  },
  { label: "Stripe secret", pattern: /\bsk_(?:live|test)_[A-Za-z0-9]{16,}\b/ },
  {
    label: "OpenAI key",
    pattern: /\bsk-(?:proj|admin|org)-[A-Za-z0-9_-]{20,}\b/,
  },
  { label: "AWS access key", pattern: /\bAKIA[0-9A-Z]{16}\b/ },
  {
    label: "NPM token",
    pattern:
      /\b(?:npm_[A-Za-z0-9]{20,}|_authToken\s*=\s*(?!\$\{)[^\s#]{20,})\b/i,
  },
  { label: "Slack token", pattern: /\bxox[baprs]-[A-Za-z0-9-]{20,}\b/ },
  {
    label: "bearer credential",
    pattern: /Authorization:\s*Bearer\s+[A-Za-z0-9._-]{20,}/i,
  },
];

const { stdout } = await execFileAsync("git", ["ls-files", "-z"], {
  cwd: projectRoot,
  maxBuffer: 4 * 1024 * 1024,
});
const trackedFiles = stdout
  .split("\0")
  .filter(Boolean)
  .filter(
    (file) =>
      textExtensions.has(path.extname(file).toLowerCase()) ||
      textBasenames.has(path.basename(file).toLowerCase()),
  );
const findings = [];

for (const relativeFile of trackedFiles) {
  const absoluteFile = path.join(projectRoot, relativeFile);
  let source;
  try {
    source = await readFile(absoluteFile, "utf8");
  } catch {
    continue;
  }
  for (const { label, pattern } of patterns) {
    if (pattern.test(source)) findings.push(`${relativeFile}: ${label}`);
  }
}

if (findings.length > 0) {
  console.error(
    `Secret hygiene check failed with ${findings.length} finding${findings.length === 1 ? "" : "s"}:`,
  );
  for (const finding of findings) console.error(`- ${finding}`);
  process.exitCode = 1;
} else {
  console.log(
    `Secret hygiene check passed for ${trackedFiles.length} tracked text files.`,
  );
}
