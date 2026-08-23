import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = join(fileURLToPath(new URL(".", import.meta.url)), "..");
const nextConfig = await readFile(join(projectRoot, "next.config.js"), "utf8");
const proxy = await readFile(join(projectRoot, "proxy.ts"), "utf8");
const layout = await readFile(join(projectRoot, "app/layout.tsx"), "utf8");
const serviceWorker = await readFile(join(projectRoot, "public/sw.js"), "utf8");
const serviceWorkerManager = await readFile(
  join(projectRoot, "lib/serviceWorker.ts"),
  "utf8",
);
const serviceWorkerCache = await readFile(
  join(projectRoot, "lib/cache/serviceWorkerCache.ts"),
  "utf8",
);
const errorRecovery = await readFile(
  join(projectRoot, "lib/utils/errorRecovery.ts"),
  "utf8",
);
const publicSecurityPolicy = await readFile(
  join(projectRoot, "public/SECURITY.md"),
  "utf8",
);
const securityTxt = await readFile(
  join(projectRoot, "public/.well-known/security.txt"),
  "utf8",
);
const robots = await readFile(join(projectRoot, "public/robots.txt"), "utf8");
const sitemap = await readFile(join(projectRoot, "public/sitemap.xml"), "utf8");
const packageJson = await readFile(join(projectRoot, "package.json"), "utf8");
const secretHygiene = await readFile(
  join(projectRoot, "scripts/secret-hygiene.mjs"),
  "utf8",
);
const ciWorkflow = await readFile(
  join(projectRoot, ".github/workflows/ci.yml"),
  "utf8",
);
const requiredMarkers = [
  'source: "/:path*"',
  "poweredByHeader: false",
  "Content-Security-Policy",
  "default-src 'self'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "object-src 'none'",
  "script-src-attr 'none'",
  "style-src-attr 'none'",
  "connect-src 'self' https://www.gstatic.com",
  "worker-src 'self' blob:",
  "Permissions-Policy",
  "clipboard-read=()",
  "clipboard-write=()",
  "microphone=()",
  "payment=()",
  "Strict-Transport-Security",
  "includeSubDomains; preload",
  "X-Content-Type-Options",
  "X-Frame-Options",
  "X-Permitted-Cross-Domain-Policies",
  "Cross-Origin-Opener-Policy",
  "Cross-Origin-Resource-Policy",
  "Cross-Origin-Embedder-Policy",
  "Origin-Agent-Cluster",
  "X-DNS-Prefetch-Control",
];

const failures = requiredMarkers
  .filter((marker) => !nextConfig.includes(marker))
  .map((marker) => `next.config.js is missing ${marker}`);
for (const marker of [
  "function contentSecurityPolicy",
  "function createNonce",
  "crypto.getRandomValues",
  'requestHeaders.set("x-nonce"',
  'requestHeaders.set("content-security-policy"',
  "'nonce-${nonce}'",
  "NextResponse.next({ request: { headers: requestHeaders } })",
  'matcher: ["/((?!_next/static).*)"]',
]) {
  if (!proxy.includes(marker))
    failures.push(
      `proxy.ts is missing nonce-backed CSP enforcement: ${marker}`,
    );
}
if (nextConfig.includes("script-src 'self' 'unsafe-inline'")) {
  failures.push("next.config.js must not allow unsafe inline scripts");
}
if (!layout.includes('export const dynamic = "force-dynamic"')) {
  failures.push(
    "app/layout.tsx must force dynamic rendering for nonce-backed CSP",
  );
}
if (nextConfig.includes("X-XSS-Protection"))
  failures.push("next.config.js must not rely on deprecated X-XSS-Protection");
for (const marker of [
  'const CACHE_PREFIX = "zerodevllc-sw-"',
  "url.origin === self.location.origin",
  'url.pathname.startsWith("/api/")',
  'request.mode === "navigate"',
  'response.type !== "basic"',
  'response.headers.has("set-cookie")',
  'url.search === ""',
  "async function deleteOwnedCaches",
  "event.ports[0]",
]) {
  if (!serviceWorker.includes(marker))
    failures.push(`public/sw.js is missing cache isolation control: ${marker}`);
}
if (
  serviceWorker.includes('self.addEventListener("sync"') ||
  serviceWorker.includes('self.addEventListener("push"')
) {
  failures.push("public/sw.js must not install unused background handlers");
}
for (const marker of [
  'if (!("serviceWorker" in navigator) || this.registration) return;',
  'getRegistration("/")',
  'updateViaCache: "none"',
  "setConfig(config)",
  "useRef<ServiceWorkerManager | null>(null)",
]) {
  if (!serviceWorkerManager.includes(marker))
    failures.push(
      `lib/serviceWorker.ts is missing stable registration control: ${marker}`,
    );
}
for (const marker of [
  'const CACHE_PREFIX = "zerodevllc-sw-"',
  'getRegistration("/")',
  "Refusing to open an unmanaged cache",
  'credentials: "omit"',
  "Offline request queue is disabled",
  "Array.from(OWNED_CACHE_NAMES)",
]) {
  if (!serviceWorkerCache.includes(marker))
    failures.push(
      `lib/cache/serviceWorkerCache.ts is missing cache isolation control: ${marker}`,
    );
}
if (serviceWorkerCache.includes("localStorage.setItem"))
  failures.push(
    "lib/cache/serviceWorkerCache.ts must not persist arbitrary request data",
  );
for (const marker of [
  'const SERVICE_WORKER_CACHE_PREFIX = "zerodevllc-sw-"',
  "name.startsWith(SERVICE_WORKER_CACHE_PREFIX)",
  "localStorage.removeItem(key)",
]) {
  if (!errorRecovery.includes(marker))
    failures.push(
      `lib/utils/errorRecovery.ts is missing scoped cleanup: ${marker}`,
    );
}
if (errorRecovery.includes("localStorage.clear()"))
  failures.push("error recovery must not wipe unrelated local storage");
for (const [label, text, markers] of [
  [
    "public/SECURITY.md",
    publicSecurityPolicy,
    [
      "Report suspected vulnerabilities privately",
      "hello@zerodevllc.com",
      "Do not publish",
    ],
  ],
  [
    "public/.well-known/security.txt",
    securityTxt,
    [
      "Contact: mailto:hello@zerodevllc.com",
      "Expires: ",
      "Canonical: https://zerodevllc.com/.well-known/security.txt",
      "Policy: https://zerodevllc.com/SECURITY.md",
    ],
  ],
  [
    "public/robots.txt",
    robots,
    [
      "User-agent: *",
      "Allow: /",
      "Disallow: /api/",
      "Sitemap: https://zerodevllc.com/sitemap.xml",
    ],
  ],
  [
    "public/sitemap.xml",
    sitemap,
    ["<urlset", "<loc>https://zerodevllc.com/</loc>"],
  ],
]) {
  for (const marker of markers) {
    if (!text.includes(marker)) failures.push(`${label} is missing ${marker}`);
  }
}
const requiredCiMarkers = [
  "permissions:",
  "contents: read",
  "push: {}",
  "timeout-minutes: 30",
  "persist-credentials: false",
  "actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1",
  "actions/setup-node@820762786026740c76f36085b0efc47a31fe5020",
  "npm ci --ignore-scripts",
  "npm run quality",
];
for (const marker of requiredCiMarkers) {
  if (!ciWorkflow.includes(marker))
    failures.push(`.github/workflows/ci.yml is missing ${marker}`);
}
if (!packageJson.includes("scripts/secret-hygiene.mjs"))
  failures.push(
    "package.json security script must run scripts/secret-hygiene.mjs",
  );
for (const marker of [
  "git",
  "ls-files",
  "textExtensions",
  ".sh",
  ".ps1",
  ".sql",
  ".toml",
  ".tf",
  ".envrc",
  "textBasenames",
  "path.basename",
  "private key",
  "GitHub token",
  "Stripe secret",
  "OpenAI key",
  "AWS access key",
  "NPM token",
  "Slack token",
  "bearer credential",
]) {
  if (!secretHygiene.includes(marker))
    failures.push(`scripts/secret-hygiene.mjs is missing ${marker}`);
}
const securityExpiry = securityTxt.match(/^Expires:\s*(.+)$/m)?.[1];
const securityExpiryAt = securityExpiry
  ? Date.parse(securityExpiry)
  : Number.NaN;
if (
  !securityExpiry ||
  Number.isNaN(securityExpiryAt) ||
  securityExpiryAt <= Date.now()
)
  failures.push("security.txt must have a future Expires value");

if (failures.length) {
  console.error(failures.join("\n"));
  process.exitCode = 1;
} else {
  console.log("Security header policy verified for the corporate application.");
}
