import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = join(fileURLToPath(new URL('.', import.meta.url)), '..');
const read = (relativePath) => readFile(join(projectRoot, relativePath), 'utf8');
const readOptional = async (relativePath) => {
  try {
    return await read(relativePath);
  } catch (error) {
    if (error?.code === 'ENOENT') return '';
    throw error;
  }
};

const [proxy, robots, sitemap, securityTxt, securityPolicy, publicSecurityPolicy, layout, nextConfig, checkoutRoute, page, qualityWorkflow, dependabot, packageJson, secretHygiene] = await Promise.all([
  read('proxy.ts'),
  read('app/robots.ts'),
  read('app/sitemap.ts'),
  read('public/.well-known/security.txt'),
  read('SECURITY.md'),
  read('public/SECURITY.md'),
  read('app/layout.tsx'),
  read('next.config.ts'),
  readOptional('app/api/checkout/route.ts'),
  read('app/page.tsx'),
  read('.github/workflows/quality.yml'),
  read('.github/dependabot.yml'),
  read('package.json'),
  read('scripts/secret-hygiene.mjs'),
]);

const canonicalMatch = proxy.match(/const canonicalHost = ['"]([^'"]+)['"]/);
const previewMatch = proxy.match(/const previewHost = ['"]([^'"]+)['"]/);
if (!canonicalMatch || !previewMatch) {
  throw new Error('canonicalHost and previewHost must remain explicit in proxy.ts');
}

const canonicalHost = canonicalMatch[1];
const failures = [];
const SECURITY_EXPIRY_MIN_MS = 30 * 24 * 60 * 60 * 1000;
const SECURITY_EXPIRY_MAX_MS = 366 * 24 * 60 * 60 * 1000;
const requireText = (label, text, marker) => {
  if (!text.includes(marker)) failures.push(`${label} is missing: ${marker}`);
};
requireText('proxy.ts', proxy, 'zerodevllc-com-v41');
requireText('next.config.ts', nextConfig, 'zerodevllc-com-v41');
requireText('app/page.tsx', page, 'const canonicalDomains');
requireText('app/page.tsx', page, 'https://zerodevllc.eu');
requireText('app/page.tsx', page, 'https://zerodevllc.store');
if (page.includes('zerodevllc-store.michaelmorangeometri.chatgpt.site')) {
  failures.push('app/page.tsx must route the store card through https://zerodevllc.store');
}

for (const marker of [
  'Content-Security-Policy',
  'Permissions-Policy',
  'camera=()',
  'clipboard-read=()',
  'clipboard-write=()',
  'microphone=()',
  'geolocation=()',
  'payment=',
  'accelerometer=()',
  'autoplay=()',
  'display-capture=()',
  'encrypted-media=()',
  'fullscreen=()',
  'gyroscope=()',
  'magnetometer=()',
  'midi=()',
  'picture-in-picture=()',
  'usb=()',
  'X-Robots-Tag',
  'noindex, nofollow, noarchive',
  'applyPreviewPrivacy',
  'host === previewHost',
  'Referrer-Policy',
  'Strict-Transport-Security',
  'X-Content-Type-Options',
  'X-Frame-Options',
  'Cross-Origin-Opener-Policy',
  'Cross-Origin-Resource-Policy',
  'Cross-Origin-Embedder-Policy',
  'Origin-Agent-Cluster',
  'X-DNS-Prefetch-Control',
  'X-Permitted-Cross-Domain-Policies',
  'X-ZeroDev-Security-Profile',
  'X-ZeroDev-Release',
  'nextUrl.hostname',
  'hasHostHeaderMismatch',
  'forwardedProtoHeader',
  'requestProtocol',
  'effectiveProto',
  'NextResponse.redirect',
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
  'upgrade-insecure-requests',
  'hasExplicitPort',
  'shouldCanonicalizeHost',
  "url.port = ''",
  'secureRedirect',
  'Cache-Control',
]) {
  requireText('proxy.ts', proxy, marker);
}
for (const marker of [
  'poweredByHeader: false',
  'Content-Security-Policy',
  'Permissions-Policy',
  'camera=()',
  'clipboard-read=()',
  'clipboard-write=()',
  'microphone=()',
  'geolocation=()',
  'payment=',
  'accelerometer=()',
  'autoplay=()',
  'display-capture=()',
  'encrypted-media=()',
  'fullscreen=()',
  'gyroscope=()',
  'magnetometer=()',
  'midi=()',
  'picture-in-picture=()',
  'usb=()',
  'Referrer-Policy',
  'Strict-Transport-Security',
  'X-Content-Type-Options',
  'X-Frame-Options',
  'Cross-Origin-Opener-Policy',
  'Cross-Origin-Resource-Policy',
  'Cross-Origin-Embedder-Policy',
  'Origin-Agent-Cluster',
  'X-DNS-Prefetch-Control',
  'X-Permitted-Cross-Domain-Policies',
  'X-ZeroDev-Security-Profile',
  'X-ZeroDev-Release',
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
  'upgrade-insecure-requests',
  "source: '/:path*'",
]) {
  requireText('next.config.ts', nextConfig, marker);
}
for (const marker of ['schedule:', 'cron:', 'workflow_dispatch:', 'npm ci --ignore-scripts', 'actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1', 'actions/setup-node@820762786026740c76f36085b0efc47a31fe5020']) {
  requireText('.github/workflows/quality.yml', qualityWorkflow, marker);
}
requireText('package.json', packageJson, 'npm audit --audit-level=moderate');
requireText('package.json', packageJson, 'scripts/secret-hygiene.mjs');
for (const marker of ['git', 'ls-files', 'textExtensions', 'textBasenames', 'path.basename', 'private key', 'GitHub token', 'Stripe secret', 'OpenAI key', 'AWS access key', 'NPM token', 'Slack token', 'bearer credential']) {
  requireText('scripts/secret-hygiene.mjs', secretHygiene, marker);
}
for (const marker of ['version: 2', 'package-ecosystem: npm', 'package-ecosystem: github-actions', 'interval: weekly', 'interval: monthly']) {
  requireText('.github/dependabot.yml', dependabot, marker);
}

if (proxy.includes('_next/image') || proxy.includes('favicon.ico')) {
  failures.push('proxy matcher must not bypass image or favicon routes');
}

requireText('app/robots.ts', robots, `sitemap: 'https://${canonicalHost}/sitemap.xml'`);
requireText('app/robots.ts', robots, "'/api/'");
requireText('app/sitemap.ts', sitemap, `https://${canonicalHost}/`);
requireText('security.txt', securityTxt, 'Contact: mailto:');
requireText(
  'security.txt',
  securityTxt,
  `Canonical: https://${canonicalHost}/.well-known/security.txt`,
);
requireText('security.txt', securityTxt, 'Expires: ');
requireText('security.txt', securityTxt, `Policy: https://${canonicalHost}/SECURITY.md`);
requireText('SECURITY.md', securityPolicy, 'Report suspected vulnerabilities privately');
requireText('SECURITY.md', securityPolicy, 'hello@zerodevllc.com');
requireText('SECURITY.md', securityPolicy, 'Do not publish');
requireText('public/SECURITY.md', publicSecurityPolicy, 'Report suspected vulnerabilities privately');
requireText('public/SECURITY.md', publicSecurityPolicy, 'hello@zerodevllc.com');
requireText('public/SECURITY.md', publicSecurityPolicy, 'Do not publish');
const securityExpiry = securityTxt.match(/^Expires:\s*(.+)$/m)?.[1];
const securityExpiryAt = securityExpiry ? Date.parse(securityExpiry) : Number.NaN;
if (!securityExpiry || Number.isNaN(securityExpiryAt) || securityExpiryAt <= Date.now()) {
  failures.push('security.txt must have a valid future Expires value');
} else if (securityExpiryAt <= Date.now() + SECURITY_EXPIRY_MIN_MS) {
  failures.push('security.txt Expires value must have at least 30 days of runway');
} else if (securityExpiryAt > Date.now() + SECURITY_EXPIRY_MAX_MS) {
  failures.push('security.txt Expires value must not be more than one year ahead');
}
requireText('app/layout.tsx', layout, `https://${canonicalHost}`);

if (canonicalHost === 'zerodevllc.store') {
  const stripePaymentPolicy = 'payment=(self "https://checkout.stripe.com" "https://buy.stripe.com")';
  requireText('proxy.ts', proxy, stripePaymentPolicy);
  requireText('next.config.ts', nextConfig, stripePaymentPolicy);
  requireText('app/robots.ts', robots, "'/success'");
  requireText('proxy.ts', proxy, 'session_id');
  requireText('proxy.ts', proxy, 'Cache-Control');
  requireText('proxy.ts', proxy, 'no-referrer');
  requireText('app/api/checkout/route.ts', checkoutRoute, 'request.arrayBuffer()');
  requireText('app/api/checkout/route.ts', checkoutRoute, 'body.byteLength');
  requireText('app/api/checkout/route.ts', checkoutRoute, 'new TextDecoder()');
  requireText('app/api/checkout/route.ts', checkoutRoute, "'cache-control': 'no-store'");
  requireText('app/api/checkout/route.ts', checkoutRoute, 'const canonicalHost');
  requireText('app/api/checkout/route.ts', checkoutRoute, 'const localHosts');
  requireText('app/api/checkout/route.ts', checkoutRoute, 'const allowedHosts');
  if (checkoutRoute.includes('zerodevllc-store.michaelmorangeometri.chatgpt.site') || checkoutRoute.includes('www.zerodevllc.store')) {
    failures.push('checkout route must not accept preview or www hosts as production origins');
  }
} else {
  requireText('proxy.ts', proxy, 'payment=()');
  requireText('next.config.ts', nextConfig, 'payment=()');
}

if (failures.length > 0) {
  throw new Error(failures.join('\n'));
}

console.log(`Security controls verified for ${canonicalHost} (${previewMatch[1]} preview policy).`);
