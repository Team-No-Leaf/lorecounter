const CACHE_NAME = "lorcana-scorekeeper-dev-v28";
const ASSETS = [
  "./",
  "./index.html",
  "./styles.css?v=28",
  "./app.js?v=28",
  "./manifest.webmanifest?v=28-dev",
  "../proxies/brand/favicon-light.png",
  "../proxies/brand/favicon-dark.png",
  "../proxies/brand/logo-light.png",
  "../proxies/brand/logo-dark.png",
  "../proxies/brand/favicon-light-transparent.png",
  "../proxies/brand/favicon-dark-transparent.png",
  "../proxies/brand/logo-light-transparent.png",
  "../proxies/brand/logo-dark-transparent.png",
  "./assets/ink/dlc_ink_amber.png",
  "./assets/ink/dlc_ink_amethyst.png",
  "./assets/ink/dlc_ink_emerald.png",
  "./assets/ink/dlc_ink_ruby.png",
  "./assets/ink/dlc_ink_sapphire.png",
  "./assets/ink/dlc_ink_steel.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
    )
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
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
