const CACHE_PREFIX = "jungle-dash-offline";
const CACHE_VERSION = "v5";
const CACHE_NAME = `${CACHE_PREFIX}-${CACHE_VERSION}`;

const STATIC_FILES = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./favicon.png",
  "./pe-jungledash.jpg",
  "./service-worker.js",
];

const ASSET_CACHE_EXTENSIONS = [
  ".js", ".css", ".png", ".jpg", ".jpeg", ".gif", ".svg", ".webp", ".ico", ".json", ".webmanifest", ".woff", ".woff2", ".mp3", ".wav", ".ogg", ".m4a", ".glb", ".gltf",
];

self.addEventListener("install", (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    await cache.addAll(STATIC_FILES);

  })());
});

self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(
      keys
        .filter((key) => key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME)
        .map((key) => caches.delete(key)),
    );

    await self.clients.claim();
  })());
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  if (event.request.mode === "navigate") {
    event.respondWith((async () => {
      try {
        const networkResponse = await fetch(event.request);
        const cache = await caches.open(CACHE_NAME);
        cache.put("./index.html", networkResponse.clone());
        return networkResponse;
      } catch {
        return (await caches.match("./index.html")) || Response.error();
      }
    })());
    return;
  }

  const isCacheableAsset = ASSET_CACHE_EXTENSIONS.some((ext) => url.pathname.endsWith(ext));
  if (!isCacheableAsset) return;

  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);
    const cached = await caches.match(event.request, { ignoreSearch: true });

    const networkFetch = fetch(event.request)
      .then((networkResponse) => {
        if (networkResponse.ok) {
          cache.put(event.request, networkResponse.clone());
        }
        return networkResponse;
      })
      .catch(() => null);

    if (cached) {
      networkFetch.catch(() => {
        // Ignore background refresh failures while offline.
      });
      return cached;
    }

    const networkResponse = await networkFetch;
    return networkResponse || Response.error();
  })());
});

self.addEventListener("message", (event) => {
  if (event.data?.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});
