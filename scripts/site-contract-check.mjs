import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = join(fileURLToPath(new URL(".", import.meta.url)), "..");
const read = (relativePath) => readFile(join(projectRoot, relativePath), "utf8");

const [page, homeStatus, globalsCss, attacksRoute, liveDefconMap, engagePage, servicesPage, servicesCss, deliverablesPage, methodologyPage, remediationPage, frameworksPage, assurancePage, sectorsPage, privacyPage, errorPage, notFoundPage, loadingPage, siteHeader, siteFooter] = await Promise.all([
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
  read("app/privacy/page.tsx"),
  read("app/error.tsx"),
  read("app/not-found.tsx"),
  read("app/loading.tsx"),
  read("app/site-header.tsx"),
  read("app/site-footer.tsx"),
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
requireText("app/page.tsx skip target", page, 'id="start" tabIndex={-1}');
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
  'Open the DEFCON Signal Fusion EU gateway',
  "target: '_blank', rel: 'noopener noreferrer'",
  'Open the live DEFCON EU gateway; opens in a new tab',
  'Open live DEFCON EU map; opens in a new tab',
]) {
  requireText("app/page.tsx, app/home-status.tsx, and app/live-defcon-map.tsx trust language", `${page}\n${homeStatus}\n${liveDefconMap}`, marker);
}

for (const marker of [
  "document.addEventListener('pointerdown', closeOnPointerDown)",
  "document.body.style.overflow = 'hidden'",
  'ref={headerRef}',
]) {
  requireText("app/home-status.tsx mobile navigation contract", homeStatus, marker);
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
  'role="status" aria-live="polite">{feedState.label}',
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
  'aria-expanded={menuOpen}',
  'styles.headerMenuToggleOpen',
  "document.addEventListener('pointerdown', handlePointerDown)",
  "document.body.style.overflow = 'hidden'",
  'className={styles.headerAction}',
  'href="/engage" aria-label="Prepare a safe first brief"',
]) {
  requireText("app/site-header.tsx shared navigation contract", siteHeader, marker);
}

for (const marker of [
  ".headerAction { align-items: center;",
  ".headerAction:hover, .headerAction:focus-visible",
  ".headerMenuToggleOpen span:first-child",
  ".headerMenuToggleOpen span:nth-child(2)",
  ".headerMenuToggleOpen span:last-child",
]) {
  requireText("app/services/services.module.css shared navigation styles", servicesCss, marker);
}

const routeSignalSources = `${page}\n${servicesPage}\n${engagePage}\n${deliverablesPage}\n${methodologyPage}\n${remediationPage}\n${frameworksPage}\n${assurancePage}\n${sectorsPage}\n${siteHeader}\n${siteFooter}`;
for (const marker of [
  'href="/engage">Prepare a safe first brief <span aria-hidden="true">→</span>',
  'href="/services">Review security and resilience services <span aria-hidden="true">→</span>',
  'href={`/services#service-${number}`}>{path} <span aria-hidden="true">↓</span>',
  'target="_blank" rel="noopener noreferrer" aria-label={`${surface.label}; opens in a new tab`}>{surface.label} <span aria-hidden="true">↗</span>',
]) {
  requireText("same-site and external route signal contract", routeSignalSources, marker);
}

const skipTargetContracts = [
  ["app/services/page.tsx", servicesPage, 'id="services-content" tabIndex={-1}'],
  ["app/engage/page.tsx", engagePage, 'id="engage-content" tabIndex={-1}'],
  ["app/sectors/page.tsx", sectorsPage, 'id="sectors-content" tabIndex={-1}'],
  ["app/deliverables/page.tsx", deliverablesPage, 'id="deliverables-content" tabIndex={-1}'],
  ["app/methodology/page.tsx", methodologyPage, 'id="methodology-content" tabIndex={-1}'],
  ["app/remediation/page.tsx", remediationPage, 'id="remediation-content" tabIndex={-1}'],
  ["app/frameworks/page.tsx", frameworksPage, 'id="frameworks-content" tabIndex={-1}'],
  ["app/assurance/page.tsx", assurancePage, 'id="assurance-content" tabIndex={-1}'],
  ["app/privacy/page.tsx", privacyPage, 'id="privacy-content" tabIndex={-1}'],
  ["app/error.tsx", errorPage, 'id="error-content" tabIndex={-1}'],
  ["app/not-found.tsx", notFoundPage, 'id="not-found-content" tabIndex={-1}'],
  ["app/loading.tsx", loadingPage, 'id="loading-content" tabIndex={-1}'],
];
for (const [label, source, marker] of skipTargetContracts) {
  requireText(`${label} skip target`, source, marker);
}

const claimsProofDiscoveryRoutes = [
  ["app/page.tsx", page, 'href="/assurance#claims-proof">Review claims / proof / gates'],
  ["app/services/page.tsx", servicesPage, 'href="/assurance#claims-proof">Check the claims-to-proof matrix before publishing a stronger statement'],
  ["app/deliverables/page.tsx", deliverablesPage, 'href="/assurance#claims-proof">Use the claims-to-proof matrix before turning evidence into a public claim'],
  ["app/frameworks/page.tsx", frameworksPage, 'href="/assurance#claims-proof">Check the claims-to-proof matrix'],
  ["app/sectors/page.tsx", sectorsPage, 'href="/assurance#claims-proof">Check the claims-to-proof matrix'],
  ["app/methodology/page.tsx", methodologyPage, 'href="/assurance#claims-proof">claims-to-proof matrix'],
  ["app/remediation/page.tsx", remediationPage, 'href="/assurance#claims-proof">Check the claims-to-proof matrix before describing closure publicly'],
];
for (const [label, source, marker] of claimsProofDiscoveryRoutes) {
  requireText(`${label} claims-proof discovery`, source, marker);
}

const scrollableTableSources = [
  ["app/engage/page.tsx", engagePage],
  ["app/services/page.tsx", servicesPage],
  ["app/deliverables/page.tsx", deliverablesPage],
  ["app/assurance/page.tsx", assurancePage],
  ["app/frameworks/page.tsx", frameworksPage],
  ["app/remediation/page.tsx", remediationPage],
];
for (const [label, source] of scrollableTableSources) {
  const wrapperCount = (source.match(/className=\{styles\.actionTableWrap\}/g) ?? []).length;
  const accessibleWrapperCount = (source.match(/className=\{styles\.actionTableWrap\} tabIndex=\{0\} role="region" aria-label="[^"]+"/g) ?? []).length;
  if (wrapperCount !== accessibleWrapperCount) {
    failures.push(`${label} has ${wrapperCount} table wrapper(s) but ${accessibleWrapperCount} keyboard-named wrapper(s)`);
  }
}
requireText("app/services/services.module.css accessible table focus", servicesCss, ".actionTableWrap:focus-visible {");

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
  ".pageIndex { backdrop-filter: blur(18px);",
  "position: sticky; top: 76px; z-index: 9;",
  "background: rgba(5, 10, 8, .96);",
  ".pageIndex ol { display: grid;",
  ".pageIndex a:hover, .pageIndex a:focus-visible",
  ".routeSection { scroll-margin-top: 150px; }",
  ".pageIndex { top: 64px; }",
  ".pageIndex { background: #fff; box-shadow: none; position: static; }",
  ".pageIndex ol { gap: 6px; grid-template-columns: repeat(2, minmax(0, 1fr)); }",
]) {
  requireText("app/services/services.module.css route index", servicesCss, marker);
}

for (const marker of [
  ".frameworkSource { color: var(--dim) !important;",
  ".frameworkFreshness { border-left: 1px solid var(--cyan);",
]) {
  requireText("app/services/services.module.css framework freshness", servicesCss, marker);
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
  'aria-labelledby={`service-heading-${service.number}`}',
  'id={`service-heading-${service.number}`}',
  'aria-label={`Review ${service.title} service briefing pack`}',
  'aria-labelledby={`brief-heading-${brief.number}`}',
  'id={`brief-heading-${brief.number}`}',
  'Safe evidence',
  'Review method',
  'Next gate',
]) {
  requireText("app/services/page.tsx route index", servicesPage, marker);
}

const additionalRouteIndexContracts = [
  ["app/deliverables/page.tsx", deliverablesPage, [
    'aria-label="Deliverables page sections"',
    'href="#output-shapes"',
    'href="#evidence-request-map"',
    'href="#procurement-evidence"',
    'href="#synthetic-preview"',
    'href="#evidence-state"',
    'href="#provenance-confidence"',
    'href="#handling-boundary"',
    'id="output-shapes"',
    'id="evidence-request-map"',
    'id="procurement-evidence"',
    'id="synthetic-preview"',
    'id="evidence-state"',
    'id="provenance-confidence"',
    'id="handling-boundary"',
    'PROCUREMENT / VENDOR RISK EVIDENCE PATH',
    'styles.procurementEvidenceMap',
    'ZeroDev does not approve a supplier',
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
    'href="/assurance#claims-proof"',
    'claims-to-proof matrix',
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
    'href="/assurance#claims-proof"',
    'Check the claims-to-proof matrix before describing closure publicly',
  ]],
  ["app/frameworks/page.tsx", frameworksPage, [
    'aria-label="Frameworks page sections"',
    'href="#reference-control"',
    'href="#standards-library"',
    'href="#service-framework-map"',
    'href="#procurement-governance"',
    'href="#claims-control"',
    'id="reference-control"',
    'id="standards-library"',
    'id="service-framework-map"',
    'id="procurement-governance"',
    'id="claims-control"',
    "const frameworkReviewDate = '2026-09-06';",
    'REFERENCE CURRENCY CONTROL',
    'frameworkFreshnessRules',
    'Publisher:</strong>',
    'Version / edition named:</strong>',
    'Source check:</strong>',
    'recheck before use',
  ]],
  ["app/assurance/page.tsx", assurancePage, [
    'aria-label="Assurance page sections"',
    'href="#review-path"',
    'href="#assurance-pillars"',
    'href="#information-handling"',
    'href="#procurement-governance"',
    'href="#claims-control"',
    'href="#claims-proof"',
    'id="review-path"',
    'id="assurance-pillars"',
    'id="information-handling"',
    'id="procurement-governance"',
    'id="claims-control"',
    'id="claims-proof"',
    'CLAIMS / PROOF / GATES',
    'styles.claimsProofMap',
    'Claims-to-proof matrix',
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
