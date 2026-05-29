const CACHE_PREFIX = "jungle-dash-offline";
const CACHE_VERSION = "v14";
const CACHE_NAME = `${CACHE_PREFIX}-${CACHE_VERSION}`;

const STATIC_FILES = [
  "./",
  "./index.html",
  "./offline.html",
  "./manifest.webmanifest",
  "./favicon.png",
  "./pe-jungledash.jpg",
  "./service-worker.js",
];

const NETWORK_FIRST_EXTENSIONS = [".js", ".css"];

const CACHE_FIRST_EXTENSIONS = [
  ".png", ".jpg", ".jpeg", ".gif", ".svg", ".webp", ".ico", ".json", ".webmanifest", ".woff", ".woff2", ".mp3", ".wav", ".ogg", ".m4a", ".glb", ".gltf",
];

self.addEventListener("install", (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    await cache.addAll(STATIC_FILES);
    await self.skipWaiting();
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
        return (await caches.match("./index.html")) || (await caches.match("./offline.html")) || Response.error();
      }
    })());
    return;
  }

  const isNetworkFirstAsset = NETWORK_FIRST_EXTENSIONS.some((ext) => url.pathname.endsWith(ext));
  const isCacheFirstAsset = CACHE_FIRST_EXTENSIONS.some((ext) => url.pathname.endsWith(ext));
  if (!isNetworkFirstAsset && !isCacheFirstAsset) return;

  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);

    if (isNetworkFirstAsset) {
      try {
        const networkResponse = await fetch(event.request);
        if (networkResponse.ok) {
          cache.put(event.request, networkResponse.clone());
        }
        return networkResponse;
      } catch {
        return (await caches.match(event.request)) || Response.error();
      }
    }

    const cached = await caches.match(event.request, { ignoreSearch: true });
    if (cached) return cached;

    try {
      const networkResponse = await fetch(event.request);
      if (networkResponse.ok) {
        cache.put(event.request, networkResponse.clone());
      }
      return networkResponse;
    } catch {
      return Response.error();
    }
  })());
});

self.addEventListener("message", (event) => {
  if (event.data?.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});
