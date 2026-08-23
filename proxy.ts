import { NextRequest, NextResponse } from "next/server";

const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1", "::1"]);
const CANONICAL_HOSTS = Object.freeze({
  "zerodevllc.com": "zerodevllc.com",
  "www.zerodevllc.com": "zerodevllc.com",
  "zerodevllc.eu": "zerodevllc.eu",
  "www.zerodevllc.eu": "zerodevllc.eu",
  "zerodevllc.store": "zerodevllc.store",
  "www.zerodevllc.store": "zerodevllc.store",
});
const DEFAULT_RELEASE_FINGERPRINTS = Object.freeze({
  "zerodevllc.com": "zerodevllc-com-v42",
  "zerodevllc.eu": "zerodevllc-eu-v43",
  "zerodevllc.store": "zerodevllc-store-v55",
});
const SECURITY_PROFILE = "strict-2026-08";

function contentSecurityPolicy(nonce?: string) {
  const nonceSource = nonce ? ` 'nonce-${nonce}'` : "";
  return `default-src 'self'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; frame-src 'none'; child-src 'none'; object-src 'none'; script-src 'self'${nonceSource}; script-src-attr 'none'; style-src 'self'${nonceSource}; style-src-attr 'none'; img-src 'self' data: blob:; font-src 'self' data:; connect-src 'self' https://www.gstatic.com; worker-src 'self' blob:; manifest-src 'self'; media-src 'self' blob:; upgrade-insecure-requests`;
}

function createNonce() {
  const bytes = new Uint8Array(18);
  crypto.getRandomValues(bytes);
  return btoa(String.fromCharCode(...bytes))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function normalizeHostname(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/^\[|\]$/g, "");
}

function hostHeaderHostname(value: string) {
  const trimmed = value.trim();
  if (trimmed.startsWith("[")) {
    const closingBracket = trimmed.indexOf("]");
    return closingBracket === -1
      ? ""
      : normalizeHostname(trimmed.slice(1, closingBracket));
  }
  return normalizeHostname(trimmed.split(":", 1)[0] ?? "");
}

function releaseFingerprint(hostname: string) {
  const configured =
    typeof process !== "undefined" ? process.env.ZERO_DEV_RELEASE?.trim() : "";
  const canonicalHost =
    CANONICAL_HOSTS[hostname as keyof typeof CANONICAL_HOSTS];
  const hostFamily = canonicalHost?.replace("zerodevllc.", "");
  if (
    configured &&
    hostFamily &&
    new RegExp(`^zerodevllc-${hostFamily}-v\\d+$`).test(configured)
  ) {
    return configured;
  }
  return (
    DEFAULT_RELEASE_FINGERPRINTS[
      canonicalHost as keyof typeof DEFAULT_RELEASE_FINGERPRINTS
    ] ?? "zerodevllc-local-v0"
  );
}

function securityHeaders(hostname: string, csp = contentSecurityPolicy()) {
  return {
    "Content-Security-Policy": csp,
    "Permissions-Policy":
      "accelerometer=(), autoplay=(), camera=(), clipboard-read=(), clipboard-write=(), display-capture=(), encrypted-media=(), fullscreen=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), midi=(), payment=(), picture-in-picture=(), usb=()",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Strict-Transport-Security": "max-age=31536000; includeSubDomains; preload",
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "Cross-Origin-Opener-Policy": "same-origin",
    "Cross-Origin-Resource-Policy": "same-origin",
    "Cross-Origin-Embedder-Policy": "require-corp",
    "Origin-Agent-Cluster": "?1",
    "X-DNS-Prefetch-Control": "off",
    "X-Permitted-Cross-Domain-Policies": "none",
    "X-ZeroDev-Security-Profile": SECURITY_PROFILE,
    "X-ZeroDev-Release": releaseFingerprint(hostname),
  };
}

function requestHost(request: NextRequest) {
  const hostname = normalizeHostname(request.nextUrl.hostname);
  const rawHost = request.headers.get("host");
  if (rawHost && hostHeaderHostname(rawHost) !== hostname) return null;
  return hostname;
}

function shouldUpgradeToHttps(request: NextRequest) {
  return request.nextUrl.protocol !== "https:";
}

function canonicalRedirect(
  request: NextRequest,
  hostname: string,
  canonicalHost: string,
) {
  const redirectUrl = request.nextUrl.clone();
  redirectUrl.protocol = "https:";
  redirectUrl.hostname = canonicalHost;
  redirectUrl.port = "";
  return NextResponse.redirect(redirectUrl, {
    status: 308,
    headers: {
      ...securityHeaders(canonicalHost),
      "Cache-Control": "no-store",
      "X-ZeroDev-Source-Host": hostname,
    },
  });
}

export function proxy(request: NextRequest) {
  const hostname = requestHost(request);
  if (!hostname) {
    return new NextResponse("Request host is not allowed.", {
      status: 421,
      headers: {
        ...securityHeaders(""),
        "Cache-Control": "no-store",
        "Content-Type": "text/plain; charset=utf-8",
      },
    });
  }

  const isLocal = LOCAL_HOSTS.has(hostname);
  const canonicalHost =
    CANONICAL_HOSTS[hostname as keyof typeof CANONICAL_HOSTS];
  if (!isLocal && !canonicalHost) {
    return new NextResponse("Host is not configured for ZeroDevLLC.", {
      status: 404,
      headers: {
        ...securityHeaders(hostname),
        "Cache-Control": "no-store",
        "Content-Type": "text/plain; charset=utf-8",
      },
    });
  }

  if (
    !isLocal &&
    canonicalHost &&
    (shouldUpgradeToHttps(request) || hostname !== canonicalHost)
  ) {
    return canonicalRedirect(request, hostname, canonicalHost);
  }

  const nonce = createNonce();
  const csp = contentSecurityPolicy(nonce);
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("content-security-policy", csp);
  requestHeaders.set("x-zerodev-security-profile", SECURITY_PROFILE);
  requestHeaders.set("x-zerodev-release", releaseFingerprint(hostname));

  const response = NextResponse.next({ request: { headers: requestHeaders } });
  Object.entries(securityHeaders(hostname, csp)).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  if (!request.nextUrl.pathname.startsWith("/_next/static/")) {
    response.headers.set("Cache-Control", "private, no-store, max-age=0");
  }
  return response;
}

export const config = {
  matcher: ["/:path*"],
};
