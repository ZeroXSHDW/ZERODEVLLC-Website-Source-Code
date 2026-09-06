import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = join(fileURLToPath(new URL(".", import.meta.url)), "..");
const read = (relativePath) => readFile(join(projectRoot, relativePath), "utf8");

const [page, globalsCss, attacksRoute, liveDefconMap, engagePage, servicesPage, servicesCss] = await Promise.all([
  read("app/page.tsx"),
  read("app/globals.css"),
  read("app/api/attacks/route.ts"),
  read("app/live-defcon-map.tsx"),
  read("app/engage/page.tsx"),
  read("app/services/page.tsx"),
  read("app/services/services.module.css"),
]);

const failures = [];
const requireText = (label, source, marker) => {
  if (!source.includes(marker)) failures.push(`${label} is missing: ${marker}`);
};

const decisionPaths = page.match(/const decisionPaths = \[(.*?)\] as const;/s)?.[1] ?? "";
for (const marker of [
  "'EXPOSURE'",
  "'ASSURANCE'",
  "'RECOVERY'",
  "'RESPONSE'",
  "'/services#service-01'",
  "'/services#service-03'",
  "'/services#service-07'",
  "'/services#service-08'",
]) {
  requireText("app/page.tsx decisionPaths", decisionPaths, marker);
}
requireText("app/page.tsx", page, 'id="start"');
requireText("app/page.tsx", page, "START WITH THE DECISION");
requireText("app/page.tsx", page, "Do not begin with a product label");
requireText("app/page.tsx", page, "decision-card-${tone}");

for (const marker of [
  ".decision-grid { display: grid;",
  "grid-template-columns: repeat(4, minmax(0, 1fr));",
  ".decision-card:hover, .decision-card:focus-within",
  ".decision-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }",
  ".decision-grid { grid-template-columns: 1fr; }",
  ".decision-card:hover, .decision-card:focus-within,",
  ".decision-card, .card-mode",
]) {
  requireText("app/globals.css decision layout", globalsCss, marker);
}

for (const marker of [
  "@media (max-width: 980px) {",
  ".topbar { min-height: 64px; padding-left: 16px; padding-right: 16px; }",
  ".nav.is-open { display: flex; }",
  ".mobile-menu-toggle { display: inline-flex; margin-left: auto; margin-right: 8px; }",
  ".status-label { display: none; }",
  "@media (max-width: 640px) {",
]) {
  requireText("app/globals.css responsive header", globalsCss, marker);
}

for (const marker of [
  "FORCE_REFRESH_COOLDOWN_MS",
  "lastForcedRefreshAt",
  "requestTime - lastForcedRefreshAt < FORCE_REFRESH_COOLDOWN_MS",
  "refreshCooldownSeconds",
  "Refresh cooling down; showing the last known public signals",
  "Refresh cooling down; try again shortly",
  "sources: [],",
]) {
  requireText("app/api/attacks/route.ts refresh contract", attacksRoute, marker);
}

for (const marker of [
  "DEFAULT_REFRESH_COOLDOWN_SECONDS = 15",
  "boundedSeconds(feed.refreshCooldownSeconds, DEFAULT_REFRESH_COOLDOWN_SECONDS, 60)",
  "nextManualRefreshAtRef",
  "cache: force ? 'no-store' : 'default'",
  "disabled={isRefreshing || refreshWaitSeconds > 0}",
  "Refresh public threat signals; available in ${refreshWaitSeconds} seconds",
]) {
  requireText("app/live-defcon-map.tsx refresh contract", liveDefconMap, marker);
}

for (const marker of [
  'aria-label="Engagement page sections"',
  'href="#intake"',
  'href="#brief-template"',
  'href="#handling"',
  'href="#decision-lanes"',
  'href="#response"',
  'id="intake"',
  'id="brief-template"',
  'id="handling"',
  'id="decision-lanes"',
  'id="response"',
]) {
  requireText("app/engage/page.tsx route index", engagePage, marker);
}

for (const marker of [
  ".pageIndex { border-bottom: 1px solid var(--line);",
  ".pageIndex ol { display: grid;",
  ".pageIndex a:hover, .pageIndex a:focus-visible",
  ".routeSection { scroll-margin-top: 96px; }",
  ".pageIndex ol { gap: 6px; grid-template-columns: repeat(2, minmax(0, 1fr)); }",
]) {
  requireText("app/services/services.module.css route index", servicesCss, marker);
}

for (const marker of [
  'aria-label="Services page sections"',
  'href="#engagement-areas"',
  'href="#briefing-packs"',
  'href="#decision-matrix"',
  'href="#fit-contexts"',
  'href="#controlled-engagement"',
  'href="#claims-limits"',
  'id="engagement-areas"',
  'id="briefing-packs"',
  'id="decision-matrix"',
  'id="fit-contexts"',
  'id="controlled-engagement"',
  'id="claims-limits"',
]) {
  requireText("app/services/page.tsx route index", servicesPage, marker);
}

if (decisionPaths.split("\n").filter((line) => line.trim().startsWith("[")).length !== 4) {
  failures.push("app/page.tsx decisionPaths must retain exactly four decision routes");
}

if (failures.length > 0) throw new Error(failures.join("\n"));

console.log("Decision-routing and public-feed refresh contracts verified.");
