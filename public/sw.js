// Service Worker for caching and offline functionality

const CACHE_NAME = 'glb-viewer-v1.0.0';
const STATIC_CACHE = 'glb-viewer-static-v1.0.0';
const DYNAMIC_CACHE = 'glb-viewer-dynamic-v1.0.0';

// Files to cache immediately
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/favicon.ico',
  '/robots.txt',
  // Cache essential chunks and assets
  '/_next/static/css/',
  '/_next/static/js/',
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker');
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      console.log('[SW] Caching static assets');
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - serve from cache or network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Handle API requests differently
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      caches.open(DYNAMIC_CACHE).then((cache) => {
        return fetch(request)
          .then((response) => {
            // Cache successful responses
            if (response.status === 200) {
              cache.put(request, response.clone());
            }
            return response;
          })
          .catch(() => {
            // Return cached version if available
            return cache.match(request);
          });
      })
    );
    return;
  }

  // Handle model files (.glb, .gltf) - cache them for offline use
  if (url.pathname.match(/\.(glb|gltf)$/i)) {
    event.respondWith(
      caches.open(DYNAMIC_CACHE).then((cache) => {
        return cache.match(request).then((cachedResponse) => {
          if (cachedResponse) {
            // Return cached version immediately, but also fetch fresh version
            fetch(request).then((response) => {
              if (response.status === 200) {
                cache.put(request, response.clone());
              }
            }).catch(() => {
              // Ignore fetch errors for cached models
            });
            return cachedResponse;
          }

          return fetch(request).then((response) => {
            if (response.status === 200) {
              cache.put(request, response.clone());
            }
            return response;
          });
        });
      })
    );
    return;
  }

  // Handle static assets - cache first strategy
  if (
    url.pathname.match(/\.(js|css|png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)$/i) ||
    url.pathname.startsWith('/_next/')
  ) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }

        return caches.open(STATIC_CACHE).then((cache) => {
          return fetch(request).then((response) => {
            // Cache successful responses
            if (response.status === 200) {
              cache.put(request, response.clone());
            }
            return response;
          });
        });
      })
    );
    return;
  }

  // Default: network first for HTML pages
  event.respondWith(
    fetch(request)
      .then((response) => {
        // Cache successful HTML responses
        if (response.status === 200 && request.destination === 'document') {
          const responseClone = response.clone();
          caches.open(DYNAMIC_CACHE).then((cache) => {
            cache.put(request, responseClone);
          });
        }
        return response;
      })
      .catch(() => {
        // Return cached version if available
        return caches.match(request);
      })
  );
});

// Background sync for offline actions (if implemented later)
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync:', event.tag);
  // Handle background sync events here
});

// Push notifications (if implemented later)
self.addEventListener('push', (event) => {
  console.log('[SW] Push received:', event);
  // Handle push notifications here
});

// Message handling for communication with the main thread
self.addEventListener('message', (event) => {
  const { type, data } = event.data || {};

  switch (type) {
    case 'SKIP_WAITING':
      self.skipWaiting();
      break;
    case 'GET_VERSION':
      event.ports[0].postMessage({ version: CACHE_NAME });
      break;
    case 'CLEAR_CACHE':
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => caches.delete(cacheName))
        );
      }).then(() => {
        event.ports[0].postMessage({ success: true });
      }).catch((error) => {
        event.ports[0].postMessage({ success: false, error });
      });
      break;
    default:
      console.log('[SW] Unknown message type:', type);
  }
});
