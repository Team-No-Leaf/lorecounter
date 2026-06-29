const CACHE_NAME = "lorcana-scorekeeper-v22";
const ASSETS = [
  "./",
  "./index.html",
  "./styles.css?v=22",
  "./app.js?v=22",
  "./manifest.webmanifest",
  "./icon.svg",
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
