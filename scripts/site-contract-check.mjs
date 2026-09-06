import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = join(fileURLToPath(new URL(".", import.meta.url)), "..");
const read = (relativePath) => readFile(join(projectRoot, relativePath), "utf8");

const [page, homeStatus, routeIndex, globalsCss, attacksRoute, liveDefconMap, engagePage, servicesPage, servicesCss, deliverablesPage, methodologyPage, remediationPage, frameworksPage, frameworkLibrary, briefActions, assurancePage, sectorsPage, privacyPage, errorPage, notFoundPage, loadingPage, siteHeader, siteFooter, structuredData, layout, roleRoutes, serviceRoutes] = await Promise.all([
  read("app/page.tsx"),
  read("app/home-status.tsx"),
  read("app/route-index.tsx"),
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
  read("app/framework-library.tsx"),
  read("app/brief-actions.tsx"),
  read("app/assurance/page.tsx"),
  read("app/sectors/page.tsx"),
  read("app/privacy/page.tsx"),
  read("app/error.tsx"),
  read("app/not-found.tsx"),
  read("app/loading.tsx"),
  read("app/site-header.tsx"),
  read("app/site-footer.tsx"),
  read("app/structured-data.tsx"),
  read("app/layout.tsx"),
  read("app/role-routes.ts"),
  read("app/service-routes.ts"),
]);

const failures = [];
const requireText = (label, source, marker) => {
  if (!source.includes(marker)) failures.push(`${label} is missing: ${marker}`);
};
const requireRouteIndexText = (label, source, marker) => {
  const variants = [marker];
  if (marker.startsWith('aria-label="')) variants.push(marker.replace(/^aria-label=/, 'ariaLabel='));
  if (marker.startsWith('href="#')) variants.push(marker.replace(/^href="#/, "href: '#").replace(/"$/, "'"));
  if (!variants.some((variant) => source.includes(variant))) failures.push(`${label} is missing: ${marker}`);
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
for (const marker of [
  "decision-card-facts",
  "Entry gate",
  "Owner",
  "First output",
  "A reviewable evidence and treatment path",
]) {
  requireText("app/page.tsx decision card readiness facts", page, marker);
}
for (const marker of [
  'href="#roles"',
  'id="roles"',
  "CHOOSE BY DECISION OWNER",
  "roleRoutes.map((role)",
  "role-card-${role.tone}",
  "role.briefHref",
  "Review the qualification context or prepare a role-aware safe brief",
  "Prepare a role-aware brief for ${role.title}",
]) {
  requireRouteIndexText("app/page.tsx role route chooser", page, marker);
}
for (const marker of [
  "export const roleRoutes = [",
  "'PROCUREMENT / RISK'",
  "'Start with resilience fit'",
  "briefHref",
  "briefPrompt",
  "briefGate",
]) {
  requireText("app/role-routes.ts role route source", roleRoutes, marker);
}
requireText("app/page.tsx skip target", page, 'id="start" tabIndex={-1}');
requireText("app/page.tsx operating summary", page, "String(registeredSurfaceCount).padStart(2, '0')");
requireText("app/page.tsx operating summary", page, "registered surfaces");
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
  ".decision-card, .role-card, .card-mode",
  ".role-grid { display: grid;",
  ".role-card:hover, .role-card:focus-within",
  ".role-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }",
  ".role-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }",
  ".system-card:hover, .system-card:focus-within",
  ".system-card:hover::before, .system-card:focus-within::before",
  ".card-link, .card-detail-link { align-items: center;",
  ".text-link { align-items: center; color: var(--green); display: inline-flex;",
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
  'systems.map((system)',
  'terminalSystemKey(system.name)',
  "system.external ? 'LINK' : 'HOLD'",
  'system.mode.toLowerCase()',
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
  'mobileMenuToggleRef',
  'previouslyFocused?.isConnected',
  'preventScroll: true',
  'ref={headerRef}',
]) {
  requireText("app/home-status.tsx mobile navigation contract", homeStatus, marker);
}

for (const marker of [
  "const [activeSection, setActiveSection] = useState('#start')",
  'const syncHash = () =>',
  'window.location.hash',
  "window.addEventListener('hashchange', syncHash)",
  "new IntersectionObserver",
  "aria-current={activeSection === item.href ? 'location' : undefined}",
]) {
  requireText("app/home-status.tsx active section navigation contract", homeStatus, marker);
}
requireText("app/globals.css active section navigation styles", globalsCss, ".nav a[aria-current='location']::after");

for (const marker of [
  "import { useEffect, useMemo, useState } from 'react'",
  'const sectionsKey = JSON.stringify(sections)',
  'const stableSections = useMemo(() => JSON.parse(sectionsKey) as RouteIndexSection[], [sectionsKey])',
  "const [activeSection, setActiveSection] = useState(sections[0]?.href ?? '')",
  "const syncHash = () =>",
  "window.addEventListener('hashchange', syncHash)",
  "window.removeEventListener('hashchange', syncHash)",
  "new IntersectionObserver",
  "rootMargin: '-150px 0px -55% 0px'",
  '}, [stableSections])',
  "aria-current={activeSection === section.href ? 'location' : undefined}",
  "onClick={() => setActiveSection(section.href)}",
]) {
  requireText("app/route-index.tsx active route index contract", routeIndex, marker);
}
requireText("app/services/services.module.css active route index styles", servicesCss, ".pageIndex a[aria-current='location']");

for (const marker of [
  "<StructuredData />",
  "id=\"zerodevllc-structured-data\"",
  "'@type': 'Organization'",
  "'@type': 'WebSite'",
  "'@type': 'ItemList'",
  "'@type': 'Service'",
  "Authorized penetration testing",
  "#service-01",
  "#service-08",
  "'@id': `https://zerodevllc.com/services${anchor}`",
  "does not create a certification",
]) {
  requireText("structured service discovery contract", `${layout}\n${structuredData}`, marker);
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
  "const DEFAULT_REQUEST_TIMEOUT_MS = 15_000",
  "boundedSeconds(feed.refreshCooldownSeconds, DEFAULT_REFRESH_COOLDOWN_SECONDS, 60)",
  "nextManualRefreshAtRef",
  "requestAbortRef",
  "signal: controller.signal",
  "window.setTimeout(() => controller.abort(), DEFAULT_REQUEST_TIMEOUT_MS)",
  "const refreshAfterMs = (feed?.refreshAfterSeconds ?? 0) * 1000",
  "feed?.checkedAt, feed?.refreshAfterSeconds, feed?.status, feed?.stale",
  '<time dateTime={feed.observedAt}>',
  '<time dateTime={event.observedAt}>',
  "Live public threat feed request timed out",
  "mountedRef.current",
  "function getEventSeverity(value: number)",
  "severity ${severity.label.toLowerCase()}",
  '<th scope="col">Severity</th>',
  "cache: force ? 'no-store' : 'default'",
  "disabled={isRefreshing || refreshWaitSeconds > 0}",
  "Refresh public threat signals; available in ${refreshWaitSeconds} seconds",
  "function getFeedStateCopy(feed: ThreatFeed | null, refreshWaitSeconds: number)",
  "label: 'LIVE / FRESH RESPONSE'",
  "label: 'STALE CACHE'",
  "threat-feed-state",
  "threat-feed-state-detail",
  'role="status" aria-live="polite" aria-atomic="true">{feedState.label}',
  'role="status" aria-live="polite" aria-atomic="true"><i />',
]) {
  requireText("app/live-defcon-map.tsx refresh contract", liveDefconMap, marker);
}

for (const marker of [
  ".threat-feed-state { align-items: center;",
  ".threat-feed-state-detail { color: var(--dim);",
  ".threat-state-stale { background:",
  ".severity-label-high { color: var(--red);",
]) {
  requireText("app/globals.css threat feed state contract", globalsCss, marker);
}

for (const marker of [
  'aria-expanded={menuOpen}',
  'styles.headerMenuToggleOpen',
  "document.addEventListener('pointerdown', handlePointerDown)",
  "document.body.style.overflow = 'hidden'",
  'previouslyFocusedRef',
  'toggleMenu',
  'className={styles.headerAction}',
  'href="/engage" aria-label="Prepare a safe first brief"',
  'className={styles.surfaceBar}',
  'aria-label="Public surface controls"',
  'href="/privacy">View handling boundary',
]) {
  requireText("app/site-header.tsx shared navigation contract", siteHeader, marker);
}

for (const marker of [
  ".headerAction { align-items: center;",
  ".headerAction:hover, .headerAction:focus-visible",
  ".headerMenuToggleOpen span:first-child",
  ".headerMenuToggleOpen span:nth-child(2)",
  ".headerMenuToggleOpen span:last-child",
  ".surfaceBar { align-items: center;",
  ".surfaceBarLive::before",
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
  ["app/methodology/page.tsx", methodologyPage],
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
  'href="#engagement-readiness"',
  'href="#print-brief"',
  'href="#handling"',
  'href="#decision-lanes"',
  'href="#response"',
  'id="role-prep"',
  'id="intake"',
  'id="brief-template"',
  'id="engagement-readiness"',
  'id="print-brief"',
  'id="handling"',
  'id="decision-lanes"',
  'id="response"',
  'PREPARE BY RESPONSIBILITY',
  'Public-sector / government owner',
  'Defense supplier / technology provider',
  'Buyer / third-party-risk owner',
  'Security / engineering / technical owner',
  'Continuity / service / incident owner',
  'Prepare a role-aware brief for ${role}',
  'type BriefContextLink =',
  'links: readonly BriefContextLink[];',
  'selectedService.serviceHref',
  'selectedService.briefHref',
  'styles.briefContextLinks',
  'context.links.map((link)',
  'Review service card',
  'Review briefing pack',
  'PRINT / INTERNAL REVIEW COPY',
  'ENGAGEMENT READINESS / SOW STARTER',
  'styles.sowReadinessMap',
  'aria-label="Engagement readiness and SOW starter table"',
  'Owner acceptance or stop condition',
  'ZERODEVLLC // FIRST BRIEF',
  'NOT AUTHORIZATION',
  'className={styles.briefSheetContextRow}',
  'className={styles.briefSheetGate}',
]) {
  requireRouteIndexText("app/engage/page.tsx route index", engagePage, marker);
}

for (const marker of [
  ".briefSheet { background:",
  ".briefSheetFields > div { border-bottom:",
  ".briefSheetContextRow { background:",
  ".briefSheetGate { border-left:",
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
  ".frameworkRecord { display: grid;",
  ".frameworkRecord dt { color: var(--cyan);",
  ".frameworkRecordLink { color: var(--green);",
  ".actionTable tr:target td { background:",
]) {
  requireText("app/services/services.module.css framework freshness", servicesCss, marker);
}

for (const marker of [
  ".briefContextLinks { align-items: center;",
  ".briefContextLink:hover, .briefContextLink:focus-visible",
]) {
  requireText("app/services/services.module.css brief context links", servicesCss, marker);
}

for (const marker of [
  ".serviceCardActions { align-items: center; display: flex;",
  ".serviceCardActions .primaryLink { align-items: center; font-size: 9px; min-height: 42px;",
]) {
  requireText("app/services/services.module.css service brief actions", servicesCss, marker);
}

for (const marker of [
  'aria-label="Services page sections"',
  'href="#engagement-areas"',
  'href="#briefing-packs"',
  'href="#decision-record"',
  'href="#decision-matrix"',
  'href="#fit-contexts"',
  'href="#controlled-engagement"',
  'href="#claims-limits"',
  'id="engagement-areas"',
  'id="briefing-packs"',
  'id="decision-record"',
  'id="decision-matrix"',
  'id="fit-contexts"',
  'id="controlled-engagement"',
  'id="claims-limits"',
  'aria-labelledby={`service-heading-${service.number}`}',
  'id={`service-heading-${service.number}`}',
  'aria-label={`Review ${service.title} service briefing pack`}',
  "service.slug",
  'href={`/engage?service=${service.slug}`}',
  'aria-label={`Prepare a safe first brief for ${service.title}`}',
  'const entryRoutes =',
  'aria-label="Choose a service route"',
  'styles.entryRoutesGrid',
  'href={route.anchor}',
  'href={route.briefHref}',
  'Do we know what is exposed?',
  'Can we defend the decision?',
  'Can the service keep moving?',
  'const decisionRecord =',
  'aria-labelledby="decision-record-heading"',
  'id="decision-record-heading"',
  'SHARED DECISION RECORD',
  'One record.',
  'Acceptance and treatment',
  'Retest and review trigger',
  'styles.stepList',
  'aria-labelledby={`brief-heading-${brief.number}`}',
  'id={`brief-heading-${brief.number}`}',
  'Safe evidence',
  'Review method',
  'Next gate',
]) {
  requireRouteIndexText("app/services/page.tsx route index", servicesPage, marker);
}
for (const marker of [
  "export const serviceRoutes = [",
  "'authorized-penetration-testing'",
  "'incident-readiness'",
  "briefPrompt",
  "briefGate",
  "serviceHref",
  "briefHref",
]) {
  requireText("app/service-routes.ts service route source", serviceRoutes, marker);
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
    'id={`evidence-request-${number}`}',
  ]],
  ["app/methodology/page.tsx", methodologyPage, [
    'aria-label="Methodology page sections"',
    'href="#engagement-lifecycle"',
    'href="#control-baseline"',
    'href="#rules-of-engagement"',
    'href="#risk-interpretation"',
    'href="#evidence-outputs"',
    'id="engagement-lifecycle"',
    'id="control-baseline"',
    'id="rules-of-engagement"',
    'id="risk-interpretation"',
    'id="evidence-outputs"',
    'RULES OF ENGAGEMENT STARTER',
    'styles.roeMap',
    'aria-label="Rules of engagement starter table"',
    'The public starter is not an authorization',
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
    'FrameworkLibrary',
    'Rev. 5 / Release 5.2.0 published August 27, 2025',
    'Rev. 1 / updates through 2024-11-01',
    'Rev. 3 final / published May 14, 2024',
    'Rev. 3 final / published May 13, 2026',
    'NIST CUI publications (SP 800-171/171A Rev. 3)',
    'NIST CUI publications (SP 800-172/172A Rev. 3)',
    'Publisher-controlled current release; recheck latest',
    '4.0 / page reviewed 2025-08-06',
    '2019 + Amendment 1 (2024); to be revised / 2018',
    'DoD CMMC Program',
    'CMMC assessment, certification, C3PAO, DIBCAC, or DoD authorization',
    'EU NIS2 Directive (EU) 2022/2555',
    'EU DORA Regulation (EU) 2022/2554',
    'EU GDPR Regulation (EU) 2016/679',
    'EU Cyber Resilience Act (EU) 2024/2847',
    'EU Critical Entities Resilience Directive (EU) 2022/2557',
    'Government and defense readiness',
    'Applicability record',
    'Evidence to confirm',
    'Decision owner',
    'Treatment gate',
    'Retest trigger',
    'record.evidenceHref',
    'record.evidenceLabel',
    'styles.frameworkRecordLink',
    'const serviceFrameworkMap = [',
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
    'id={`sector-${number}`}',
    'aria-labelledby={`sector-heading-${number}`}',
  ]],
];

for (const [label, source, markers] of additionalRouteIndexContracts) {
  for (const marker of markers) requireRouteIndexText(`${label} route index`, source, marker);
}

for (const marker of [
  'framework-library-search',
  'history.pushState',
  'history.replaceState',
  "window.addEventListener('popstate'",
  'queryHistoryActiveRef',
  'role="group" aria-label="Filter framework references by category"',
  'aria-pressed={category === option}',
  'className={classNames.libraryShareNote}',
  'FILTERS PERSIST IN LINK',
  'className={classNames.frameworkSource}',
  '<dt>Publisher</dt>',
  '<dt>Version / edition named</dt>',
  'Source check:</strong>',
  'recheck before use',
  'No reference matches that route.',
  'Clear library filters',
]) requireText("app/framework-library.tsx library controls", frameworkLibrary, marker);

for (const marker of [
  '.libraryShareNote { color: var(--green);',
]) requireText("app/services/services.module.css framework library share state", servicesCss, marker);

for (const marker of [
  'navigator.clipboard?.writeText',
  'aria-label="Copy the safe high-level brief to the clipboard"',
  'Copied safe brief.',
  'Clipboard unavailable here; use the email template.',
]) requireText("app/brief-actions.tsx safe copy controls", briefActions, marker);

if (decisionPaths.split("\n").filter((line) => line.trim().startsWith("[")).length !== 4) {
  failures.push("app/page.tsx decisionPaths must retain exactly four decision routes");
}

if (failures.length > 0) throw new Error(failures.join("\n"));

console.log("Decision-routing and public-feed refresh contracts verified.");
