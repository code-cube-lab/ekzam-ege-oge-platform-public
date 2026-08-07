const CACHE_NAME = "ekzam-offline-v6";
const SCOPE_PATH = new URL(self.registration.scope).pathname.replace(/\/$/, "");
const scopedUrl = (path) => `${SCOPE_PATH}${path}`;
const CORE_URLS = [
  "/",
  "/exam?level=oge",
  "/exam?level=ege",
  "/practice",
  "/resume",
  "/parent-report",
  "/subjects",
  "/telegram",
  "/offline.html",
  "/favicon.svg",
].map(scopedUrl);

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => Promise.allSettled(CORE_URLS.map((url) => cache.add(url)))));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((key) => key.startsWith("ekzam-") && key !== CACHE_NAME).map((key) => caches.delete(key))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin || url.pathname.startsWith(scopedUrl("/api/"))) return;

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          }
          return response;
        })
        .catch(async () => (await caches.match(request)) || caches.match(scopedUrl("/offline.html"))),
    );
    return;
  }

  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response.ok) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
        }
        return response;
      })
      .catch(() => caches.match(request)),
  );
});
