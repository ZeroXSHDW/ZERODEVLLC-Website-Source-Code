import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = join(fileURLToPath(new URL('.', import.meta.url)), '..');
const read = (relativePath) => readFile(join(projectRoot, relativePath), 'utf8');

const [proxy, robots, sitemap, securityTxt, layout, nextConfig] = await Promise.all([
  read('proxy.ts'),
  read('app/robots.ts'),
  read('app/sitemap.ts'),
  read('public/.well-known/security.txt'),
  read('app/layout.tsx'),
  read('next.config.ts'),
]);

const canonicalMatch = proxy.match(/const canonicalHost = ['"]([^'"]+)['"]/);
const previewMatch = proxy.match(/const previewHost = ['"]([^'"]+)['"]/);
if (!canonicalMatch || !previewMatch) {
  throw new Error('canonicalHost and previewHost must remain explicit in proxy.ts');
}

const canonicalHost = canonicalMatch[1];
const failures = [];
const requireText = (label, text, marker) => {
  if (!text.includes(marker)) failures.push(`${label} is missing: ${marker}`);
};

for (const marker of [
  'Content-Security-Policy',
  'Strict-Transport-Security',
  'Permissions-Policy',
  'Referrer-Policy',
  'X-Content-Type-Options',
  'X-Frame-Options',
  'Cross-Origin-Opener-Policy',
  'Cross-Origin-Resource-Policy',
  'Origin-Agent-Cluster',
  'X-DNS-Prefetch-Control',
  'forwardedProto',
  'NextResponse.redirect',
]) {
  requireText('proxy.ts', proxy, marker);
}
for (const marker of [
  'Content-Security-Policy',
  'Strict-Transport-Security',
  'X-Content-Type-Options',
  'X-Frame-Options',
  "source: '/:path*'",
]) {
  requireText('next.config.ts', nextConfig, marker);
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
requireText('app/layout.tsx', layout, `https://${canonicalHost}`);

if (canonicalHost === 'zerodevllc.store') {
  requireText('app/robots.ts', robots, "'/success'");
  requireText('proxy.ts', proxy, 'session_id');
  requireText('proxy.ts', proxy, 'Cache-Control');
  requireText('proxy.ts', proxy, 'no-referrer');
}

if (failures.length > 0) {
  throw new Error(failures.join('\n'));
}

console.log(`Security controls verified for ${canonicalHost} (${previewMatch[1]} preview policy).`);
