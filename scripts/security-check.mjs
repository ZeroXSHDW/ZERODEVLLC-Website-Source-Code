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

const [proxy, robots, sitemap, securityTxt, securityPolicy, layout, nextConfig, checkoutRoute, qualityWorkflow, dependabot, packageJson] = await Promise.all([
  read('proxy.ts'),
  read('app/robots.ts'),
  read('app/sitemap.ts'),
  read('public/.well-known/security.txt'),
  read('SECURITY.md'),
  read('app/layout.tsx'),
  read('next.config.ts'),
  readOptional('app/api/checkout/route.ts'),
  read('.github/workflows/quality.yml'),
  read('.github/dependabot.yml'),
  read('package.json'),
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

for (const marker of [
  'Content-Security-Policy',
  'Permissions-Policy',
  'camera=()',
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
for (const marker of ['schedule:', 'cron:', 'workflow_dispatch:', 'npm ci --ignore-scripts']) {
  requireText('.github/workflows/quality.yml', qualityWorkflow, marker);
}
requireText('package.json', packageJson, 'npm audit --audit-level=moderate');
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
} else {
  requireText('proxy.ts', proxy, 'payment=()');
  requireText('next.config.ts', nextConfig, 'payment=()');
}

if (failures.length > 0) {
  throw new Error(failures.join('\n'));
}

console.log(`Security controls verified for ${canonicalHost} (${previewMatch[1]} preview policy).`);
