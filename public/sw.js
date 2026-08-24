// ZeroDevLLC service worker.
//
// This worker deliberately caches only public, same-origin assets and model
// files. HTML, API responses, cross-origin requests, and credential-bearing
// responses must always stay on the network so stale or private data cannot be
// replayed from Cache Storage.

const CACHE_PREFIX = "zerodevllc-sw-";
const VERSION = "v2";
const STATIC_CACHE = `${CACHE_PREFIX}static-${VERSION}`;
const MODEL_CACHE = `${CACHE_PREFIX}models-${VERSION}`;
const CACHE_NAME = `${CACHE_PREFIX}${VERSION}`;
const OWNED_CACHE_NAMES = new Set([STATIC_CACHE, MODEL_CACHE]);

const PRECACHE_ASSETS = [
  "/manifest.json",
  "/robots.txt",
  "/icon-192x192.png",
  "/icon-192x192.svg",
];

const MODEL_PATH = /\.(glb|gltf)$/i;
const STATIC_PATH = /\.(css|eot|gif|jpeg|jpg|js|png|svg|ttf|webp|woff|woff2)$/i;

function isSameOriginRequest(request) {
  const url = new URL(request.url);
  return url.origin === self.location.origin;
}

function isPublicRequest(request, url) {
  if (request.method !== "GET" || !isSameOriginRequest(request)) {
    return false;
  }

  // Never let authenticated or partial responses enter a shared cache.
  if (
    request.headers.has("authorization") ||
    request.headers.has("range") ||
    request.mode === "navigate"
  ) {
    return false;
  }

  // API and worker responses are intentionally network-only.
  if (
    url.pathname.startsWith("/api/") ||
    url.pathname === "/sw.js" ||
    url.pathname.startsWith("/_next/image")
  ) {
    return false;
  }

  return true;
}

function isCacheableResponse(response) {
  if (
    !response ||
    !response.ok ||
    response.type !== "basic" ||
    response.redirected ||
    response.headers.has("set-cookie")
  ) {
    return false;
  }

  const cacheControl = response.headers.get("cache-control") || "";
  return !/\bno-store\b/i.test(cacheControl);
}

function isCacheableStaticResponse(response) {
  if (!isCacheableResponse(response)) return false;

  const contentType = response.headers.get("content-type") || "";
  return !/text\/html|application\/json/i.test(contentType);
}

function isCacheableModelResponse(response) {
  if (!isCacheableResponse(response)) return false;

  const contentType = response.headers.get("content-type") || "";
  return /model\/gltf|application\/octet-stream|application\/json/i.test(
    contentType,
  );
}

function isModelRequest(request, url) {
  return (
    isPublicRequest(request, url) &&
    MODEL_PATH.test(url.pathname) &&
    url.search === ""
  );
}

function isStaticRequest(request, url) {
  return (
    isPublicRequest(request, url) &&
    (url.pathname.startsWith("/_next/static/") ||
      STATIC_PATH.test(url.pathname))
  );
}

async function cachePrecacheAssets() {
  const cache = await caches.open(STATIC_CACHE);

  await Promise.all(
    PRECACHE_ASSETS.map(async (asset) => {
      try {
        const request = new Request(asset, { cache: "no-store" });
        const response = await fetch(request);
        if (isCacheableResponse(response)) {
          await cache.put(request, response.clone());
        }
      } catch (_error) {
        // An optional public asset must not prevent a new worker from
        // installing. It will be fetched normally when needed.
      }
    }),
  );
}

async function deleteOwnedCaches(includeCurrent = true) {
  const cacheNames = await caches.keys();
  await Promise.all(
    cacheNames
      .filter(
        (cacheName) =>
          cacheName.startsWith(CACHE_PREFIX) &&
          (includeCurrent || !OWNED_CACHE_NAMES.has(cacheName)),
      )
      .map((cacheName) => caches.delete(cacheName)),
  );
}

async function getCacheStats() {
  const stats = { staticCache: 0, modelCache: 0, total: 0 };

  for (const cacheName of OWNED_CACHE_NAMES) {
    const cache = await caches.open(cacheName);
    const count = (await cache.keys()).length;
    if (cacheName === STATIC_CACHE) stats.staticCache = count;
    if (cacheName === MODEL_CACHE) stats.modelCache = count;
    stats.total += count;
  }

  return stats;
}

self.addEventListener("install", (event) => {
  event.waitUntil(cachePrecacheAssets().then(() => self.skipWaiting()));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(deleteOwnedCaches(false).then(() => self.clients.claim()));
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Non-GET, cross-origin, API, document, and unknown requests remain
  // untouched and use the browser's normal network behavior.
  if (isModelRequest(request, url)) {
    event.respondWith(
      (async () => {
        const cache = await caches.open(MODEL_CACHE);
        try {
          const response = await fetch(request);
          if (isCacheableModelResponse(response)) {
            await cache.put(request, response.clone());
          }
          return response;
        } catch (_error) {
          return (await cache.match(request)) || Response.error();
        }
      })(),
    );
    return;
  }

  if (isStaticRequest(request, url)) {
    event.respondWith(
      (async () => {
        const cache = await caches.open(STATIC_CACHE);
        const cachedResponse = await cache.match(request);
        if (cachedResponse) return cachedResponse;

        try {
          const response = await fetch(request);
          if (isCacheableStaticResponse(response)) {
            await cache.put(request, response.clone());
          }
          return response;
        } catch (_error) {
          return Response.error();
        }
      })(),
    );
  }
});

self.addEventListener("message", (event) => {
  const type =
    event.data && typeof event.data === "object" ? event.data.type : null;
  const reply = (payload) => {
    if (event.ports && event.ports[0]) {
      event.ports[0].postMessage(payload);
    }
  };

  if (type === "SKIP_WAITING") {
    self.skipWaiting();
    return;
  }

  if (type === "GET_VERSION") {
    reply({ version: CACHE_NAME });
    return;
  }

  if (type === "GET_CACHE_STATS") {
    event.waitUntil(
      getCacheStats()
        .then((stats) => reply({ success: true, stats }))
        .catch(() => reply({ success: false, stats: null })),
    );
    return;
  }

  if (type === "CLEANUP_CACHE") {
    event.waitUntil(
      deleteOwnedCaches(false)
        .then(() => reply({ success: true }))
        .catch(() => reply({ success: false })),
    );
    return;
  }

  if (type === "CLEAR_CACHE") {
    event.waitUntil(
      deleteOwnedCaches(true)
        .then(() => reply({ success: true }))
        .catch(() => reply({ success: false })),
    );
  }
});
