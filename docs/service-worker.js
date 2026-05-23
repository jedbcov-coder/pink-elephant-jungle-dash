const CACHE_PREFIX = "jungle-dash-offline";
const CACHE_VERSION = "v3";
const CACHE_NAME = `${CACHE_PREFIX}-${CACHE_VERSION}`;
const BUILD_MANIFEST_URL = "./.vite/manifest.json";

const STATIC_FILES = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./favicon.png",
  "./pe-jungledash.jpg",
  "./service-worker.js",
];

self.addEventListener("install", (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    await cache.addAll(STATIC_FILES);

    try {
      const response = await fetch(BUILD_MANIFEST_URL, { cache: "no-store" });
      if (!response.ok) {
        throw new Error(`Failed to fetch build manifest: ${response.status}`);
      }
      const buildManifest = await response.json();
      const buildFiles = new Set();

      for (const entry of Object.values(buildManifest)) {
        if (entry.file) {
          buildFiles.add(`./${entry.file}`);
        }
        if (Array.isArray(entry.css)) {
          entry.css.forEach((file) => buildFiles.add(`./${file}`));
        }
        if (Array.isArray(entry.assets)) {
          entry.assets.forEach((file) => buildFiles.add(`./${file}`));
        }
      }

      await cache.addAll([...buildFiles]);
    } catch (error) {
      console.warn("Offline asset pre-cache failed; fallback cache remains active.", error);
    }

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
  if (event.request.method !== "GET") {
    return;
  }

  event.respondWith((async () => {
    const cached = await caches.match(event.request);
    if (cached) {
      return cached;
    }

    try {
      const networkResponse = await fetch(event.request);
      const requestUrl = new URL(event.request.url);
      if (networkResponse.ok && requestUrl.origin === self.location.origin) {
        const cache = await caches.open(CACHE_NAME);
        cache.put(event.request, networkResponse.clone());
      }
      return networkResponse;
    } catch (error) {
      const fallback = await caches.match("./index.html");
      if (fallback && event.request.mode === "navigate") {
        return fallback;
      }
      throw error;
    }
  })());
});


self.addEventListener("message", (event) => {
  if (event.data?.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});
