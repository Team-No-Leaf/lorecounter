const CACHE_NAME = "lorcana-scorekeeper-v72";
const ASSETS = [
  "./",
  "./index.html",
  "./styles.css?v=67",
  "./app.js?v=72",
  "./manifest.webmanifest?v=67",
  "./proxies/",
  "./proxies/index.html",
  "./icon.svg",
  "./assets/icons/illuminary-favicon.png",
  "./assets/icons/illuminary-180.png",
  "./assets/icons/illuminary-192.png",
  "./assets/icons/illuminary-512.png",
  "./assets/ink/dlc_ink_amber.png",
  "./assets/ink/dlc_ink_amethyst.png",
  "./assets/ink/dlc_ink_emerald.png",
  "./assets/ink/dlc_ink_ruby.png",
  "./assets/ink/dlc_ink_sapphire.png",
  "./assets/ink/dlc_ink_steel.png"
];

self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  const requestUrl = new URL(event.request.url);
  const scopeUrl = new URL(self.registration.scope);
  const relativePath = requestUrl.pathname.slice(scopeUrl.pathname.length);

  if (relativePath.startsWith("proxies/")) {
    event.respondWith(
      fetch(event.request).then((response) => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        return response;
      }).catch(() => caches.match(event.request))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cached) =>
      cached || fetch(event.request).then((response) => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        return response;
      })
    )
  );
});
