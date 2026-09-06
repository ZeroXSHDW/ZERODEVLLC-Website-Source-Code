import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = join(fileURLToPath(new URL(".", import.meta.url)), "..");
const read = (relativePath) =>
  readFile(join(projectRoot, relativePath), "utf8");
const readOptional = async (relativePath) => {
  try {
    return await read(relativePath);
  } catch (error) {
    if (error?.code === "ENOENT") return "";
    throw error;
  }
};

const [
  proxy,
  robots,
  sitemap,
  securityTxt,
  securityPolicy,
  publicSecurityPolicy,
  layout,
  nextConfig,
  liveDefconMap,
  privacyPage,
  servicesPage,
  methodologyPage,
  frameworksPage,
  engagePage,
  deliverablesPage,
  assurancePage,
  siteFooter,
  sectorsPage,
  remediationPage,
  notFoundPage,
  errorPage,
  loadingPage,
  siteHeader,
  homeStatus,
  checkoutRoute,
  attacksRoute,
  page,
  qualityWorkflow,
  dependabot,
  packageJson,
  securityAudit,
  secretHygiene,
  globalsCss,
  servicesCss,
  privacyCss,
] = await Promise.all([
  read("proxy.ts"),
  read("app/robots.ts"),
  read("app/sitemap.ts"),
  read("public/.well-known/security.txt"),
  read("SECURITY.md"),
  read("public/SECURITY.md"),
  read("app/layout.tsx"),
  read("next.config.ts"),
  read("app/live-defcon-map.tsx"),
  read("app/privacy/page.tsx"),
  read("app/services/page.tsx"),
  read("app/methodology/page.tsx"),
  read("app/frameworks/page.tsx"),
  read("app/engage/page.tsx"),
  read("app/deliverables/page.tsx"),
  read("app/assurance/page.tsx"),
  read("app/site-footer.tsx"),
  read("app/sectors/page.tsx"),
  read("app/remediation/page.tsx"),
  read("app/not-found.tsx"),
  read("app/error.tsx"),
  read("app/loading.tsx"),
  read("app/site-header.tsx"),
  read("app/home-status.tsx"),
  readOptional("app/api/checkout/route.ts"),
  read("app/api/attacks/route.ts"),
  read("app/page.tsx"),
  read(".github/workflows/quality.yml"),
  read(".github/dependabot.yml"),
  read("package.json"),
  read("scripts/security-audit.mjs"),
  read("scripts/secret-hygiene.mjs"),
  read("app/globals.css"),
  read("app/services/services.module.css"),
  read("app/privacy/privacy.module.css"),
]);
const nodeVersion = await read(".node-version");

const canonicalMatch = proxy.match(/const canonicalHost = ['"]([^'"]+)['"]/);
const previewMatch = proxy.match(/const previewHost = ['"]([^'"]+)['"]/);
if (!canonicalMatch || !previewMatch) {
  throw new Error(
    "canonicalHost and previewHost must remain explicit in proxy.ts",
  );
}

const canonicalHost = canonicalMatch[1];
const failures = [];
const SECURITY_EXPIRY_MIN_MS = 30 * 24 * 60 * 60 * 1000;
const SECURITY_EXPIRY_MAX_MS = 366 * 24 * 60 * 60 * 1000;
const requireText = (label, text, marker) => {
  if (!text.includes(marker)) failures.push(`${label} is missing: ${marker}`);
};
requireText("proxy.ts", proxy, "zerodevllc-com-v50");
requireText("next.config.ts", nextConfig, "zerodevllc-com-v50");
requireText("app/layout.tsx", layout, "export const dynamic = 'force-dynamic'");
requireText("app/layout.tsx", layout, "metadataBase: new URL('https://zerodevllc.com')");
requireText("app/layout.tsx", layout, "Authorized defensive cybersecurity");
requireText("app/layout.tsx", layout, "summary_large_image");
requireText("app/layout.tsx", layout, "url: '/og.png'");
requireText("app/api/attacks/route.ts", attacksRoute, "stale-while-revalidate=300");
requireText("app/api/attacks/route.ts", attacksRoute, "safeCisaUrl");
requireText("app/api/attacks/route.ts", attacksRoute, "memoryCache");
requireText("app/api/attacks/route.ts", attacksRoute, "FORCE_REFRESH_COOLDOWN_MS");
requireText("app/api/attacks/route.ts", attacksRoute, "lastForcedRefreshAt");
requireText("app/api/attacks/route.ts", attacksRoute, "refreshCooldownSeconds");
requireText("app/api/attacks/route.ts", attacksRoute, "Refresh cooling down");
requireText("app/live-defcon-map.tsx", liveDefconMap, "const CISA_HOSTS");
requireText("app/live-defcon-map.tsx", liveDefconMap, "function isSafeCisaUrl");
requireText("app/live-defcon-map.tsx", liveDefconMap, "MAX_EVENT_URL_LENGTH");
requireText("app/live-defcon-map.tsx", liveDefconMap, ".slice(0, MAX_EVENTS)");
requireText("app/live-defcon-map.tsx", liveDefconMap, "const nextFeed = parseThreatFeed(await response.json())");
requireText("app/live-defcon-map.tsx", liveDefconMap, "nextManualRefreshAt");
requireText("app/live-defcon-map.tsx", liveDefconMap, "refreshWaitSeconds");
requireText("app/privacy/page.tsx", privacyPage, "https://zerodevllc.com/privacy");
requireText("app/privacy/page.tsx", privacyPage, "Do not send credentials");
requireText("app/privacy/page.tsx", privacyPage, "twitter:");
requireText("app/services/page.tsx", servicesPage, "Authorized penetration testing");
requireText("app/services/page.tsx", servicesPage, "Vendor due diligence");
requireText("app/services/page.tsx", servicesPage, "Disaster recovery and BCP");
requireText("app/services/page.tsx", servicesPage, "Readiness is not certification");
requireText("app/services/page.tsx", servicesPage, "Public-sector procurement");
requireText("app/services/page.tsx", servicesPage, "Defense-supplier assurance");
requireText("app/services/page.tsx", servicesPage, "Capability decision matrix");
requireText("app/services/page.tsx", servicesPage, "SERVICE BRIEFING PACKS");
requireText("app/services/page.tsx", servicesPage, "SYNTHETIC BRIEF / NOT A PROPOSAL");
requireText("app/services/page.tsx", servicesPage, "No-fit or owner gate");
requireText("app/services/page.tsx", servicesPage, "Review the service briefing pack");
requireText("app/services/page.tsx", servicesPage, "tableServiceLink");
requireText("app/services/page.tsx", servicesPage, "service-${number}");
requireText("app/services/page.tsx", servicesPage, "twitter:");
requireText("app/services/page.tsx", servicesPage, "Minimum entry gate");
requireText("app/services/page.tsx", servicesPage, "Written authority, in-scope assets");
requireText("app/services/page.tsx", servicesPage, "Best starting point");
requireText("app/services/page.tsx", servicesPage, "Procurement or third-party risk owner.");
requireText("app/services/page.tsx", servicesPage, "service-${service.number}");
requireText("app/services/page.tsx", servicesPage, "RTO/RPO discussion");
requireText("app/services/page.tsx", servicesPage, "Start with the authorized engagement brief");
requireText("app/methodology/page.tsx", methodologyPage, "Written authorization and named decision owner");
requireText("app/methodology/page.tsx", methodologyPage, "does not perform unauthorized access");
requireText("app/methodology/page.tsx", methodologyPage, "Potential treatment choices");
requireText("app/methodology/page.tsx", methodologyPage, "Evidence confidence");
requireText("app/methodology/page.tsx", methodologyPage, "twitter:");
requireText("app/frameworks/page.tsx", frameworksPage, "NIST CSF 2.0");
requireText("app/frameworks/page.tsx", frameworksPage, "NIST SP 800-30 Rev. 1");
requireText("app/frameworks/page.tsx", frameworksPage, "NIST SP 800-61 Rev. 3");
requireText("app/frameworks/page.tsx", frameworksPage, "NIST SP 800-171 Rev. 3");
requireText("app/frameworks/page.tsx", frameworksPage, "NCSC Cyber Assessment Framework 4.0");
requireText("app/frameworks/page.tsx", frameworksPage, "primary publisher reference");
requireText("app/frameworks/page.tsx", frameworksPage, "SERVICE / FRAMEWORK FIT");
requireText("app/frameworks/page.tsx", frameworksPage, "Service-to-framework orientation map");
requireText("app/frameworks/page.tsx", frameworksPage, "not a formal crosswalk");
requireText("app/frameworks/page.tsx", frameworksPage, "Review the service briefing packs");
requireText("app/frameworks/page.tsx", frameworksPage, "Readiness support is not");
requireText("app/frameworks/page.tsx", frameworksPage, "twitter:");
requireText("app/engage/page.tsx", engagePage, "Do not send secrets");
requireText("app/engage/page.tsx", engagePage, "decision owner");
requireText("app/engage/page.tsx", engagePage, "briefMailto");
requireText("app/engage/page.tsx", engagePage, "Open a high-level brief template");
requireText("app/engage/page.tsx", engagePage, "INFORMATION HANDLING GUIDANCE");
requireText("app/engage/page.tsx", engagePage, "classified-information handling policy");
requireText("app/engage/page.tsx", engagePage, "Review aligned services");
requireText("app/engage/page.tsx", engagePage, "service-${serviceNumber}");
requireText("app/engage/page.tsx", engagePage, "twitter:");
requireText("app/deliverables/page.tsx", deliverablesPage, "TEMPLATE SHAPE / NOT CLIENT EVIDENCE");
requireText("app/deliverables/page.tsx", deliverablesPage, "SYNTHETIC REVIEW PREVIEW");
requireText("app/deliverables/page.tsx", deliverablesPage, "Synthetic executive risk brief preview");
requireText("app/deliverables/page.tsx", deliverablesPage, "no live target, customer record, credential, or production export");
requireText("app/deliverables/page.tsx", deliverablesPage, "Received is not");
requireText("app/deliverables/page.tsx", deliverablesPage, "private incident evidence");
requireText("app/deliverables/page.tsx", deliverablesPage, "EVIDENCE REQUEST / ACCEPTANCE");
requireText("app/deliverables/page.tsx", deliverablesPage, "Illustrative evidence-request and acceptance map");
requireText("app/deliverables/page.tsx", deliverablesPage, "Decision or acceptance condition");
requireText("app/deliverables/page.tsx", deliverablesPage, "services#service-${number}");
requireText("app/deliverables/page.tsx", deliverablesPage, "evidenceRequestLink");
requireText("app/deliverables/page.tsx", deliverablesPage, "PROVENANCE / CONFIDENCE");
requireText("app/deliverables/page.tsx", deliverablesPage, "Illustrative provenance and confidence record");
requireText("app/deliverables/page.tsx", deliverablesPage, "A historical pass does not prove current security");
requireText("app/services/page.tsx", servicesPage, "Review evidence request map");
requireText("app/deliverables/page.tsx", deliverablesPage, "twitter:");
requireText("app/assurance/page.tsx", assurancePage, "Authority and scope");
requireText("app/assurance/page.tsx", assurancePage, "Evidence discipline");
requireText("app/assurance/page.tsx", assurancePage, "Data minimization");
requireText("app/assurance/page.tsx", assurancePage, "Never through this site or ordinary email");
requireText("app/assurance/page.tsx", assurancePage, "Readiness support is not certification");
requireText("app/assurance/page.tsx", assurancePage, "PROCUREMENT REVIEW PATH");
requireText("app/assurance/page.tsx", assurancePage, "aria-label=\"Procurement review stages\"");
requireText("app/assurance/page.tsx", assurancePage, "<li className={styles.frameworkCard}");
requireText("app/assurance/page.tsx", assurancePage, "Frame the question");
requireText("app/assurance/page.tsx", assurancePage, "Review remediation lifecycle");
requireText("app/assurance/page.tsx", assurancePage, "twitter:");
requireText("app/site-footer.tsx", siteFooter, "Footer navigation");
requireText("app/site-footer.tsx", siteFooter, "Private security reporting");
requireText("app/site-footer.tsx", siteFooter, "NO USER TELEMETRY / READ-ONLY BY DEFAULT");
requireText("app/site-footer.tsx", siteFooter, "payments, or sensitive records");
requireText("app/site-footer.tsx", siteFooter, "SEPARATE EXTERNAL SURFACES");
requireText("app/site-footer.tsx", siteFooter, "does not establish their provider");
requireText("app/site-footer.tsx", siteFooter, "Back to top");
requireText("app/site-header.tsx", siteHeader, "id=\"top\"");
for (const [label, source] of [
  ["app/services/page.tsx", servicesPage],
  ["app/engage/page.tsx", engagePage],
  ["app/sectors/page.tsx", sectorsPage],
  ["app/deliverables/page.tsx", deliverablesPage],
  ["app/assurance/page.tsx", assurancePage],
  ["app/methodology/page.tsx", methodologyPage],
  ["app/frameworks/page.tsx", frameworksPage],
  ["app/remediation/page.tsx", remediationPage],
  ["app/privacy/page.tsx", privacyPage],
]) requireText(label, source, "SiteFooter");
requireText("app/sectors/page.tsx", sectorsPage, "Public-sector and government programs");
requireText("app/sectors/page.tsx", sectorsPage, "Defense suppliers and primes");
requireText("app/sectors/page.tsx", sectorsPage, "Audience map only");
requireText("app/sectors/page.tsx", sectorsPage, "Aligned service lanes");
requireText("app/sectors/page.tsx", sectorsPage, "service-${serviceNumber}");
requireText("app/sectors/page.tsx", sectorsPage, "First brief should cover");
requireText("app/sectors/page.tsx", sectorsPage, "Decision date, accountable owner");
requireText("app/sectors/page.tsx", sectorsPage, "twitter:");
requireText("app/remediation/page.tsx", remediationPage, "Review model only");
requireText("app/remediation/page.tsx", remediationPage, "No owner");
requireText("app/remediation/page.tsx", remediationPage, "Closed with evidence or accepted risk");
requireText("app/remediation/page.tsx", remediationPage, "Illustrative action matrix");
requireText("app/remediation/page.tsx", remediationPage, "not client evidence");
requireText("app/remediation/page.tsx", remediationPage, "twitter:");
requireText("app/not-found.tsx", notFoundPage, "ROUTE NOT FOUND");
requireText("app/not-found.tsx", notFoundPage, "Safe recovery.");
requireText("app/not-found.tsx", notFoundPage, "robots: { index: false, follow: true }");
requireText("app/error.tsx", errorPage, "SURFACE DEGRADED");
requireText("app/error.tsx", errorPage, "No diagnostic details");
requireText("app/error.tsx", errorPage, "Do not send credentials");
requireText("app/error.tsx", errorPage, "reset");
requireText("app/loading.tsx", loadingPage, "aria-busy=\"true\"");
requireText("app/loading.tsx", loadingPage, "TRANSITION / LOADING");
requireText("app/loading.tsx", loadingPage, "Public boundary.");
requireText("app/globals.css", globalsCss, "@media print");
requireText("app/globals.css", globalsCss, ".map-data-details > :not(summary)");
requireText("app/services/services.module.css", servicesCss, "@media print");
requireText("app/services/services.module.css", servicesCss, ".actionTableWrap { overflow: visible; }");
requireText("app/privacy/privacy.module.css", privacyCss, "@media print");
if (errorPage.includes("error.message") || errorPage.includes("error.stack") || errorPage.includes("error.digest")) {
  failures.push("app/error.tsx must not expose runtime error details in the public recovery surface");
}
requireText("app/site-header.tsx", siteHeader, "headerMenuToggle");
requireText("app/site-header.tsx", siteHeader, "aria-expanded");
requireText("app/site-header.tsx", siteHeader, "aria-current");
requireText("app/site-header.tsx", siteHeader, "requestAnimationFrame");
requireText("app/site-header.tsx", siteHeader, "event.stopPropagation()");
requireText("app/home-status.tsx", homeStatus, "event.stopPropagation()");
requireText("app/home-status.tsx", homeStatus, "previouslyFocusedRef");
requireText("app/sitemap.ts", sitemap, "https://zerodevllc.com/privacy");
requireText("app/sitemap.ts", sitemap, "https://zerodevllc.com/services");
requireText("app/sitemap.ts", sitemap, "https://zerodevllc.com/methodology");
requireText("app/sitemap.ts", sitemap, "https://zerodevllc.com/frameworks");
requireText("app/sitemap.ts", sitemap, "https://zerodevllc.com/engage");
requireText("app/sitemap.ts", sitemap, "https://zerodevllc.com/deliverables");
requireText("app/sitemap.ts", sitemap, "https://zerodevllc.com/assurance");
requireText("app/sitemap.ts", sitemap, "https://zerodevllc.com/sectors");
requireText("app/sitemap.ts", sitemap, "https://zerodevllc.com/remediation");
for (const source of [proxy, nextConfig]) {
  if (source.includes("'unsafe-inline'"))
    failures.push("CSP must not allow unsafe inline scripts or styles");
}
requireText("app/page.tsx", page, "const canonicalDomains");
requireText("app/page.tsx", page, "defcon: 'https://zerodevllc.eu/defcon'");
requireText("app/page.tsx", page, "https://zerodevllc.eu");
requireText("app/page.tsx", page, "https://zerodevllc.store");
requireText("app/page.tsx", page, "Open the DEFCON Signal Fusion EU gateway");
requireText("app/page.tsx", page, "EU gateway / external");
requireText("app/page.tsx", page, "DEFENSIVE CYBER / RESILIENCE");
requireText("app/page.tsx", page, "SiteFooter");
requireText("app/page.tsx", page, "Protect the mission.");
requireText("app/page.tsx", page, "Authorized defensive cybersecurity for public-sector programs");
requireText("app/page.tsx", page, "defense suppliers, essential services, and regulated-technology teams");
requireText("app/page.tsx", page, "Authorized penetration testing and vulnerability assessment");
requireText("app/page.tsx", page, "Disaster recovery, BCP, and incident readiness");
requireText("app/page.tsx", page, "DEFENSIVE DELIVERY / REVIEWABLE OUTPUT");
requireText("app/page.tsx", page, "Prepare a brief");
requireText("app/page.tsx", page, "Find your operating context");
requireText("app/page.tsx", page, "START WITH THE DECISION");
requireText("app/page.tsx", page, "Find the right");
requireText("app/page.tsx", page, "decisionPaths");
requireText("app/page.tsx", page, "decision-card-${tone}");
requireText("app/page.tsx", page, "authorized defensive assessments");
requireText("app/page.tsx", page, "Make the next decision");
requireText("app/page.tsx", page, "Prepare a safe first brief");
requireText("proxy.ts", proxy, "const liveMapDestination = 'https://zerodevllc.eu/defcon'");
requireText("proxy.ts", proxy, "isLiveMapPath");
if (page.includes('href="mailto:hello@zerodevllc.com"')) {
  failures.push(
    "app/page.tsx must route general contact CTAs through /engage; retain only explicitly private reporting channels",
  );
}
if (page.includes("defcon-signal-fusion.michaelmorangeometri.chatgpt.site")) {
  failures.push(
    "app/page.tsx must route the DEFCON card through https://zerodevllc.eu/defcon",
  );
}
if (page.includes("zerodevllc-store.michaelmorangeometri.chatgpt.site")) {
  failures.push(
    "app/page.tsx must route the store card through https://zerodevllc.store",
  );
}
if (page.includes("zeroxshdw.michaelmorangeometri.chatgpt.site")) {
  failures.push(
    "app/page.tsx must not expose the historical Threat Ops hostname until its source and provider route are reconciled",
  );
}

for (const marker of [
  "Content-Security-Policy",
  "Permissions-Policy",
  "camera=()",
  "clipboard-read=()",
  "clipboard-write=()",
  "microphone=()",
  "geolocation=()",
  "payment=",
  "accelerometer=()",
  "autoplay=()",
  "display-capture=()",
  "encrypted-media=()",
  "fullscreen=()",
  "gyroscope=()",
  "magnetometer=()",
  "midi=()",
  "picture-in-picture=()",
  "usb=()",
  "X-Robots-Tag",
  "noindex, nofollow, noarchive",
  "applyPreviewPrivacy",
  "host === previewHost",
  "Referrer-Policy",
  "Strict-Transport-Security",
  "X-Content-Type-Options",
  "X-Frame-Options",
  "Cross-Origin-Opener-Policy",
  "Cross-Origin-Resource-Policy",
  "Cross-Origin-Embedder-Policy",
  "Origin-Agent-Cluster",
  "X-DNS-Prefetch-Control",
  "X-Permitted-Cross-Domain-Policies",
  "X-ZeroDev-Security-Profile",
  "X-ZeroDev-Release",
  "nextUrl.hostname",
  "hasHostHeaderMismatch",
  "forwardedProtoHeader",
  "requestProtocol",
  "effectiveProto",
  "NextResponse.redirect",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "frame-src 'none'",
  "child-src 'none'",
  "object-src 'none'",
  "script-src-attr 'none'",
  "style-src-attr 'none'",
  "img-src 'self' data:",
  "worker-src 'none'",
  "manifest-src 'none'",
  "media-src 'none'",
  "upgrade-insecure-requests",
  "hasExplicitPort",
  "shouldCanonicalizeHost",
  "url.port = ''",
  "secureRedirect",
  "Cache-Control",
  "contentSecurityPolicy",
  "createNonce",
  "x-nonce",
]) {
  requireText("proxy.ts", proxy, marker);
}
for (const marker of [
  "poweredByHeader: false",
  "Content-Security-Policy",
  "Permissions-Policy",
  "camera=()",
  "clipboard-read=()",
  "clipboard-write=()",
  "microphone=()",
  "geolocation=()",
  "payment=",
  "accelerometer=()",
  "autoplay=()",
  "display-capture=()",
  "encrypted-media=()",
  "fullscreen=()",
  "gyroscope=()",
  "magnetometer=()",
  "midi=()",
  "picture-in-picture=()",
  "usb=()",
  "Referrer-Policy",
  "Strict-Transport-Security",
  "X-Content-Type-Options",
  "X-Frame-Options",
  "Cross-Origin-Opener-Policy",
  "Cross-Origin-Resource-Policy",
  "Cross-Origin-Embedder-Policy",
  "Origin-Agent-Cluster",
  "X-DNS-Prefetch-Control",
  "X-Permitted-Cross-Domain-Policies",
  "X-ZeroDev-Security-Profile",
  "X-ZeroDev-Release",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "frame-src 'none'",
  "child-src 'none'",
  "object-src 'none'",
  "script-src-attr 'none'",
  "style-src-attr 'none'",
  "img-src 'self' data:",
  "worker-src 'none'",
  "manifest-src 'none'",
  "media-src 'none'",
  "upgrade-insecure-requests",
  "source: '/:path*'",
]) {
  requireText("next.config.ts", nextConfig, marker);
}
if (!/^\d+\.\d+\.\d+\s*$/.test(nodeVersion))
  failures.push(
    ".node-version must contain one exact semantic Node.js version",
  );
for (const marker of [
  "schedule:",
  "cron:",
  "workflow_dispatch:",
  "npm ci --ignore-scripts",
  "actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1",
  "actions/setup-node@820762786026740c76f36085b0efc47a31fe5020",
  "node-version-file: .node-version",
]) {
  requireText(".github/workflows/quality.yml", qualityWorkflow, marker);
}
requireText("package.json", packageJson, "node scripts/security-audit.mjs");
requireText("security-audit.mjs", securityAudit, "NPM_AUDIT_TIMEOUT_MS");
requireText("security-audit.mjs", securityAudit, "timedOut ? 124");
requireText("package.json", packageJson, "scripts/secret-hygiene.mjs");
for (const marker of [
  "git",
  "ls-files",
  "textExtensions",
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
  requireText("scripts/secret-hygiene.mjs", secretHygiene, marker);
}
for (const marker of [
  "version: 2",
  "package-ecosystem: npm",
  "package-ecosystem: github-actions",
  "interval: weekly",
  "interval: monthly",
]) {
  requireText(".github/dependabot.yml", dependabot, marker);
}

if (proxy.includes("_next/image") || proxy.includes("favicon.ico")) {
  failures.push("proxy matcher must not bypass image or favicon routes");
}

requireText(
  "app/robots.ts",
  robots,
  `sitemap: 'https://${canonicalHost}/sitemap.xml'`,
);
requireText("app/robots.ts", robots, "'/api/'");
requireText("app/sitemap.ts", sitemap, `https://${canonicalHost}/`);
requireText("security.txt", securityTxt, "Contact: mailto:");
requireText(
  "security.txt",
  securityTxt,
  `Canonical: https://${canonicalHost}/.well-known/security.txt`,
);
requireText("security.txt", securityTxt, "Expires: ");
requireText(
  "security.txt",
  securityTxt,
  `Policy: https://${canonicalHost}/SECURITY.md`,
);
requireText(
  "SECURITY.md",
  securityPolicy,
  "Report suspected vulnerabilities privately",
);
requireText("SECURITY.md", securityPolicy, "hello@zerodevllc.com");
requireText("SECURITY.md", securityPolicy, "Do not publish");
requireText(
  "public/SECURITY.md",
  publicSecurityPolicy,
  "Report suspected vulnerabilities privately",
);
requireText("public/SECURITY.md", publicSecurityPolicy, "hello@zerodevllc.com");
requireText("public/SECURITY.md", publicSecurityPolicy, "Do not publish");
const securityExpiry = securityTxt.match(/^Expires:\s*(.+)$/m)?.[1];
const securityExpiryAt = securityExpiry
  ? Date.parse(securityExpiry)
  : Number.NaN;
if (
  !securityExpiry ||
  Number.isNaN(securityExpiryAt) ||
  securityExpiryAt <= Date.now()
) {
  failures.push("security.txt must have a valid future Expires value");
} else if (securityExpiryAt <= Date.now() + SECURITY_EXPIRY_MIN_MS) {
  failures.push(
    "security.txt Expires value must have at least 30 days of runway",
  );
} else if (securityExpiryAt > Date.now() + SECURITY_EXPIRY_MAX_MS) {
  failures.push(
    "security.txt Expires value must not be more than one year ahead",
  );
}
requireText("app/layout.tsx", layout, `https://${canonicalHost}`);

if (canonicalHost === "zerodevllc.store") {
  const stripePaymentPolicy =
    'payment=(self "https://checkout.stripe.com" "https://buy.stripe.com")';
  requireText("proxy.ts", proxy, stripePaymentPolicy);
  requireText("next.config.ts", nextConfig, stripePaymentPolicy);
  requireText("app/robots.ts", robots, "'/success'");
  requireText("proxy.ts", proxy, "session_id");
  requireText("proxy.ts", proxy, "Cache-Control");
  requireText("proxy.ts", proxy, "no-referrer");
  requireText(
    "app/api/checkout/route.ts",
    checkoutRoute,
    "request.arrayBuffer()",
  );
  requireText("app/api/checkout/route.ts", checkoutRoute, "body.byteLength");
  requireText("app/api/checkout/route.ts", checkoutRoute, "new TextDecoder()");
  requireText(
    "app/api/checkout/route.ts",
    checkoutRoute,
    "'cache-control': 'no-store'",
  );
  requireText(
    "app/api/checkout/route.ts",
    checkoutRoute,
    "const canonicalHost",
  );
  requireText("app/api/checkout/route.ts", checkoutRoute, "const localHosts");
  requireText("app/api/checkout/route.ts", checkoutRoute, "const allowedHosts");
  if (
    checkoutRoute.includes(
      "zerodevllc-store.michaelmorangeometri.chatgpt.site",
    ) ||
    checkoutRoute.includes("www.zerodevllc.store")
  ) {
    failures.push(
      "checkout route must not accept preview or www hosts as production origins",
    );
  }
} else {
  requireText("proxy.ts", proxy, "payment=()");
  requireText("next.config.ts", nextConfig, "payment=()");
}

if (failures.length > 0) {
  throw new Error(failures.join("\n"));
}

console.log(
  `Security controls verified for ${canonicalHost} (${previewMatch[1]} preview policy).`,
);
