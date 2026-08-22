import { NextRequest, NextResponse } from 'next/server';

const canonicalHost = 'zerodevllc.com';
const previewHost = 'zerodevllc-com.michaelmorangeometri.chatgpt.site';

const securityHeaders: Record<string, string> = {
  'Content-Security-Policy':
    "default-src 'self'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; object-src 'none'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self'; upgrade-insecure-requests",
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=()',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-Permitted-Cross-Domain-Policies': 'none',
  'Cross-Origin-Opener-Policy': 'same-origin',
  'Cross-Origin-Resource-Policy': 'same-origin',
};

function applySecurityHeaders(response: NextResponse) {
  for (const [name, value] of Object.entries(securityHeaders)) {
    response.headers.set(name, value);
  }
  return response;
}

function getHost(request: NextRequest) {
  const rawHost = request.headers.get('host') ?? request.nextUrl.hostname;
  return rawHost.startsWith('[')
    ? rawHost.slice(0, rawHost.indexOf(']') + 1).toLowerCase()
    : rawHost.split(':')[0].toLowerCase();
}

export function proxy(request: NextRequest) {
  const host = getHost(request);
  const isLocal = host === 'localhost' || host === '127.0.0.1' || host === '[::1]' || host === '::1';
  const forwardedProto = (request.headers.get('x-forwarded-proto') ?? request.nextUrl.protocol.replace(':', ''))
    .split(',')[0]
    .trim()
    .toLowerCase();

  if (!isLocal && forwardedProto !== 'https') {
    const url = request.nextUrl.clone();
    url.protocol = 'https:';
    return applySecurityHeaders(NextResponse.redirect(url, 308));
  }

  if (host === `www.${canonicalHost}` || (!isLocal && host !== canonicalHost && host !== previewHost)) {
    const url = request.nextUrl.clone();
    url.protocol = 'https:';
    url.hostname = canonicalHost;
    return applySecurityHeaders(NextResponse.redirect(url, 308));
  }

  const response = applySecurityHeaders(NextResponse.next());
  response.headers.set('Link', `<https://${canonicalHost}${request.nextUrl.pathname}>; rel="canonical"`);

  if (host === previewHost) {
    response.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive');
  }

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
