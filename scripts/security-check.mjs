import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = join(fileURLToPath(new URL('.', import.meta.url)), '..');
const nextConfig = await readFile(join(projectRoot, 'next.config.js'), 'utf8');
const requiredMarkers = [
  'source: "/:path*"',
  'Content-Security-Policy',
  "default-src 'self'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "object-src 'none'",
  "script-src-attr 'none'",
  "style-src-attr 'none'",
  "connect-src 'self' https://www.gstatic.com",
  "worker-src 'self' blob:",
  'Permissions-Policy',
  'clipboard-read=()',
  'clipboard-write=()',
  'microphone=()',
  'payment=()',
  'Strict-Transport-Security',
  'includeSubDomains; preload',
  'X-Content-Type-Options',
  'X-Frame-Options',
  'X-Permitted-Cross-Domain-Policies',
  'Cross-Origin-Opener-Policy',
  'Cross-Origin-Resource-Policy',
  'Origin-Agent-Cluster',
  'X-DNS-Prefetch-Control',
];

const failures = requiredMarkers
  .filter((marker) => !nextConfig.includes(marker))
  .map((marker) => `next.config.js is missing ${marker}`);
if (nextConfig.includes('X-XSS-Protection')) failures.push('next.config.js must not rely on deprecated X-XSS-Protection');

if (failures.length) {
  console.error(failures.join('\n'));
  process.exitCode = 1;
} else {
  console.log('Security header policy verified for the corporate application.');
}
