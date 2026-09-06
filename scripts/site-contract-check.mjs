import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = join(fileURLToPath(new URL(".", import.meta.url)), "..");
const read = (relativePath) => readFile(join(projectRoot, relativePath), "utf8");

const [page, homeStatus, globalsCss, attacksRoute, liveDefconMap, engagePage, servicesPage, servicesCss, deliverablesPage, methodologyPage, remediationPage, frameworksPage, assurancePage, sectorsPage] = await Promise.all([
  read("app/page.tsx"),
  read("app/home-status.tsx"),
  read("app/globals.css"),
  read("app/api/attacks/route.ts"),
  read("app/live-defcon-map.tsx"),
  read("app/engage/page.tsx"),
  read("app/services/page.tsx"),
  read("app/services/services.module.css"),
  read("app/deliverables/page.tsx"),
  read("app/methodology/page.tsx"),
  read("app/remediation/page.tsx"),
  read("app/frameworks/page.tsx"),
  read("app/assurance/page.tsx"),
  read("app/sectors/page.tsx"),
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
requireText("app/page.tsx", page, 'href="#start">Skip to decision routes</a>');
requireText("app/page.tsx", page, 'href="#start">\n              Choose the first route');
requireText("app/page.tsx", page, "START WITH THE DECISION");
requireText("app/page.tsx", page, "Do not begin with a product label");
requireText("app/page.tsx", page, "decision-card-${tone}");
for (const marker of ["VIEW OPERATING APPROACH", "VIEW EVIDENCE", "VIEW DELIVERY MODEL"]) {
  requireText("app/page.tsx registered-surface actions", page, marker);
}

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
  ".status-label-short { display: inline; }",
  "@media (max-width: 640px) {",
]) {
  requireText("app/globals.css responsive header", globalsCss, marker);
}

for (const marker of [
  'aria-label="ZeroDev public signal status"',
  'READ ONLY',
  './check --public-surface',
  'EU gateway / public signals',
  'Public signal status: ${copy.chip.toLowerCase()}',
]) {
  requireText("app/page.tsx and app/home-status.tsx trust language", `${page}\n${homeStatus}`, marker);
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
  "function getFeedStateCopy(feed: ThreatFeed | null, refreshWaitSeconds: number)",
  "label: 'LIVE / FRESH RESPONSE'",
  "label: 'STALE CACHE'",
  "threat-feed-state",
  "threat-feed-state-detail",
]) {
  requireText("app/live-defcon-map.tsx refresh contract", liveDefconMap, marker);
}

for (const marker of [
  ".threat-feed-state { align-items: center;",
  ".threat-feed-state-detail { color: var(--dim);",
  ".threat-state-stale { background:",
]) {
  requireText("app/globals.css threat feed state contract", globalsCss, marker);
}

for (const marker of [
  'aria-label="Engagement page sections"',
  'href="#role-prep"',
  'href="#intake"',
  'href="#brief-template"',
  'href="#print-brief"',
  'href="#handling"',
  'href="#decision-lanes"',
  'href="#response"',
  'id="role-prep"',
  'id="intake"',
  'id="brief-template"',
  'id="print-brief"',
  'id="handling"',
  'id="decision-lanes"',
  'id="response"',
  'PREPARE BY RESPONSIBILITY',
  'Security / engineering owner',
  'Procurement / vendor risk',
  'Continuity / service owner',
  'Executive / risk / assurance',
  'PRINT / INTERNAL REVIEW COPY',
  'ZERODEVLLC // FIRST BRIEF',
  'NOT AUTHORIZATION',
]) {
  requireText("app/engage/page.tsx route index", engagePage, marker);
}

for (const marker of [
  ".briefSheet { background:",
  ".briefSheetFields > div { border-bottom:",
  ".briefSheetBoundary { border-left:",
]) {
  requireText("app/services/services.module.css print brief contract", servicesCss, marker);
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

const additionalRouteIndexContracts = [
  ["app/deliverables/page.tsx", deliverablesPage, [
    'aria-label="Deliverables page sections"',
    'href="#output-shapes"',
    'href="#evidence-request-map"',
    'href="#synthetic-preview"',
    'href="#evidence-state"',
    'href="#provenance-confidence"',
    'href="#handling-boundary"',
    'id="output-shapes"',
    'id="evidence-request-map"',
    'id="synthetic-preview"',
    'id="evidence-state"',
    'id="provenance-confidence"',
    'id="handling-boundary"',
  ]],
  ["app/methodology/page.tsx", methodologyPage, [
    'aria-label="Methodology page sections"',
    'href="#engagement-lifecycle"',
    'href="#control-baseline"',
    'href="#risk-interpretation"',
    'href="#evidence-outputs"',
    'id="engagement-lifecycle"',
    'id="control-baseline"',
    'id="risk-interpretation"',
    'id="evidence-outputs"',
  ]],
  ["app/remediation/page.tsx", remediationPage, [
    'aria-label="Remediation page sections"',
    'href="#remediation-lifecycle"',
    'href="#action-record"',
    'href="#action-matrix"',
    'href="#status-vocabulary"',
    'href="#closure-boundary"',
    'id="remediation-lifecycle"',
    'id="action-record"',
    'id="action-matrix"',
    'id="status-vocabulary"',
    'id="closure-boundary"',
  ]],
  ["app/frameworks/page.tsx", frameworksPage, [
    'aria-label="Frameworks page sections"',
    'href="#standards-library"',
    'href="#service-framework-map"',
    'href="#procurement-governance"',
    'href="#claims-control"',
    'id="standards-library"',
    'id="service-framework-map"',
    'id="procurement-governance"',
    'id="claims-control"',
  ]],
  ["app/assurance/page.tsx", assurancePage, [
    'aria-label="Assurance page sections"',
    'href="#review-path"',
    'href="#assurance-pillars"',
    'href="#information-handling"',
    'href="#procurement-governance"',
    'href="#claims-control"',
    'id="review-path"',
    'id="assurance-pillars"',
    'id="information-handling"',
    'id="procurement-governance"',
    'id="claims-control"',
  ]],
  ["app/sectors/page.tsx", sectorsPage, [
    'aria-label="Sector fit page sections"',
    'href="#decision-contexts"',
    'href="#qualification-questions"',
    'href="#claims-control"',
    'id="decision-contexts"',
    'id="qualification-questions"',
    'id="claims-control"',
  ]],
];

for (const [label, source, markers] of additionalRouteIndexContracts) {
  for (const marker of markers) requireText(`${label} route index`, source, marker);
}

if (decisionPaths.split("\n").filter((line) => line.trim().startsWith("[")).length !== 4) {
  failures.push("app/page.tsx decisionPaths must retain exactly four decision routes");
}

if (failures.length > 0) throw new Error(failures.join("\n"));

console.log("Decision-routing and public-feed refresh contracts verified.");
